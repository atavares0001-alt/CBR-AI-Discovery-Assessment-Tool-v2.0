'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import type { Assessment } from '@/lib/types/database'

function maskEmail(email: string): string {
  const [local, domain] = email.split('@')
  if (!domain) return email
  const maskedLocal = local.length > 2 ? local[0] + '***' + local[local.length - 1] : local[0] + '***'
  return `${maskedLocal}@****`
}

interface AssessmentRowProps {
  assessment: Assessment
  onStatusChange?: () => void
}

export function AssessmentRow({ assessment, onStatusChange }: AssessmentRowProps) {
  const [copied, setCopied] = useState(false)

  async function handleCopyLink() {
    const url = `${window.location.origin}/assess/${assessment.share_token}`
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)

    // Update status to 'sent' if currently 'draft'
    if (assessment.status === 'draft') {
      await fetch(`/api/assessments/${assessment.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'sent' }),
      })
      onStatusChange?.()
    }
  }

  const borderClass = `status-border-${assessment.status}`

  return (
    <div className={`glass-card glass-card-interactive flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between ${borderClass}`}>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3">
          <h3 className="truncate text-lg font-bold">{assessment.client_name}</h3>
          <Badge status={assessment.status} />
        </div>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-text-muted">
          {assessment.company_name && <span className="font-semibold text-text-secondary">{assessment.company_name}</span>}
          {assessment.client_email && (
            <span title="Email (masked for privacy)">{maskEmail(assessment.client_email)}</span>
          )}
          {assessment.industry && <span>{assessment.industry}</span>}
          <span>
            Updated {new Date(assessment.updated_at).toLocaleDateString('en-AU', {
              day: 'numeric', month: 'short', year: 'numeric',
            })}
          </span>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <Button variant="secondary" size="sm" onClick={handleCopyLink}>
          {copied ? 'Copied!' : 'Copy Link'}
        </Button>
        {assessment.client_email && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              const assessUrl = `${window.location.origin}/assess/${assessment.share_token}`
              const name = assessment.client_name.split(' ')[0]
              const subject = encodeURIComponent('Your AI Discovery Assessment from CBR AI Agency')
              const body = encodeURIComponent(
`Hi ${name},

Thank you for your interest in exploring how AI can transform your business!

We've prepared a personalised AI Discovery Assessment for you. It takes just a few minutes to complete and will help us understand your current workflows, tools, and goals so we can tailor our recommendations specifically to your business.

Click the link below to get started:
${assessUrl}

If you have any questions along the way, don't hesitate to reach out.

Looking forward to working with you!

Warm Regards,

Andrew and Phill
CBR AI Agency`
              )
              window.open(`mailto:${assessment.client_email}?subject=${subject}&body=${body}`, '_self')
            }}
          >
            Email Client
          </Button>
        )}
        <Link href={`/dashboard/assessment/${assessment.id}`}>
          <Button variant="secondary" size="sm">View</Button>
        </Link>
      </div>
    </div>
  )
}
