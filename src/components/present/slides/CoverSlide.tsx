'use client'

import Image from 'next/image'
import { GlassCard, StageTag, MetaField, SlideIcon } from '../ui'

interface CoverSlideProps {
  contactName: string
  businessName: string
  industry: string
  description: string
  date: string
  agencyName?: string
  onNext?: () => void
}

export function CoverSlide({
  contactName, businessName, industry, description,
  date, agencyName = 'CBR AI Agency', onNext,
}: CoverSlideProps) {
  return (
    <div className="text-center py-3 sm:py-12">
      {/* Agency branding */}
      <div className="flex justify-center mb-6 lg:mb-8">
        <Image
          src="/branding/logo-glow.svg"
          alt="Canberra AI Agency"
          width={320}
          height={56}
          className="h-10 lg:h-14 w-auto"
          priority
        />
      </div>

      <StageTag>AI Discovery Assessment</StageTag>

      <h1 className="font-outfit text-3xl sm:text-[42px] lg:text-[52px] font-bold leading-[1.1] tracking-tight mt-2">
        <span className="block text-discovery-text-dim font-normal mb-1">
          Unlocking AI Potential for
        </span>
        <span className="text-discovery-accent">{businessName}</span>
      </h1>

      <p className="text-[15px] lg:text-base leading-relaxed text-discovery-text-dim max-w-[580px] mx-auto mt-4 lg:mt-6">
        {description}
      </p>

      {onNext && (
        <div className="flex justify-center mt-6 lg:mt-9">
          <button
            onClick={onNext}
            className="btn-primary inline-flex items-center gap-2 px-5 lg:px-7 py-3.5 rounded-lg bg-discovery-accent text-[#050505] font-semibold text-[15px] min-h-[48px] transition-all"
          >
            Explore Findings
            <SlideIcon name="arrow" color="#050505" size={16} />
          </button>
        </div>
      )}

      <div className="mt-8 lg:mt-13 max-w-[560px] mx-auto">
        <GlassCard>
          <div className="text-[11px] font-bold tracking-[0.15em] uppercase text-discovery-text-mute mb-3">
            Prepared For
          </div>
          <div className="font-outfit text-[22px] lg:text-[28px] font-bold text-discovery-text leading-tight">
            {contactName}
          </div>
          <div className="font-outfit text-base lg:text-lg font-medium text-discovery-accent mt-1">
            {businessName}
          </div>

          <div className="w-10 h-px bg-discovery-border mx-auto my-4" />

          <div className="flex justify-center gap-5 lg:gap-10 flex-wrap">
            <MetaField label="Industry" value={industry} />
            <MetaField label="Date" value={date} />
            <MetaField label="Prepared By" value={agencyName} />
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
