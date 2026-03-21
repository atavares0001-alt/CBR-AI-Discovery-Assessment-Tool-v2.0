import { Tag } from './Tag'
import type { ProductItem } from '@/lib/types/discovery'

interface ProductCardProps extends ProductItem {}

const typeColorMap: Record<string, 'accent' | 'accent-light' | 'warm'> = {
  core: 'accent',
  product: 'accent-light',
  service: 'warm',
}

export function ProductCard({ title, description, type }: ProductCardProps) {
  const color = typeColorMap[type] ?? 'accent'

  return (
    <div className="p-4 lg:p-5 rounded-xl bg-white/[0.02] border border-discovery-border">
      <div className="flex items-center gap-2 mb-2.5">
        <Tag color={color} size="xs">
          {type}
        </Tag>
      </div>
      <h4 className="font-outfit text-[15px] lg:text-base font-semibold text-discovery-text mb-2">
        {title}
      </h4>
      <p className="text-[13px] leading-relaxed text-discovery-text-dim">
        {description}
      </p>
    </div>
  )
}
