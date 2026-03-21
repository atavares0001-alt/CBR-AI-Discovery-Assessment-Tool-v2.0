'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { container } from '../animations'

interface TechTool {
  name: string
  category: string
  value: string
}

interface TechStackGridProps {
  tools: TechTool[]
}

const CLOUD_KEYWORDS = [
  'google', 'microsoft', 'office 365', 'workspace', 'slack', 'asana',
  'monday', 'trello', 'hubspot', 'salesforce', 'xero', 'myob',
  'dropbox', 'onedrive', 'icloud', 'notion', 'teams', 'zoom',
  'calendly', 'servicem8', 'quickbooks',
]

function getToolStatus(value: string): 'cloud' | 'none' | 'other' {
  if (!value || value.toLowerCase() === 'none') return 'none'
  const lower = value.toLowerCase()
  if (CLOUD_KEYWORDS.some((kw) => lower.includes(kw))) return 'cloud'
  return 'other'
}

const STATUS_CONFIG = {
  cloud: {
    border: 'border-emerald-500/40',
    bg: 'bg-emerald-500/[0.06]',
    glow: '0 0 20px rgba(16,185,129,0.08)',
    icon: '🟢',
    iconColor: 'text-emerald-400',
    valueColor: 'text-emerald-300',
    label: 'Cloud / Modern',
  },
  other: {
    border: 'border-amber-500/40',
    bg: 'bg-amber-500/[0.06]',
    glow: '0 0 20px rgba(245,158,11,0.08)',
    icon: '🟡',
    iconColor: 'text-amber-400',
    valueColor: 'text-amber-300',
    label: 'Other / Legacy',
  },
  none: {
    border: 'border-white/[0.06]',
    bg: 'bg-white/[0.02]',
    glow: 'none',
    icon: '⚫',
    iconColor: 'text-white/20',
    valueColor: 'text-white/25',
    label: 'Not in use',
  },
} as const

const CATEGORY_ICONS: Record<string, string> = {
  Communication: 'M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75',
  CRM: 'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z',
  'Project Management': 'M6 6.878V6a2.25 2.25 0 012.25-2.25h7.5A2.25 2.25 0 0118 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 004.5 9v.878m13.5-3A2.25 2.25 0 0119.5 9v.878m0 0a2.246 2.246 0 00-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0121 12v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6c0-.98.626-1.813 1.5-2.122',
  'Data Storage': 'M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125',
  Specialised: 'M11.42 15.17l-5.658-5.66a1.21 1.21 0 010-1.713L11.42 2.14a1.21 1.21 0 011.714 0l5.657 5.657a1.21 1.21 0 010 1.714L13.134 15.17a1.21 1.21 0 01-1.714 0zM4.308 18.789l2.074-2.074m6.236 6.236l2.074-2.074',
}

import { FaMicrosoft } from 'react-icons/fa'
import {
  SiGoogle, SiSlack, SiAsana, SiTrello,
  SiHubspot, SiSalesforce, SiXero, SiDropbox, SiNotion,
  SiZoom, SiCalendly
} from 'react-icons/si'

function getBrandIcon(value: string) {
  const v = value.toLowerCase()
  if (v.includes('google') || v.includes('workspace')) return SiGoogle
  if (v.includes('microsoft') || v.includes('office 365') || v.includes('teams')) return FaMicrosoft
  if (v.includes('slack')) return SiSlack
  if (v.includes('asana')) return SiAsana
  if (v.includes('trello')) return SiTrello
  if (v.includes('hubspot')) return SiHubspot
  if (v.includes('salesforce')) return SiSalesforce
  if (v.includes('xero')) return SiXero
  if (v.includes('dropbox') || v.includes('onedrive')) return SiDropbox
  if (v.includes('notion')) return SiNotion
  if (v.includes('zoom')) return SiZoom
  if (v.includes('calendly')) return SiCalendly
  return null
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const cardItemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
}

export function TechStackGrid({ tools }: TechStackGridProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <div ref={ref}>
      <motion.div
        className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-5"
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
      >
        {tools.map((tool, i) => {
          const status = getToolStatus(tool.value)
          const config = STATUS_CONFIG[status]
          const isEmpty = status === 'none'
          const iconPath = CATEGORY_ICONS[tool.category]
          const BrandIcon = getBrandIcon(tool.value)

          return (
            <motion.div
              key={tool.name}
              className={`group relative overflow-hidden rounded-2xl border ${config.border} ${config.bg} p-5 transition-transform duration-300 hover:-translate-y-1 sm:p-6 ${isEmpty ? 'opacity-60' : ''}`}
              style={{ boxShadow: config.glow }}
              variants={cardItemVariants}
            >
              {/* Subtle gradient overlay */}
              {!isEmpty && (
                <div
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    background: status === 'cloud'
                      ? 'linear-gradient(135deg, rgba(16,185,129,0.06) 0%, transparent 60%)'
                      : 'linear-gradient(135deg, rgba(245,158,11,0.06) 0%, transparent 60%)',
                  }}
                />
              )}

              {/* Header row */}
              <div className="relative flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  {/* Category icon */}
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${isEmpty ? 'bg-white/[0.04]' : status === 'cloud' ? 'bg-emerald-500/10' : 'bg-amber-500/10'}`}>
                    {BrandIcon ? (
                      <BrandIcon className={`h-5 w-5 ${config.iconColor}`} />
                    ) : iconPath ? (
                      <svg
                        className={`h-5 w-5 ${isEmpty ? 'text-white/20' : config.iconColor}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d={iconPath} />
                      </svg>
                    ) : (
                      <span className="text-sm">{config.icon}</span>
                    )}
                  </div>

                  <div>
                    {/* Category label */}
                    <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/35">
                      {tool.category}
                    </p>
                    {/* Field label */}
                    <p className="text-lg font-semibold text-white/90 sm:text-xl">
                      {tool.name}
                    </p>
                  </div>
                </div>

                {/* Status indicator dot */}
                <div className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${status === 'cloud' ? 'bg-emerald-400 drop-shadow-[0_0_4px_rgba(52,211,153,0.8)]' : status === 'other' ? 'bg-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.8)]' : 'bg-white/15'}`} />
              </div>

              {/* Value */}
              <div className="relative mt-4 rounded-xl bg-white/[0.03] px-4 py-3 border border-white/[0.02]">
                <p className={`text-base font-medium ${isEmpty ? 'italic text-white/25' : config.valueColor}`}>
                  {isEmpty ? 'Not configured' : tool.value}
                </p>
              </div>
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}
