import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { calculateAIReadinessScore } from '@/lib/utils/scoring'
import type { StageName } from '@/lib/types/database'

// POST /api/assess/[token]/responses — Save stage responses
export async function POST(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params
  const supabase = createServiceClient()

  const { data: assessment } = await supabase
    .from('assessments')
    .select('id, token_expires_at, status, current_stage')
    .eq('share_token', token)
    .single()

  if (!assessment) {
    return NextResponse.json({ error: 'Assessment not found' }, { status: 404 })
  }

  if (new Date(assessment.token_expires_at) < new Date()) {
    return NextResponse.json({ error: 'Token expired' }, { status: 410 })
  }

  const body = await request.json()
  const { stage, answers, is_final } = body as {
    stage: StageName
    answers: Record<string, unknown>
    is_final?: boolean
  }

  if (!stage || !answers) {
    return NextResponse.json({ error: 'Stage and answers are required' }, { status: 400 })
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
    return NextResponse.json({ error: responseError.message }, { status: 500 })
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

  // Update industry from Stage 1 answers
  if (stage === 'stage_1' && answers.industry) {
    updates.industry = answers.industry
  }

  // If final submission (Stage 5)
  if (is_final) {
    updates.status = 'client_complete'

    // Calculate AI Readiness Score
    const { data: allResponses } = await supabase
      .from('responses')
      .select('*')
      .eq('assessment_id', assessment.id)

    if (allResponses) {
      updates.ai_readiness_score = calculateAIReadinessScore(allResponses)
    }
  }

  await supabase
    .from('assessments')
    .update(updates)
    .eq('id', assessment.id)

  return NextResponse.json({ success: true })
}
