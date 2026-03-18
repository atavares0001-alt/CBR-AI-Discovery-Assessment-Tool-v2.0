'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { VortexBackground } from '@/components/VortexBackground'

const tiles = [
  {
    icon: (
      <svg className="h-8 w-8 text-accent" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: '~15 Minutes',
    description: 'Complete the assessment in about 15 minutes across 5 simple stages.',
  },
  {
    icon: (
      <svg className="h-8 w-8 text-accent" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: 'Privacy Act Compliant',
    description: 'Your data is encrypted, secure, and handled in compliance with Australian privacy law.',
  },
  {
    icon: (
      <svg className="h-8 w-8 text-accent" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
      </svg>
    ),
    title: 'AI Readiness Score',
    description: 'Receive a personalised AI Readiness Score with tailored recommendations.',
  },
]

const fadeUp = {
  initial: { opacity: 0, y: 8, filter: 'blur(4px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
}

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <VortexBackground />

      {/* Animated gradient orb behind hero */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, rgba(16,185,129,0.02) 40%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-4 py-5 sm:px-6 md:px-10">
        <span className="font-display text-xl font-bold">
          CBR <span className="text-accent">AI</span>
        </span>
        <Link
          href="/login"
          className="rounded-xl border border-glass-border bg-glass-bg px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:border-accent/30 hover:text-text-primary"
        >
          Consultant Login
        </Link>
      </header>

      {/* Hero */}
      <main className="relative z-10 flex flex-col items-center px-4 pt-12 sm:pt-20 md:pt-24">
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mx-auto max-w-3xl text-center"
        >
          <h1 className="font-display text-3xl font-bold leading-tight sm:text-4xl md:text-5xl lg:text-6xl" style={{ textWrap: 'balance' } as React.CSSProperties}>
            AI Discovery{' '}
            <span className="text-accent">Assessment</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-text-secondary sm:mt-6 sm:text-lg">
            Discover how AI automation can transform your business. Complete a guided assessment and receive a personalised readiness report with actionable recommendations.
          </p>
        </motion.div>

        {/* Value proposition tiles */}
        <div className="mt-10 grid w-full max-w-4xl gap-4 px-2 sm:mt-16 sm:gap-6 sm:px-4 grid-cols-1 sm:grid-cols-3">
          {tiles.map((tile, i) => (
            <motion.div
              key={tile.title}
              {...fadeUp}
              transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 + i * 0.1 }}
              className="glass-card glass-card-interactive p-5 text-center sm:p-6"
            >
              <div className="mb-3 flex justify-center sm:mb-4">{tile.icon}</div>
              <h3 className="mb-1.5 text-sm font-semibold sm:mb-2">{tile.title}</h3>
              <p className="text-xs leading-relaxed text-text-secondary">{tile.description}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA notice */}
        <motion.p
          {...fadeUp}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.6 }}
          className="mt-10 text-center text-sm text-text-muted sm:mt-16"
        >
          To begin an assessment, you need a link from your CBR AI consultant.
        </motion.p>
      </main>
    </div>
  )
}
