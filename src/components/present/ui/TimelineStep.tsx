import { Tag } from './Tag'
import type { RoadmapStep } from '@/lib/types/discovery'

interface TimelineStepProps extends RoadmapStep {
  isLast?: boolean
}

export function TimelineStep({ number, title, description, timeframe, isLast = false }: TimelineStepProps) {
  return (
    <div className="flex gap-3.5 lg:gap-5 relative">
      <div className="flex flex-col items-center min-w-[40px]">
        <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-[13px] font-extrabold text-[#050505] shrink-0">
          {number}
        </div>
        {!isLast && (
          <div className="w-0.5 flex-1 bg-discovery-border my-1" aria-hidden="true" />
        )}
      </div>
      <div className="pb-6 flex-1">
        <div className="flex items-center gap-2.5 mb-1 flex-wrap">
          <h3 className="font-outfit text-[15px] lg:text-base font-semibold text-discovery-text">
            {title}
          </h3>
          <Tag color="accent-light" size="xs">{timeframe}</Tag>
        </div>
        <p className="text-[13px] lg:text-sm leading-relaxed text-discovery-text-dim">
          {description}
        </p>
      </div>
    </div>
  )
}
