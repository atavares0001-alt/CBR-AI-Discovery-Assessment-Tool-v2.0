'use client'

import type { AssessmentWithResponses } from '@/lib/types/database'
import { InlineEditable } from '../InlineEditable'
import { usePresentationContext } from '../PresentationShell'
import { TwoColumnSlide } from '../layout/TwoColumnSlide'

interface WorkflowsSlideProps {
  assessment: AssessmentWithResponses
}

function getStageAnswers(
  assessment: AssessmentWithResponses,
  stage: string,
): Record<string, unknown> {
  return (assessment.responses.find((r) => r.stage === stage)?.answers ||
    {}) as Record<string, unknown>
}

// Visual gauge showing automation maturity level
function AutomationGauge({ level }: { level: string }) {
  const segments = [
    { label: 'Manual', color: 'bg-red-500' },
    { label: 'Basic', color: 'bg-amber-500' },
    { label: 'Partial', color: 'bg-accent' },
    { label: 'Advanced', color: 'bg-emerald-400' },
  ]

  const lower = level.toLowerCase()
  let activeIdx = 0
  if (lower.includes('mostly')) activeIdx = 3
  else if (lower.includes('somewhat')) activeIdx = 2
  else if (lower.includes('little') || lower.includes('basic')) activeIdx = 1

  return (
    <div className="flex gap-1.5">
      {segments.map((seg, i) => (
        <div key={seg.label} className="flex flex-col items-center gap-1.5">
          <div
            className={`h-2 w-10 rounded-full sm:w-14 ${
              i <= activeIdx ? segments[activeIdx].color : 'bg-white/[0.08]'
            }`}
          />
          <span className={`text-[9px] font-medium uppercase tracking-wider ${
            i === activeIdx ? 'text-text-primary' : 'text-white/25'
          }`}>
            {seg.label}
          </span>
        </div>
      ))}
    </div>
  )
}

export function WorkflowsSlide({ assessment }: WorkflowsSlideProps) {
  const { onFieldChange } = usePresentationContext()
  const s3 = getStageAnswers(assessment, 'stage_3')
  const s4 = getStageAnswers(assessment, 'stage_4')

  const automationTools = (s3.automation_tools as string) || 'None'
  const automationDetails = (s3.automation_details as string) || ''
  const timeDrains = [1, 2, 3, 4, 5]
    .map((i) => (s3[`time_drain_${i}`] as string) || '')
    .filter((v) => v.trim())
  const magicWandTask = (s3.magic_wand_task as string) || (s4.magic_wand_task as string) || 'Not specified'

  return (
    <TwoColumnSlide
      title="Under the Hood"
      subtitle="Your current automation status, biggest time drains, and where the opportunity lies."
      icon={
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.1-3.18a2.25 2.25 0 01-.64-3.12l.82-1.23a2.25 2.25 0 013.12-.64l5.1 3.18m-6.3 4.99l5.1 3.18a2.25 2.25 0 003.12-.64l.82-1.23a2.25 2.25 0 00-.64-3.12l-5.1-3.18" />
        </svg>
      }
    >
      <div className="flex w-full flex-col gap-5">

        {/* ── Row 1: Automation Status — full-width banner ── */}
        <div className="glass-card rounded-2xl px-6 py-5 sm:px-8 sm:py-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            {/* Left: label + value */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.06]">
                  <svg className="h-4 w-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                  </svg>
                </div>
                <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-white/45">
                  Automation Level
                </h3>
              </div>
              <div className="mt-3 text-base font-medium leading-relaxed text-text-primary sm:text-lg">
                <InlineEditable
                  value={automationTools}
                  onChange={(v) => onFieldChange('stage_3', 'automation_tools', v)}
                  placeholder="No automation tools listed"
                />
              </div>
              {automationDetails && (
                <div className="mt-1.5 text-sm leading-relaxed text-text-secondary">
                  <InlineEditable
                    value={automationDetails}
                    onChange={(v) => onFieldChange('stage_3', 'automation_details', v)}
                    placeholder=""
                  />
                </div>
              )}
            </div>

            {/* Right: visual gauge */}
            <div className="shrink-0 pt-1">
              <AutomationGauge level={automationTools} />
            </div>
          </div>
        </div>

        {/* ── Row 2: Two-column bento — Time Drain + Magic Wand ── */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

          {/* Time & Effort Drains */}
          <div className="glass-card flex flex-col rounded-2xl px-6 py-5 sm:px-7 sm:py-6">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-500/10">
                <svg className="h-[18px] w-[18px] text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/35">
                  Time Drains
                </p>
                <p className="text-sm font-semibold text-white/90">
                  Top Time & Effort Drains
                </p>
              </div>
            </div>
            <div className="mt-4 flex-1 space-y-2">
              {timeDrains.length > 0 ? timeDrains.map((drain, i) => (
                <div key={i} className="flex items-start gap-2.5 rounded-xl bg-white/[0.03] px-4 py-2.5 border border-white/[0.04]">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500/15 text-[10px] font-bold text-red-400 mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-sm leading-relaxed text-text-primary">{drain}</p>
                </div>
              )) : (
                <div className="rounded-xl bg-white/[0.03] px-4 py-3.5 border border-white/[0.04]">
                  <p className="text-sm text-text-muted">Not specified</p>
                </div>
              )}
            </div>
          </div>

          {/* Magic Wand — What They'd Eliminate */}
          <div className="glass-card-glow shimmer-bg relative flex flex-col overflow-hidden rounded-2xl px-6 py-5 sm:px-7 sm:py-6">
            <div className="relative flex items-center gap-2.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent/15">
                <svg className="h-[18px] w-[18px] text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
                </svg>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-accent/60">
                  Magic Wand
                </p>
                <p className="text-sm font-semibold text-accent">
                  What They&apos;d Eliminate
                </p>
              </div>
            </div>
            <div className="relative mt-4 flex-1 rounded-xl bg-accent/[0.04] px-4 py-3.5 border border-accent/10">
              <p className="text-sm font-medium leading-relaxed text-text-primary sm:text-base">
                &ldquo;{magicWandTask}&rdquo;
              </p>
            </div>
          </div>

        </div>

      </div>
    </TwoColumnSlide>
  )
}
