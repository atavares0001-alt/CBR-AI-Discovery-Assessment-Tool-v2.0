'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { ScoreDisplay } from './ScoreDisplay'
import type { Assessment } from '@/lib/types/database'

interface ReportTabProps {
  assessment: Assessment
}

export function ReportTab({ assessment }: ReportTabProps) {
  const [downloading, setDownloading] = useState(false)
  const [error, setError] = useState('')

  async function handleDownload() {
    setDownloading(true)
    setError('')

    try {
      const res = await fetch(`/api/assessments/${assessment.id}/report`, {
        method: 'POST',
      })

      if (!res.ok) {
        throw new Error('Failed to generate PDF')
      }

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `CBR-AI-Report-${assessment.client_name.replace(/[^a-zA-Z0-9]/g, '-')}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      setError('Failed to generate PDF report. Please try again.')
    }

    setDownloading(false)
  }

  const canGenerate = assessment.stage_6_data && assessment.stage_7_data

  return (
    <div className="space-y-6">
      <ScoreDisplay score={assessment.ai_readiness_score} />

      <div className="glass-card p-6 text-center">
        <h3 className="text-lg font-semibold">PDF Report</h3>
        <p className="mt-2 text-sm text-text-muted">
          {canGenerate
            ? 'Generate and download the full AI Discovery Report including client responses, your recommendations, and the proposed investment.'
            : 'Complete both Recommendations (Stage 6) and Quote Builder (Stage 7) before generating the report.'}
        </p>

        {error && (
          <div className="mt-3 flex items-center justify-center gap-3">
            <p className="text-sm text-red-400">{error}</p>
            <button
              onClick={handleDownload}
              className="text-sm font-semibold text-accent hover:text-accent-hover"
            >
              Retry
            </button>
          </div>
        )}

        <Button
          className="mt-6"
          size="lg"
          onClick={handleDownload}
          disabled={!canGenerate || downloading}
        >
          {downloading ? 'Generating PDF...' : 'Download PDF Report'}
        </Button>
      </div>
    </div>
  )
}
