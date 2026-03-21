'use client'

import { StageTag, PainPointCard } from '../ui'
import type { PainPoint } from '@/lib/types/discovery'

interface PainPointsSlideProps {
  painPoints: PainPoint[]
  title?: string
  subtitle?: string
}

export function PainPointsSlide({
  painPoints,
  title = 'Where Time & Revenue Are Leaking',
  subtitle,
}: PainPointsSlideProps) {
  const defaultSubtitle = `${painPoints.length} critical bottleneck${painPoints.length !== 1 ? 's' : ''} consuming the team's time and costing the business leads.`

  return (
    <section>
      <StageTag color="text-red-500">Stage 3 — How Things Run Today</StageTag>
      <h2 className="font-outfit text-[22px] sm:text-[26px] lg:text-[30px] font-semibold leading-tight tracking-tight">
        {title}
      </h2>
      <p className="text-[15px] lg:text-base leading-relaxed text-discovery-text-dim max-w-[680px] mt-2 mb-5 lg:mb-7">
        {subtitle ?? defaultSubtitle}
      </p>

      <div className="flex flex-col gap-3 lg:gap-4">
        {painPoints.map((pain, i) => (
          <PainPointCard key={i} {...pain} />
        ))}
      </div>
    </section>
  )
}
