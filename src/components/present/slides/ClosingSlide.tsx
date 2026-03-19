'use client'

import { motion } from 'framer-motion'
import type { AssessmentWithResponses } from '@/lib/types/database'
import { container, fadeUp, lineReveal } from '../animations'
import { Logo, SlideWatermark } from '@/components/ui/Logo'

interface ClosingSlideProps {
  assessment: AssessmentWithResponses
}

function parseNextSteps(text: string): string[] {
  if (!text) return []
  // Try numbered items
  const numbered = text.split(/\d+[.)]\s+/).filter(Boolean)
  if (numbered.length > 1) return numbered.map((s) => s.trim())
  // Try newlines
  const lines = text.split(/\n+/).filter(Boolean)
  if (lines.length > 1)
    return lines.map((s) => s.replace(/^\d+[.)]\s*/, '').replace(/^[-*]\s*/, '').trim())
  // Try bullet/dash separators
  const bullets = text.split(/[-*]\s+/).filter(Boolean)
  if (bullets.length > 1) return bullets.map((s) => s.trim())
  return [text.trim()]
}

export function ClosingSlide({ assessment }: ClosingSlideProps) {
  const s7 = assessment.stage_7_data
  const nextStepsRaw = s7?.next_steps || ''
  const proposedTimeline = s7?.proposed_timeline || ''
  const nextSteps = parseNextSteps(nextStepsRaw)
  const clientName = assessment.client_name

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-10 sm:px-6 md:px-8 md:py-16">
      <SlideWatermark />
      {/* Subtle radial glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 sm:h-[600px] sm:w-[600px]"
        style={{
          background:
            'radial-gradient(circle, rgba(16,185,129,0.05) 0%, transparent 70%)',
        }}
      />

      <motion.div
        className="relative z-10 flex w-full max-w-4xl flex-col items-center"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        {/* Title */}
        <motion.h2
          className="font-display text-3xl font-bold tracking-tight text-text-primary sm:text-4xl md:text-5xl"
          variants={fadeUp}
          style={{ textWrap: 'balance' } as React.CSSProperties}
        >
          Next Steps
        </motion.h2>

        {/* Proposed timeline */}
        {proposedTimeline && (
          <motion.div className="mt-8 w-full sm:mt-10" variants={fadeUp}>
            <div className="glass-card-glow relative flex flex-col items-center rounded-2xl px-6 py-7 text-center sm:px-10 sm:py-8">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                  <svg className="h-4 w-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                  </svg>
                </div>
                <h3 className="slide-section-label text-accent">
                  Proposed Timeline
                </h3>
              </div>
              <p className="mt-3 text-xl font-semibold text-accent sm:text-2xl md:text-3xl">
                {proposedTimeline}
              </p>
            </div>
          </motion.div>
        )}

        {/* Next steps list */}
        {nextSteps.length > 0 && nextStepsRaw && (
          <motion.div className="mt-6 w-full sm:mt-8" variants={fadeUp}>
            <div className="glass-card rounded-2xl px-6 py-6 sm:px-8 sm:py-7">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.06]">
                  <svg className="h-4 w-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="slide-section-label">
                  Action Items
                </h3>
              </div>
              <ul className="mt-5 space-y-3 sm:space-y-4">
                {nextSteps.map((step, i) => (
                  <motion.li
                    key={i}
                    className="flex items-start gap-3 sm:gap-4"
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.45,
                      delay: 0.5 + i * 0.1,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/20 text-[10px] font-bold text-accent sm:h-7 sm:w-7 sm:text-xs">
                      {i + 1}
                    </span>
                    <span className="text-sm leading-relaxed text-text-primary sm:text-base">
                      {step}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}

        {/* Emerald divider */}
        <motion.div
          className="mt-10 h-[2px] w-20 origin-center rounded-full bg-accent sm:mt-12 sm:w-24"
          variants={lineReveal}
          style={{
            boxShadow:
              '0 0 20px rgba(16, 185, 129, 0.4), 0 0 40px rgba(16, 185, 129, 0.2)',
          }}
        />

        {/* Thank you message */}
        <motion.div
          className="mt-8 flex flex-col items-center text-center sm:mt-10"
          variants={fadeUp}
        >
          <h3 className="font-display text-2xl font-bold text-text-primary sm:text-3xl md:text-4xl">
            Thank You
          </h3>
          <p className="mt-2 text-lg text-accent sm:mt-3 sm:text-xl">{clientName}</p>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-text-secondary sm:mt-6 sm:text-base">
            We look forward to partnering with you on your AI automation
            journey. From AI receptionists to workflow automation, let&apos;s
            help your business work smarter.
          </p>
        </motion.div>

        {/* CBR branding */}
        <motion.div
          className="mt-12 flex flex-col items-center gap-1 sm:mt-16"
          variants={fadeUp}
        >
          <Logo size="md" />
          <span className="text-[9px] font-medium uppercase tracking-[0.3em] text-text-muted/50">
            Canberra&apos;s Leading AI Agency
          </span>
        </motion.div>
      </motion.div>
    </div>
  )
}
