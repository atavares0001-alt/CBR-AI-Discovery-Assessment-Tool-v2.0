'use client'

import { motion, type HTMLMotionProps } from 'framer-motion'

interface GlassCardProps extends HTMLMotionProps<'div'> {
  glow?: boolean
  children: React.ReactNode
}

export function GlassCard({ glow, children, className = '', ...props }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`${glow ? 'glass-card-glow' : 'glass-card'} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  )
}
