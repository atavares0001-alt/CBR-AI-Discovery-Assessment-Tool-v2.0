'use client'

import { motion } from 'framer-motion'

interface ScoreGaugeProps {
  value: number
  max: number
  label: string
  size?: 'sm' | 'lg'
}

function getScoreColor(value: number, max: number): string {
  const normalized = max === 100 ? value : (value / max) * 100
  if (normalized >= 70) return '#10b981' // green
  if (normalized >= 40) return '#f59e0b' // amber
  return '#ef4444' // red
}

export function ScoreGauge({ value, max, label, size = 'sm' }: ScoreGaugeProps) {
  const dimensions = size === 'lg' ? { r: 60, stroke: 8, sz: 160 } : { r: 36, stroke: 6, sz: 96 }
  const { r, stroke, sz } = dimensions
  const circumference = 2 * Math.PI * r
  const progress = (value / max) * circumference
  const color = getScoreColor(value, max)

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={sz} height={sz} className="-rotate-90">
        <circle
          cx={sz / 2}
          cy={sz / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={stroke}
        />
        <motion.circle
          cx={sz / 2}
          cy={sz / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - progress }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
        />
      </svg>
      <div className="absolute flex items-center justify-center" style={{ width: sz, height: sz }}>
        <span className={`font-mono font-bold ${size === 'lg' ? 'text-3xl' : 'text-lg'}`} style={{ color }}>
          {value}
        </span>
      </div>
      <span className="text-xs font-medium text-text-secondary">{label}</span>
    </div>
  )
}
