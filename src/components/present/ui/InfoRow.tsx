import { type ReactNode } from 'react'
import { IconBadge } from './IconBadge'

interface InfoRowProps {
  icon: ReactNode
  label: string
  value: string
  showBorder?: boolean
}

export function InfoRow({ icon, label, value, showBorder = true }: InfoRowProps) {
  return (
    <div
      className={`
        flex items-center gap-3 py-3
        ${showBorder ? 'border-b border-discovery-border' : ''}
      `}
    >
      <IconBadge size="sm">{icon}</IconBadge>
      <div className="flex-1 min-w-0 flex justify-between gap-2 flex-wrap sm:flex-nowrap">
        <span className="text-sm text-discovery-text-mute font-medium whitespace-nowrap">
          {label}
        </span>
        <span className="text-sm text-discovery-text font-semibold text-right">
          {value}
        </span>
      </div>
    </div>
  )
}
