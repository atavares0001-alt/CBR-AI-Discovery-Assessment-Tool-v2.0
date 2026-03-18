'use client'

import { motion } from 'framer-motion'
import type { AssessmentWithResponses } from '@/lib/types/database'
import { InlineEditable } from '../InlineEditable'
import { usePresentationContext } from '../PresentationShell'
import { FIELD_LABELS } from '@/lib/constants/labels'
import { container, fadeUp } from '../animations'

interface VisionSlideProps {
  assessment: AssessmentWithResponses
}

function getStageAnswers(
  assessment: AssessmentWithResponses,
  stage: string,
): Record<string, unknown> {
  return (assessment.responses.find((r) => r.stage === stage)?.answers ||
    {}) as Record<string, unknown>
}

const BADGE_FIELDS = [
  { key: 'ai_autonomy', label: FIELD_LABELS.ai_autonomy || 'AI Autonomy', icon: 'M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5' },
  { key: 'primary_concern', label: FIELD_LABELS.primary_concern || 'Primary Concern', icon: 'M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286zm0 13.036h.008v.008H12v-.008z' },
  { key: 'timeline', label: FIELD_LABELS.timeline || 'Timeline', icon: 'M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5' },
  { key: 'budget', label: FIELD_LABELS.budget || 'Budget Range', icon: 'M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
]

export function VisionSlide({ assessment }: VisionSlideProps) {
  const { onFieldChange } = usePresentationContext()
  const s5 = getStageAnswers(assessment, 'stage_5')

  const successVision = (s5.success_vision as string) || ''
  const automatedFocus = (s5.automated_focus as string) || ''

  return (
    <div className="flex min-h-screen flex-col justify-center px-4 py-10 sm:px-6 md:px-8 md:py-16 lg:px-16">
      <motion.div
        className="mx-auto w-full max-w-6xl"
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
          Future Vision
        </motion.h2>

        {/* Success vision — large quote block */}
        <motion.div className="mt-8 sm:mt-10" variants={fadeUp}>
          <div className="glass-card relative overflow-hidden rounded-2xl px-7 py-8 sm:px-10 sm:py-10">
            {/* Decorative quotation marks */}
            <div
              className="pointer-events-none absolute left-4 top-3 font-display text-6xl leading-none sm:left-6 sm:top-4 sm:text-8xl"
              style={{ color: 'rgba(16,185,129,0.12)' }}
            >
              &ldquo;
            </div>
            <div
              className="pointer-events-none absolute bottom-1 right-5 font-display text-6xl leading-none sm:bottom-2 sm:right-8 sm:text-8xl"
              style={{ color: 'rgba(16,185,129,0.12)' }}
            >
              &rdquo;
            </div>

            <div className="relative">
              <h3 className="slide-section-label">
                {FIELD_LABELS.success_vision || '6-Month Success Vision'}
              </h3>
              <div className="mt-4 text-lg leading-relaxed text-text-primary sm:text-xl md:text-2xl">
                <InlineEditable
                  value={successVision}
                  onChange={(v) => onFieldChange('stage_5', 'success_vision', v)}
                  fieldType="textarea"
                  placeholder="Vision not provided"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Automated focus — highlighted card */}
        <motion.div className="mt-6" variants={fadeUp}>
          <div className="glass-card card-accent-left rounded-2xl px-6 py-6 sm:px-8 sm:py-7">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                <svg className="h-4 w-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
              </div>
              <h3 className="slide-section-label">
                {FIELD_LABELS.automated_focus || 'Focus After Automation'}
              </h3>
            </div>
            <div className="mt-4 text-base leading-relaxed text-text-primary sm:text-lg">
              <InlineEditable
                value={automatedFocus}
                onChange={(v) =>
                  onFieldChange('stage_5', 'automated_focus', v)
                }
                fieldType="textarea"
                placeholder="Focus area not provided"
              />
            </div>
          </div>
        </motion.div>

        {/* Badge cards grid */}
        <motion.div
          className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-4"
          variants={fadeUp}
        >
          {BADGE_FIELDS.map((field) => {
            const value = (s5[field.key] as string) || 'Not specified'
            return (
              <div
                key={field.key}
                className="glass-card flex flex-col rounded-2xl px-4 py-5 sm:px-6 sm:py-6"
              >
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/[0.06]">
                    <svg className="h-3.5 w-3.5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={field.icon} />
                    </svg>
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-text-muted sm:text-[11px]">
                    {field.label}
                  </span>
                </div>
                <div className="mt-3 text-base font-semibold leading-snug text-text-primary sm:text-lg">
                  <InlineEditable
                    value={value}
                    onChange={(v) =>
                      onFieldChange('stage_5', field.key, v)
                    }
                    placeholder="Not specified"
                  />
                </div>
              </div>
            )
          })}
        </motion.div>
      </motion.div>
    </div>
  )
}
