'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

interface SlideContainerProps {
  id: string
  children: React.ReactNode
  isActive: boolean
  direction: number
  mode: 'dashboard' | 'presentation'
}

const presentationVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? '-100%' : '100%',
    opacity: 0,
  }),
}

const dashboardVariants = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
}

export function SlideContainer({
  id,
  children,
  isActive,
  direction,
  mode,
}: SlideContainerProps) {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  // --- Conditional centering for presentation mode ---
  const containerRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [fits, setFits] = useState(true)

  const measure = useCallback(() => {
    const container = containerRef.current
    const content = contentRef.current
    if (!container || !content) return
    setFits(content.scrollHeight <= container.clientHeight)
  }, [])

  // Scroll to top when entering a slide (so overflowing slides always start at the top)
  useEffect(() => {
    if (mode === 'presentation' && containerRef.current) {
      containerRef.current.scrollTop = 0
    }
  }, [mode, isActive])

  // Observe content size changes
  useEffect(() => {
    if (mode !== 'presentation') return
    const content = contentRef.current
    if (!content) return

    measure()

    const ro = new ResizeObserver(measure)
    ro.observe(content)
    window.addEventListener('resize', measure)

    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [mode, measure])

  if (mode === 'presentation') {
    return (
      <motion.section
        ref={containerRef}
        id={id}
        custom={direction}
        variants={presentationVariants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{
          x: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
          opacity: { duration: 0.4 },
        }}
        className={`absolute inset-0 flex flex-col overflow-auto ${
          fits ? 'justify-center' : 'justify-start'
        }`}
      >
        {/* Subtle radial background */}
        <div
          className="pointer-events-none fixed inset-0 z-0"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(16,185,129,0.04) 0%, transparent 70%)',
          }}
        />

        <div
          ref={contentRef}
          className="relative z-10 w-full max-w-6xl mx-auto px-4 py-8 sm:px-6 md:px-8 lg:py-12 shrink-0"
        >
          {children}
        </div>
      </motion.section>
    )
  }

  // Dashboard mode
  return (
    <motion.section
      ref={ref}
      id={id}
      variants={dashboardVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative min-h-screen flex items-center justify-center px-4 py-12 sm:px-6 md:px-8 lg:py-20"
    >
      {/* Subtle radial background */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(16,185,129,0.03) 0%, transparent 70%)',
        }}
      />
      <div className="relative z-10 w-full max-w-6xl mx-auto">{children}</div>
    </motion.section>
  )
}
