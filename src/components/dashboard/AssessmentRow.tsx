'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import type { Assessment } from '@/lib/types/database'

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

  return (
    <div className="glass-card flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3">
          <h3 className="truncate text-sm font-semibold">{assessment.client_name}</h3>
          <Badge status={assessment.status} />
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-text-muted">
          {assessment.company_name && <span>{assessment.company_name}</span>}
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
        <Link href={`/dashboard/assessment/${assessment.id}`}>
          <Button variant="secondary" size="sm">View</Button>
        </Link>
      </div>
    </div>
  )
}
