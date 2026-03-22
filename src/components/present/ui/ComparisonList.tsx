import { InlineEditable } from '../InlineEditable'

interface ComparisonListProps {
  items: string[]
  variant: 'before' | 'after'
  onEditItem?: (index: number, value: string) => void
}

export function ComparisonList({ items, variant, onEditItem }: ComparisonListProps) {
  const isBefore = variant === 'before'

  return (
    <div className="space-y-2.5">
      {items.map((item, i) => (
        <div key={i} className="flex gap-2.5 items-start">
          {isBefore ? (
            <span className="text-red-500 text-sm mt-0.5 shrink-0" aria-hidden="true">&#x2715;</span>
          ) : (
            <svg
              className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          )}
          <span
            className={`text-sm leading-relaxed ${
              isBefore ? 'text-discovery-text-dim' : 'text-discovery-text'
            }`}
          >
            {onEditItem ? (
              <InlineEditable
                value={item}
                onChange={(value) => onEditItem(i, value)}
                fieldType="textarea"
              />
            ) : (
              item
            )}
          </span>
        </div>
      ))}
    </div>
  )
}
