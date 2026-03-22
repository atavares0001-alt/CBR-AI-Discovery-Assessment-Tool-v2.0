'use client'

import { useRef, useState } from 'react'
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

type OrderedPainPoint = PainPoint & { _id: number }

let nextId = 0

export function PainPointsSlide({
  painPoints,
  title = 'Where Time & Revenue Are Leaking',
  subtitle,
  onEdit,
}: PainPointsSlideProps) {
  const { editMode } = usePresentationContext()
  const defaultSubtitle = `${painPoints.length} critical bottleneck${painPoints.length !== 1 ? 's' : ''} consuming the team's time and costing the business leads.`

  // Local ordered list with stable IDs — preserve manual order across re-renders
  const prevLength = useRef(painPoints.length)
  const [ordered, setOrdered] = useState<OrderedPainPoint[]>(() =>
    painPoints.map((p) => ({ ...p, _id: nextId++ }))
  )

  // Only reset if the number of items changes (new data loaded)
  if (painPoints.length !== prevLength.current) {
    prevLength.current = painPoints.length
    setOrdered(painPoints.map((p) => ({ ...p, _id: nextId++ })))
  }

  // Severity managed here — single source of truth, survives reorders and remounts
  const [severities, setSeverities] = useState<Record<number, number>>(() => {
    const initial: Record<number, number> = {}
    painPoints.forEach((p) => { initial[p.sourceIndex] = p.severity })
    return initial
  })

  const handleSeverityChange = (sourceIndex: number, value: number) => {
    setSeverities(prev => ({ ...prev, [sourceIndex]: value }))
    onEdit?.(`time_drain_${sourceIndex + 1}_severity`, String(value))
  }

  const renderCard = (pain: OrderedPainPoint) => {
    const i = pain.sourceIndex
    return (
      <PainPointCard
        {...pain}
        controlledSeverity={severities[i] ?? pain.severity}
        onEditTitle={onEdit ? (value) => onEdit(`time_drain_${i + 1}`, value) : undefined}
        onEditBusinessImpact={onEdit ? (value) => onEdit(`time_drain_${i + 1}_impact`, value) : undefined}
        onEditCurrentProcess={onEdit ? (value) => onEdit(`time_drain_${i + 1}_process`, value) : undefined}
        onEditSeverity={(value) => handleSeverityChange(i, value)}
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
          values={ordered}
          onReorder={(newOrder) => {
            setOrdered(newOrder)
            onEdit?.('pain_point_order', JSON.stringify(newOrder.map(p => p.sourceIndex)))
          }}
          className="flex flex-col gap-3 lg:gap-4"
        >
          {ordered.map((pain) => (
            <Reorder.Item
              as="div"
              key={pain._id}
              value={pain}
              className="cursor-grab active:cursor-grabbing"
              whileDrag={{ scale: 1.02, boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}
            >
              {renderCard(pain)}
            </Reorder.Item>
          ))}
        </Reorder.Group>
      ) : (
        <div className="flex flex-col gap-3 lg:gap-4">
          {ordered.map((pain) => (
            <div key={pain._id}>
              {renderCard(pain)}
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
