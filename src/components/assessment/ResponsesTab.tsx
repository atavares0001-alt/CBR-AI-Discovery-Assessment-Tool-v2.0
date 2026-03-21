'use client'

import { GlassCard } from '@/components/ui/GlassCard'
import { STAGE_LABELS, FIELD_LABELS } from '@/lib/constants/labels'
import type { Response } from '@/lib/types/database'

interface ResponsesTabProps {
  responses: Response[]
}

export function ResponsesTab({ responses }: ResponsesTabProps) {
  const stageOrder = ['stage_1', 'stage_2', 'stage_3', 'stage_4', 'stage_5']
  const sorted = stageOrder
    .map((stage) => responses.find((r) => r.stage === stage))
    .filter(Boolean) as Response[]

  if (sorted.length === 0) {
    return (
      <div className="py-12 text-center text-text-muted">
        No client responses yet. The client has not started the assessment.
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {sorted.map((response) => (
        <div key={response.stage}>
          <h3 className="mb-4 text-sm font-semibold text-accent">
            {STAGE_LABELS[response.stage] || response.stage}
          </h3>
          <div className="space-y-3">
            {Object.entries(response.answers as Record<string, unknown>).map(([key, value]) => {
              if (!value && value !== 0) return null
              return (
                <GlassCard key={key} className="p-4">
                  <p className="text-xs uppercase text-text-muted">
                    {FIELD_LABELS[key] || key.replace(/_/g, ' ')}
                  </p>
                  <p className="mt-1 text-sm">{String(value)}</p>
                </GlassCard>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
