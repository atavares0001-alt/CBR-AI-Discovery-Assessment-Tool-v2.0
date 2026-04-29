'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GlassCard } from '@/components/ui/GlassCard'
import { STAGE_LABELS, FIELD_LABELS, STAGE_ORDER } from '@/lib/constants/labels'
import type { Response } from '@/lib/types/database'

/* ─── Types ─── */
interface ResponsesTabProps {
  responses: Response[]
}

interface FieldGroup {
  label: string
  icon: React.ReactNode
  fields: string[]
}

/* ─── Stage sub-group definitions ─── */
const STAGE_GROUPS: Record<string, FieldGroup[]> = {
  stage_1: [
    {
      label: 'Contact & Business Details',
      icon: <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>,
      fields: ['contact_name', 'phone_number', 'business_name', 'website_url'],
    },
    {
      label: 'About the Business',
      icon: <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" /></svg>,
      fields: ['business_purpose'],
    },
    {
      label: 'Team & Industry',
      icon: <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" /></svg>,
      fields: ['employee_count', 'industry', 'industry_other'],
    },
    {
      label: 'Decision Making',
      icon: <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
      fields: ['is_decision_maker', 'decision_maker_name'],
    },
  ],
  stage_2: [
    {
      label: 'Communication & Productivity',
      icon: <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" /></svg>,
      fields: ['email_calendar', 'crm_tool', 'project_management'],
    },
    {
      label: 'Data & Finance',
      icon: <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" /></svg>,
      fields: ['data_storage', 'accounting_software'],
    },
    {
      label: 'Specialist & Marketing',
      icon: <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 001.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 010 3.46" /></svg>,
      fields: ['specialised_software', 'social_media', 'website_hosting'],
    },
  ],
  stage_3: [
    {
      label: 'Automation Status',
      icon: <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077l1.41-.513m14.095-5.13l1.41-.513M5.106 17.785l1.15-.964m11.49-9.642l1.149-.964M7.501 19.795l.75-1.3m7.5-12.99l.75-1.3m-6.063 16.658l.26-1.477m2.605-14.772l.26-1.477m0 17.726l-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.794l-.75-1.299M7.5 4.205L12 12m6.894 5.785l-1.149-.964M6.256 7.178l-1.15-.964m15.352 8.864l-1.41-.513M4.954 9.435l-1.41-.514M12.002 12l-3.75 6.495" /></svg>,
      fields: ['automation_tools', 'automation_details'],
    },
    {
      label: 'Top 5 Time & Effort Drains',
      icon: <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
      fields: ['time_drain_1', 'time_drain_2', 'time_drain_3', 'time_drain_4', 'time_drain_5'],
    },
    {
      label: 'If You Had a Magic Wand',
      icon: <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" /></svg>,
      fields: ['magic_wand_task'],
    },
  ],
  stage_5: [
    {
      label: 'Your Vision',
      icon: <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
      fields: ['vision_1', 'vision_2', 'vision_3', 'vision_4', 'vision_5'],
    },
    {
      label: 'High-Value Focus Areas',
      icon: <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>,
      fields: ['focus_1', 'focus_2', 'focus_3', 'focus_4', 'focus_5'],
    },
    {
      label: 'AI Preferences',
      icon: <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" /></svg>,
      fields: ['ai_autonomy', 'primary_concern'],
    },
    {
      label: 'Timeline & Budget',
      icon: <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
      fields: ['timeline', 'budget'],
    },
  ],
}

const FULL_WIDTH_FIELDS = new Set([
  'business_purpose', 'magic_wand_task', 'automation_details', 'website_url', 'automation_tools',
])

const NUMBERED_GROUPS = new Set([
  'time_drain_1', 'time_drain_2', 'time_drain_3', 'time_drain_4', 'time_drain_5',
  'vision_1', 'vision_2', 'vision_3', 'vision_4', 'vision_5',
  'focus_1', 'focus_2', 'focus_3', 'focus_4', 'focus_5',
])

const JSON_ARRAY_FIELDS = new Set([
  'email_calendar', 'crm_tool', 'project_management', 'data_storage',
  'accounting_software', 'specialised_software', 'social_media', 'website_hosting',
  'primary_concern',
])

/* ─── Stage accent colours ─── */
const STAGE_COLORS: Record<string, { bg: string; text: string; border: string; glow: string; dot: string }> = {
  stage_1: {
    bg: 'bg-accent/12',
    text: 'text-accent',
    border: 'border-accent/30',
    glow: 'shadow-[0_0_20px_rgba(16,185,129,0.12)]',
    dot: 'bg-accent',
  },
  stage_2: {
    bg: 'bg-blue-500/12',
    text: 'text-blue-400',
    border: 'border-blue-500/30',
    glow: 'shadow-[0_0_20px_rgba(59,130,246,0.12)]',
    dot: 'bg-blue-400',
  },
  stage_3: {
    bg: 'bg-amber-500/12',
    text: 'text-amber-400',
    border: 'border-amber-500/30',
    glow: 'shadow-[0_0_20px_rgba(245,158,11,0.12)]',
    dot: 'bg-amber-400',
  },
  stage_5: {
    bg: 'bg-purple-500/12',
    text: 'text-purple-400',
    border: 'border-purple-500/30',
    glow: 'shadow-[0_0_20px_rgba(168,85,247,0.12)]',
    dot: 'bg-purple-400',
  },
}

/* ─── Stage icons ─── */
const STAGE_ICONS: Record<string, React.ReactNode> = {
  stage_1: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>,
  stage_2: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3" /></svg>,
  stage_3: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  stage_5: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>,
}

/* ─── Helpers ─── */
function parseJsonArray(value: unknown): string[] | null {
  if (typeof value !== 'string') return null
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed.filter(Boolean) : null
  } catch { return null }
}

function isNumberedField(key: string): boolean {
  return NUMBERED_GROUPS.has(key)
}

function getNumberFromField(key: string): number {
  const match = key.match(/_(\d+)$/)
  return match ? parseInt(match[1], 10) : 0
}

function countAnsweredFields(answers: Record<string, unknown>, fields: string[]): number {
  return fields.filter((f) => {
    const v = answers[f]
    if (!v && v !== 0) return false
    if (JSON_ARRAY_FIELDS.has(f)) {
      const parsed = parseJsonArray(v)
      return parsed ? parsed.length > 0 : false
    }
    return true
  }).length
}

/* ═══════════════════ Chip ═══════════════════ */
function Chip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/[0.06] border border-white/[0.10] px-2.5 py-1 text-xs font-medium text-text-secondary">
      <span className="w-1 h-1 rounded-full bg-accent/60 shrink-0" />
      {label}
    </span>
  )
}

/* ═══════════════════ YesNo ═══════════════════ */
function YesNoBadge({ value }: { value: string }) {
  const isYes = value.toLowerCase() === 'yes'
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
      isYes
        ? 'bg-accent/15 text-accent border border-accent/25'
        : 'bg-red-500/10 text-red-400 border border-red-500/20'
    }`}>
      {isYes
        ? <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
        : <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
      }
      {value}
    </span>
  )
}

/* ═══════════════════ Numbered Item ═══════════════════ */
function NumberedItem({
  number,
  value,
  color = 'accent',
  delay = 0,
}: {
  number: number
  value: string
  color?: 'accent' | 'blue' | 'amber' | 'purple'
  delay?: number
}) {
  const styles = {
    accent: { num: 'bg-accent/12 text-accent border-accent/20', left: 'bg-accent/20', bar: 'border-l-accent/25' },
    blue:   { num: 'bg-blue-500/12 text-blue-400 border-blue-400/20', left: 'bg-blue-400/20', bar: 'border-l-blue-500/25' },
    amber:  { num: 'bg-amber-500/12 text-amber-400 border-amber-400/20', left: 'bg-amber-400/20', bar: 'border-l-amber-500/25' },
    purple: { num: 'bg-purple-500/12 text-purple-400 border-purple-400/20', left: 'bg-purple-400/20', bar: 'border-l-purple-500/25' },
  }
  const s = styles[color]
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay }}
      className={`flex items-start gap-3 rounded-xl border border-glass-border/50 border-l-2 ${s.bar} bg-white/[0.025] px-4 py-3 group`}
    >
      <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${s.num} text-xs font-bold mt-0.5 tabular-nums`}>
        {number}
      </span>
      <p className="text-sm text-text-primary leading-relaxed">{value}</p>
    </motion.div>
  )
}

/* ═══════════════════ Quote Block (full-width long text) ═══════════════════ */
function QuoteBlock({ value }: { value: string }) {
  return (
    <div className="relative rounded-xl border border-glass-border/50 border-l-2 border-l-accent/40 bg-white/[0.025] px-4 py-3.5">
      <p className="text-sm text-text-primary leading-relaxed whitespace-pre-wrap">{value}</p>
    </div>
  )
}

/* ═══════════════════ Field Cell ═══════════════════ */
function FieldCell({
  fieldKey,
  value,
  fullWidth,
}: {
  fieldKey: string
  value: unknown
  fullWidth: boolean
}) {
  const label = FIELD_LABELS[fieldKey] || fieldKey.replace(/_/g, ' ')
  const isEmpty = !value && value !== 0

  const renderValue = () => {
    if (isEmpty) {
      return (
        <span className="inline-flex items-center gap-1.5 text-xs italic text-text-muted/40">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
          </svg>
          Not provided
        </span>
      )
    }

    const str = String(value)

    if (JSON_ARRAY_FIELDS.has(fieldKey)) {
      const parsed = parseJsonArray(value)
      if (parsed && parsed.length > 0) {
        return (
          <div className="flex flex-wrap gap-1.5 mt-0.5">
            {parsed.map((item) => <Chip key={item} label={item} />)}
          </div>
        )
      }
      return <span className="text-xs italic text-text-muted/40">None selected</span>
    }

    if (fieldKey === 'is_decision_maker' && (str === 'Yes' || str === 'No')) {
      return <div className="mt-0.5"><YesNoBadge value={str} /></div>
    }

    if (FULL_WIDTH_FIELDS.has(fieldKey)) {
      return <div className="mt-1"><QuoteBlock value={str} /></div>
    }

    return <p className="text-sm text-text-primary mt-0.5">{str}</p>
  }

  return (
    <div className={`rounded-xl border border-glass-border/40 bg-white/[0.02] px-4 py-3 transition-colors hover:bg-white/[0.035] hover:border-glass-border/70 ${
      isEmpty ? 'opacity-50' : ''
    } ${fullWidth ? 'md:col-span-2' : ''}`}>
      <p className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-text-muted/70 leading-none">
        {label}
      </p>
      {renderValue()}
    </div>
  )
}

/* ═══════════════════ Sub-group ═══════════════════ */
function SubGroup({
  group,
  answers,
  stageColor,
  animDelay = 0,
}: {
  group: FieldGroup
  answers: Record<string, unknown>
  stageColor: typeof STAGE_COLORS[string]
  animDelay?: number
}) {
  const numberedFields = group.fields.filter(isNumberedField)
  const regularFields = group.fields.filter((f) => !isNumberedField(f))

  const isFocus = group.fields.some((f) => f.startsWith('focus_'))
  const isVision = group.fields.some((f) => f.startsWith('vision_'))
  const isDrain = group.fields.some((f) => f.startsWith('time_drain'))

  const numberedColor: 'accent' | 'blue' | 'amber' | 'purple' =
    isDrain ? 'amber' : isVision ? 'purple' : isFocus ? 'blue' : 'accent'

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: animDelay }}
    >
      {/* Sub-group header */}
      <div className="flex items-center gap-2 mb-3">
        <span className={`flex h-5 w-5 items-center justify-center rounded-md ${stageColor.bg} ${stageColor.text}`}>
          {group.icon}
        </span>
        <span className="text-[11px] font-semibold uppercase tracking-[0.09em] text-text-muted/80">
          {group.label}
        </span>
        <div className="flex-1 h-px bg-glass-border/50" />
      </div>

      {/* Numbered list */}
      {numberedFields.length > 0 && (
        <div className="space-y-2 mb-2">
          {numberedFields
            .sort((a, b) => getNumberFromField(a) - getNumberFromField(b))
            .map((field, idx) => {
              const val = answers[field]
              if (!val && val !== 0) return null
              return (
                <NumberedItem
                  key={field}
                  number={getNumberFromField(field)}
                  value={String(val)}
                  color={numberedColor}
                  delay={idx * 0.04}
                />
              )
            })}
          {numberedFields.every((f) => !answers[f]) && (
            <p className="text-xs italic text-text-muted/40 pl-1">No items provided</p>
          )}
        </div>
      )}

      {/* Regular fields grid */}
      {regularFields.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {regularFields.map((field) => {
            // Conditional fields
            if (field === 'decision_maker_name' && answers.is_decision_maker !== 'No') return null
            if (field === 'industry_other' && !answers.industry_other) return null

            const isFullWidth = FULL_WIDTH_FIELDS.has(field) || JSON_ARRAY_FIELDS.has(field)
            return (
              <FieldCell
                key={field}
                fieldKey={field}
                value={answers[field]}
                fullWidth={isFullWidth}
              />
            )
          })}
        </div>
      )}
    </motion.div>
  )
}

/* ═══════════════════ Chevron ═══════════════════ */
function ChevronIcon({ expanded }: { expanded: boolean }) {
  return (
    <motion.svg
      animate={{ rotate: expanded ? 180 : 0 }}
      transition={{ duration: 0.22, ease: 'easeInOut' }}
      className="w-4 h-4 text-text-muted/60 shrink-0"
      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </motion.svg>
  )
}

/* ═══════════════════ Stage Section ═══════════════════ */
function StageSection({
  stage,
  response,
  defaultExpanded,
  index,
}: {
  stage: string
  response: Response | null
  defaultExpanded: boolean
  index: number
}) {
  const [expanded, setExpanded] = useState(defaultExpanded)
  const isCompleted = response !== null
  const groups = STAGE_GROUPS[stage] || []
  const answers = (response?.answers as Record<string, unknown>) || {}
  const color = STAGE_COLORS[stage] || STAGE_COLORS.stage_1

  // Count answered fields for the summary line
  const allFields = groups.flatMap((g) => g.fields)
  const answeredCount = countAnsweredFields(answers, allFields)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
    >
      <div className={`glass-card overflow-hidden ${isCompleted && expanded ? color.glow : ''} transition-shadow duration-500`}>

        {/* Top accent line on completed stages */}
        {isCompleted && (
          <div className={`h-[2px] w-full ${color.dot} opacity-60`}
            style={{ background: `linear-gradient(to right, ${
              stage === 'stage_1' ? 'rgba(16,185,129,0.8), rgba(16,185,129,0.1)' :
              stage === 'stage_2' ? 'rgba(59,130,246,0.8), rgba(59,130,246,0.1)' :
              stage === 'stage_3' ? 'rgba(245,158,11,0.8), rgba(245,158,11,0.1)' :
              'rgba(168,85,247,0.8), rgba(168,85,247,0.1)'
            })` }}
          />
        )}

        {/* Header button */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex w-full items-center gap-3.5 px-5 py-4 sm:px-6 text-left group"
          aria-expanded={expanded}
        >
          {/* Icon */}
          <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
            isCompleted
              ? `${color.bg} ${color.text} ${color.border}`
              : 'bg-glass-bg text-text-muted border-glass-border'
          } transition-colors`}>
            {STAGE_ICONS[stage]}
          </span>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className={`text-sm sm:text-[15px] font-semibold leading-snug ${
                isCompleted ? 'text-text-primary' : 'text-text-muted'
              }`}>
                {STAGE_LABELS[stage] || stage}
              </h3>
            </div>
            <p className={`text-xs mt-0.5 ${isCompleted ? 'text-text-muted' : 'text-text-muted/50'}`}>
              {isCompleted
                ? `${answeredCount} field${answeredCount !== 1 ? 's' : ''} answered`
                : 'Awaiting client response'}
            </p>
          </div>

          {/* Status pill */}
          {isCompleted ? (
            <span className={`hidden sm:inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold border ${color.bg} ${color.text} ${color.border} mr-1 shrink-0`}>
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              Complete
            </span>
          ) : (
            <span className="hidden sm:inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium bg-glass-bg border border-glass-border text-text-muted/60 mr-1 shrink-0">
              Pending
            </span>
          )}

          <ChevronIcon expanded={expanded} />
        </button>

        {/* Content */}
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              key="content"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
              className="overflow-hidden"
            >
              <div className="border-t border-glass-border/60 px-5 pb-6 pt-5 sm:px-6">
                {!isCompleted ? (
                  /* Pending empty state */
                  <div className="flex flex-col items-center py-8 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-glass-bg border border-glass-border mb-3">
                      <svg className="w-6 h-6 text-text-muted/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.25}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-text-muted">Waiting for client</p>
                    <p className="text-xs text-text-muted/50 mt-1 max-w-[22ch]">This stage hasn't been completed yet.</p>
                  </div>
                ) : (
                  <div className="space-y-7">
                    {groups.map((group, gIdx) => (
                      <SubGroup
                        key={group.label}
                        group={group}
                        answers={answers}
                        stageColor={color}
                        animDelay={gIdx * 0.06}
                      />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

/* ═══════════════════ Progress Header ═══════════════════ */
function ProgressHeader({
  completedStages,
  total,
}: {
  completedStages: Set<string>
  total: number
}) {
  const completedCount = completedStages.size
  const pct = total > 0 ? Math.round((completedCount / total) * 100) : 0

  const stageShortLabels: Record<string, string> = {
    stage_1: 'Profile',
    stage_2: 'Stack',
    stage_3: 'Ops',
    stage_5: 'Vision',
  }

  return (
    <div className="glass-card p-5 sm:p-6 mb-5">
      {/* Top row */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h3 className="text-sm font-semibold text-text-primary">Client Progress</h3>
          <p className="text-xs text-text-muted mt-0.5">
            {completedCount === 0
              ? 'No stages completed yet'
              : completedCount === total
              ? 'All stages complete — ready to review'
              : `${completedCount} of ${total} stages submitted`}
          </p>
        </div>
        <div className="text-right shrink-0">
          <span className="text-3xl font-bold font-display tabular-nums" style={{
            background: 'linear-gradient(135deg, #10b981, #34d399)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            {pct}%
          </span>
        </div>
      </div>

      {/* Progress track */}
      <div className="relative h-2 rounded-full bg-white/[0.06] overflow-hidden mb-4">
        <motion.div
          className="h-full rounded-full"
          style={{ background: 'linear-gradient(to right, #10b981, #34d399)' }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: [0.4, 0, 0.2, 1], delay: 0.15 }}
        />
        {/* Shimmer sweep */}
        {pct > 0 && (
          <motion.div
            className="absolute inset-y-0 w-12 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            initial={{ left: '-10%' }}
            animate={{ left: '110%' }}
            transition={{ duration: 1.2, delay: 0.8, ease: 'easeInOut' }}
          />
        )}
      </div>

      {/* Stage step indicators */}
      <div className="grid grid-cols-4 gap-1.5">
        {STAGE_ORDER.map((stage) => {
          const done = completedStages.has(stage)
          const color = STAGE_COLORS[stage]
          return (
            <div key={stage} className={`flex flex-col items-center gap-1.5 rounded-lg px-2 py-2 transition-colors ${
              done ? `${color.bg} border border-[rgba(255,255,255,0.06)]` : 'bg-white/[0.025] border border-glass-border/30'
            }`}>
              <div className={`flex h-5 w-5 items-center justify-center rounded-full ${
                done ? `${color.dot}` : 'bg-glass-bg border border-glass-border'
              }`}>
                {done && (
                  <svg className="w-2.5 h-2.5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                )}
              </div>
              <span className={`text-[10px] font-medium text-center leading-tight ${
                done ? color.text : 'text-text-muted/40'
              }`}>
                {stageShortLabels[stage]}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ═══════════════════ Empty State ═══════════════════ */
function EmptyState() {
  return (
    <div className="glass-card py-16 text-center px-6">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-glass-bg border border-glass-border">
        <svg className="w-7 h-7 text-text-muted/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.25}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      </div>
      <h3 className="text-base font-semibold text-text-primary mb-1.5">No responses yet</h3>
      <p className="text-sm text-text-muted max-w-[30ch] mx-auto leading-relaxed">
        The client hasn&apos;t started their assessment. Share the link to get started.
      </p>
    </div>
  )
}

/* ═══════════════════ Main ═══════════════════ */
export function ResponsesTab({ responses }: ResponsesTabProps) {
  const responseMap = useMemo(() => {
    const map = new Map<string, Response>()
    responses.forEach((r) => map.set(r.stage, r))
    return map
  }, [responses])

  const completedStages = useMemo(
    () => new Set(STAGE_ORDER.filter((s) => responseMap.has(s))),
    [responseMap]
  )

  if (responses.length === 0) return <EmptyState />

  return (
    <div>
      <ProgressHeader completedStages={completedStages} total={STAGE_ORDER.length} />
      <div className="space-y-3">
        {STAGE_ORDER.map((stage, i) => (
          <StageSection
            key={stage}
            stage={stage}
            response={responseMap.get(stage) ?? null}
            defaultExpanded={responseMap.has(stage)}
            index={i}
          />
        ))}
      </div>
    </div>
  )
}
