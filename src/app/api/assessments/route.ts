import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateShareToken, getTokenExpiryDate } from '@/lib/utils/token'
import { isValidEmail } from '@/lib/utils/validation'
import { isSameOrigin } from '@/lib/security/origin'
import { sanitizeSearchTerm } from '@/lib/security/sanitize'
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

// POST /api/assessments — Create a new assessment
export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    audit('csrf.blocked', { ip: getClientIp(request), route: '/api/assessments', method: 'POST' })
    return forbidden()
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    audit('auth.unauthorized', { route: '/api/assessments', method: 'POST' })
    return unauthorized()
  }

  let body: { client_name?: string; client_email?: string; client_phone?: string; company_name?: string }
  try {
    body = await readJsonBody(request, BODY_LIMITS.small)
  } catch (err) {
    if (err instanceof PayloadTooLargeError) return payloadTooLarge()
    if (err instanceof InvalidJsonError) return badRequest('Invalid JSON')
    return serverError('assessments.create.body', err)
  }

  const { client_name, client_email, client_phone, company_name } = body

  if (!client_name?.trim()) {
    return badRequest('Client name is required')
  }

  // Cap free-text fields so a malicious consultant can't stuff payloads
  // into other consultants' database (and to keep the mailto helper sane).
  const trimmedName = client_name.trim().slice(0, 200)
  const trimmedEmail = client_email?.trim().slice(0, 254) || null
  const trimmedPhone = client_phone?.trim().slice(0, 32) || null
  const trimmedCompany = company_name?.trim().slice(0, 200) || null

  if (trimmedEmail && !isValidEmail(trimmedEmail)) {
    return badRequest('Invalid email address')
  }

  const { data, error } = await supabase
    .from('assessments')
    .insert({
      consultant_id: user.id,
      client_name: trimmedName,
      client_email: trimmedEmail,
      client_phone: trimmedPhone,
      company_name: trimmedCompany,
      share_token: generateShareToken(),
      token_expires_at: getTokenExpiryDate(),
    })
    .select()
    .single()

  if (error) {
    return serverError('assessments.create', error)
  }

  audit('assessment.create', { userId: user.id, resourceId: data?.id })
  return NextResponse.json(data, { status: 201 })
}

// GET /api/assessments — List all assessments for the authenticated consultant
export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    audit('auth.unauthorized', { route: '/api/assessments', method: 'GET' })
    return unauthorized()
  }

  const url = new URL(request.url)
  const pageRaw = parseInt(url.searchParams.get('page') || '1', 10)
  const page = Number.isFinite(pageRaw) && pageRaw > 0 ? Math.min(pageRaw, 10000) : 1
  const limit = 20
  const offset = (page - 1) * limit
  const search = sanitizeSearchTerm(url.searchParams.get('search') || '')
  const allowedSortColumns = new Set(['updated_at', 'created_at', 'client_name', 'company_name', 'status'])
  const sortRaw = url.searchParams.get('sort') || 'updated_at'
  const sort = allowedSortColumns.has(sortRaw) ? sortRaw : 'updated_at'
  const order = url.searchParams.get('order') === 'asc' ? 'asc' : 'desc'
  const includeArchived = url.searchParams.get('include_archived') === 'true'

  let query = supabase
    .from('assessments')
    .select('*', { count: 'exact' })
    .eq('consultant_id', user.id)

  if (!includeArchived) {
    query = query.neq('status', 'archived')
  }

  if (search) {
    // search is sanitized to a safe character set above; still wrap in
    // ilike pattern explicitly so PostgREST treats it as a literal value
    const pattern = `%${search}%`
    query = query.or(
      `client_name.ilike.${pattern},client_email.ilike.${pattern},company_name.ilike.${pattern}`
    )
  }

  query = query
    .order(sort, { ascending: order === 'asc' })
    .range(offset, offset + limit - 1)

  const { data, error, count } = await query

  if (error) {
    return serverError('assessments.list', error)
  }

  return NextResponse.json({
    assessments: data,
    total: count,
    page,
    totalPages: Math.ceil((count || 0) / limit),
  })
}
