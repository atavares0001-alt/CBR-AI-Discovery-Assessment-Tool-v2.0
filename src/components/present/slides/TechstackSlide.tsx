'use client'

import { GlassCard, StageTag, Tag, SlideIcon } from '../ui'
import type { SoftwareItem } from '@/lib/types/discovery'

interface TechStackSlideProps {
  softwareStack: SoftwareItem[]
  subtitle?: string
}

/**
 * Split a tool string like "Google Drive, Dropbox / OneDrive" into individual names.
 */
function splitTools(tool: string): string[] {
  return tool
    .split(/[,/&+]/)
    .map((t) => t.trim())
    .filter(Boolean)
}

export function TechStackSlide({ softwareStack, subtitle }: TechStackSlideProps) {
  const gaps = softwareStack.filter(s => s.status === 'gap').length
  const defaultSubtitle = gaps > 0
    ? `${gaps} critical gap${gaps !== 1 ? 's' : ''} create${gaps === 1 ? 's' : ''} immediate automation opportunities.`
    : 'Solid existing foundation provides excellent integration potential.'

  return (
    <section>
      <StageTag color="text-emerald-500">Stage 2 — Technology Stack</StageTag>
      <h2 className="font-outfit text-[22px] sm:text-[26px] lg:text-[30px] font-semibold leading-tight tracking-tight">
        Current Tools &amp; Automation Readiness
      </h2>
      <p className="text-[15px] lg:text-base leading-relaxed text-discovery-text-dim max-w-[680px] mt-2 mb-5 lg:mb-7">
        {subtitle ?? defaultSubtitle}
      </p>

      <GlassCard>
        <h3 className="font-outfit text-[15px] lg:text-base font-semibold text-discovery-text mb-4">
          Software Ecosystem
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-2.5">
          {softwareStack.map((item, i) => {
            const isGap = item.status === 'gap'
            const tagColor: 'danger' | 'accent' = isGap ? 'danger' : 'accent'
            const tools = isGap ? [] : splitTools(item.tool)

            return (
              <div
                key={i}
                className="px-4 py-3.5 rounded-xl bg-white/[0.02] border border-discovery-border"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-discovery-text-mute uppercase tracking-wider">
                    {item.category}
                  </span>
                  <Tag color={tagColor} size="xs">
                    {isGap ? 'GAP' : 'ACTIVE'}
                  </Tag>
                </div>

                {isGap ? (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                    <span className="text-sm font-semibold text-red-500">None</span>
                  </div>
                ) : tools.length === 1 ? (
                  <div className="flex items-center gap-2">
                    <SlideIcon name="check" color="accent" size={14} />
                    <span className="text-sm font-semibold text-discovery-text">{tools[0]}</span>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {tools.map((t, ti) => (
                      <span
                        key={ti}
                        className="inline-flex items-center gap-1.5 text-[13px] font-medium text-discovery-text bg-emerald-500/8 border border-emerald-500/15 rounded-md px-2.5 py-1"
                      >
                        <SlideIcon name="check" color="accent" size={12} />
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </GlassCard>
    </section>
  )
}
