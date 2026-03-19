'use client'

import { motion } from 'framer-motion'

export function CompletionScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.6 }}
        className="glass-card-glow w-full max-w-lg p-8 text-center"
      >
        <div className="mb-6 text-4xl">✓</div>
        <h1 className="font-display text-2xl font-bold">Assessment Complete</h1>
        <p className="mt-3 text-text-secondary">
          Thank you for completing your AI Discovery Assessment. Your consultant will now review your responses.
        </p>

        <div className="mt-8 space-y-4">
          <h2 className="text-sm font-semibold text-accent">What happens next</h2>
          {[
            { step: '1', title: 'Review', desc: 'Your consultant will review your responses and assess your AI readiness.' },
            { step: '2', title: 'Recommendations', desc: 'You\'ll receive tailored recommendations — from AI receptionists to workflow automation — based on your needs.' },
            { step: '3', title: 'Report', desc: 'A comprehensive AI Discovery Report with your readiness score and proposed investment starting from $390/mo.' },
          ].map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.15 }}
              className="glass-card flex items-start gap-4 p-4 text-left"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/20 text-sm font-bold text-accent">
                {item.step}
              </span>
              <div>
                <p className="text-sm font-medium">{item.title}</p>
                <p className="mt-0.5 text-xs text-text-muted">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
