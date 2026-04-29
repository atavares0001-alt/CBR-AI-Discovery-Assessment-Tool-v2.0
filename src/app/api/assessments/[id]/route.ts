import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isValidEmail } from '@/lib/utils/validation'
import { isSameOrigin } from '@/lib/security/origin'
import { readJsonBody, BODY_LIMITS, PayloadTooLargeError, InvalidJsonError } from '@/lib/security/bodyLimit'
import { audit } from '@/lib/security/audit'
import {
  badRequest,
  forbidden,
  notFound,
  payloadTooLarge,
  serverError,
  unauthorized,
} from '@/lib/security/errors'
import { getClientIp } from '@/lib/security/rateLimit'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// Whitelist of fields a consultant is allowed to PATCH directly via this route.
// Anything else (consultant_id, share_token, token_expires_at, created_at, ...)
// is silently dropped to prevent privilege escalation / token reset.
const PATCH_ALLOWED_FIELDS = new Set<string>([
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
])

const PATCH_ALLOWED_STATUSES = new Set<string>([
  'draft',
  'sent',
  'in_progress',
  'client_complete',
  'recommendations_added',
  'quote_added',
  'report_generated',
  'quote_sent',
  'accepted',
  'lost',
  'archived',
])

// GET /api/assessments/[id] — Get a single assessment with responses
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  if (!UUID_RE.test(id)) return notFound('Assessment not found')

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    audit('auth.unauthorized', { route: '/api/assessments/[id]', method: 'GET' })
    return unauthorized()
  }

  const { data: assessment, error: assessmentError } = await supabase
    .from('assessments')
    .select('*')
    .eq('id', id)
    .eq('consultant_id', user.id)
    .single()

  if (assessmentError || !assessment) {
    return notFound('Assessment not found')
  }

  const { data: responses, error: respError } = await supabase
    .from('responses')
    .select('*')
    .eq('assessment_id', id)
    .order('stage')

  if (respError) {
    return serverError('assessments.get.responses', respError)
  }

  return NextResponse.json({ ...assessment, responses: responses || [] })
}

// PATCH /api/assessments/[id] — Update assessment (stage 6, stage 7, etc.)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isSameOrigin(request)) {
    audit('csrf.blocked', { ip: getClientIp(request), route: '/api/assessments/[id]', method: 'PATCH' })
    return forbidden()
  }

  const { id } = await params
  if (!UUID_RE.test(id)) return notFound('Assessment not found')

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    audit('auth.unauthorized', { route: '/api/assessments/[id]', method: 'PATCH' })
    return unauthorized()
  }

  let body: Record<string, unknown>
  try {
    body = await readJsonBody(request, BODY_LIMITS.medium)
  } catch (err) {
    if (err instanceof PayloadTooLargeError) return payloadTooLarge()
    if (err instanceof InvalidJsonError) return badRequest('Invalid JSON')
    return serverError('assessments.patch.body', err)
  }

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return badRequest('Invalid payload')
  }

  // Strip any field that isn't in the allow-list
  const updates: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(body)) {
    if (PATCH_ALLOWED_FIELDS.has(key)) {
      updates[key] = value
    }
  }

  // If a status is being set, ensure it's a valid enum value
  if ('status' in updates) {
    const s = updates.status
    if (typeof s !== 'string' || !PATCH_ALLOWED_STATUSES.has(s)) {
      return badRequest('Invalid status')
    }
  }

  // Validate / cap free-text fields if present
  if ('client_email' in updates) {
    const e = updates.client_email
    if (e !== null && (typeof e !== 'string' || !isValidEmail(e))) {
      return badRequest('Invalid email address')
    }
    if (typeof e === 'string') updates.client_email = e.trim().slice(0, 254) || null
  }
  for (const field of ['client_name', 'company_name'] as const) {
    if (field in updates && typeof updates[field] === 'string') {
      updates[field] = (updates[field] as string).trim().slice(0, 200)
    }
  }
  if ('client_phone' in updates && typeof updates.client_phone === 'string') {
    updates.client_phone = (updates.client_phone as string).trim().slice(0, 32) || null
  }

  if (Object.keys(updates).length === 0) {
    return badRequest('No updatable fields supplied')
  }

  const { data, error } = await supabase
    .from('assessments')
    .update(updates)
    .eq('id', id)
    .eq('consultant_id', user.id)
    .select()
    .single()

  if (error) {
    return serverError('assessments.patch', error)
  }

  if (!data) {
    return notFound('Assessment not found')
  }

  return NextResponse.json(data)
}

// DELETE /api/assessments/[id] — Delete assessment and all responses
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isSameOrigin(request)) {
    audit('csrf.blocked', { ip: getClientIp(request), route: '/api/assessments/[id]', method: 'DELETE' })
    return forbidden()
  }

  const { id } = await params
  if (!UUID_RE.test(id)) return notFound('Assessment not found')

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    audit('auth.unauthorized', { route: '/api/assessments/[id]', method: 'DELETE' })
    return unauthorized()
  }

  const { error } = await supabase
    .from('assessments')
    .delete()
    .eq('id', id)
    .eq('consultant_id', user.id)

  if (error) {
    return serverError('assessments.delete', error)
  }

  audit('assessment.delete', { userId: user.id, resourceId: id })
  return NextResponse.json({ success: true })
}
