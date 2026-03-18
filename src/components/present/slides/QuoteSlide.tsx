'use client'

import { motion } from 'framer-motion'
import type { AssessmentWithResponses } from '@/lib/types/database'
import { PricingTable } from '../visualizations/PricingTable'
import { container, fadeUp } from '../animations'

interface QuoteSlideProps {
  assessment: AssessmentWithResponses
}

export function QuoteSlide({ assessment }: QuoteSlideProps) {
  const s7 = assessment.stage_7_data

  if (!s7) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 sm:px-6 md:px-8">
        <div className="glass-card rounded-2xl px-12 py-10 text-center">
          <h2 className="font-display text-3xl font-bold text-text-primary">
            Investment Proposal
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-text-secondary">
            A quote has not yet been prepared for this assessment.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col justify-center px-4 py-10 sm:px-6 md:px-8 md:py-16 lg:px-16">
      <motion.div
        className="mx-auto w-full max-w-6xl"
        initial="hidden"
        animate="visible"
        variants={container}
      >
        {/* Title */}
        <motion.h2
          className="font-display text-3xl font-bold tracking-tight text-text-primary sm:text-4xl md:text-5xl"
          variants={fadeUp}
          style={{ textWrap: 'balance' } as React.CSSProperties}
        >
          Investment Proposal
        </motion.h2>

        {/* Pricing table */}
        <motion.div className="mt-10" variants={fadeUp}>
          <PricingTable stage7Data={s7} />
        </motion.div>
      </motion.div>
    </div>
  )
}
