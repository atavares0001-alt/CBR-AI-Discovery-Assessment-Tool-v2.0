'use client'

import { GlassCard, StageTag, Tag, IconBadge, SlideIcon } from '../ui'
import type { AISolution } from '@/lib/types/discovery'

interface OpportunitySlideProps {
  solutions: AISolution[]
  aiAutonomyLevel: string
  primaryConcern: string
  subtitle?: string
}

const colorVarMap: Record<string, { text: string; bg: string }> = {
  accent: { text: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  'accent-light': { text: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  warm: { text: 'text-amber-500', bg: 'bg-amber-500/10' },
  danger: { text: 'text-red-500', bg: 'bg-red-500/10' },
}

export function OpportunitySlide({
  solutions, aiAutonomyLevel, primaryConcern, subtitle,
}: OpportunitySlideProps) {
  const defaultSubtitle = `${solutions.length} interconnected solutions, prioritised by impact and aligned with your ${aiAutonomyLevel} preference and ${primaryConcern.toLowerCase()} requirements.`

  return (
    <section>
      <StageTag>AI Opportunity Map</StageTag>
      <h2 className="font-outfit text-[22px] sm:text-[26px] lg:text-[30px] font-semibold leading-tight tracking-tight">
        Recommended AI Solutions
      </h2>
      <p className="text-[15px] lg:text-base leading-relaxed text-discovery-text-dim max-w-[680px] mt-2 mb-5 lg:mb-7">
        {subtitle ?? defaultSubtitle}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5">
        {solutions.map((sol, i) => {
          const colors = colorVarMap[sol.color] ?? colorVarMap.accent
          return (
            <GlassCard key={i} className="relative overflow-hidden">
              <div
                className={`absolute top-0 right-0 px-3.5 py-1.5 rounded-bl-xl text-[11px] font-extrabold ${colors.text} ${colors.bg}`}
              >
                P{sol.priority}
              </div>

              <IconBadge
                size="md"
                color={sol.color === 'warm' ? 'warm' : sol.color === 'danger' ? 'danger' : 'accent'}
              >
                <SlideIcon name={sol.iconType} color={sol.color} />
              </IconBadge>

              <h3 className="font-outfit text-[15px] lg:text-base font-semibold text-discovery-text mt-3.5 mb-2">
                {sol.title}
              </h3>
              <p className="text-[13px] lg:text-sm leading-relaxed text-discovery-text-dim mb-3.5">
                {sol.description}
              </p>

              {/* Benefits as bullet points */}
              <ul className="space-y-1.5 mb-3">
                {sol.impact.split(/[,;·•]/).map((benefit, bi) => {
                  const trimmed = benefit.trim()
                  if (!trimmed) return null
                  return (
                    <li key={bi} className="flex items-start gap-2">
                      <SlideIcon name="check" color={sol.color} size={14} />
                      <span className="text-[13px] font-semibold text-discovery-text-dim">
                        {trimmed}
                      </span>
                    </li>
                  )
                })}
              </ul>

              <Tag color="mute">Effort: {sol.effort}</Tag>
            </GlassCard>
          )
        })}
      </div>
    </section>
  )
}
