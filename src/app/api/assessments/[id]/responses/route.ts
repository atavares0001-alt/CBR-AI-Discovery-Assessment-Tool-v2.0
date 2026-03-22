import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// PATCH /api/assessments/[id]/responses — Update stage responses (consultant)
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

  // Verify the consultant owns this assessment
  const { data: assessment, error: assessmentError } = await supabase
    .from('assessments')
    .select('id')
    .eq('id', id)
    .eq('consultant_id', user.id)
    .single()

  if (assessmentError || !assessment) {
    return NextResponse.json({ error: 'Assessment not found' }, { status: 404 })
  }

  const { stage, answers } = await request.json()

  if (!stage || !answers || typeof answers !== 'object') {
    return NextResponse.json({ error: 'stage and answers are required' }, { status: 400 })
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
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
