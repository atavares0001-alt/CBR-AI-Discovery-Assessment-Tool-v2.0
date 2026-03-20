'use client'

import { motion } from 'framer-motion'
import type { AssessmentWithResponses } from '@/lib/types/database'
import { AnimatedCounter } from '../visualizations/AnimatedCounter'
import { FIELD_LABELS } from '@/lib/constants/labels'
import { container, fadeUp } from '../animations'
import { SlideWatermark } from '@/components/ui/Logo'

interface PainpointsSlideProps {
  assessment: AssessmentWithResponses
}

import { TwoColumnSlide } from '../layout/TwoColumnSlide'

function getStageAnswers(
  assessment: AssessmentWithResponses,
  stage: string,
): Record<string, unknown> {
  return (assessment.responses.find((r) => r.stage === stage)?.answers ||
    {}) as Record<string, unknown>
}

export function PainpointsSlide({ assessment }: PainpointsSlideProps) {
  const s4 = getStageAnswers(assessment, 'stage_4')

  const manualHours = Number(s4.manual_data_entry_hours) || 0
  const repetitiveTask = (s4.repetitive_task as string) || 'Not specified'
  const humanErrors = (s4.human_errors as string) || 'Not specified'
  const responseTime = (s4.response_time as string) || 'Not specified'
  const magicWandTask = (s4.magic_wand_task as string) || 'Not specified'

  const painCards = [
    { key: 'repetitive_task', label: FIELD_LABELS.repetitive_task || 'Most Repetitive Task', value: repetitiveTask, icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' },
    { key: 'human_errors', label: FIELD_LABELS.human_errors || 'Common Human Errors', value: humanErrors, icon: 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z' },
    { key: 'response_time', label: FIELD_LABELS.response_time || 'Enquiry Response Time', value: responseTime, icon: 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z' },
  ]

  return (
    <TwoColumnSlide
      title="Pain Points"
      subtitle="The biggest areas of friction and time waste across your current operations."
      icon={
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      }
    >
      <div className="flex w-full flex-col gap-6">

        {/* Hero metric — manual data entry hours */}
        <div className="glass-card-glow relative flex w-full flex-col items-center justify-center rounded-3xl px-8 py-10 sm:py-14 sm:px-12">
          {/* Radial glow */}
          <div
            className="pointer-events-none absolute inset-0 rounded-3xl"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(16,185,129,0.08) 0%, transparent 70%)',
            }}
          />
          <AnimatedCounter
            value={manualHours}
            duration={1400}
            className="relative text-[5rem] font-bold leading-none text-accent sm:text-[7rem] lg:text-[8rem]"
          />
          <p className="relative mt-4 text-center text-base font-medium leading-relaxed tracking-wide text-text-secondary sm:text-lg">
            hours/week on manual data entry
          </p>
        </div>

        {/* Pain point cards */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-6">
          {painCards.map((card) => (
            <div key={card.key} className="glass-card rounded-2xl px-6 py-6 hover:-translate-y-1 transition-transform">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.06]">
                  <svg className="h-4 w-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={card.icon} />
                  </svg>
                </div>
                <h3 className="slide-section-label">
                  {card.label}
                </h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-text-primary sm:text-base">
                {card.value}
              </p>
            </div>
          ))}
        </div>

        {/* Magic wand — highlight card */}
        <div className="glass-card-glow shimmer-bg relative overflow-hidden rounded-2xl px-6 py-7 sm:px-8 sm:py-8 mt-2">
          <div className="relative">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/15">
                <svg className="h-4 w-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
                </svg>
              </div>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-accent">
                If you had a magic wand...
              </h3>
            </div>
            <p className="mt-4 text-lg font-medium leading-relaxed text-text-primary sm:text-xl md:text-2xl">
              &ldquo;{magicWandTask}&rdquo;
            </p>
          </div>
        </div>

      </div>
    </TwoColumnSlide>
  )
}
