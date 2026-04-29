'use client'

import { useState, useCallback, useEffect } from 'react'
import { GlassCard, StageTag } from '../ui'
import { InlineEditable } from '../InlineEditable'
import type { SoftwareItem } from '@/lib/types/discovery'

interface TechStackSlideProps {
  softwareStack: SoftwareItem[]
  subtitle?: string
  onEdit?: (field: string, value: string) => void
}

/** Map category labels back to stage_2 field keys */
const categoryFieldMap: Record<string, string> = {
  'CRM / Lead Mgmt': 'crm_tool',
  'Data Storage': 'data_storage',
  'Email & Calendar': 'email_calendar',
  'Project Mgmt & Comms': 'project_management',
  'Accounting & Finance': 'accounting_software',
  'Specialised Software': 'specialised_software',
  'Social Media': 'social_media',
  'Website Hosting': 'website_hosting',
  'Automation Tools': 'automation_tools',
}

export function TechStackSlide({ softwareStack, subtitle, onEdit }: TechStackSlideProps) {
  // Track only order — by stable category. Content is read fresh from props.
  const [order, setOrder] = useState<string[]>(() => softwareStack.map(s => s.category))
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  // Reconcile order when categories are added or removed.
  useEffect(() => {
    const currentCats = softwareStack.map(s => s.category)
    const currentSet = new Set(currentCats)
    setOrder(prev => {
      const filtered = prev.filter(c => currentSet.has(c))
      const existing = new Set(filtered)
      const added = currentCats.filter(c => !existing.has(c))
      if (filtered.length === prev.length && added.length === 0) return prev
      return [...filtered, ...added]
    })
  }, [softwareStack])

  // Derived list — always reflects latest prop values.
  const byCategory = new Map(softwareStack.map(s => [s.category, s]))
  const items = order
    .map(c => byCategory.get(c))
    .filter((s): s is SoftwareItem => s !== undefined)

  const handleEdit = (field: string) => (value: string) => onEdit?.(field, value)

  const handleStatusChange = useCallback((index: number, newStatus: 'active' | 'gap' | 'n/a') => {
    const item = items[index]
    if (!item) return
    const fieldKey = categoryFieldMap[item.category] || item.category
    onEdit?.(`${fieldKey}_status`, newStatus)
  }, [items, onEdit])

  const handleDragStart = (index: number) => {
    setDragIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    setDragOverIndex(index)
  }

  const handleDrop = (dropIndex: number) => {
    if (dragIndex === null || dragIndex === dropIndex) {
      setDragIndex(null)
      setDragOverIndex(null)
      return
    }

    const newOrder = [...order]
    const [dragged] = newOrder.splice(dragIndex, 1)
    newOrder.splice(dropIndex, 0, dragged)
    setOrder(newOrder)

    // Persist the new order as category keys
    const keyOrder = newOrder.map(c => categoryFieldMap[c] || c)
    onEdit?.('techstack_order', JSON.stringify(keyOrder))

    setDragIndex(null)
    setDragOverIndex(null)
  }

  const handleDragEnd = () => {
    setDragIndex(null)
    setDragOverIndex(null)
  }

  const gaps = items.filter(s => s.status === 'gap').length
  const defaultSubtitle = gaps > 0
    ? `${gaps} critical gap${gaps !== 1 ? 's' : ''} create${gaps === 1 ? 's' : ''} immediate automation opportunities.`
    : 'Solid existing foundation provides excellent integration potential.'

  return (
    <section>
      <StageTag color="text-emerald-500">Technology Stack</StageTag>
      <h2 className="font-outfit text-[22px] sm:text-[26px] lg:text-[30px] font-semibold leading-tight tracking-tight">
        Current Tools &amp; Automation Readiness
      </h2>
      <p className="text-[15px] lg:text-base leading-relaxed text-discovery-text-dim max-w-[680px] mt-2 mb-5 lg:mb-7">
        {subtitle ?? defaultSubtitle}
      </p>

      <GlassCard>
        <h3 className="font-outfit text-lg lg:text-xl font-semibold text-discovery-text mb-5">
          Software Ecosystem
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-3.5">
          {items.map((item, i) => {
            const isGap = item.status === 'gap'
            const fieldKey = categoryFieldMap[item.category] || item.category
            const isDragging = dragIndex === i
            const isDragOver = dragOverIndex === i

            return (
              <div
                key={`${item.category}-${i}`}
                draggable
                onDragStart={() => handleDragStart(i)}
                onDragOver={(e) => handleDragOver(e, i)}
                onDrop={() => handleDrop(i)}
                onDragEnd={handleDragEnd}
                className={`px-5 py-4 rounded-xl bg-white/[0.02] border transition-all duration-200 cursor-grab active:cursor-grabbing ${
                  isDragging
                    ? 'opacity-50 border-accent/50'
                    : isDragOver
                      ? 'border-accent/40 bg-accent/5'
                      : 'border-discovery-border'
                }`}
              >
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-discovery-text-mute opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16" />
                    </svg>
                    <span className="text-sm font-semibold text-discovery-text-mute uppercase tracking-wider">
                      {item.category}
                    </span>
                  </div>
                  <div className="relative">
                    <select
                      value={item.tool === 'N/A' ? 'n/a' : isGap ? 'gap' : 'active'}
                      onChange={(e) => handleStatusChange(i, e.target.value as 'active' | 'gap' | 'n/a')}
                      className={`appearance-none cursor-pointer rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider border-0 outline-none ${
                        item.tool === 'N/A'
                          ? 'bg-gray-500/15 text-gray-400'
                          : isGap
                            ? 'bg-red-500/15 text-red-400'
                            : 'bg-emerald-500/15 text-emerald-400'
                      }`}
                    >
                      <option value="active">Active</option>
                      <option value="gap">Gap</option>
                      <option value="n/a">N/A</option>
                    </select>
                  </div>
                </div>

                <div className="text-base font-semibold text-discovery-text">
                  <InlineEditable
                    value={item.tool}
                    onChange={handleEdit(fieldKey)}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </GlassCard>
    </section>
  )
}
