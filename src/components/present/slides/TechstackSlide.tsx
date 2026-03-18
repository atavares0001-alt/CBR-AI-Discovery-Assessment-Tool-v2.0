'use client'

import { motion } from 'framer-motion'
import type { AssessmentWithResponses } from '@/lib/types/database'
import { TechStackGrid } from '../visualizations/TechStackGrid'
import { FIELD_LABELS } from '@/lib/constants/labels'
import { container, fadeUp } from '../animations'

interface TechstackSlideProps {
  assessment: AssessmentWithResponses
}

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

  return (
    <div className="flex min-h-screen flex-col justify-center px-4 py-10 sm:px-6 md:px-8 md:py-16 lg:px-16">
      <motion.div
        className="mx-auto w-full max-w-6xl"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        {/* Header row */}
        <motion.div
          className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
          variants={fadeUp}
        >
          <h2
            className="font-display text-3xl font-bold tracking-tight text-text-primary sm:text-4xl md:text-5xl"
            style={{ textWrap: 'balance' } as React.CSSProperties}
          >
            Technology Stack
          </h2>

          {/* Digital maturity badge */}
          {digitalMaturity != null && (
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
          )}
        </motion.div>

        {/* Tech stack grid */}
        <motion.div className="mt-8 sm:mt-12" variants={fadeUp}>
          <TechStackGrid tools={tools} />
        </motion.div>

        {/* Legend */}
        <motion.div
          className="mt-8 flex flex-wrap items-center gap-4 sm:mt-10 sm:gap-8"
          variants={fadeUp}
        >
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-sm bg-emerald-500" />
            <span className="text-xs font-medium text-text-secondary">
              Cloud / Modern
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-sm bg-amber-500" />
            <span className="text-xs font-medium text-text-secondary">
              Other / Legacy
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-sm bg-white/15" />
            <span className="text-xs font-medium text-text-secondary">
              Not in use
            </span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
