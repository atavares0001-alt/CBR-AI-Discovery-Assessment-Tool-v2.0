'use client'

import { useState, useEffect, useRef } from 'react'

interface HBarProps {
  label: string
  value: number
  max?: number
  suffix?: string
  color?: 'accent' | 'warm' | 'danger' | 'mute'
}

const colorClasses = {
  accent: 'text-emerald-500',
  warm: 'text-amber-500',
  danger: 'text-red-500',
  mute: 'text-white/65',
}

const barGradients = {
  accent: 'from-emerald-500 to-emerald-500/80',
  warm: 'from-amber-500 to-amber-500/80',
  danger: 'from-red-500 to-red-500/80',
  mute: 'from-white/40 to-white/25',
}

export function HBar({ label, value, max = 100, suffix = '', color = 'accent' }: HBarProps) {
  const [width, setWidth] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setWidth((value / max) * 100) },
      { threshold: 0.2 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [value, max])

  return (
    <div ref={ref} className="mb-4">
      <div className="flex justify-between mb-1.5">
        <span className="text-[13px] text-discovery-text-dim font-medium">{label}</span>
        <span className={`text-[13px] font-bold ${colorClasses[color]}`}>
          {value}{suffix}
        </span>
      </div>
      <div
        className="h-1.5 rounded-full bg-white/[0.06]"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label}
      >
        <div
          className={`h-full rounded-full bg-gradient-to-r ${barGradients[color]} anim-bar`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  )
}
