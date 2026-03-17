'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { VortexBackground } from '@/components/VortexBackground'

interface ConsentGateProps {
  onConsent: () => void
  loading?: boolean
}

export function ConsentGate({ onConsent, loading }: ConsentGateProps) {
  const [checked, setChecked] = useState(false)

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4">
      <VortexBackground />
      <motion.div
        initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.6 }}
        className="glass-card-glow relative z-10 w-full max-w-lg p-8"
      >
        <div className="mb-6 text-center">
          <h1 className="font-display text-2xl font-bold">
            CBR <span className="text-accent">AI</span> Discovery Assessment
          </h1>
          <p className="mt-2 text-sm text-text-secondary">
            Before we begin, please review our data handling statement.
          </p>
        </div>

        <div className="glass-card mb-6 p-4 text-sm text-text-secondary leading-relaxed">
          <p className="mb-3 font-medium text-text-primary">Data Handling Statement</p>
          <ul className="space-y-2 text-xs">
            <li><strong>What we collect:</strong> Your business information, current software usage, workflow details, pain points, and future goals across 5 assessment stages.</li>
            <li><strong>Why:</strong> To evaluate your AI readiness and provide tailored automation recommendations.</li>
            <li><strong>How long retained:</strong> Your data is retained for 12 months from the date of your last interaction, after which it may be deleted.</li>
            <li><strong>Who sees it:</strong> Only your assigned CBR AI consultant will have access to your responses.</li>
          </ul>
        </div>

        <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-glass-border p-4 transition-colors hover:border-accent/30">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
            className="mt-0.5 h-5 w-5 shrink-0 rounded accent-accent"
          />
          <span className="text-sm text-text-secondary">
            I consent to CBR AI Agency storing my responses for the purpose of this discovery assessment
          </span>
        </label>

        <Button
          className="mt-6 w-full"
          size="lg"
          disabled={!checked || loading}
          onClick={onConsent}
        >
          {loading ? 'Starting...' : 'Begin Assessment'}
        </Button>
      </motion.div>
    </div>
  )
}
