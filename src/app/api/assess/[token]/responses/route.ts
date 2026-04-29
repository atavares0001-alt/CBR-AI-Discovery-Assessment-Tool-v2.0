import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { calculateAIReadinessScore } from '@/lib/utils/scoring'
import type { StageName } from '@/lib/types/database'
import { rateLimit, getClientIp } from '@/lib/security/rateLimit'
import { isSameOrigin } from '@/lib/security/origin'
import { readJsonBody, BODY_LIMITS, PayloadTooLargeError, InvalidJsonError } from '@/lib/security/bodyLimit'
import { audit } from '@/lib/security/audit'
import {
  badRequest,
  forbidden,
  gone,
  notFound,
  payloadTooLarge,
  serverError,
  tooManyRequests,
} from '@/lib/security/errors'

const COMPLETED_STATUSES = new Set([
  'client_complete',
  'recommendations_added',
  'quote_added',
  'report_generated',
  'quote_sent',
  'accepted',
])

const VALID_STAGES = new Set<StageName>(['stage_1', 'stage_2', 'stage_3', 'stage_4', 'stage_5'])

const SAVE_LIMIT = 60
const SAVE_WINDOW_SEC = 60

// POST /api/assess/[token]/responses — Save stage responses
export async function POST(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params
  const ip = getClientIp(request)

  // Rate limit per token to stop a single client (or attacker) spamming saves
  const rl = rateLimit(`assess:save:${token}`, SAVE_LIMIT, SAVE_WINDOW_SEC)
  if (!rl.allowed) {
    audit('rate_limit.blocked', { ip, route: '/api/assess/[token]/responses', method: 'POST' })
    return tooManyRequests(rl.retryAfterSec)
  }

  // CSRF: same-origin check (form is served from our own /assess/[token] page)
  if (!isSameOrigin(request)) {
    audit('csrf.blocked', { ip, route: '/api/assess/[token]/responses', method: 'POST' })
    return forbidden()
  }

  if (!/^[A-Za-z0-9]{8,64}$/.test(token)) {
    audit('token.invalid', { ip, route: '/api/assess/[token]/responses' })
    return notFound('Assessment not found')
  }

  let body: { stage?: StageName; answers?: Record<string, unknown>; is_final?: boolean }
  try {
    body = await readJsonBody(request, BODY_LIMITS.small)
  } catch (err) {
    if (err instanceof PayloadTooLargeError) return payloadTooLarge()
    if (err instanceof InvalidJsonError) return badRequest('Invalid JSON')
    return serverError('assess.responses.body', err)
  }

  const { stage, answers, is_final } = body

  if (!stage || !VALID_STAGES.has(stage)) {
    return badRequest('Invalid stage')
  }
  if (!answers || typeof answers !== 'object' || Array.isArray(answers)) {
    return badRequest('Invalid answers payload')
  }

  const supabase = createServiceClient()

  const { data: assessment, error: lookupError } = await supabase
    .from('assessments')
    .select('id, token_expires_at, status, current_stage')
    .eq('share_token', token)
    .single()

  if (lookupError || !assessment) {
    return notFound('Assessment not found')
  }

  if (new Date(assessment.token_expires_at) < new Date()) {
    audit('token.expired', { ip, resourceId: assessment.id })
    return gone('Token expired', 'TOKEN_EXPIRED')
  }

  // Block writes once the assessment is sealed by completion / consultant work
  if (COMPLETED_STATUSES.has(assessment.status)) {
    audit('token.completed_write_attempt', { ip, resourceId: assessment.id, detail: { status: assessment.status } })
    return gone('Assessment already completed', 'ALREADY_COMPLETE')
  }

  // Upsert response (unique on assessment_id + stage)
  const { error: responseError } = await supabase
    .from('responses')
    .upsert(
      {
        assessment_id: assessment.id,
        stage,
        answers,
      },
      { onConflict: 'assessment_id,stage' }
    )

  if (responseError) {
    return serverError('assess.responses.upsert', responseError)
  }

  // Determine new stage number and status
  const stageMap: Record<string, number> = {
    stage_1: 1, stage_2: 2, stage_3: 3, stage_4: 3, stage_5: 4,
  }
  const stageNum = stageMap[stage] || 0

  const updates: Record<string, unknown> = {
    current_stage: stageNum,
  }

  // Set status to in_progress on first save
  if (assessment.status === 'draft' || assessment.status === 'sent') {
    updates.status = 'in_progress'
  }

  // Update industry from Stage 1 answers — only accept a string
  if (stage === 'stage_1' && typeof answers.industry === 'string') {
    updates.industry = answers.industry
  }

  // If final submission (Stage 5)
  if (is_final) {
    updates.status = 'client_complete'

    const { data: allResponses, error: allErr } = await supabase
      .from('responses')
      .select('*')
      .eq('assessment_id', assessment.id)

    if (allErr) {
      return serverError('assess.responses.score', allErr)
    }

    if (allResponses) {
      updates.ai_readiness_score = calculateAIReadinessScore(allResponses)
    }
  }

  const { error: updateErr } = await supabase
    .from('assessments')
    .update(updates)
    .eq('id', assessment.id)

  if (updateErr) {
    return serverError('assess.responses.assessment_update', updateErr)
  }

  return NextResponse.json({ success: true })
}
