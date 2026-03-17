import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/assessments/[id] — Get a single assessment with responses
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: assessment, error: assessmentError } = await supabase
    .from('assessments')
    .select('*')
    .eq('id', id)
    .eq('consultant_id', user.id)
    .single()

  if (assessmentError || !assessment) {
    return NextResponse.json({ error: 'Assessment not found' }, { status: 404 })
  }

  const { data: responses } = await supabase
    .from('responses')
    .select('*')
    .eq('assessment_id', id)
    .order('stage')

  return NextResponse.json({ ...assessment, responses: responses || [] })
}

// PATCH /api/assessments/[id] — Update assessment (stage 6, stage 7, etc.)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()

  const { data, error } = await supabase
    .from('assessments')
    .update(body)
    .eq('id', id)
    .eq('consultant_id', user.id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

// DELETE /api/assessments/[id] — Delete assessment and all responses
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { error } = await supabase
    .from('assessments')
    .delete()
    .eq('id', id)
    .eq('consultant_id', user.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
