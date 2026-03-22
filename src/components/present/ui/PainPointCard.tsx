'use client'

import { useState } from 'react'
import { IconBadge } from './IconBadge'
import { SlideIcon } from './SlideIcons'
import { InlineEditable } from '../InlineEditable'
import type { PainPoint } from '@/lib/types/discovery'

// ── Impact scale ──────────────────────────────────────────
const IMPACT_LEVELS = [
  { label: 'Very Low', value: 20, textClass: 'text-emerald-400', bgClass: 'bg-emerald-400', badgeBg: 'bg-emerald-400/10' },
  { label: 'Low', value: 40, textClass: 'text-emerald-500', bgClass: 'bg-emerald-500', badgeBg: 'bg-emerald-500/10' },
  { label: 'Medium', value: 60, textClass: 'text-amber-500', bgClass: 'bg-amber-500', badgeBg: 'bg-amber-500/10' },
  { label: 'High', value: 80, textClass: 'text-orange-500', bgClass: 'bg-orange-500', badgeBg: 'bg-orange-500/10' },
  { label: 'Very High', value: 95, textClass: 'text-red-500', bgClass: 'bg-red-500', badgeBg: 'bg-red-500/10' },
] as const

function getImpactLevel(severity: number) {
  if (severity >= 90) return IMPACT_LEVELS[4]
  if (severity >= 70) return IMPACT_LEVELS[3]
  if (severity >= 50) return IMPACT_LEVELS[2]
  if (severity >= 30) return IMPACT_LEVELS[1]
  return IMPACT_LEVELS[0]
}

// ── Props ─────────────────────────────────────────────────
interface PainPointCardProps extends PainPoint {
  /** Controlled severity — managed by parent, not local state */
  controlledSeverity?: number
  onEditTitle?: (value: string) => void
  onEditBusinessImpact?: (value: string) => void
  onEditCurrentProcess?: (value: string) => void
  onEditSeverity?: (value: number) => void
}

export function PainPointCard({
  title, severity: defaultSeverity, currentState, businessImpact, currentProcess,
  iconType, color, controlledSeverity, onEditTitle, onEditBusinessImpact, onEditCurrentProcess, onEditSeverity,
}: PainPointCardProps) {
  const [open, setOpen] = useState(false)
  const [showPicker, setShowPicker] = useState(false)

  // Use controlled severity from parent if provided, otherwise fall back to prop
  const severity = controlledSeverity ?? defaultSeverity
  const impact = getImpactLevel(severity)

  const handleSeverityChange = (newValue: number) => {
    onEditSeverity?.(newValue)
    setShowPicker(false)
  }

  return (
    <div
      className={`
        w-full text-left card-hover
        bg-discovery-glass backdrop-blur-glass
        border rounded-glass-sm lg:rounded-glass
        p-5 lg:p-7 shadow-glass-glow
        transition-all duration-300
        ${open ? 'border-white/20 -translate-y-0.5' : 'border-discovery-border'}
        relative
      `}
    >
      <div className="flex gap-3 lg:gap-4 items-start">
        <IconBadge size="md" color="warm">
          <SlideIcon name={iconType} color="warm" />
        </IconBadge>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
            <h3 className="font-outfit text-[17px] lg:text-[19px] font-semibold text-discovery-text">
              {onEditTitle ? (
                <InlineEditable
                  value={title}
                  onChange={onEditTitle}
                  fieldType="textarea"
                />
              ) : (
                title
              )}
            </h3>

            {/* ── Impact rating (clickable to change) ── */}
            <div className="flex items-center gap-2 shrink-0 relative">
              <button
                onClick={(e) => { e.stopPropagation(); setShowPicker(v => !v) }}
                className={`
                  inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold cursor-pointer
                  transition-all duration-200 hover:scale-105
                  ${impact.textClass} ${impact.badgeBg}
                `}
              >
                {impact.label}
                <svg className="w-3 h-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>

              {/* Bar */}
              <div className="w-14 h-[5px] rounded-full bg-white/[0.06]">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${impact.bgClass}`}
                  style={{ width: `${severity}%` }}
                />
              </div>

              {/* Expand/collapse */}
              <button
                onClick={() => setOpen(v => !v)}
                aria-expanded={open}
                aria-label={open ? 'Collapse details' : 'Expand details'}
                className="cursor-pointer p-1"
              >
                <svg
                  className={`w-3.5 h-3.5 text-white/50 transition-transform duration-300 ${open ? 'rotate-180' : ''
                    }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>

              {/* Impact level picker dropdown — opens upward to avoid clipping */}
              {showPicker && (
                <div
                  className="absolute bottom-full right-0 mb-2 z-50 bg-[#0f0f12] border border-white/10 rounded-xl p-1.5 shadow-xl min-w-[140px]"
                  onClick={(e) => e.stopPropagation()}
                >
                  {IMPACT_LEVELS.map((level) => (
                    <button
                      key={level.label}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleSeverityChange(level.value)
                      }}
                      className={`
                        w-full text-left px-3 py-2 rounded-lg text-sm font-semibold
                        flex items-center gap-2 transition-colors cursor-pointer
                        ${severity === level.value ? `${level.badgeBg} ${level.textClass}` : 'text-white/60 hover:bg-white/5 hover:text-white/90'}
                      `}
                    >
                      <div className={`w-2.5 h-2.5 rounded-full ${level.bgClass}`} />
                      {level.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {open && (
            <div className="mt-3.5 grid grid-cols-1 lg:grid-cols-2 gap-3 animate-fade-up">
              {/* Current Process — left column */}
              <div className="p-3.5 lg:p-4 bg-white/[0.02] rounded-lg border border-discovery-border">
                <h4 className="text-base lg:text-lg font-bold text-amber-400 mb-2.5">Current Process</h4>
                <div className="text-[13px] lg:text-sm leading-relaxed text-discovery-text-dim">
                  {onEditCurrentProcess ? (
                    <InlineEditable
                      value={currentProcess}
                      onChange={onEditCurrentProcess}
                      fieldType="textarea"
                    />
                  ) : currentProcess}
                </div>
              </div>

              {/* Business Impact — right column */}
              <div className="p-3.5 lg:p-4 bg-white/[0.02] rounded-lg border border-discovery-border">
                <h4 className="text-base lg:text-lg font-bold text-amber-400 mb-2.5">Business Impact</h4>
                <div className="text-[13px] lg:text-sm leading-relaxed text-discovery-text-dim">
                  {onEditBusinessImpact ? (
                    <InlineEditable
                      value={businessImpact}
                      onChange={onEditBusinessImpact}
                      fieldType="textarea"
                    />
                  ) : businessImpact}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
