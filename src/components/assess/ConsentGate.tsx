'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { VortexBackground } from '@/components/VortexBackground'
import { Logo } from '@/components/ui/Logo'

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
          <Logo size="md" />
          <h1 className="mt-2 font-display text-xl font-bold">
            Discovery Assessment
          </h1>
        </div>

        <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-glass-border p-4 transition-colors hover:border-accent/30">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
            className="mt-0.5 h-6 w-6 shrink-0 rounded accent-accent"
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
