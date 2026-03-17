'use client'

import { motion } from 'framer-motion'

interface ProgressBarProps {
  currentStage: number
  totalStages: number
  stageName: string
  saving?: boolean
  saved?: boolean
}

const STAGE_NAMES = ['Consent', 'Business Profile', 'Industry Details', 'Software Stack', 'Workflows', 'Pain Points', 'Future Vision']

export function ProgressBar({ currentStage, totalStages, stageName, saving, saved }: ProgressBarProps) {
  const progress = totalStages > 0 ? (currentStage / totalStages) * 100 : 0

  return (
    <div className="fixed top-0 left-0 right-0 z-30 border-b border-glass-border bg-bg/90 backdrop-blur-lg">
      <div className="mx-auto max-w-3xl px-4 py-3">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">{stageName}</span>
          <span className="text-text-muted">
            {saving ? (
              <span className="text-amber-400">Saving...</span>
            ) : saved ? (
              <span className="text-accent">Saved ✓</span>
            ) : (
              `Stage ${currentStage} of ${totalStages}`
            )}
          </span>
        </div>
        <div className="mt-2 h-1 rounded-full bg-white/10">
          <motion.div
            className="h-full rounded-full bg-accent"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      </div>
    </div>
  )
}
