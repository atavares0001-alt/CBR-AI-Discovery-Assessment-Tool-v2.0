'use client'

import { GlassCard, StageTag, Tag, ComparisonList, SlideIcon } from '../ui'
import { InlineEditable } from '../InlineEditable'
import type { HeroMetric } from '@/lib/types/discovery'

interface VisionSlideProps {
  heroMetrics: HeroMetric[]
  currentStateItems: string[]
  futureStateItems: string[]
  budgetRange: string
  desiredTimeline: string
  aiAutonomyLevel: string
  primaryConcern: string
  postAutomationFocus?: string
  subtitle?: string
  onEdit?: (field: string, value: string) => void
}

const metricColorMap: Record<string, string> = {
  accent: 'text-emerald-500',
  'accent-light': 'text-emerald-400',
  warm: 'text-amber-500',
  danger: 'text-red-500',
}

const autonomyLabels: Record<string, string> = {
  'fully-autonomous': 'Fully Autonomous',
  'semi-autonomous': 'Semi-Autonomous',
  'human-in-loop': 'Human-in-Loop',
}

export function VisionSlide({
  heroMetrics, currentStateItems, futureStateItems,
  budgetRange, desiredTimeline, aiAutonomyLevel, primaryConcern,
  postAutomationFocus = 'Delivery & Growth', subtitle, onEdit,
}: VisionSlideProps) {
  const handleEdit = (field: string) => (value: string) => onEdit?.(field, value)
  const defaultSubtitle = "Here's what success looks like \u2014 from where you are today to where AI can take you."

  return (
    <section>
      <StageTag>Future Vision</StageTag>
      <h2 className="font-outfit text-[22px] sm:text-[26px] lg:text-[30px] font-semibold leading-tight tracking-tight">
        The 6-Month Transformation
      </h2>
      <p className="text-[15px] lg:text-base leading-relaxed text-discovery-text-dim max-w-[680px] mt-2 mb-5 lg:mb-7">
        {subtitle ?? defaultSubtitle}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
        {heroMetrics.map((m, i) => {
          const idx = i + 1
          return (
            <GlassCard key={i} className="text-center !py-5 lg:!py-6">
              <div className={`font-outfit text-[32px] lg:text-[40px] font-bold leading-none ${metricColorMap[m.color] ?? 'text-emerald-500'}`}>
                <InlineEditable
                  value={`${m.value}${m.suffix}`}
                  onChange={(val) => {
                    // Split value and suffix (e.g. "100%" → value: "100", suffix: "%")
                    const match = val.match(/^([\d.]+)(.*)$/)
                    if (match) {
                      onEdit?.(`hero_metric_${idx}_value`, match[1])
                      onEdit?.(`hero_metric_${idx}_suffix`, match[2])
                    } else {
                      onEdit?.(`hero_metric_${idx}_value`, val)
                      onEdit?.(`hero_metric_${idx}_suffix`, '')
                    }
                  }}
                />
              </div>
              <div className="text-sm font-semibold text-discovery-text mt-2">
                <InlineEditable
                  value={m.label}
                  onChange={handleEdit(`hero_metric_${idx}_label`)}
                />
              </div>
              <div className={`text-xs font-medium mt-0.5 ${metricColorMap[m.color] ?? 'text-emerald-500'}`}>
                <InlineEditable
                  value={m.subtitle}
                  onChange={handleEdit(`hero_metric_${idx}_subtitle`)}
                />
              </div>
            </GlassCard>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5 mt-4 lg:mt-6">
        <GlassCard borderColor="border-red-500/20">
          <Tag color="danger" size="sm">Current State</Tag>
          <div className="mt-3.5">
            <ComparisonList
              items={currentStateItems}
              variant="before"
              onEditItem={onEdit ? (i, value) => onEdit(`current_state_${i + 1}`, value) : undefined}
            />
          </div>
        </GlassCard>

        <GlassCard borderColor="border-emerald-500/20">
          <Tag color="accent" size="sm">With CBR AI</Tag>
          <div className="mt-3.5">
            <ComparisonList
              items={futureStateItems}
              variant="after"
              onEditItem={onEdit ? (i, value) => onEdit(`future_state_${i + 1}`, value) : undefined}
            />
          </div>
        </GlassCard>
      </div>

      <GlassCard className="mt-4 lg:mt-5">
        <div className="grid grid-cols-3 lg:grid-cols-5 gap-3.5 lg:gap-3 text-center">
          {[
            { label: 'Investment Range', value: budgetRange, field: 'budget', icon: <SlideIcon name="chart" color="accent" /> },
            { label: 'Target Timeline', value: desiredTimeline, field: 'timeline', icon: <SlideIcon name="clock" color="accent-light" /> },
            { label: 'AI Approach', value: autonomyLabels[aiAutonomyLevel] ?? aiAutonomyLevel, field: 'ai_autonomy', icon: <SlideIcon name="shield" color="accent" /> },
            { label: 'Primary Concern', value: primaryConcern, field: 'primary_concern', icon: <SlideIcon name="shield" color="accent" /> },
            { label: 'Post-Automation', value: postAutomationFocus, field: 'automated_focus', icon: <SlideIcon name="rocket" color="accent" /> },
          ].map((item, i) => (
            <div key={i} className={i >= 3 ? 'max-lg:col-span-1 max-lg:justify-self-center' : ''}>
              <div className="mb-1.5">{item.icon}</div>
              <div className="font-outfit text-[13px] lg:text-sm font-bold text-discovery-text leading-snug">
                <InlineEditable
                  value={item.value}
                  onChange={handleEdit(item.field)}

                />
              </div>
              <div className="text-[11px] text-discovery-text-mute mt-0.5">{item.label}</div>
            </div>
          ))}
        </div>
      </GlassCard>
    </section>
  )
}
