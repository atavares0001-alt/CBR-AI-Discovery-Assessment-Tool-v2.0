'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { container, fadeUp } from '../animations'
import { SlideWatermark } from '@/components/ui/Logo'

interface TwoColumnSlideProps {
  title: string
  subtitle?: string
  icon?: ReactNode
  badge?: ReactNode
  children: ReactNode
}

export function TwoColumnSlide({
  title,
  subtitle,
  icon,
  badge,
  children,
}: TwoColumnSlideProps) {
  return (
    <div className="relative flex min-h-[calc(100vh-80px)] w-full flex-col lg:flex-row pb-12 lg:pb-0">
      <SlideWatermark />
      {/* Left Column (Sticky context) */}
      <motion.div
        className="relative z-20 flex w-full flex-col pt-10 pb-8 lg:sticky lg:top-0 lg:h-screen lg:w-[35%] lg:min-w-[320px] lg:max-w-[420px] lg:justify-center lg:py-16 lg:pr-12"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        <div className="flex flex-col gap-5">
          {/* Optional Icon/Badge Header */}
          {(icon || badge) && (
            <motion.div className="flex items-center gap-4" variants={fadeUp}>
              {icon && (
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  {icon}
                </div>
              )}
              {badge}
            </motion.div>
          )}

          <motion.h2
            className="font-display text-4xl font-bold tracking-tight text-text-primary md:text-5xl lg:text-6xl"
            variants={fadeUp}
            style={{ textWrap: 'balance' } as React.CSSProperties}
          >
            {title}
          </motion.h2>

          {subtitle && (
            <motion.p
              className="mt-2 text-base leading-relaxed text-text-secondary md:text-lg"
              variants={fadeUp}
            >
              {subtitle}
            </motion.p>
          )}
        </div>
      </motion.div>

      {/* Right Column (Scrollable Content / Data / Bento) */}
      <motion.div
        className="relative z-10 flex w-full flex-1 flex-col lg:justify-center lg:py-16"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        {children}
      </motion.div>
    </div>
  )
}
