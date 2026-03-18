'use client'

import { useRef, useMemo } from 'react'
import { motion, useInView } from 'framer-motion'

interface ProcessFlowProps {
  steps: string[]
  title: string
}

function parseSteps(steps: string[]): string[] {
  // If a single string is passed, try to split it
  if (steps.length === 1) {
    const text = steps[0]
    // Try numbered items: "1. Foo 2. Bar" or "1) Foo 2) Bar"
    const numbered = text.split(/\d+[.)]\s+/).filter(Boolean)
    if (numbered.length > 1) return numbered.map((s) => s.trim())
    // Try newline splitting
    const lines = text.split(/\n+/).filter(Boolean)
    if (lines.length > 1)
      return lines.map((s) => s.replace(/^\d+[.)]\s*/, '').trim())
    return [text.trim()]
  }
  // Clean each step
  return steps.map((s) => s.replace(/^\d+[.)]\s*/, '').trim()).filter(Boolean)
}

export function ProcessFlow({ steps, title }: ProcessFlowProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-40px' })

  const parsedSteps = useMemo(() => parseSteps(steps), [steps])

  return (
    <div ref={ref} className="flex w-full flex-col gap-6">
      {/* Title */}
      <motion.h3
        className="text-base font-semibold text-white sm:text-lg"
        initial={{ opacity: 0, y: 10 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.4 }}
      >
        {title}
      </motion.h3>

      {/* Steps container: vertical on mobile, horizontal wrap on desktop */}
      <div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:gap-4">
        {parsedSteps.map((step, index) => {
          const stepNumber = index + 1
          const isLast = index === parsedSteps.length - 1

          return (
            <div key={stepNumber} className="flex flex-col md:flex-row md:items-center">
              {/* Step card */}
              <motion.div
                className="glass-card relative flex min-h-[100px] w-full flex-col gap-3 rounded-xl px-5 py-4 md:min-w-[200px] md:max-w-[300px] md:flex-1"
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{
                  duration: 0.45,
                  delay: index * 0.12,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {/* Step number badge */}
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">
                  {stepNumber}
                </div>

                <p
                  className="text-sm leading-snug"
                  style={{ color: 'rgba(255,255,255,0.8)' }}
                >
                  {step}
                </p>
              </motion.div>

              {/* Connector */}
              {!isLast && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.12 + 0.2,
                  }}
                >
                  {/* Mobile: vertical dashed line */}
                  <div className="flex justify-center py-1 md:hidden">
                    <div
                      className="h-4 w-0 border-l-2 border-dashed"
                      style={{ borderColor: 'rgba(16, 185, 129, 0.5)' }}
                    />
                  </div>

                  {/* Desktop: horizontal chevron arrow */}
                  <div className="hidden md:flex md:items-center md:px-2">
                    <div
                      className="h-0 w-4 border-t-2 border-dashed"
                      style={{ borderColor: 'rgba(16, 185, 129, 0.5)' }}
                    />
                    <div
                      className="h-0 w-0 border-y-[5px] border-l-[7px] border-y-transparent"
                      style={{ borderLeftColor: 'rgba(16, 185, 129, 0.6)' }}
                    />
                  </div>
                </motion.div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
