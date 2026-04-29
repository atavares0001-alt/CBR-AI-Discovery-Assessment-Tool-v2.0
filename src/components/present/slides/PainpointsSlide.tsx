'use client'

import { useEffect, useState } from 'react'
import { Reorder } from 'framer-motion'
import { StageTag, PainPointCard } from '../ui'
import { usePresentationContext } from '../PresentationShell'
import type { PainPoint } from '@/lib/types/discovery'

interface PainPointsSlideProps {
  painPoints: PainPoint[]
  title?: string
  subtitle?: string
  onEdit?: (field: string, value: string) => void
}

export function PainPointsSlide({
  painPoints,
  title = 'Where Time & Revenue Are Leaking',
  subtitle,
  onEdit,
}: PainPointsSlideProps) {
  const { editMode } = usePresentationContext()
  const defaultSubtitle = `${painPoints.length} critical bottleneck${painPoints.length !== 1 ? 's' : ''} consuming the team's time and costing the business leads.`

  // Track only the order — by stable sourceIndex. Content is read fresh from props.
  const [orderIds, setOrderIds] = useState<number[]>(() => painPoints.map(p => p.sourceIndex))

  // Reconcile order when items are added or removed.
  useEffect(() => {
    const currentIds = painPoints.map(p => p.sourceIndex)
    const currentSet = new Set(currentIds)
    setOrderIds(prev => {
      const filtered = prev.filter(id => currentSet.has(id))
      const existing = new Set(filtered)
      const added = currentIds.filter(id => !existing.has(id))
      if (filtered.length === prev.length && added.length === 0) return prev
      return [...filtered, ...added]
    })
  }, [painPoints])

  // Derived list — always reflects latest prop values.
  const bySource = new Map(painPoints.map(p => [p.sourceIndex, p]))
  const rendered = orderIds
    .map(id => bySource.get(id))
    .filter((p): p is PainPoint => p !== undefined)

  const renderCard = (pain: PainPoint) => {
    const i = pain.sourceIndex
    return (
      <PainPointCard
        {...pain}
        controlledSeverity={pain.severity}
        onEditTitle={onEdit ? (value) => onEdit(`time_drain_${i + 1}`, value) : undefined}
        onEditBusinessImpact={onEdit ? (value) => onEdit(`time_drain_${i + 1}_impact`, value) : undefined}
        onEditCurrentProcess={onEdit ? (value) => onEdit(`time_drain_${i + 1}_process`, value) : undefined}
        onEditSeverity={(value) => onEdit?.(`time_drain_${i + 1}_severity`, String(value))}
      />
    )
  }

  return (
    <section>
      <StageTag color="text-red-500">How Things Run Today</StageTag>
      <h2 className="font-outfit text-[22px] sm:text-[26px] lg:text-[30px] font-semibold leading-tight tracking-tight">
        {title}
      </h2>
      <p className="text-[15px] lg:text-base leading-relaxed text-discovery-text-dim max-w-[680px] mt-2 mb-5 lg:mb-7">
        {subtitle ?? defaultSubtitle}
      </p>

      {editMode ? (
        <Reorder.Group
          as="div"
          axis="y"
          values={orderIds}
          onReorder={(newOrder) => {
            setOrderIds(newOrder)
            onEdit?.('pain_point_order', JSON.stringify(newOrder))
          }}
          className="flex flex-col gap-3 lg:gap-4"
        >
          {rendered.map((pain) => (
            <Reorder.Item
              as="div"
              key={pain.sourceIndex}
              value={pain.sourceIndex}
              className="cursor-grab active:cursor-grabbing"
              whileDrag={{ scale: 1.02, boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}
            >
              {renderCard(pain)}
            </Reorder.Item>
          ))}
        </Reorder.Group>
      ) : (
        <div className="flex flex-col gap-3 lg:gap-4">
          {rendered.map((pain) => (
            <div key={pain.sourceIndex}>
              {renderCard(pain)}
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
