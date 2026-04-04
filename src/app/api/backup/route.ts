import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/backup — Export all assessments + responses as structured JSON
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Fetch all assessments for this consultant
  const { data: assessments, error: assessError } = await supabase
    .from('assessments')
    .select('*')
    .eq('consultant_id', user.id)
    .order('created_at', { ascending: false })

  if (assessError) {
    return NextResponse.json({ error: assessError.message }, { status: 500 })
  }

  if (!assessments || assessments.length === 0) {
    return NextResponse.json({
      version: '1.0',
      exported_at: new Date().toISOString(),
      consultant_id: user.id,
      assessments: [],
    })
  }

  // Fetch all responses for these assessments
  const assessmentIds = assessments.map((a) => a.id)
  const { data: responses, error: respError } = await supabase
    .from('responses')
    .select('*')
    .in('assessment_id', assessmentIds)
    .order('stage')

  if (respError) {
    return NextResponse.json({ error: respError.message }, { status: 500 })
  }

  // Group responses by assessment_id
  const responsesByAssessment: Record<string, typeof responses> = {}
  for (const resp of responses || []) {
    if (!responsesByAssessment[resp.assessment_id]) {
      responsesByAssessment[resp.assessment_id] = []
    }
    responsesByAssessment[resp.assessment_id].push(resp)
  }

  // Build export payload
  const payload = {
    version: '1.0',
    exported_at: new Date().toISOString(),
    consultant_id: user.id,
    assessments: assessments.map((a) => ({
      ...a,
      responses: responsesByAssessment[a.id] || [],
    })),
  }

  return NextResponse.json(payload)
}

// POST /api/backup — Import assessments + responses from JSON
export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: {
    version?: string
    assessments?: Array<{
      id: string
      responses?: Array<{
        id: string
        assessment_id: string
        stage: string
        answers: Record<string, unknown>
        created_at?: string
        updated_at?: string
      }>
      [key: string]: unknown
    }>
  }

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (!body.assessments || !Array.isArray(body.assessments)) {
    return NextResponse.json(
      { error: 'Invalid backup format: missing assessments array' },
      { status: 400 }
    )
  }

  let assessmentsImported = 0
  let responsesImported = 0
  const errors: string[] = []

  for (const item of body.assessments) {
    const { responses, ...assessmentData } = item

    // Force the consultant_id to the current user so imported data
    // is owned by whoever is importing
    const assessmentPayload = {
      ...assessmentData,
      consultant_id: user.id,
      updated_at: new Date().toISOString(),
    }

    // Remove fields that Supabase manages automatically if they cause issues
    delete (assessmentPayload as Record<string, unknown>).created_at

    const { error: upsertError } = await supabase
      .from('assessments')
      .upsert(assessmentPayload, { onConflict: 'id' })

    if (upsertError) {
      errors.push(`Assessment ${item.id}: ${upsertError.message}`)
      continue
    }

    assessmentsImported++

    // Import responses
    if (responses && Array.isArray(responses)) {
      for (const resp of responses) {
        const responsePayload = {
          assessment_id: item.id,
          stage: resp.stage,
          answers: resp.answers,
          updated_at: new Date().toISOString(),
        }

        const { error: respError } = await supabase
          .from('responses')
          .upsert(responsePayload, { onConflict: 'assessment_id,stage' })

        if (respError) {
          errors.push(`Response ${resp.stage} for ${item.id}: ${respError.message}`)
        } else {
          responsesImported++
        }
      }
    }
  }

  return NextResponse.json({
    success: true,
    assessments_imported: assessmentsImported,
    responses_imported: responsesImported,
    errors: errors.length > 0 ? errors : undefined,
  })
}
