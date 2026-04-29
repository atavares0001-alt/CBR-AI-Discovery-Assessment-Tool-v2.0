import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateShareToken, getTokenExpiryDate } from '@/lib/utils/token'
import { isSameOrigin } from '@/lib/security/origin'
import { audit } from '@/lib/security/audit'
import {
  forbidden,
  notFound,
  serverError,
  unauthorized,
} from '@/lib/security/errors'
import { getClientIp } from '@/lib/security/rateLimit'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/**
 * POST /api/assessments/[id]/rotate-token
 *
 * Rotates the public share token for an assessment that the consultant
 * suspects has been leaked. Generates a new random token and resets the
 * 30-day expiry. The previous token becomes immediately invalid because
 * `share_token` is UNIQUE — the next lookup using the old value will 404.
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isSameOrigin(request)) {
    audit('csrf.blocked', { ip: getClientIp(request), route: '/api/assessments/[id]/rotate-token', method: 'POST' })
    return forbidden()
  }

  const { id } = await params
  if (!UUID_RE.test(id)) return notFound('Assessment not found')

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    audit('auth.unauthorized', { route: '/api/assessments/[id]/rotate-token', method: 'POST' })
    return unauthorized()
  }

  const { data, error } = await supabase
    .from('assessments')
    .update({
      share_token: generateShareToken(),
      token_expires_at: getTokenExpiryDate(),
    })
    .eq('id', id)
    .eq('consultant_id', user.id)
    .select('id, share_token, token_expires_at')
    .single()

  if (error) {
    return serverError('assessments.rotate_token', error)
  }

  if (!data) {
    return notFound('Assessment not found')
  }

  audit('assessment.rotate_token', { userId: user.id, resourceId: id })

  return NextResponse.json(data)
}
