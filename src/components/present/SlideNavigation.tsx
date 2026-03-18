'use client'

import { motion } from 'framer-motion'

interface SlideNavigationProps {
  currentSlide: number
  totalSlides: number
  onNavigate: (index: number) => void
  slideNames: string[]
}

function ArrowLeftIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12.5 15L7.5 10L12.5 5" />
    </svg>
  )
}

function ArrowRightIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7.5 5L12.5 10L7.5 15" />
    </svg>
  )
}

export function SlideNavigation({
  currentSlide,
  totalSlides,
  onNavigate,
  slideNames,
}: SlideNavigationProps) {
  return (
    <motion.div
      initial={{ y: 60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-4 sm:pb-6"
    >
      <div className="glass-card mx-auto flex max-w-2xl items-center justify-between gap-3 rounded-full px-4 py-2.5 sm:max-w-3xl sm:gap-4 sm:px-6 sm:py-3">
        {/* Current slide title */}
        <span className="hidden text-sm font-medium text-text-secondary sm:block sm:min-w-0 sm:flex-shrink sm:truncate">
          {slideNames[currentSlide]}
        </span>

        {/* Left arrow */}
        <button
          onClick={() => onNavigate(currentSlide - 1)}
          disabled={currentSlide === 0}
          className="flex-shrink-0 rounded-full p-1.5 transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-25"
          aria-label="Previous slide"
        >
          <ArrowLeftIcon />
        </button>

        {/* Progress dots */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {Array.from({ length: totalSlides }).map((_, i) => (
            <button
              key={i}
              onClick={() => onNavigate(i)}
              className="relative flex items-center justify-center p-0.5"
              aria-label={`Go to slide ${i + 1}: ${slideNames[i]}`}
            >
              <motion.div
                layout
                className="rounded-full"
                animate={{
                  width: i === currentSlide ? 20 : 7,
                  height: 7,
                  backgroundColor:
                    i === currentSlide
                      ? 'rgb(16, 185, 129)'
                      : i < currentSlide
                        ? 'rgba(16, 185, 129, 0.3)'
                        : 'rgba(255, 255, 255, 0.15)',
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              />
            </button>
          ))}
        </div>

        {/* Right arrow */}
        <button
          onClick={() => onNavigate(currentSlide + 1)}
          disabled={currentSlide === totalSlides - 1}
          className="flex-shrink-0 rounded-full p-1.5 transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-25"
          aria-label="Next slide"
        >
          <ArrowRightIcon />
        </button>

        {/* Slide counter */}
        <span className="flex-shrink-0 font-mono text-xs tabular-nums text-text-muted">
          {currentSlide + 1}/{totalSlides}
        </span>
      </div>
    </motion.div>
  )
}
