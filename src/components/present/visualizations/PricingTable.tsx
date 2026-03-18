'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import type { Stage7Data } from '@/lib/types/database'
import { AnimatedCounter } from './AnimatedCounter'
import { MetricCard } from './MetricCard'
import { container } from '../animations'

interface PricingTableProps {
  stage7Data: Stage7Data
}

function formatCurrency(amount: number): string {
  return '$' + amount.toLocaleString('en-AU', { minimumFractionDigits: 0 })
}

const PACKAGE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Foundation: {
    bg: 'rgba(16, 185, 129, 0.10)',
    text: '#10b981',
    border: 'rgba(16, 185, 129, 0.3)',
  },
  Acceleration: {
    bg: 'rgba(245, 158, 11, 0.10)',
    text: '#f59e0b',
    border: 'rgba(245, 158, 11, 0.3)',
  },
  Transformation: {
    bg: 'rgba(139, 92, 246, 0.10)',
    text: '#8b5cf6',
    border: 'rgba(139, 92, 246, 0.3)',
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: 'easeOut' },
  },
} as const

export function PricingTable({ stage7Data }: PricingTableProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-30px' })

  const pkg = PACKAGE_COLORS[stage7Data.package] ?? PACKAGE_COLORS.Foundation

  const totalOneTime = stage7Data.line_items.reduce(
    (sum, item) => sum + item.one_time_cost,
    0,
  )
  const totalMonthly = stage7Data.line_items.reduce(
    (sum, item) => sum + item.monthly_cost,
    0,
  )
  const grandMonthly =
    stage7Data.monthly_maintenance + stage7Data.monthly_api_costs + totalMonthly

  return (
    <motion.div
      ref={ref}
      className="flex w-full flex-col gap-8"
      variants={container}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
    >
      {/* Package badge */}
      <motion.div className="flex justify-center" variants={itemVariants}>
        <div
          className="glass-card inline-flex items-center gap-3 rounded-full px-8 py-3"
          style={{
            background: pkg.bg,
            borderColor: pkg.border,
          }}
        >
          <div
            className="h-3 w-3 rounded-full"
            style={{ background: pkg.text }}
          />
          <span
            className="text-lg font-bold tracking-wide"
            style={{ fontFamily: 'var(--font-display)', color: pkg.text }}
          >
            {stage7Data.package} Package
          </span>
        </div>
      </motion.div>

      {/* Summary metric cards */}
      <motion.div
        className="grid grid-cols-1 gap-4 sm:grid-cols-3"
        variants={itemVariants}
      >
        <MetricCard
          value={formatCurrency(stage7Data.setup_cost)}
          label="Setup Cost"
          highlight
        />
        <MetricCard
          value={formatCurrency(stage7Data.monthly_maintenance)}
          label="Monthly Maintenance"
        />
        <MetricCard
          value={formatCurrency(stage7Data.monthly_api_costs)}
          label="Monthly API Costs"
        />
      </motion.div>

      {/* Line items table */}
      {stage7Data.line_items.length > 0 && (
        <motion.div
          className="glass-card overflow-hidden rounded-2xl"
          variants={itemVariants}
        >
          <div
            className="border-b px-6 py-4"
            style={{ borderColor: 'rgba(255,255,255,0.08)' }}
          >
            <h4 className="text-sm font-semibold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Quote Breakdown
            </h4>
          </div>

          <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
            {/* Header row */}
            <div
              className="grid grid-cols-12 gap-4 px-6 py-3 text-xs font-semibold uppercase tracking-wider"
              style={{ color: 'rgba(255,255,255,0.4)' }}
            >
              <div className="col-span-5">Item</div>
              <div className="col-span-3">Description</div>
              <div className="col-span-2 text-right">One-Time</div>
              <div className="col-span-2 text-right">Monthly</div>
            </div>

            {/* Line item rows */}
            {stage7Data.line_items.map((item, i) => (
              <motion.div
                key={item.id}
                className="grid grid-cols-12 items-center gap-4 px-6 py-4"
                style={{
                  borderColor: 'rgba(255,255,255,0.06)',
                }}
                initial={{ opacity: 0, x: -10 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{
                  duration: 0.35,
                  delay: 0.4 + i * 0.06,
                  ease: 'easeOut',
                }}
              >
                <div className="col-span-5">
                  <p className="text-sm font-medium text-white">{item.name}</p>
                </div>
                <div className="col-span-3">
                  <p
                    className="text-xs leading-relaxed"
                    style={{ color: 'rgba(255,255,255,0.5)' }}
                  >
                    {item.description}
                  </p>
                </div>
                <div className="col-span-2 text-right">
                  <span className="font-mono text-sm font-semibold text-white">
                    {item.one_time_cost > 0
                      ? formatCurrency(item.one_time_cost)
                      : '\u2014'}
                  </span>
                </div>
                <div className="col-span-2 text-right">
                  <span className="font-mono text-sm font-semibold text-white">
                    {item.monthly_cost > 0
                      ? formatCurrency(item.monthly_cost)
                      : '\u2014'}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Totals row */}
      <motion.div
        className="glass-card-glow flex items-center justify-between rounded-2xl px-8 py-6"
        variants={itemVariants}
      >
        <div className="flex flex-col gap-1">
          <span
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: 'rgba(255,255,255,0.45)' }}
          >
            Total Investment
          </span>
          <span
            className="text-sm"
            style={{ color: 'rgba(255,255,255,0.5)' }}
          >
            Setup + ongoing monthly
          </span>
        </div>

        <div className="flex items-baseline gap-8">
          <div className="flex flex-col items-end gap-1">
            <span
              className="text-xs font-medium uppercase"
              style={{ color: 'rgba(255,255,255,0.4)' }}
            >
              One-Time
            </span>
            {isInView && (
              <AnimatedCounter
                value={stage7Data.setup_cost + totalOneTime}
                prefix="$"
                duration={1200}
                className="text-3xl text-white"
              />
            )}
          </div>

          <div
            className="h-10 w-px"
            style={{ background: 'rgba(255,255,255,0.1)' }}
          />

          <div className="flex flex-col items-end gap-1">
            <span
              className="text-xs font-medium uppercase"
              style={{ color: 'rgba(255,255,255,0.4)' }}
            >
              Per Month
            </span>
            {isInView && (
              <AnimatedCounter
                value={grandMonthly}
                prefix="$"
                suffix="/mo"
                duration={1200}
                className="text-3xl"
                // emerald for monthly
              />
            )}
          </div>
        </div>
      </motion.div>

      {/* Timeline & Next Steps */}
      {(stage7Data.proposed_timeline || stage7Data.next_steps) && (
        <motion.div
          className="grid grid-cols-1 gap-4 sm:grid-cols-2"
          variants={itemVariants}
        >
          {stage7Data.proposed_timeline && (
            <div className="glass-card rounded-2xl px-6 py-5">
              <h4
                className="mb-2 text-xs font-semibold uppercase tracking-widest"
                style={{ color: 'rgba(255,255,255,0.4)' }}
              >
                Proposed Timeline
              </h4>
              <p className="text-sm leading-relaxed text-white">
                {stage7Data.proposed_timeline}
              </p>
            </div>
          )}
          {stage7Data.next_steps && (
            <div className="glass-card rounded-2xl px-6 py-5">
              <h4
                className="mb-2 text-xs font-semibold uppercase tracking-widest"
                style={{ color: 'rgba(255,255,255,0.4)' }}
              >
                Next Steps
              </h4>
              <p className="text-sm leading-relaxed text-white">
                {stage7Data.next_steps}
              </p>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  )
}
