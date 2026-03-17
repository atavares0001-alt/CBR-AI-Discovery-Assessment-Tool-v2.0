'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'

interface StageFormProps {
  title: string
  description?: string
  children: React.ReactNode
  onBack?: () => void
  onContinue: () => void
  continueLabel?: string
  continueDisabled?: boolean
  loading?: boolean
  showBack?: boolean
}

export function StageForm({
  title,
  description,
  children,
  onBack,
  onContinue,
  continueLabel = 'Continue',
  continueDisabled = false,
  loading = false,
  showBack = true,
}: StageFormProps) {
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onContinue()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.5 }}
      className="mx-auto w-full max-w-2xl px-4 pt-20 pb-12"
    >
      <div className="mb-8">
        <h2 className="font-display text-2xl font-bold">{title}</h2>
        {description && (
          <p className="mt-2 text-sm text-text-secondary">{description}</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {children}

        <div className="flex justify-between pt-4">
          {showBack && onBack ? (
            <Button type="button" variant="secondary" onClick={onBack}>
              Back
            </Button>
          ) : (
            <span />
          )}
          <Button type="submit" disabled={continueDisabled || loading}>
            {loading ? 'Saving...' : continueLabel}
          </Button>
        </div>
      </form>
    </motion.div>
  )
}
