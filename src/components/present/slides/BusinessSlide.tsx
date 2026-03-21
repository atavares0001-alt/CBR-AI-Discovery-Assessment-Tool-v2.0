'use client'

import { motion } from 'framer-motion'
import type { AssessmentWithResponses } from '@/lib/types/database'
import { MetricCard } from '../visualizations/MetricCard'
import { InlineEditable } from '../InlineEditable'
import { usePresentationContext } from '../PresentationShell'
import { FIELD_LABELS } from '@/lib/constants/labels'
import { container, fadeUp } from '../animations'
import { SlideWatermark } from '@/components/ui/Logo'

interface BusinessSlideProps {
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

function SectionHeader({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.06]">
        <svg className="h-4 w-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
        </svg>
      </div>
      <h3 className="slide-section-label">{label}</h3>
    </div>
  )
}

export function BusinessSlide({ assessment }: BusinessSlideProps) {
  const { onFieldChange } = usePresentationContext()
  const s1 = getStageAnswers(assessment, 'stage_1')
  const employeeCount = (s1.employee_count as string) || 'N/A'
  const industry = assessment.industry || 'N/A'
  const businessPurpose = (s1.business_purpose as string) || ''
  const isDecisionMaker = s1.is_decision_maker as string
  const decisionMakerName = (s1.decision_maker_name as string) || ''

  return (
    <TwoColumnSlide
      title="Business Profile"
      subtitle="An overview of your organisation’s current operational landscape."
      icon={
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 0h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
        </svg>
      }
    >
      <div className="flex w-full flex-col gap-6">

        {/* Metric cards grid */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-6">
          <MetricCard
            value={employeeCount}
            label={FIELD_LABELS.employee_count || 'Employees'}
          />
          <MetricCard
            value={industry}
            label={FIELD_LABELS.industry || 'Industry'}
          />
        </div>

        {/* Business purpose & core products */}
        <div className="glass-card rounded-2xl px-6 py-6 sm:px-8 sm:py-7 hover:-translate-y-1 transition-transform">
          <SectionHeader
            icon="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 0h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z"
            label={FIELD_LABELS.business_purpose || 'What They Do'}
          />
          <div className="mt-4 text-base leading-relaxed text-text-primary sm:text-lg">
            <InlineEditable
              value={businessPurpose}
              onChange={(v) => onFieldChange('stage_1', 'business_purpose', v)}
              fieldType="textarea"
              placeholder="Business purpose not provided"
            />
          </div>
        </div>

        {/* Decision maker info */}
        {(isDecisionMaker || decisionMakerName) && (
          <div className="glass-card rounded-2xl px-6 py-5 sm:px-8 sm:py-6">
            <SectionHeader
              icon="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
              label="Decision Maker"
            />
            <div className="mt-3">
              <span className="text-base text-text-primary sm:text-lg">
                {isDecisionMaker === 'yes' || isDecisionMaker === 'Yes' ? (
                  <span className="font-medium text-accent">
                    Client is the decision maker
                  </span>
                ) : decisionMakerName ? (
                  <InlineEditable
                    value={decisionMakerName}
                    onChange={(v) =>
                      onFieldChange('stage_1', 'decision_maker_name', v)
                    }
                    placeholder="Decision maker name"
                  />
                ) : (
                  <span className="text-text-muted">Not specified</span>
                )}
              </span>
            </div>
          </div>
        )}

      </div>
    </TwoColumnSlide>
  )
}
