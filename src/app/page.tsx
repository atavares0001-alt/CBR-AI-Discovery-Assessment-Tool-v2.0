'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { VortexBackground } from '@/components/VortexBackground'
import { Logo } from '@/components/ui/Logo'

const tiles = [
  {
    icon: (
      <svg className="h-8 w-8 text-accent" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: '~10 Minutes',
    description: 'Complete the assessment in about 10 minutes across 4 simple stages.',
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
        <Logo size="md" />
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
            Discover how AI can automate your small business. Complete a guided assessment and receive a personalised AI readiness report with tailored automation recommendations.
          </p>
        </motion.div>

        {/* Value proposition tiles */}
        <div className="mt-10 flex w-full max-w-sm justify-center px-2 sm:mt-16 sm:px-4">
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
          To begin an assessment, you need a link from your CBR AI Agency consultant.
        </motion.p>
      </main>
    </div>
  )
}
