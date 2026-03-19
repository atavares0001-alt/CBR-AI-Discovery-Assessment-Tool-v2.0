'use client'

import { motion } from 'framer-motion'
import type { AssessmentWithResponses } from '@/lib/types/database'
import { VortexBackground } from '@/components/VortexBackground'
import { container, fadeUp, lineReveal } from '../animations'
import { Logo } from '@/components/ui/Logo'

interface CoverSlideProps {
  assessment: AssessmentWithResponses
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function CoverSlide({ assessment }: CoverSlideProps) {
  const companyName = assessment.company_name || assessment.client_name

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Vortex background */}
      <VortexBackground />

      {/* Radial overlay for depth */}
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 20%, rgba(5,5,5,0.4) 50%, #050505 85%)',
        }}
      />

      {/* Content */}
      <motion.div
        className="relative z-[2] flex flex-col items-center px-6 text-center sm:px-8"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        {/* Agency branding — top */}
        <motion.div className="flex flex-col items-center gap-2" variants={fadeUp}>
          <Logo size="lg" />
          <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-text-muted/60">
            Canberra&apos;s Leading AI Agency
          </span>
        </motion.div>

        {/* Emerald divider with glow */}
        <motion.div
          className="mt-8 h-[2px] w-24 origin-center rounded-full bg-accent sm:mt-10 sm:w-32"
          variants={lineReveal}
          style={{
            boxShadow: '0 0 20px rgba(16, 185, 129, 0.5), 0 0 60px rgba(16, 185, 129, 0.15)',
          }}
        />

        {/* AI Discovery Assessment title */}
        <motion.h1
          className="mt-8 font-display text-4xl font-bold leading-[1.1] tracking-tight text-text-primary sm:mt-10 sm:text-5xl md:text-6xl lg:text-7xl"
          style={{ textWrap: 'balance' } as React.CSSProperties}
          variants={fadeUp}
        >
          AI Discovery{' '}
          <span className="text-accent">Assessment</span>
        </motion.h1>

        {/* Prepared for */}
        <motion.div className="mt-8 sm:mt-10" variants={fadeUp}>
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-text-muted">
            Prepared for
          </span>
          <p className="mt-2 text-2xl font-semibold text-text-primary sm:text-3xl">
            {companyName}
          </p>
          <p className="mt-1 text-lg font-medium text-accent">
            {assessment.client_name}
          </p>
        </motion.div>

        {/* Industry badge + Date */}
        <motion.div className="mt-6 flex flex-col items-center gap-3" variants={fadeUp}>
          {assessment.industry && (
            <span className="inline-block rounded-full border border-accent/20 bg-accent/[0.06] px-5 py-1.5 text-sm font-medium text-accent/90">
              {assessment.industry}
            </span>
          )}
          <p className="text-xs font-medium tracking-widest text-text-muted/70">
            {formatDate(assessment.created_at)}
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}
