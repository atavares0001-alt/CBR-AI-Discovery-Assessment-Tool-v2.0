import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { AssessmentStatus } from '@/lib/types/database'
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

const MANUAL_STATUSES: AssessmentStatus[] = ['quote_sent', 'accepted', 'lost']
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// PATCH /api/assessments/[id]/status — Manual status update
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isSameOrigin(request)) {
    audit('csrf.blocked', { ip: getClientIp(request), route: '/api/assessments/[id]/status', method: 'PATCH' })
    return forbidden()
  }

  const { id } = await params
  if (!UUID_RE.test(id)) return notFound('Assessment not found')

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    audit('auth.unauthorized', { route: '/api/assessments/[id]/status', method: 'PATCH' })
    return unauthorized()
  }

  let body: { status?: string }
  try {
    body = await readJsonBody(request, BODY_LIMITS.small)
  } catch (err) {
    if (err instanceof PayloadTooLargeError) return payloadTooLarge()
    if (err instanceof InvalidJsonError) return badRequest('Invalid JSON')
    return serverError('assessments.status.body', err)
  }

  const { status } = body

  if (!status || !MANUAL_STATUSES.includes(status as AssessmentStatus)) {
    return badRequest('Invalid status')
  }

  const { data, error } = await supabase
    .from('assessments')
    .update({ status })
    .eq('id', id)
    .eq('consultant_id', user.id)
    .select()
    .single()

  if (error) {
    return serverError('assessments.status.update', error)
  }

  if (!data) {
    return notFound('Assessment not found')
  }

  return NextResponse.json(data)
}
