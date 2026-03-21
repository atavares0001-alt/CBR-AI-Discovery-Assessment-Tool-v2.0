import { type ReactNode } from 'react'

interface IconBadgeProps {
  children: ReactNode
  size?: 'sm' | 'md' | 'lg'
  color?: 'accent' | 'warm' | 'danger'
  className?: string
}

const sizeMap = {
  sm: 'w-[34px] h-[34px] rounded-lg',
  md: 'w-11 h-11 rounded-xl',
  lg: 'w-12 h-12 rounded-xl',
}

const colorMap = {
  accent: 'bg-emerald-500/8 border-emerald-500/12',
  warm: 'bg-amber-500/8 border-amber-500/12',
  danger: 'bg-red-500/8 border-red-500/12',
}

export function IconBadge({ children, size = 'md', color = 'accent', className = '' }: IconBadgeProps) {
  return (
    <div
      className={`
        flex items-center justify-center shrink-0 border
        ${sizeMap[size]} ${colorMap[color]} ${className}
      `}
      aria-hidden="true"
    >
      {children}
    </div>
  )
}
