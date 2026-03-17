import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

// POST /api/assess/[token]/consent — Record consent
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params
  const supabase = createServiceClient()

  const { data: assessment } = await supabase
    .from('assessments')
    .select('id, token_expires_at, status')
    .eq('share_token', token)
    .single()

  if (!assessment) {
    return NextResponse.json({ error: 'Assessment not found' }, { status: 404 })
  }

  if (new Date(assessment.token_expires_at) < new Date()) {
    return NextResponse.json({ error: 'Token expired' }, { status: 410 })
  }

  const { error } = await supabase
    .from('assessments')
    .update({ consent_given_at: new Date().toISOString() })
    .eq('id', assessment.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
