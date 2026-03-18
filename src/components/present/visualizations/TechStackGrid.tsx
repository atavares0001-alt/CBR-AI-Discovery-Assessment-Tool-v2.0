'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { container, scaleIn } from '../animations'

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
  'dropbox', 'onedrive', 'icloud',
]

function getToolStatus(value: string): 'cloud' | 'none' | 'other' {
  if (!value || value.toLowerCase() === 'none') return 'none'
  const lower = value.toLowerCase()
  if (CLOUD_KEYWORDS.some((kw) => lower.includes(kw))) return 'cloud'
  return 'other'
}

function getBorderClass(status: 'cloud' | 'none' | 'other'): string {
  switch (status) {
    case 'cloud':
      return 'border-l-emerald-500'
    case 'other':
      return 'border-l-amber-500'
    case 'none':
      return 'border-l-white/10'
  }
}

function getAccentColor(status: 'cloud' | 'none' | 'other'): string {
  switch (status) {
    case 'cloud':
      return 'text-emerald-400'
    case 'other':
      return 'text-amber-400'
    case 'none':
      return 'text-white/30'
  }
}

export function TechStackGrid({ tools }: TechStackGridProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <div ref={ref}>
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        variants={container}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
      >
        {tools.map((tool) => {
          const status = getToolStatus(tool.value)
          const isEmpty = status === 'none'

          return (
            <motion.div
              key={tool.name}
              className={`glass-card rounded-xl border-l-4 ${getBorderClass(status)} px-4 py-4 ${isEmpty ? 'opacity-50' : ''}`}
              variants={scaleIn}
            >
              {/* Category label */}
              <p className="text-[10px] font-semibold uppercase tracking-widest text-white/40 mb-1">
                {tool.category}
              </p>

              {/* Tool name / field label */}
              <p className="text-sm font-semibold text-white truncate">
                {tool.name}
              </p>

              {/* Value */}
              <p
                className={`mt-1 text-base font-medium truncate ${
                  isEmpty ? 'text-white/25 italic' : getAccentColor(status)
                }`}
              >
                {isEmpty ? (tool.value || 'None') : tool.value}
              </p>
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}
