'use client'

import { GlassCard, StageTag, Tag } from '../ui'
import { InlineEditable } from '../InlineEditable'
import type { SoftwareItem } from '@/lib/types/discovery'

interface TechStackSlideProps {
  softwareStack: SoftwareItem[]
  subtitle?: string
  onEdit?: (field: string, value: string) => void
}

/** Map category labels back to stage_2 field keys */
const categoryFieldMap: Record<string, string> = {
  'CRM / Lead Mgmt': 'crm_tool',
  'Data Storage': 'data_storage',
  'Email & Calendar': 'email_calendar',
  'Project Mgmt & Comms': 'project_management',
  'Accounting & Finance': 'accounting_software',
  'Specialised Software': 'specialised_software',
  'Automation Tools': 'automation_tools',
}

export function TechStackSlide({ softwareStack, subtitle, onEdit }: TechStackSlideProps) {
  const handleEdit = (field: string) => (value: string) => onEdit?.(field, value)

  const gaps = softwareStack.filter(s => s.status === 'gap').length
  const defaultSubtitle = gaps > 0
    ? `${gaps} critical gap${gaps !== 1 ? 's' : ''} create${gaps === 1 ? 's' : ''} immediate automation opportunities.`
    : 'Solid existing foundation provides excellent integration potential.'

  return (
    <section>
      <StageTag color="text-emerald-500">Technology Stack</StageTag>
      <h2 className="font-outfit text-[22px] sm:text-[26px] lg:text-[30px] font-semibold leading-tight tracking-tight">
        Current Tools &amp; Automation Readiness
      </h2>
      <p className="text-[15px] lg:text-base leading-relaxed text-discovery-text-dim max-w-[680px] mt-2 mb-5 lg:mb-7">
        {subtitle ?? defaultSubtitle}
      </p>

      <GlassCard>
        <h3 className="font-outfit text-[15px] lg:text-base font-semibold text-discovery-text mb-4">
          Software Ecosystem
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-2.5">
          {softwareStack.map((item, i) => {
            const isGap = item.status === 'gap'
            const tagColor: 'danger' | 'accent' = isGap ? 'danger' : 'accent'
            const fieldKey = categoryFieldMap[item.category] || item.category

            return (
              <div
                key={i}
                className="px-4 py-3.5 rounded-xl bg-white/[0.02] border border-discovery-border"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-discovery-text-mute uppercase tracking-wider">
                    {item.category}
                  </span>
                  <Tag color={tagColor} size="xs">
                    {isGap ? 'GAP' : 'ACTIVE'}
                  </Tag>
                </div>

                <div className="text-sm font-semibold text-discovery-text">
                  <InlineEditable
                    value={item.tool}
                    onChange={handleEdit(fieldKey)}

                  />
                </div>
              </div>
            )
          })}
        </div>
      </GlassCard>
    </section>
  )
}
