'use client'

import { motion } from 'framer-motion'
import type { AssessmentWithResponses } from '@/lib/types/database'
import { ProcessFlow } from '../visualizations/ProcessFlow'
import { MetricCard } from '../visualizations/MetricCard'
import { InlineEditable } from '../InlineEditable'
import { usePresentationContext } from '../PresentationShell'
import { FIELD_LABELS } from '@/lib/constants/labels'
import { container, fadeUp } from '../animations'
import { SlideWatermark } from '@/components/ui/Logo'

interface WorkflowsSlideProps {
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

function SectionHeader({ icon, label, accent }: { icon: string; label: string; accent?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${accent ? 'bg-accent/10' : 'bg-white/[0.06]'}`}>
        <svg className={`h-4 w-4 ${accent ? 'text-accent' : 'text-text-muted'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
        </svg>
      </div>
      <h3 className="slide-section-label">{label}</h3>
    </div>
  )
}

export function WorkflowsSlide({ assessment }: WorkflowsSlideProps) {
  const { onFieldChange } = usePresentationContext()
  const s3 = getStageAnswers(assessment, 'stage_3')

  const leadProcess = (s3.lead_process as string) || ''
  const invoiceProcess = (s3.invoice_process as string) || ''
  const automationTools = (s3.automation_tools as string) || 'None'
  const autoReplies = (s3.auto_replies as string) || 'None'
  const manualDataTransfer = (s3.manual_data_transfer as string) || 'N/A'

  return (
    <TwoColumnSlide
      title="Current Workflows"
      subtitle="Breaking down operational processes to identify manual bottlenecks."
      icon={
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
        </svg>
      }
    >
      <div className="flex w-full flex-col gap-10">
        
        {/* Process flows */}
        <div className="space-y-8">
          {leadProcess && (
            <ProcessFlow
              steps={[leadProcess]}
              title={FIELD_LABELS.lead_process || 'Lead / Enquiry Process'}
            />
          )}

          {invoiceProcess && (
            <ProcessFlow
              steps={[invoiceProcess]}
              title={FIELD_LABELS.invoice_process || 'Invoice & Contract Process'}
            />
          )}
        </div>

        {/* Bottom cards row */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-6">
          {/* Automation tools */}
          <div className="glass-card rounded-2xl px-6 py-6 hover:-translate-y-1 transition-transform">
            <SectionHeader
              icon="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
              label={FIELD_LABELS.automation_tools || 'Automation Tools'}
            />
            <div className="mt-3 text-sm leading-relaxed text-text-primary sm:text-base">
              <InlineEditable
                value={automationTools}
                onChange={(v) =>
                  onFieldChange('stage_3', 'automation_tools', v)
                }
                placeholder="No automation tools listed"
              />
            </div>
          </div>

          {/* Auto-replies / chatbots */}
          <div className="glass-card rounded-2xl px-6 py-6 hover:-translate-y-1 transition-transform">
            <SectionHeader
              icon="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
              label={FIELD_LABELS.auto_replies || 'Auto-replies / Chatbots'}
            />
            <div className="mt-3 text-sm leading-relaxed text-text-primary sm:text-base">
              <InlineEditable
                value={autoReplies}
                onChange={(v) =>
                  onFieldChange('stage_3', 'auto_replies', v)
                }
                placeholder="No auto-replies listed"
              />
            </div>
          </div>

          {/* Manual data transfer */}
          <MetricCard
            value={`${manualDataTransfer}/10`}
            label={FIELD_LABELS.manual_data_transfer || 'Manual Data Transfer'}
            highlight
          />
        </div>

      </div>
    </TwoColumnSlide>
  )
}
