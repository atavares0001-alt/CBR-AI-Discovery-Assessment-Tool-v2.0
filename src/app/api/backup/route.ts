import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isSameOrigin } from '@/lib/security/origin'
import { readJsonBody, BODY_LIMITS, PayloadTooLargeError, InvalidJsonError } from '@/lib/security/bodyLimit'
import { audit } from '@/lib/security/audit'
import {
  badRequest,
  forbidden,
  payloadTooLarge,
  serverError,
  unauthorized,
} from '@/lib/security/errors'
import { getClientIp } from '@/lib/security/rateLimit'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// Whitelist of fields that may be imported into the assessments table.
// consultant_id is intentionally excluded — it is forced to the importing user.
// share_token / token_expires_at are excluded — they are regenerated to
// avoid resurrecting expired tokens or colliding with existing rows.
const ASSESSMENT_IMPORT_FIELDS = [
  'id',
  'client_name',
  'client_email',
  'client_phone',
  'company_name',
  'industry',
  'status',
  'current_stage',
  'ai_readiness_score',
  'stage_6_data',
  'stage_7_data',
  'consent_given_at',
] as const

const VALID_STAGES = new Set(['stage_1', 'stage_2', 'stage_3', 'stage_4', 'stage_5'])

const MAX_ASSESSMENTS = 1000
const MAX_RESPONSES_PER_ASSESSMENT = 20

interface BackupResponse {
  stage: string
  answers: Record<string, unknown>
}

interface BackupAssessment {
  id?: string
  responses?: BackupResponse[]
  [key: string]: unknown
}

// GET /api/backup — Export all assessments + responses as structured JSON
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    audit('auth.unauthorized', { route: '/api/backup', method: 'GET' })
    return unauthorized()
  }

  // Fetch all assessments for this consultant
  const { data: assessments, error: assessError } = await supabase
    .from('assessments')
    .select('*')
    .eq('consultant_id', user.id)
    .order('created_at', { ascending: false })

  if (assessError) {
    return serverError('backup.export.assessments', assessError)
  }

  if (!assessments || assessments.length === 0) {
    audit('assessment.export', { userId: user.id, detail: { count: 0 } })
    return NextResponse.json({
      version: '1.0',
      exported_at: new Date().toISOString(),
      consultant_id: user.id,
      assessments: [],
    })
  }

  // Fetch all responses for these assessments
  const assessmentIds = assessments.map((a) => a.id)
  const { data: responses, error: respError } = await supabase
    .from('responses')
    .select('*')
    .in('assessment_id', assessmentIds)
    .order('stage')

  if (respError) {
    return serverError('backup.export.responses', respError)
  }

  // Group responses by assessment_id
  const responsesByAssessment: Record<string, typeof responses> = {}
  for (const resp of responses || []) {
    if (!responsesByAssessment[resp.assessment_id]) {
      responsesByAssessment[resp.assessment_id] = []
    }
    responsesByAssessment[resp.assessment_id].push(resp)
  }

  audit('assessment.export', { userId: user.id, detail: { count: assessments.length } })

  // Build export payload
  const payload = {
    version: '1.0',
    exported_at: new Date().toISOString(),
    consultant_id: user.id,
    assessments: assessments.map((a) => ({
      ...a,
      responses: responsesByAssessment[a.id] || [],
    })),
  }

  return NextResponse.json(payload)
}

// POST /api/backup — Import assessments + responses from JSON
export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    audit('csrf.blocked', { ip: getClientIp(request), route: '/api/backup', method: 'POST' })
    return forbidden()
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    audit('auth.unauthorized', { route: '/api/backup', method: 'POST' })
    return unauthorized()
  }

  let body: { version?: string; assessments?: BackupAssessment[] }
  try {
    body = await readJsonBody(request, BODY_LIMITS.large)
  } catch (err) {
    if (err instanceof PayloadTooLargeError) return payloadTooLarge()
    if (err instanceof InvalidJsonError) return badRequest('Invalid JSON')
    return serverError('backup.import.body', err)
  }

  if (!body.assessments || !Array.isArray(body.assessments)) {
    return badRequest('Invalid backup format: missing assessments array')
  }

  if (body.assessments.length > MAX_ASSESSMENTS) {
    return badRequest(`Too many assessments (max ${MAX_ASSESSMENTS})`)
  }

  let assessmentsImported = 0
  let responsesImported = 0
  const errors: string[] = []

  for (const item of body.assessments) {
    if (!item || typeof item !== 'object') {
      errors.push('Invalid assessment entry')
      continue
    }

    if (item.id !== undefined && (typeof item.id !== 'string' || !UUID_RE.test(item.id))) {
      errors.push('Invalid assessment id')
      continue
    }

    // Build a sanitized payload with only whitelisted fields. Anything else
    // (consultant_id, share_token, token_expires_at, created_at, updated_at,
    // foreign join data, ...) is silently dropped.
    const assessmentPayload: Record<string, unknown> = {}
    for (const field of ASSESSMENT_IMPORT_FIELDS) {
      if (field in item) {
        assessmentPayload[field] = (item as Record<string, unknown>)[field]
      }
    }

    // Force the consultant_id to the current user so imported data
    // is owned by whoever is importing
    assessmentPayload.consultant_id = user.id
    assessmentPayload.updated_at = new Date().toISOString()

    // Required field
    if (typeof assessmentPayload.client_name !== 'string' || !assessmentPayload.client_name.trim()) {
      errors.push(`Assessment ${item.id || '(no id)'}: missing client_name`)
      continue
    }

    // Generate a fresh share_token + expiry rather than trusting the input
    // (don't resurrect expired tokens or risk collisions on UNIQUE share_token)
    const { generateShareToken, getTokenExpiryDate } = await import('@/lib/utils/token')
    assessmentPayload.share_token = generateShareToken()
    assessmentPayload.token_expires_at = getTokenExpiryDate()

    const { error: upsertError } = await supabase
      .from('assessments')
      .upsert(assessmentPayload, { onConflict: 'id' })

    if (upsertError) {
      // Don't leak DB error text to client
      console.error('[backup.import.assessment]', upsertError)
      errors.push(`Assessment ${item.id || '(no id)'}: failed to import`)
      continue
    }

    assessmentsImported++

    // Import responses
    if (item.responses && Array.isArray(item.responses)) {
      if (item.responses.length > MAX_RESPONSES_PER_ASSESSMENT) {
        errors.push(`Assessment ${item.id}: too many responses`)
        continue
      }

      for (const resp of item.responses) {
        if (!resp || typeof resp !== 'object') continue
        if (typeof resp.stage !== 'string' || !VALID_STAGES.has(resp.stage)) continue
        if (!resp.answers || typeof resp.answers !== 'object' || Array.isArray(resp.answers)) continue

        const responsePayload = {
          assessment_id: item.id,
          stage: resp.stage,
          answers: resp.answers,
          updated_at: new Date().toISOString(),
        }

        const { error: respError } = await supabase
          .from('responses')
          .upsert(responsePayload, { onConflict: 'assessment_id,stage' })

        if (respError) {
          console.error('[backup.import.response]', respError)
          errors.push(`Response ${resp.stage} for ${item.id}: failed to import`)
        } else {
          responsesImported++
        }
      }
    }
  }

  audit('assessment.import', {
    userId: user.id,
    detail: { assessments: assessmentsImported, responses: responsesImported, errors: errors.length },
  })

  return NextResponse.json({
    success: true,
    assessments_imported: assessmentsImported,
    responses_imported: responsesImported,
    errors: errors.length > 0 ? errors : undefined,
  })
}
