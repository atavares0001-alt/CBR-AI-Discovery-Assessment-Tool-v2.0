'use client'

import { motion, AnimatePresence } from 'framer-motion'

interface FloatingToolbarProps {
  mode: 'dashboard' | 'presentation'
  editMode: boolean
  saving: 'idle' | 'saving' | 'saved'
  onToggleMode: () => void
  onToggleEdit: () => void
}

function GridIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="5.5" height="5.5" rx="1" />
      <rect x="10.5" y="2" width="5.5" height="5.5" rx="1" />
      <rect x="2" y="10.5" width="5.5" height="5.5" rx="1" />
      <rect x="10.5" y="10.5" width="5.5" height="5.5" rx="1" />
    </svg>
  )
}

function SlidesIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="14" height="10" rx="1.5" />
      <path d="M7 16L9 13L11 16" />
    </svg>
  )
}

function PencilIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11.5 1.5L14.5 4.5L5 14H2V11L11.5 1.5Z" />
      <path d="M9.5 3.5L12.5 6.5" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.5 7.5L5.5 10.5L11.5 3.5" />
    </svg>
  )
}

function SpinnerIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="animate-spin">
      <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" strokeDasharray="20 12" strokeLinecap="round" />
    </svg>
  )
}

export function FloatingToolbar({
  mode,
  editMode,
  saving,
  onToggleMode,
  onToggleEdit,
}: FloatingToolbarProps) {
  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed bottom-16 left-1/2 z-50 -translate-x-1/2 sm:bottom-20"
    >
      <div className="glass-card rounded-full px-2 py-1.5 flex items-center gap-1 shadow-lg shadow-black/30">
        {/* Mode toggle */}
        <ToolbarButton
          onClick={onToggleMode}
          active={false}
          tooltip={mode === 'dashboard' ? 'Presentation mode (F)' : 'Dashboard mode (F)'}
        >
          {mode === 'dashboard' ? <SlidesIcon /> : <GridIcon />}
        </ToolbarButton>

        {/* Divider */}
        <div className="w-px h-5 bg-white/10 mx-1" />

        {/* Edit toggle */}
        <ToolbarButton
          onClick={onToggleEdit}
          active={editMode}
          tooltip={editMode ? 'Exit edit mode (E)' : 'Edit mode (E)'}
        >
          <PencilIcon />
        </ToolbarButton>

        {/* Save indicator */}
        <AnimatePresence mode="wait">
          {saving !== 'idle' && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 'auto', opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium whitespace-nowrap">
                {saving === 'saving' && (
                  <>
                    <SpinnerIcon />
                    <span className="text-text-secondary">Saving...</span>
                  </>
                )}
                {saving === 'saved' && (
                  <>
                    <span className="text-accent">
                      <CheckIcon />
                    </span>
                    <span className="text-accent">Saved</span>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

// ---------------------------------------------------------------------------
// Toolbar button sub-component
// ---------------------------------------------------------------------------

function ToolbarButton({
  children,
  onClick,
  active,
  tooltip,
}: {
  children: React.ReactNode
  onClick: () => void
  active: boolean
  tooltip: string
}) {
  return (
    <button
      onClick={onClick}
      title={tooltip}
      className={`
        relative p-2 rounded-full transition-all duration-200
        hover:bg-white/10
        ${active ? 'bg-accent/20 text-accent' : 'text-text-secondary hover:text-text-primary'}
      `}
    >
      {children}
    </button>
  )
}
