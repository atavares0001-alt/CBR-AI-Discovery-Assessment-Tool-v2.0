import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { rateLimit, getClientIp } from '@/lib/security/rateLimit'
import { audit } from '@/lib/security/audit'
import { tooManyRequests, gone, notFound, serverError } from '@/lib/security/errors'

// Public endpoint — protect against brute-force token enumeration
const LOOKUP_LIMIT = 30
const LOOKUP_WINDOW_SEC = 60

// GET /api/assess/[token] — Look up assessment by token (public)
export async function GET(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params

  // Rate-limit lookups per IP to make token enumeration expensive
  const ip = getClientIp(request)
  const rl = rateLimit(`assess:lookup:${ip}`, LOOKUP_LIMIT, LOOKUP_WINDOW_SEC)
  if (!rl.allowed) {
    audit('rate_limit.blocked', { ip, route: '/api/assess/[token]', method: 'GET' })
    return tooManyRequests(rl.retryAfterSec)
  }

  // Cheap shape validation — share tokens are 12 chars from [A-Za-z0-9]
  if (!/^[A-Za-z0-9]{8,64}$/.test(token)) {
    audit('token.invalid', { ip, route: '/api/assess/[token]' })
    return notFound('Assessment not found')
  }

  const supabase = createServiceClient()

  const { data: assessment, error } = await supabase
    .from('assessments')
    .select('id, client_name, company_name, status, share_token, token_expires_at, current_stage, consent_given_at')
    .eq('share_token', token)
    .single()

  if (error || !assessment) {
    return notFound('Assessment not found')
  }

  // Check token expiry
  if (new Date(assessment.token_expires_at) < new Date()) {
    audit('token.expired', { ip, resourceId: assessment.id })
    return gone('Token expired', 'TOKEN_EXPIRED')
  }

  // Check if already completed
  if (['client_complete', 'recommendations_added', 'quote_added', 'report_generated', 'quote_sent', 'accepted'].includes(assessment.status)) {
    return gone('Assessment already completed', 'ALREADY_COMPLETE')
  }

  // Fetch existing responses
  const { data: responses, error: respErr } = await supabase
    .from('responses')
    .select('stage, answers')
    .eq('assessment_id', assessment.id)
    .order('stage')

  if (respErr) {
    return serverError('assess.lookup.responses', respErr)
  }

  return NextResponse.json({
    ...assessment,
    responses: responses || [],
  })
}
