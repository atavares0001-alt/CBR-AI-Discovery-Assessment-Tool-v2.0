import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { renderToBuffer } from '@react-pdf/renderer'
import { ReportDocument } from '@/lib/pdf/ReportDocument'
import React from 'react'

// POST /api/assessments/[id]/report — Generate PDF report
export async function POST(
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

  try {
    const doc = React.createElement(ReportDocument, {
      assessment,
      responses: responses || [],
    })
    // @ts-expect-error - react-pdf types mismatch with React 19
    const buffer = await renderToBuffer(doc)

    // Update status to report_generated
    await supabase
      .from('assessments')
      .update({ status: 'report_generated' })
      .eq('id', id)

    const clientName = assessment.client_name.replace(/[^a-zA-Z0-9]/g, '-')

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="CBR-AI-Report-${clientName}.pdf"`,
      },
    })
  } catch (err) {
    console.error('PDF generation error:', err)
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 })
  }
}
