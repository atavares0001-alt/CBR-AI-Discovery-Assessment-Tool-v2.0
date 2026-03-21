import { type ReactNode } from 'react'

interface GlassCardProps {
  children: ReactNode
  className?: string
  hoverable?: boolean
  borderColor?: string
}

export function GlassCard({ children, className = '', hoverable = true, borderColor }: GlassCardProps) {
  return (
    <div
      className={`
        bg-discovery-glass backdrop-blur-glass
        border border-discovery-border rounded-glass-sm lg:rounded-glass
        p-5 lg:p-7 shadow-glass-glow
        transition-all duration-300
        ${hoverable ? 'card-hover' : ''}
        ${borderColor ?? ''}
        ${className}
      `}
    >
      {children}
    </div>
  )
}
