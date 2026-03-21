'use client'

import { GlassCard, StageTag, InfoRow, ProductCard, SlideIcon } from '../ui'
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
}

export function ProfileSlide({
  businessName, description, industry, employeeRange,
  contactName, isDecisionMaker, growthStage, targetClients,
  whatWeDo, keyDifferentiator, products,
}: ProfileSlideProps) {
  const contactLabel = isDecisionMaker
    ? `${contactName} (Decision Maker)`
    : contactName

  return (
    <section>
      <StageTag>Stage 1 — Business Profile</StageTag>
      <h2 className="font-outfit text-[22px] sm:text-[26px] lg:text-[30px] font-semibold leading-tight tracking-tight">
        {businessName}
      </h2>
      <p className="text-[15px] lg:text-base leading-relaxed text-discovery-text-dim max-w-[680px] mt-2 mb-5 lg:mb-7">
        {description}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5">
        <GlassCard>
          <h3 className="font-outfit text-[15px] lg:text-base font-semibold text-discovery-text mb-4 flex items-center gap-2">
            <SlideIcon name="building" color="accent" /> Company Overview
          </h3>
          <div className="border border-discovery-border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <tbody>
                {[
                  { icon: <SlideIcon name="chart" color="accent" />, label: 'Industry', value: industry },
                  { icon: <SlideIcon name="bolt" color="accent-light" />, label: 'Employees', value: employeeRange },
                  { icon: <SlideIcon name="shield" color="accent" />, label: 'Contact', value: contactLabel },
                  ...(growthStage ? [{ icon: <SlideIcon name="rocket" color="accent" />, label: 'Growth Stage', value: growthStage }] : []),
                  { icon: <SlideIcon name="chat" color="accent-light" />, label: 'Target Clients', value: targetClients ?? '\u2014' },
                ].map((row, i, arr) => (
                  <tr key={i} className={i < arr.length - 1 ? 'border-b border-discovery-border' : ''}>
                    <td className="px-3 py-3 border-r border-discovery-border w-10">
                      <span className="flex items-center justify-center">{row.icon}</span>
                    </td>
                    <td className="px-4 py-3 border-r border-discovery-border text-discovery-text-mute font-medium whitespace-nowrap w-[120px]">
                      {row.label}
                    </td>
                    <td className="px-4 py-3 text-discovery-text font-semibold">
                      {row.value}
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
          {whatWeDo && (
            <p className="text-[13px] lg:text-sm leading-relaxed text-discovery-text-dim mb-4">
              {whatWeDo}
            </p>
          )}
          {keyDifferentiator && (
            <div className="p-3.5 lg:p-4 bg-emerald-500/[0.06] rounded-lg border border-emerald-500/[0.15]">
              <div className="text-[13px] font-bold text-discovery-accent mb-1.5">
                Key Differentiator
              </div>
              <div className="text-[13px] text-discovery-text-dim leading-relaxed">
                {keyDifferentiator}
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
