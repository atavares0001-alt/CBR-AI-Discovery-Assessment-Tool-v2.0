import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { rateLimit, getClientIp } from '@/lib/security/rateLimit'
import { isSameOrigin } from '@/lib/security/origin'
import { audit } from '@/lib/security/audit'
import {
  forbidden,
  gone,
  notFound,
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

const CONSENT_LIMIT = 10
const CONSENT_WINDOW_SEC = 60

// POST /api/assess/[token]/consent — Record consent
export async function POST(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params
  const ip = getClientIp(request)

  const rl = rateLimit(`assess:consent:${token}`, CONSENT_LIMIT, CONSENT_WINDOW_SEC)
  if (!rl.allowed) {
    audit('rate_limit.blocked', { ip, route: '/api/assess/[token]/consent', method: 'POST' })
    return tooManyRequests(rl.retryAfterSec)
  }

  if (!isSameOrigin(request)) {
    audit('csrf.blocked', { ip, route: '/api/assess/[token]/consent', method: 'POST' })
    return forbidden()
  }

  if (!/^[A-Za-z0-9]{8,64}$/.test(token)) {
    audit('token.invalid', { ip, route: '/api/assess/[token]/consent' })
    return notFound('Assessment not found')
  }

  const supabase = createServiceClient()

  const { data: assessment } = await supabase
    .from('assessments')
    .select('id, token_expires_at, status')
    .eq('share_token', token)
    .single()

  if (!assessment) {
    return notFound('Assessment not found')
  }

  if (new Date(assessment.token_expires_at) < new Date()) {
    audit('token.expired', { ip, resourceId: assessment.id })
    return gone('Token expired', 'TOKEN_EXPIRED')
  }

  if (COMPLETED_STATUSES.has(assessment.status)) {
    audit('token.completed_write_attempt', { ip, resourceId: assessment.id, detail: { status: assessment.status } })
    return gone('Assessment already completed', 'ALREADY_COMPLETE')
  }

  const { error } = await supabase
    .from('assessments')
    .update({ consent_given_at: new Date().toISOString() })
    .eq('id', assessment.id)

  if (error) {
    return serverError('assess.consent.update', error)
  }

  return NextResponse.json({ success: true })
}
