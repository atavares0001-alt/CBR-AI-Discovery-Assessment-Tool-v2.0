import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
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
import type { StageName } from '@/lib/types/database'

const VALID_STAGES = new Set<StageName>(['stage_1', 'stage_2', 'stage_3', 'stage_4', 'stage_5'])
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// PATCH /api/assessments/[id]/responses — Update stage responses (consultant)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isSameOrigin(request)) {
    audit('csrf.blocked', { ip: getClientIp(request), route: '/api/assessments/[id]/responses', method: 'PATCH' })
    return forbidden()
  }

  const { id } = await params
  if (!UUID_RE.test(id)) return notFound('Assessment not found')

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    audit('auth.unauthorized', { route: '/api/assessments/[id]/responses', method: 'PATCH' })
    return unauthorized()
  }

  // Verify the consultant owns this assessment
  const { data: assessment, error: assessmentError } = await supabase
    .from('assessments')
    .select('id')
    .eq('id', id)
    .eq('consultant_id', user.id)
    .single()

  if (assessmentError || !assessment) {
    return notFound('Assessment not found')
  }

  let body: { stage?: StageName; answers?: Record<string, unknown> }
  try {
    body = await readJsonBody(request, BODY_LIMITS.medium)
  } catch (err) {
    if (err instanceof PayloadTooLargeError) return payloadTooLarge()
    if (err instanceof InvalidJsonError) return badRequest('Invalid JSON')
    return serverError('assessments.responses.body', err)
  }

  const { stage, answers } = body

  if (!stage || !VALID_STAGES.has(stage)) {
    return badRequest('Invalid stage')
  }
  if (!answers || typeof answers !== 'object' || Array.isArray(answers)) {
    return badRequest('Invalid answers payload')
  }

  // 1. Fetch existing answers completely from server
  const { data: existingResponse } = await supabase
    .from('responses')
    .select('answers')
    .eq('assessment_id', id)
    .eq('stage', stage)
    .single()

  // 2. Safely merge backend state with incoming delta to prevent race conditions
  const existingAnswers = (existingResponse?.answers as Record<string, unknown>) || {}
  const mergedAnswers = { ...existingAnswers, ...answers }

  // 3. Upsert the fully merged state
  const { data, error } = await supabase
    .from('responses')
    .upsert(
      {
        assessment_id: id,
        stage,
        answers: mergedAnswers,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'assessment_id,stage' }
    )
    .select()
    .single()

  if (error) {
    return serverError('assessments.responses.upsert', error)
  }

  return NextResponse.json(data)
}
