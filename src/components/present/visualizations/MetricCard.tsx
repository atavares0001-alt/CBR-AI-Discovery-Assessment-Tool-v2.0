'use client'

import { type ReactNode } from 'react'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

interface MetricCardProps {
  value: string | number
  label: string
  icon?: ReactNode
  highlight?: boolean
}

function isLongValue(value: string | number): boolean {
  return String(value).length > 12
}

export function MetricCard({
  value,
  label,
  icon,
  highlight = false,
}: MetricCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-30px' })
  const longVal = isLongValue(value)

  return (
    <motion.div
      ref={ref}
      className={`glass-card relative overflow-hidden rounded-2xl px-6 py-6 sm:px-8 sm:py-7 ${highlight ? 'shimmer-bg' : ''}`}
      style={{
        borderColor: highlight ? 'rgba(16, 185, 129, 0.3)' : undefined,
        boxShadow: highlight
          ? '0 0 30px rgba(16, 185, 129, 0.1), 0 0 60px rgba(16, 185, 129, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.06)'
          : undefined,
      }}
      initial={{ opacity: 0, scale: 0.92 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="relative flex items-start gap-4">
        {icon && (
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl sm:h-11 sm:w-11"
            style={{ background: 'rgba(255,255,255,0.06)' }}
          >
            {icon}
          </div>
        )}

        <div className="flex min-w-0 flex-col gap-1">
          {/* Label first for better visual hierarchy */}
          <span className="slide-section-label">
            {label}
          </span>
          <span
            className={`mt-1 font-semibold leading-tight tracking-tight text-white ${
              longVal
                ? 'text-lg sm:text-xl'
                : 'font-mono text-3xl sm:text-4xl'
            }`}
          >
            {value}
          </span>
        </div>
      </div>
    </motion.div>
  )
}
