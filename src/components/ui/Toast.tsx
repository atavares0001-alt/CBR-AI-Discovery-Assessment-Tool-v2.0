'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'

interface ToastProps {
  message: string
  type?: 'success' | 'error' | 'info'
  visible: boolean
  onClose: () => void
  action?: { label: string; onClick: () => void }
}

const typeStyles = {
  success: 'border-emerald-500/30 text-emerald-400',
  error: 'border-red-500/30 text-red-400',
  info: 'border-blue-500/30 text-blue-400',
}

export function Toast({ message, type = 'info', visible, onClose, action }: ToastProps) {
  useEffect(() => {
    if (visible && !action) {
      const timer = setTimeout(onClose, 4000)
      return () => clearTimeout(timer)
    }
  }, [visible, onClose, action])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className={`fixed bottom-6 right-6 z-50 glass-card border px-4 py-3 ${typeStyles[type]}`}
        >
          <div className="flex items-center gap-3">
            <span className="text-sm">{message}</span>
            {action && (
              <button
                onClick={action.onClick}
                className="text-sm font-semibold text-accent hover:text-accent-hover"
              >
                {action.label}
              </button>
            )}
            <button onClick={onClose} className="text-text-muted hover:text-text-primary" aria-label="Dismiss">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
