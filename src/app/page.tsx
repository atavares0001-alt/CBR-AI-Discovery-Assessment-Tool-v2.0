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

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-5 sm:px-10">
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
      <main className="relative z-10 flex flex-col items-center px-4 pt-16 sm:pt-24">
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mx-auto max-w-3xl text-center"
        >
          <h1 className="font-display text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
            AI Discovery{' '}
            <span className="text-accent">Assessment</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-text-secondary">
            Discover how AI automation can transform your business. Complete a guided assessment and receive a personalised readiness report with actionable recommendations.
          </p>
        </motion.div>

        {/* Value proposition tiles */}
        <div className="mt-16 grid w-full max-w-4xl gap-6 px-4 sm:grid-cols-3">
          {tiles.map((tile, i) => (
            <motion.div
              key={tile.title}
              {...fadeUp}
              transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 + i * 0.1 }}
              className="glass-card p-6 text-center"
            >
              <div className="mb-4 flex justify-center">{tile.icon}</div>
              <h3 className="mb-2 text-sm font-semibold">{tile.title}</h3>
              <p className="text-xs text-text-secondary">{tile.description}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA notice */}
        <motion.p
          {...fadeUp}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.6 }}
          className="mt-16 text-center text-sm text-text-muted"
        >
          To begin an assessment, you need a link from your CBR AI consultant.
        </motion.p>
      </main>
    </div>
  )
}
