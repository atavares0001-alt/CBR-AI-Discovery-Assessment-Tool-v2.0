'use client'

import { motion } from 'framer-motion'
import type { AssessmentWithResponses } from '@/lib/types/database'
import { ScoreGaugeLarge } from '../visualizations/ScoreGaugeLarge'
import { container, fadeUp } from '../animations'

interface ScoreSlideProps {
  assessment: AssessmentWithResponses
}

function getInterpretation(score: number): { text: string; color: string } {
  if (score >= 70) return { text: 'Strong digital foundation', color: '#10b981' }
  if (score >= 40) return { text: 'Room for improvement', color: '#f59e0b' }
  return { text: 'Early stage — high potential', color: '#ef4444' }
}

export function ScoreSlide({ assessment }: ScoreSlideProps) {
  const score = assessment.ai_readiness_score

  if (!score) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 sm:px-6 md:px-8">
        <div className="glass-card rounded-2xl px-8 py-10 text-center sm:px-12">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10">
            <svg className="h-7 w-7 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
            </svg>
          </div>
          <h2 className="font-display text-2xl font-bold text-text-primary sm:text-3xl">
            AI Readiness Score
          </h2>
          <p className="mt-4 text-base leading-relaxed text-text-secondary">
            Score has not yet been calculated for this assessment.
          </p>
        </div>
      </div>
    )
  }

  const overall = getInterpretation(score.overall)
  const digital = getInterpretation(score.digital_maturity)
  const automation = getInterpretation(score.automation_potential)

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-10 sm:px-6 md:px-8 md:py-16">
      {/* Radial glow behind gauges */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 sm:h-[500px] sm:w-[500px] md:h-[700px] md:w-[700px]"
        style={{
          background: 'radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)',
        }}
      />

      <motion.div
        className="relative z-10 flex w-full max-w-5xl flex-col items-center gap-10 sm:gap-14 lg:gap-16"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        {/* Title + subtitle */}
        <motion.div className="text-center" variants={fadeUp}>
          <h2
            className="font-display text-3xl font-bold tracking-tight text-text-primary sm:text-4xl md:text-5xl"
            style={{ textWrap: 'balance' } as React.CSSProperties}
          >
            AI Readiness Score
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-text-secondary sm:text-base">
            Based on your current technology stack, workflows, and automation maturity
          </p>
        </motion.div>

        {/* Gauges row */}
        <motion.div
          className="flex w-full flex-col items-center gap-8 sm:gap-12 lg:flex-row lg:items-end lg:justify-center lg:gap-16"
          variants={fadeUp}
        >
          {/* Digital Maturity — smaller flanking */}
          <div className="flex flex-col items-center gap-3">
            <div className="scale-65 sm:scale-75 lg:scale-85">
              <ScoreGaugeLarge
                value={score.digital_maturity}
                max={100}
                label="Digital Maturity"
              />
            </div>
            <p
              className="mt-1 text-xs font-medium sm:text-sm"
              style={{ color: digital.color }}
            >
              {digital.text}
            </p>
          </div>

          {/* Overall — hero center */}
          <div className="flex flex-col items-center gap-3">
            <div className="scale-80 sm:scale-100 lg:scale-110">
              <ScoreGaugeLarge
                value={score.overall}
                max={100}
                label="Overall Score"
              />
            </div>
            <p
              className="mt-1 text-sm font-semibold sm:text-base"
              style={{ color: overall.color }}
            >
              {overall.text}
            </p>
          </div>

          {/* Automation Potential — smaller flanking */}
          <div className="flex flex-col items-center gap-3">
            <div className="scale-65 sm:scale-75 lg:scale-85">
              <ScoreGaugeLarge
                value={score.automation_potential}
                max={100}
                label="Automation Potential"
              />
            </div>
            <p
              className="mt-1 text-xs font-medium sm:text-sm"
              style={{ color: automation.color }}
            >
              {automation.text}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
