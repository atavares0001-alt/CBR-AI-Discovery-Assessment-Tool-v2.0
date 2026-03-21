'use client'

import { useState } from 'react'
import { IconBadge } from './IconBadge'
import { SlideIcon } from './SlideIcons'
import type { PainPoint } from '@/lib/types/discovery'

interface PainPointCardProps extends PainPoint {}

const colorClassMap: Record<string, string> = {
  danger: 'text-red-500',
  warm: 'text-amber-500',
  accent: 'text-emerald-500',
  'accent-light': 'text-emerald-400',
}

const barColorMap: Record<string, string> = {
  danger: 'bg-red-500',
  warm: 'bg-amber-500',
  accent: 'bg-emerald-500',
  'accent-light': 'bg-emerald-400',
}

const badgeColorMap: Record<string, 'accent' | 'warm' | 'danger'> = {
  danger: 'danger',
  warm: 'warm',
  accent: 'accent',
  'accent-light': 'accent',
}

export function PainPointCard({
  title, severity, currentState, businessImpact, currentProcess,
  iconType, color,
}: PainPointCardProps) {
  const [open, setOpen] = useState(false)

  return (
    <button
      onClick={() => setOpen(v => !v)}
      aria-expanded={open}
      aria-label={`${title} — severity ${severity}%. ${open ? 'Collapse' : 'Expand'} for details`}
      className={`
        w-full text-left card-hover
        bg-discovery-glass backdrop-blur-glass
        border rounded-glass-sm lg:rounded-glass
        p-5 lg:p-7 shadow-glass-glow
        transition-all duration-300 cursor-pointer
        ${open ? 'border-white/20 -translate-y-0.5' : 'border-discovery-border'}
      `}
    >
      <div className="flex gap-3 lg:gap-4 items-start">
        <IconBadge size="md" color={badgeColorMap[color]}>
          <SlideIcon name={iconType} color={color} />
        </IconBadge>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
            <h3 className="font-outfit text-[15px] lg:text-base font-semibold text-discovery-text">
              {title}
            </h3>
            <div className="flex items-center gap-2 shrink-0">
              <span className={`text-xs font-bold ${colorClassMap[color]}`}>
                {severity}%
              </span>
              <div className="w-12 h-[5px] rounded-full bg-white/[0.06]">
                <div
                  className={`h-full rounded-full ${barColorMap[color]}`}
                  style={{ width: `${severity}%` }}
                />
              </div>
              <svg
                className={`w-3.5 h-3.5 text-white/50 transition-transform duration-300 ml-1 ${
                  open ? 'rotate-180' : ''
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </div>
          </div>
          <p className="text-[13px] lg:text-sm leading-relaxed text-discovery-text-dim">
            {currentState}
          </p>
          {open && (
            <div className="mt-3.5 p-3.5 lg:p-4 bg-white/[0.02] rounded-lg border border-discovery-border animate-fade-up">
              <h4 className="text-[13px] font-bold text-amber-500 mb-1.5">Business Impact</h4>
              <p className="text-[13px] lg:text-sm leading-relaxed text-discovery-text-dim mb-3">
                {businessImpact}
              </p>
              <h4 className="text-[13px] font-bold text-discovery-text-mute mb-1.5">Current Process</h4>
              <p className="text-[13px] lg:text-sm leading-relaxed text-discovery-text-dim">
                {currentProcess}
              </p>
            </div>
          )}
        </div>
      </div>
    </button>
  )
}
