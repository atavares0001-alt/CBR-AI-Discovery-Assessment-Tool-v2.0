interface MetaFieldProps {
  label: string
  value: string
}

export function MetaField({ label, value }: MetaFieldProps) {
  return (
    <div>
      <div className="text-[11px] text-discovery-text-mute font-semibold uppercase tracking-wider mb-1">
        {label}
      </div>
      <div className="text-sm text-discovery-text font-semibold">
        {value}
      </div>
    </div>
  )
}
