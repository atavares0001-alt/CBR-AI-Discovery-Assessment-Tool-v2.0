import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { renderToBuffer } from '@react-pdf/renderer'
import { ReportDocument } from '@/lib/pdf/ReportDocument'
import React from 'react'
import { isSameOrigin } from '@/lib/security/origin'
import { audit } from '@/lib/security/audit'
import {
  forbidden,
  notFound,
  serverError,
  unauthorized,
} from '@/lib/security/errors'
import { getClientIp } from '@/lib/security/rateLimit'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// POST /api/assessments/[id]/report — Generate PDF report
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isSameOrigin(request)) {
    audit('csrf.blocked', { ip: getClientIp(request), route: '/api/assessments/[id]/report', method: 'POST' })
    return forbidden()
  }

  const { id } = await params
  if (!UUID_RE.test(id)) return notFound('Assessment not found')

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    audit('auth.unauthorized', { route: '/api/assessments/[id]/report', method: 'POST' })
    return unauthorized()
  }

  const { data: assessment, error: assessmentError } = await supabase
    .from('assessments')
    .select('*')
    .eq('id', id)
    .eq('consultant_id', user.id)
    .single()

  if (assessmentError || !assessment) {
    return notFound('Assessment not found')
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

    // Sanitize file name aggressively (defense in depth even though only the
    // owning consultant can reach this code path)
    const safeName = (assessment.client_name || 'client')
      .replace(/[^a-zA-Z0-9_-]/g, '-')
      .slice(0, 64) || 'client'

    audit('assessment.report', { userId: user.id, resourceId: id })

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="CBR-AI-Report-${safeName}.pdf"`,
        'X-Content-Type-Options': 'nosniff',
      },
    })
  } catch (err) {
    return serverError('assessments.report.generate', err, 500, 'Failed to generate PDF')
  }
}
