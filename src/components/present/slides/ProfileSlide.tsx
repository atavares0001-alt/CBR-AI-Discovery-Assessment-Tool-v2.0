'use client'

import { GlassCard, StageTag, ProductCard, SlideIcon } from '../ui'
import { InlineEditable } from '../InlineEditable'
import type { ProductItem } from '@/lib/types/discovery'

interface ProfileSlideProps {
  businessName: string
  description: string
  industry: string
  employeeRange: string
  contactName: string
  isDecisionMaker: boolean
  growthStage?: string
  targetClients?: string
  whatWeDo?: string
  keyDifferentiator?: string
  products: ProductItem[]
  onEdit?: (field: string, value: string) => void
}

export function ProfileSlide({
  businessName, description, industry, employeeRange,
  contactName, isDecisionMaker, growthStage, targetClients,
  whatWeDo, keyDifferentiator, products, onEdit,
}: ProfileSlideProps) {
  const handleEdit = (field: string) => (value: string) => onEdit?.(field, value)

  const contactLabel = isDecisionMaker
    ? `${contactName} (Decision Maker)`
    : contactName

  return (
    <section>
      <StageTag>Business Profile</StageTag>
      <h2 className="font-outfit text-[22px] sm:text-[26px] lg:text-[30px] font-semibold leading-tight tracking-tight mb-5 lg:mb-7">
        <InlineEditable
          value={businessName}
          onChange={handleEdit('business_name')}

        />
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5">
        <GlassCard>
          <h3 className="font-outfit text-[15px] lg:text-base font-semibold text-discovery-text mb-4 flex items-center gap-2">
            <SlideIcon name="building" color="accent" /> Company Overview
          </h3>
          <div className="border border-discovery-border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <tbody>
                {[
                  { label: 'Industry', value: industry, field: 'industry', icon: <SlideIcon name="chart" color="accent" /> },
                  { label: 'Employees', value: employeeRange, field: 'employee_count', icon: <SlideIcon name="bolt" color="accent-light" /> },
                  { label: 'Contact', value: contactLabel, field: 'client_name', icon: <SlideIcon name="shield" color="accent" /> },
                  ...(growthStage ? [{ label: 'Growth Stage', value: growthStage, field: 'growth_stage', icon: <SlideIcon name="rocket" color="accent" /> }] : []),
                  { label: 'Target Clients', value: targetClients ?? '\u2014', field: 'target_clients', icon: <SlideIcon name="chat" color="accent-light" /> },
                ].map((row, i, arr) => (
                  <tr key={i} className={i < arr.length - 1 ? 'border-b border-discovery-border' : ''}>
                    <td className="px-3 py-4 sm:py-3 border-r border-discovery-border w-10">
                      <span className="flex items-center justify-center">{row.icon}</span>
                    </td>
                    <td className="px-4 py-4 sm:py-3 border-r border-discovery-border text-discovery-text-mute font-medium whitespace-nowrap w-[120px]">
                      {row.label}
                    </td>
                    <td className="px-4 py-4 sm:py-3 text-discovery-text font-semibold">
                      <InlineEditable
                        value={row.value}
                        onChange={handleEdit(row.field)}

                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>

        <GlassCard>
          <h3 className="font-outfit text-[15px] lg:text-base font-semibold text-discovery-text mb-4 flex items-center gap-2">
            <SlideIcon name="rocket" color="accent" /> What We Do
          </h3>
          <div className="text-[13px] lg:text-sm leading-relaxed text-discovery-text-dim mb-4">
            <InlineEditable
              value={whatWeDo || ''}
              onChange={handleEdit('business_purpose')}
              fieldType="textarea"

            />
          </div>
          {keyDifferentiator && (
            <div className="p-3.5 lg:p-4 bg-emerald-500/[0.06] rounded-lg border border-emerald-500/[0.15]">
              <div className="text-[13px] font-bold text-discovery-accent mb-1.5">
                Key Differentiator
              </div>
              <div className="text-[13px] text-discovery-text-dim leading-relaxed">
                <InlineEditable
                  value={keyDifferentiator}
                  onChange={handleEdit('key_differentiator')}
                  fieldType="textarea"

                />
              </div>
            </div>
          )}
        </GlassCard>
      </div>

      {products.length > 0 && (
        <GlassCard className="mt-4 lg:mt-5">
          <h3 className="font-outfit text-[15px] lg:text-base font-semibold text-discovery-text mb-4 flex items-center gap-2">
            <SlideIcon name="chart" color="accent" /> Products &amp; Services
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-4">
            {products.map((product, i) => (
              <ProductCard key={i} {...product} />
            ))}
          </div>
        </GlassCard>
      )}
    </section>
  )
}
