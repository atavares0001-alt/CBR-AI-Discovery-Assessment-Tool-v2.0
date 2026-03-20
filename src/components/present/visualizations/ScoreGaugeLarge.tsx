'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { AnimatedCounter } from './AnimatedCounter'

interface ScoreGaugeLargeProps {
  value: number
  max: number
  label: string
}

function getScoreColor(value: number, max: number): string {
  const normalized = max === 100 ? value : (value / max) * 100
  if (normalized >= 70) return '#10b981'
  if (normalized >= 40) return '#f59e0b'
  return '#ef4444'
}

function getGlowColor(value: number, max: number): string {
  const normalized = max === 100 ? value : (value / max) * 100
  if (normalized >= 70) return 'rgba(16, 185, 129, 0.3)'
  if (normalized >= 40) return 'rgba(245, 158, 11, 0.3)'
  return 'rgba(239, 68, 68, 0.3)'
}

export function ScoreGaugeLarge({ value, max, label }: ScoreGaugeLargeProps) {
  const r = 90
  const stroke = 10
  const sz = 220
  const circumference = 2 * Math.PI * r
  const progress = (value / max) * circumference
  const color = getScoreColor(value, max)
  const glowColor = getGlowColor(value, max)

  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-40px' })
  const [animationComplete, setAnimationComplete] = useState(false)

  return (
    <div ref={ref} className="flex flex-col items-center gap-4 w-full h-full justify-center">
      <div className="relative w-full aspect-square max-w-[220px] mx-auto">
        {/* Pulsing glow ring — appears after arc animation finishes */}
        {animationComplete && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              boxShadow: `0 0 40px ${glowColor}, 0 0 80px ${glowColor}`,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.6, 0] }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}

        <svg viewBox={`0 0 ${sz} ${sz}`} className="-rotate-90 w-full h-full overflow-visible">
          {/* Background track */}
          <circle
            cx={sz / 2}
            cy={sz / 2}
            r={r}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={stroke}
          />

          {/* Subtle tick marks */}
          {Array.from({ length: 40 }).map((_, i) => {
            const angle = (i / 40) * 2 * Math.PI
            const innerR = r - stroke / 2 - 2
            const outerR = r - stroke / 2 + 2
            return (
              <line
                key={i}
                x1={sz / 2 + innerR * Math.cos(angle)}
                y1={sz / 2 + innerR * Math.sin(angle)}
                x2={sz / 2 + outerR * Math.cos(angle)}
                y2={sz / 2 + outerR * Math.sin(angle)}
                stroke="rgba(255,255,255,0.06)"
                strokeWidth={1}
              />
            )
          })}

          {/* Progress arc */}
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
            animate={isInView ? { strokeDashoffset: circumference - progress } : {}}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            onAnimationComplete={() => setAnimationComplete(true)}
            style={{
              filter: `drop-shadow(0 0 6px ${color})`,
            }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {isInView && (
            <AnimatedCounter
              value={value}
              duration={1400}
              className="text-4xl sm:text-5xl font-bold"
            />
          )}
          <span
            className="mt-1 text-xs sm:text-sm font-medium"
            style={{ color: 'rgba(255,255,255,0.5)' }}
          >
            / {max}
          </span>
        </div>
      </div>

      <motion.span
        className="text-sm sm:text-base font-medium tracking-wide uppercase text-center"
        style={{ color: 'rgba(255,255,255,0.6)' }}
        initial={{ opacity: 0, y: 8 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        {label}
      </motion.span>
    </div>
  )
}
