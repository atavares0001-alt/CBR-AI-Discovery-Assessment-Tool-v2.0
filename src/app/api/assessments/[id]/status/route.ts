import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { AssessmentStatus } from '@/lib/types/database'

const MANUAL_STATUSES: AssessmentStatus[] = ['quote_sent', 'accepted', 'lost']

// PATCH /api/assessments/[id]/status — Manual status update
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

  const { status } = await request.json()

  if (!MANUAL_STATUSES.includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('assessments')
    .update({ status })
    .eq('id', id)
    .eq('consultant_id', user.id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
