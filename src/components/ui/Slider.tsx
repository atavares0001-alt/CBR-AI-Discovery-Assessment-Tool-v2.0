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
    <div className="question-group">
      <div className="question-group-label">
        <span className="label-dot" />
        <span>{label}</span>
      </div>
      <div className="mt-1">
        <div className="mb-3 text-center">
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
        <div className="mt-1.5 flex justify-between text-xs text-text-muted">
          <span>{leftLabel}</span>
          <span>{rightLabel}</span>
        </div>
      </div>
    </div>
  )
}
