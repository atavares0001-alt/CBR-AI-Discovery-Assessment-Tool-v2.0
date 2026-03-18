'use client'

import { motion } from 'framer-motion'
import type { AssessmentWithResponses } from '@/lib/types/database'
import { VortexBackground } from '@/components/VortexBackground'
import { container, fadeUp, lineReveal } from '../animations'

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
        {/* Subtitle badge */}
        <motion.div variants={fadeUp}>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-text-secondary backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            AI Discovery Assessment
          </span>
        </motion.div>

        {/* Company name */}
        <motion.h1
          className="mt-8 font-display text-3xl font-bold leading-[1.1] tracking-tight text-text-primary sm:mt-10 sm:text-5xl md:text-6xl lg:text-7xl"
          style={{ textWrap: 'balance' } as React.CSSProperties}
          variants={fadeUp}
        >
          {companyName}
        </motion.h1>

        {/* Emerald divider with glow */}
        <motion.div
          className="mt-8 h-[2px] w-24 origin-center rounded-full bg-accent sm:mt-10 sm:w-32"
          variants={lineReveal}
          style={{
            boxShadow: '0 0 20px rgba(16, 185, 129, 0.5), 0 0 60px rgba(16, 185, 129, 0.15)',
          }}
        />

        {/* Prepared for */}
        <motion.div className="mt-6 sm:mt-8" variants={fadeUp}>
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-text-muted">
            Prepared for
          </span>
          <p className="mt-1.5 text-xl font-medium text-accent sm:text-2xl">
            {assessment.client_name}
          </p>
        </motion.div>

        {/* Industry badge */}
        {assessment.industry && (
          <motion.div variants={fadeUp} className="mt-5">
            <span className="inline-block rounded-full border border-accent/20 bg-accent/[0.06] px-5 py-1.5 text-sm font-medium text-accent/90">
              {assessment.industry}
            </span>
          </motion.div>
        )}

        {/* Date */}
        <motion.p
          className="mt-8 text-xs font-medium tracking-widest text-text-muted/70 sm:mt-10"
          variants={fadeUp}
        >
          {formatDate(assessment.created_at)}
        </motion.p>

        {/* CBR branding */}
        <motion.div
          className="mt-10 flex flex-col items-center gap-1 sm:mt-14"
          variants={fadeUp}
        >
          <span className="font-display text-sm font-bold tracking-wider">
            CBR <span className="text-accent">AI</span>
          </span>
          <span className="text-[9px] font-medium uppercase tracking-[0.3em] text-text-muted/50">
            Intelligent Business Solutions
          </span>
        </motion.div>
      </motion.div>
    </div>
  )
}
