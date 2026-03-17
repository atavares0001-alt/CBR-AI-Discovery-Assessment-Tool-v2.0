'use client'

interface SliderProps {
  label: string
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  leftLabel?: string
  rightLabel?: string
  id?: string
}

export function Slider({
  label,
  value,
  onChange,
  min = 1,
  max = 10,
  leftLabel = 'None',
  rightLabel = 'Constant',
  id,
}: SliderProps) {
  const percentage = ((value - min) / (max - min)) * 100

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-text-secondary">
        {label}
      </label>
      <div className="glass-card px-4 py-4">
        <div className="mb-2 text-center">
          <span className="font-mono text-2xl font-bold text-accent">{value}</span>
        </div>
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="slider-input w-full"
          style={{
            background: `linear-gradient(to right, #10b981 0%, #10b981 ${percentage}%, rgba(255,255,255,0.1) ${percentage}%, rgba(255,255,255,0.1) 100%)`,
          }}
        />
        <div className="mt-1 flex justify-between text-xs text-text-muted">
          <span>{leftLabel}</span>
          <span>{rightLabel}</span>
        </div>
      </div>
    </div>
  )
}
