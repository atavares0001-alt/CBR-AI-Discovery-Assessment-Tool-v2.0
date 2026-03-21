'use client'

import { GlassCard, StageTag, TimelineStep, SlideIcon } from '../ui'
import type { RoadmapStep } from '@/lib/types/discovery'

interface NextStepsSlideProps {
  businessName: string
  contactName: string
  roadmapSteps: RoadmapStep[]
  agencyName?: string
  agencyUrl?: string
  agencyTagline?: string
  onCTA?: () => void
  ctaLabel?: string
}

export function NextStepsSlide({
  businessName, contactName, roadmapSteps,
  agencyName = 'CBR AI Agency',
  agencyUrl = 'www.cbrai.com.au',
  agencyTagline = 'AI Strategy \u00b7 Automation \u00b7 Intelligent Assistants \u00b7 Workflow Optimization',
  onCTA,
  ctaLabel = 'Schedule Strategy Workshop',
}: NextStepsSlideProps) {
  return (
    <section className="text-center py-2 sm:py-4">
      <StageTag>Next Steps</StageTag>

      <h2 className="font-outfit text-3xl sm:text-[42px] lg:text-[52px] font-bold leading-[1.1] tracking-tight mt-2">
        <span className="text-discovery-accent">Ready to Transform?</span>
      </h2>

      <p className="text-[15px] lg:text-base leading-relaxed text-discovery-text-dim max-w-[540px] mx-auto mt-4 mb-8">
        Let&apos;s turn these insights into action. Here&apos;s the roadmap to get {businessName} from
        manual operations to AI-powered efficiency.
      </p>

      <div className="flex flex-col max-w-[620px] mx-auto text-left">
        {roadmapSteps.map((step, i) => (
          <TimelineStep
            key={i}
            {...step}
            isLast={i === roadmapSteps.length - 1}
          />
        ))}
      </div>

      {onCTA && (
        <div className="mt-7">
          <button
            onClick={onCTA}
            className="btn-primary inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-discovery-accent text-[#050505] font-semibold text-base min-h-[48px] transition-all"
          >
            {ctaLabel}
            <SlideIcon name="arrow" color="#050505" size={16} />
          </button>
        </div>
      )}

      <div className="mt-10 max-w-[480px] mx-auto">
        <GlassCard className="!bg-white/[0.02]">
          <div className="font-outfit text-sm font-bold text-discovery-accent mb-1">
            {agencyName}
          </div>
          <div className="text-[13px] text-discovery-text-dim">{agencyUrl}</div>
          <div className="text-xs text-discovery-text-mute mt-2">{agencyTagline}</div>
        </GlassCard>
      </div>
    </section>
  )
}
