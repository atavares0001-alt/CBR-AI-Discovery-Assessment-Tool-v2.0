'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SLIDE_ORDER, SLIDE_TITLES } from '@/lib/constants/labels'

interface SlideSidebarProps {
  activeSlide: string
  onNavigate: (slideId: string) => void
}

const SLIDE_ICONS: Record<string, string> = {
  cover: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4',
  score: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
  business: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
  techstack: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  workflows: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
  painpoints: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
  vision: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z',
  recommendations: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
  quote: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  closing: 'M13 7l5 5m0 0l-5 5m5-5H6',
}

export function SlideSidebar({ activeSlide, onNavigate }: SlideSidebarProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Mobile hamburger toggle */}
      <button
        onClick={() => setOpen(true)}
        className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-xl border border-glass-border bg-card/90 backdrop-blur-lg lg:hidden"
        aria-label="Open slide navigation"
      >
        <svg className="h-5 w-5 text-text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>

      {/* Backdrop overlay for mobile */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.nav
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className={`fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-glass-border bg-card/95 backdrop-blur-xl transition-transform duration-300 lg:w-56 lg:translate-x-0 lg:bg-card/80 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-5 py-6">
          <div>
            <h2 className="font-display text-sm font-bold text-accent">Discovery</h2>
            <p className="text-xs text-text-muted">Presentation</p>
          </div>
          {/* Close button on mobile */}
          <button
            onClick={() => setOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-text-muted hover:text-text-primary lg:hidden"
            aria-label="Close navigation"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 pb-6">
          <ul className="space-y-1">
            {SLIDE_ORDER.map((slideId, index) => {
              const isActive = activeSlide === slideId
              return (
                <li key={slideId}>
                  <button
                    onClick={() => {
                      onNavigate(slideId)
                      setOpen(false)
                    }}
                    className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-all duration-200 ${
                      isActive
                        ? 'bg-accent/15 text-accent'
                        : 'text-text-muted hover:bg-glass-bg hover:text-text-primary'
                    }`}
                  >
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors ${
                        isActive ? 'bg-accent/20' : 'bg-glass-bg group-hover:bg-glass-border'
                      }`}
                    >
                      <svg
                        className="h-3.5 w-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d={SLIDE_ICONS[slideId]} />
                      </svg>
                    </span>
                    <span className="flex items-baseline gap-2">
                      <span className="font-mono text-[10px] text-text-muted">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="font-medium">{SLIDE_TITLES[slideId]}</span>
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>

        <div className="border-t border-glass-border px-5 py-4">
          <p className="text-[10px] uppercase tracking-wider text-text-muted">
            Keyboard: F fullscreen · E edit
          </p>
        </div>
      </motion.nav>
    </>
  )
}
