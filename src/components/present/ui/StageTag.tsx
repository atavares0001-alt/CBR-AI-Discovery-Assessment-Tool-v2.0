interface StageTagProps {
  children: string
  color?: string
}

export function StageTag({ children, color = 'text-discovery-accent' }: StageTagProps) {
  return (
    <div
      className={`
        inline-block text-lg sm:text-2xl font-bold tracking-widest uppercase
        px-3.5 py-1.5 rounded-md mb-3.5
        ${color}
        bg-emerald-500/10 border border-emerald-500/20
      `}
    >
      {children}
    </div>
  )
}
