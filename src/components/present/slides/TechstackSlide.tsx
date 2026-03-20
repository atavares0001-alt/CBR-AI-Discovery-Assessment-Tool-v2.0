'use client'

import { motion } from 'framer-motion'
import type { AssessmentWithResponses } from '@/lib/types/database'
import { TechStackGrid } from '../visualizations/TechStackGrid'
import { FIELD_LABELS } from '@/lib/constants/labels'
import { container, fadeUp } from '../animations'
import { SlideWatermark } from '@/components/ui/Logo'

interface TechstackSlideProps {
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

const TECH_FIELDS: { key: string; category: string }[] = [
  { key: 'email_calendar', category: 'Communication' },
  { key: 'crm_tool', category: 'CRM' },
  { key: 'project_management', category: 'Project Management' },
  { key: 'data_storage', category: 'Data Storage' },
  { key: 'specialised_software', category: 'Specialised' },
]

export function TechstackSlide({ assessment }: TechstackSlideProps) {
  const s2 = getStageAnswers(assessment, 'stage_2')
  const digitalMaturity = assessment.ai_readiness_score?.digital_maturity

  const tools = TECH_FIELDS.map(({ key, category }) => ({
    name: FIELD_LABELS[key] || key.replace(/_/g, ' '),
    category,
    value: (s2[key] as string) || 'None',
  }))

  const badgeObj = digitalMaturity != null ? (
    <div
      className="glass-card flex items-center gap-3 self-start rounded-full px-4 py-2 sm:px-5"
      style={{
        borderColor:
          digitalMaturity >= 70
            ? 'rgba(16,185,129,0.3)'
            : digitalMaturity >= 40
              ? 'rgba(245,158,11,0.3)'
              : 'rgba(239,68,68,0.3)',
      }}
    >
      <span
        className="font-mono text-xl font-bold sm:text-2xl"
        style={{
          color:
            digitalMaturity >= 70
              ? '#10b981'
              : digitalMaturity >= 40
                ? '#f59e0b'
                : '#ef4444',
        }}
      >
        {digitalMaturity}
      </span>
      <span className="text-[10px] font-semibold uppercase tracking-widest text-text-muted sm:text-xs">
        Digital Maturity
      </span>
    </div>
  ) : undefined

  return (
    <TwoColumnSlide
      title="Technology Stack"
      subtitle="The digital platforms currently driving your business operations."
      icon={
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75L16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
        </svg>
      }
      badge={badgeObj}
    >
      <div className="flex w-full flex-col gap-8">
        {/* Tech stack grid */}
        <div className="w-full">
          <TechStackGrid tools={tools} />
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 border-t border-white/10 pt-6 sm:gap-8">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-sm bg-emerald-500 drop-shadow-[0_0_4px_rgba(16,185,129,0.8)]" />
            <span className="text-xs font-medium uppercase tracking-wider text-text-secondary">
              Cloud / Modern
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-sm bg-amber-500 drop-shadow-[0_0_4px_rgba(245,158,11,0.8)]" />
            <span className="text-xs font-medium uppercase tracking-wider text-text-secondary">
              Other / Legacy
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-sm bg-white/15" />
            <span className="text-xs font-medium uppercase tracking-wider text-text-secondary">
              Not in use
            </span>
          </div>
        </div>
      </div>
    </TwoColumnSlide>
  )
}
