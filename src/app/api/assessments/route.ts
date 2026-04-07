import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateShareToken, getTokenExpiryDate } from '@/lib/utils/token'

// POST /api/assessments — Create a new assessment
export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { client_name, client_email, client_phone, company_name } = body

  if (!client_name?.trim()) {
    return NextResponse.json({ error: 'Client name is required' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('assessments')
    .insert({
      consultant_id: user.id,
      client_name: client_name.trim(),
      client_email: client_email?.trim() || null,
      client_phone: client_phone?.trim() || null,
      company_name: company_name?.trim() || null,
      share_token: generateShareToken(),
      token_expires_at: getTokenExpiryDate(),
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}

// GET /api/assessments — List all assessments for the authenticated consultant
export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const url = new URL(request.url)
  const page = parseInt(url.searchParams.get('page') || '1')
  const limit = 20
  const offset = (page - 1) * limit
  const search = url.searchParams.get('search') || ''
  const sort = url.searchParams.get('sort') || 'updated_at'
  const order = url.searchParams.get('order') || 'desc'
  const includeArchived = url.searchParams.get('include_archived') === 'true'

  let query = supabase
    .from('assessments')
    .select('*', { count: 'exact' })
    .eq('consultant_id', user.id)

  if (!includeArchived) {
    query = query.neq('status', 'archived')
  }

  if (search) {
    query = query.or(`client_name.ilike.%${search}%,client_email.ilike.%${search}%,company_name.ilike.%${search}%`)
  }

  query = query
    .order(sort, { ascending: order === 'asc' })
    .range(offset, offset + limit - 1)

  const { data, error, count } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    assessments: data,
    total: count,
    page,
    totalPages: Math.ceil((count || 0) / limit),
  })
}
