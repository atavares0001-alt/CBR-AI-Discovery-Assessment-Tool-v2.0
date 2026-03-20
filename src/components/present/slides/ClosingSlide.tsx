'use client'

import { motion } from 'framer-motion'
import type { AssessmentWithResponses } from '@/lib/types/database'
import { container, fadeUp, lineReveal } from '../animations'
import { Logo, SlideWatermark } from '@/components/ui/Logo'

interface ClosingSlideProps {
  assessment: AssessmentWithResponses
}

import { TwoColumnSlide } from '../layout/TwoColumnSlide'

function parseNextSteps(text: string): string[] {
  if (!text) return []
  const numbered = text.split(/\d+[.)]\s+/).filter(Boolean)
  if (numbered.length > 1) return numbered.map((s) => s.trim())
  const lines = text.split(/\n+/).filter(Boolean)
  if (lines.length > 1)
    return lines.map((s) => s.replace(/^\d+[.)]\s*/, '').replace(/^[-*]\s*/, '').trim())
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
    <TwoColumnSlide
      title="Next Steps"
      subtitle="Your clear path from proposal to deployment."
      icon={
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8.25V18a2.25 2.25 0 002.25 2.25h13.5A2.25 2.25 0 0021 18V8.25m-18 0V6a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 6v2.25m-18 0h18M5.25 6h.008v.008H5.25V6zM7.5 6h.008v.008H7.5V6zm2.25 0h.008v.008H9.75V6z" />
        </svg>
      }
    >
      <div className="flex w-full flex-col gap-8">
        {/* Top Cards: Timeline & Next Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Proposed timeline */}
          {proposedTimeline && (
            <div className="glass-card-glow shimmer-bg hover:-translate-y-1 transition-transform relative flex flex-col justify-center rounded-2xl px-6 py-8 sm:px-8">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/15">
                  <svg className="h-4 w-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                  </svg>
                </div>
                <h3 className="text-xs font-semibold uppercase tracking-widest text-accent">
                  Proposed Timeline
                </h3>
              </div>
              <p className="mt-4 text-2xl font-semibold text-text-primary sm:text-3xl">
                {proposedTimeline}
              </p>
            </div>
          )}

          {/* Next steps list */}
          {nextSteps.length > 0 && nextStepsRaw && (
            <div className="glass-card hover:-translate-y-1 transition-transform rounded-2xl px-6 py-8 sm:px-8">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.06]">
                  <svg className="h-4 w-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="slide-section-label">Action Items</h3>
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
                      delay: 0.2 + i * 0.1,
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
          )}
        </div>

        {/* Thank you message */}
        <div className="border-t border-white/10 mt-4 pt-8">
          <h3 className="font-display text-2xl font-bold text-text-primary sm:text-3xl md:text-4xl">
            Thank You
          </h3>
          <p className="mt-2 text-lg text-accent sm:mt-3 sm:text-xl">
            {clientName}
          </p>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-text-secondary sm:mt-5 sm:text-base">
            We look forward to partnering with you on your AI automation
            journey. From AI receptionists to workflow automation, let&apos;s
            help your business work smarter.
          </p>

          <div className="mt-8 flex items-center gap-2">
            <Logo size="md" />
            <span className="flex flex-col ml-3 pl-3 border-l border-white/10">
              <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-text-muted/70">
                Canberra&apos;s Leading
              </span>
              <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-accent/80">
                AI Agency
              </span>
            </span>
          </div>
        </div>
      </div>
    </TwoColumnSlide>
  )
}
