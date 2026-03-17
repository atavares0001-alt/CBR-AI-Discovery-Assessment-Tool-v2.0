import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

// GET /api/assess/[token] — Look up assessment by token (public)
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params
  const supabase = createServiceClient()

  const { data: assessment, error } = await supabase
    .from('assessments')
    .select('id, client_name, company_name, status, share_token, token_expires_at, current_stage, consent_given_at')
    .eq('share_token', token)
    .single()

  if (error || !assessment) {
    return NextResponse.json({ error: 'Assessment not found' }, { status: 404 })
  }

  // Check token expiry
  if (new Date(assessment.token_expires_at) < new Date()) {
    return NextResponse.json({ error: 'Token expired', code: 'TOKEN_EXPIRED' }, { status: 410 })
  }

  // Check if already completed
  if (['client_complete', 'recommendations_added', 'quote_added', 'report_generated', 'quote_sent', 'accepted'].includes(assessment.status)) {
    return NextResponse.json({ error: 'Assessment already completed', code: 'ALREADY_COMPLETE' }, { status: 410 })
  }

  // Fetch existing responses
  const { data: responses } = await supabase
    .from('responses')
    .select('stage, answers')
    .eq('assessment_id', assessment.id)
    .order('stage')

  return NextResponse.json({
    ...assessment,
    responses: responses || [],
  })
}
