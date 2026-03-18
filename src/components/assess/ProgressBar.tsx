'use client'

import { motion } from 'framer-motion'

interface ProgressBarProps {
  currentStage: number
  totalStages: number
  stageName: string
  saving?: boolean
  saved?: boolean
}

export function ProgressBar({ currentStage, totalStages, stageName, saving, saved }: ProgressBarProps) {
  const progress = totalStages > 0 ? (currentStage / totalStages) * 100 : 0

  return (
    <div className="fixed top-0 left-0 right-0 z-30 border-b border-glass-border bg-bg/90 backdrop-blur-lg">
      <div className="mx-auto max-w-3xl px-4 py-3">
        {/* Stage label + counter */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/20 font-mono text-xs font-semibold text-accent">
              {currentStage}
            </span>
            <span className="font-medium">{stageName}</span>
          </div>
          <span className="text-text-muted">
            {saving ? (
              <span className="flex items-center gap-1.5 text-amber-400">
                <svg className="h-3 w-3 animate-spin" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" strokeDasharray="28" strokeDashoffset="8" />
                </svg>
                Saving...
              </span>
            ) : saved ? (
              <span className="text-accent">Saved</span>
            ) : (
              `Step ${currentStage} of ${totalStages}`
            )}
          </span>
        </div>

        {/* Step dots */}
        <div className="mt-2 flex items-center gap-1.5">
          {Array.from({ length: totalStages }, (_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                i < currentStage
                  ? 'bg-accent'
                  : i === currentStage
                    ? 'bg-accent/40'
                    : 'bg-white/10'
              }`}
            />
          ))}
        </div>

        {/* Auto-save notice */}
        <p className="mt-1.5 text-[10px] text-text-muted">
          Your answers are saved automatically — you can close and return anytime.
        </p>
      </div>
    </div>
  )
}
