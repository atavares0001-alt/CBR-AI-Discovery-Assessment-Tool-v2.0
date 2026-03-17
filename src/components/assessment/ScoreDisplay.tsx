'use client'

import { ScoreGauge } from '@/components/ui/ScoreGauge'
import type { AIReadinessScore } from '@/lib/types/database'

interface ScoreDisplayProps {
  score: AIReadinessScore | null
}

export function ScoreDisplay({ score }: ScoreDisplayProps) {
  if (!score) {
    return (
      <div className="glass-card p-6 text-center text-sm text-text-muted">
        AI Readiness Score will appear here once the client completes the assessment.
      </div>
    )
  }

  return (
    <div className="glass-card p-6">
      <h3 className="mb-6 text-center text-sm font-semibold text-text-secondary">
        AI Readiness Score
      </h3>
      <div className="flex flex-wrap items-center justify-center gap-8">
        <div className="relative">
          <ScoreGauge value={score.overall} max={100} label="Overall" size="lg" />
        </div>
        <div className="flex gap-6">
          <div className="relative">
            <ScoreGauge value={score.digital_maturity} max={10} label="Digital Maturity" />
          </div>
          <div className="relative">
            <ScoreGauge value={score.automation_potential} max={10} label="Automation Potential" />
          </div>
        </div>
      </div>
    </div>
  )
}
