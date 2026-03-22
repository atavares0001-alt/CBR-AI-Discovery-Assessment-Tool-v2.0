'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { GlassCard, StageTag, IconBadge, SlideIcon } from '../ui'
import { InlineEditable } from '../InlineEditable'
import { usePresentationContext } from '../PresentationShell'
import type { AISolution } from '@/lib/types/discovery'

interface OpportunitySlideProps {
  solutions: AISolution[]
  aiAutonomyLevel: string
  primaryConcern: string
  subtitle?: string
  onEdit?: (field: string, value: string) => void
}

const colorVarMap: Record<string, { text: string; bg: string }> = {
  accent: { text: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  'accent-light': { text: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  warm: { text: 'text-amber-500', bg: 'bg-amber-500/10' },
  danger: { text: 'text-red-500', bg: 'bg-red-500/10' },
}

const EFFORT_LEVELS = ['Low', 'Medium', 'High'] as const
const PRIORITY_LEVELS = [1, 2, 3, 4] as const

const effortColorMap: Record<string, { text: string; bg: string }> = {
  Low: { text: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  Medium: { text: 'text-amber-500', bg: 'bg-amber-500/10' },
  High: { text: 'text-red-500', bg: 'bg-red-500/10' },
}

function EffortPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false)
  const colors = effortColorMap[value] ?? effortColorMap.Medium

  return (
    <div className="relative inline-block">
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(v => !v) }}
        className={`
          inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-bold cursor-pointer
          transition-all duration-200 hover:scale-105
          ${colors.text} ${colors.bg}
        `}
      >
        Effort: {value}
        <svg className="w-3 h-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>
      {open && (
        <div
          className="absolute bottom-full left-0 mb-2 z-50 bg-[#0f0f12] border border-white/10 rounded-xl p-1.5 shadow-xl min-w-[120px]"
          onClick={(e) => e.stopPropagation()}
        >
          {EFFORT_LEVELS.map((level) => {
            const c = effortColorMap[level]
            return (
              <button
                key={level}
                onClick={(e) => { e.stopPropagation(); onChange(level); setOpen(false) }}
                className={`
                  w-full text-left px-3 py-2 rounded-lg text-sm font-semibold
                  flex items-center gap-2 transition-colors cursor-pointer
                  ${value === level ? `${c.bg} ${c.text}` : 'text-white/60 hover:bg-white/5 hover:text-white/90'}
                `}
              >
                <div className={`w-2.5 h-2.5 rounded-full ${c.text.replace('text-', 'bg-')}`} />
                {level}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

function PriorityPicker({ value, onChange, colors }: { value: number; onChange: (v: number) => void; colors: { text: string; bg: string } }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative inline-block">
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(v => !v) }}
        className={`
          inline-flex items-center gap-1 px-4 py-2 rounded-bl-xl text-sm font-extrabold cursor-pointer
          transition-all duration-200 hover:scale-105
          ${colors.text} ${colors.bg}
        `}
      >
        P{value}
        <svg className="w-3 h-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>
      {open && (
        <div
          className="absolute top-full right-0 mt-2 z-50 bg-[#0f0f12] border border-white/10 rounded-xl p-1.5 shadow-xl min-w-[80px]"
          onClick={(e) => e.stopPropagation()}
        >
          {PRIORITY_LEVELS.map((p) => (
            <button
              key={p}
              onClick={(e) => { e.stopPropagation(); onChange(p); setOpen(false) }}
              className={`
                w-full text-left px-3 py-2 rounded-lg text-sm font-bold
                flex items-center gap-2 transition-colors cursor-pointer
                ${value === p ? `${colors.bg} ${colors.text}` : 'text-white/60 hover:bg-white/5 hover:text-white/90'}
              `}
            >
              P{p}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Helpers ────────────────────────────────────────────────
const INTERACTIVE_TAGS = new Set(['BUTTON', 'INPUT', 'TEXTAREA', 'SELECT', 'A'])
function isInteractive(el: HTMLElement | null): boolean {
  while (el) {
    if (INTERACTIVE_TAGS.has(el.tagName)) return true
    if (el.getAttribute('role') === 'button') return true
    if (el.dataset.noDrag) return true
    el = el.parentElement
  }
  return false
}

type IndexedSolution = AISolution & { _id: number }

let nextSolId = 0

export function OpportunitySlide({
  solutions, aiAutonomyLevel, primaryConcern, subtitle, onEdit,
}: OpportunitySlideProps) {
  const { editMode } = usePresentationContext()
  const handleEdit = (field: string) => (value: string) => onEdit?.(field, value)
  const defaultSubtitle = `${solutions.length} interconnected solutions, prioritised by impact and aligned with your ${aiAutonomyLevel} preference and ${primaryConcern.toLowerCase()} requirements.`

  const [efforts, setEfforts] = useState<Record<number, string>>({})
  const [priorities, setPriorities] = useState<Record<number, number>>({})

  const prevLength = useRef(solutions.length)
  const [ordered, setOrdered] = useState<IndexedSolution[]>(() =>
    solutions.map((s) => ({ ...s, _id: nextSolId++ }))
  )

  if (solutions.length !== prevLength.current) {
    prevLength.current = solutions.length
    setOrdered(solutions.map((s) => ({ ...s, _id: nextSolId++ })))
  }

  // ── Pointer drag reorder ────────────────────────────────
  // Refs keyed by stable _id (never changes), not by position index
  const cardElMap = useRef<Map<number, HTMLDivElement>>(new Map())
  // Always-current ordered array for use inside event handlers
  const orderedRef = useRef(ordered)
  orderedRef.current = ordered

  const dragId = useRef<number | null>(null) // _id of the item being dragged
  const [draggingId, setDraggingId] = useState<number | null>(null)
  const [dragOverId, setDragOverId] = useState<number | null>(null)
  const dragActive = useRef(false) // true once pointer moved past threshold
  const startPos = useRef({ x: 0, y: 0 })
  const pointerId = useRef<number | null>(null)
  const captureEl = useRef<HTMLElement | null>(null)

  const DRAG_THRESHOLD = 5 // px before drag activates

  const handlePointerDown = useCallback((e: React.PointerEvent, id: number) => {
    // Don't start drag if clicking an interactive element
    if (isInteractive(e.target as HTMLElement)) return
    if (!editMode) return

    dragId.current = id
    dragActive.current = false
    startPos.current = { x: e.clientX, y: e.clientY }
    pointerId.current = e.pointerId
    captureEl.current = e.currentTarget as HTMLElement
    captureEl.current.setPointerCapture(e.pointerId)
  }, [editMode])

  const handlePointerMove = useCallback((e: PointerEvent) => {
    if (dragId.current === null) return

    // Activate drag after threshold
    if (!dragActive.current) {
      const dx = e.clientX - startPos.current.x
      const dy = e.clientY - startPos.current.y
      if (Math.abs(dx) < DRAG_THRESHOLD && Math.abs(dy) < DRAG_THRESHOLD) return
      dragActive.current = true
      setDraggingId(dragId.current)
    }

    const { clientX, clientY } = e

    // Find which _id the pointer is over by checking bounding rects
    let hoveredId: number | null = null
    cardElMap.current.forEach((el, id) => {
      if (id === dragId.current) return // skip self
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      // Check if pointer is within the card bounds
      if (
        clientX >= rect.left && clientX <= rect.right &&
        clientY >= rect.top && clientY <= rect.bottom
      ) {
        hoveredId = id
      }
    })

    if (hoveredId !== null) {
      setDragOverId(hoveredId)
      // Find current indices of the dragged item and the hovered item
      const cur = orderedRef.current
      const fromIdx = cur.findIndex(s => s._id === dragId.current)
      const toIdx = cur.findIndex(s => s._id === hoveredId)
      if (fromIdx !== -1 && toIdx !== -1 && fromIdx !== toIdx) {
        setOrdered(prev => {
          const next = [...prev]
          const [item] = next.splice(fromIdx, 1)
          next.splice(toIdx, 0, item)
          return next
        })
      }
    }
  }, [])

  const handlePointerUp = useCallback(() => {
    if (captureEl.current && pointerId.current !== null) {
      try { captureEl.current.releasePointerCapture(pointerId.current) } catch {}
    }
    // Save order if a drag actually happened
    if (dragActive.current) {
      const currentOrder = orderedRef.current.map(s => s.sourceIndex)
      onEdit?.('solution_order', JSON.stringify(currentOrder))
    }
    dragId.current = null
    dragActive.current = false
    pointerId.current = null
    captureEl.current = null
    setDraggingId(null)
    setDragOverId(null)
  }, [onEdit])

  useEffect(() => {
    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    }
  }, [handlePointerMove, handlePointerUp])

  return (
    <section>
      <StageTag>AI Opportunity Map</StageTag>
      <h2 className="font-outfit text-[22px] sm:text-[26px] lg:text-[30px] font-semibold leading-tight tracking-tight">
        Recommended AI Solutions
      </h2>
      <p className="text-[15px] lg:text-base leading-relaxed text-discovery-text-dim max-w-[680px] mt-2 mb-5 lg:mb-7">
        {subtitle ?? defaultSubtitle}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5">
        {ordered.map((sol) => {
          const i = sol.sourceIndex
          const currentEffort = efforts[i] ?? sol.effort
          const currentPriority = priorities[i] ?? sol.priority
          const colors = colorVarMap[sol.color] ?? colorVarMap.accent
          const isDragging = draggingId === sol._id
          const isDragOver = dragOverId === sol._id

          return (
            <motion.div
              key={sol._id}
              layout
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              ref={(el: HTMLDivElement | null) => {
                if (el) cardElMap.current.set(sol._id, el)
                else cardElMap.current.delete(sol._id)
              }}
              onPointerDown={(e) => handlePointerDown(e, sol._id)}
              style={{
                zIndex: isDragging ? 50 : 1,
                cursor: editMode ? (isDragging ? 'grabbing' : 'grab') : 'default',
                touchAction: editMode ? 'none' : 'auto',
                userSelect: isDragging ? 'none' : 'auto',
              }}
            >
              <GlassCard
                className={`relative overflow-visible transition-shadow duration-200 ${
                  isDragging ? 'shadow-2xl shadow-emerald-500/10 ring-2 ring-emerald-500/30 opacity-90' :
                  isDragOver ? 'ring-1 ring-emerald-500/20' : ''
                }`}
              >
                {/* Priority badge — top right */}
                <div className="absolute top-0 right-0">
                  <PriorityPicker
                    value={currentPriority}
                    onChange={(v) => {
                      setPriorities(prev => ({ ...prev, [i]: v }))
                      onEdit?.(`solution_${i + 1}_priority`, String(v))
                    }}
                    colors={colors}
                  />
                </div>

                <IconBadge
                  size="md"
                  color={sol.color === 'warm' ? 'warm' : sol.color === 'danger' ? 'danger' : 'accent'}
                >
                  <SlideIcon name={sol.iconType} color={sol.color} />
                </IconBadge>

                <h3 className="font-outfit text-[15px] lg:text-base font-semibold text-discovery-text mt-3.5 mb-2">
                  <InlineEditable
                    value={sol.title}
                    onChange={handleEdit(`solution_${i + 1}_title`)}
                  />
                </h3>
                <p className="text-[13px] lg:text-sm leading-relaxed text-discovery-text-dim mb-3.5">
                  <InlineEditable
                    value={sol.description}
                    onChange={handleEdit(`solution_${i + 1}_description`)}
                    fieldType="textarea"
                  />
                </p>

                <ul className="space-y-1.5 mb-4">
                  {sol.impact.split(/[,;·•]/).map((benefit, bi) => {
                    const trimmed = benefit.trim()
                    if (!trimmed) return null
                    return (
                      <li key={bi} className="flex items-start gap-2">
                        <SlideIcon name="check" color={sol.color} size={14} />
                        <span className="text-[13px] font-semibold text-discovery-text-dim">
                          {trimmed}
                        </span>
                      </li>
                    )
                  })}
                </ul>

                <EffortPicker
                  value={currentEffort}
                  onChange={(v) => {
                    setEfforts(prev => ({ ...prev, [i]: v }))
                    onEdit?.(`solution_${i + 1}_effort`, v)
                  }}
                />
              </GlassCard>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
