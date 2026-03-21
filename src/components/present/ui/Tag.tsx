import { type ReactNode } from 'react'

type TagColor = 'accent' | 'accent-light' | 'warm' | 'danger' | 'mute'

const colorMap: Record<TagColor, { text: string; bg: string; border: string }> = {
  accent:        { text: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  'accent-light': { text: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20' },
  warm:          { text: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  danger:        { text: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20' },
  mute:          { text: 'text-white/65', bg: 'bg-white/5', border: 'border-white/10' },
}

interface TagProps {
  children: ReactNode
  color?: TagColor
  size?: 'sm' | 'xs'
  className?: string
}

export function Tag({ children, color = 'accent', size = 'sm', className = '' }: TagProps) {
  const c = colorMap[color]
  const sizeClasses = size === 'xs'
    ? 'text-[10px] px-2 py-0.5 tracking-wide'
    : 'text-[11px] px-2.5 py-1 tracking-wider'

  return (
    <span
      className={`
        inline-block font-bold uppercase rounded-md border
        ${c.text} ${c.bg} ${c.border}
        ${sizeClasses}
        ${className}
      `}
    >
      {children}
    </span>
  )
}
