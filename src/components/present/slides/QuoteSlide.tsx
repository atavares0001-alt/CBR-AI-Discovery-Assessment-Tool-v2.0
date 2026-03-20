'use client'

import { motion } from 'framer-motion'
import type { AssessmentWithResponses } from '@/lib/types/database'
import { PricingTable } from '../visualizations/PricingTable'
import { container, fadeUp } from '../animations'
import { SlideWatermark } from '@/components/ui/Logo'

interface QuoteSlideProps {
  assessment: AssessmentWithResponses
}

import { TwoColumnSlide } from '../layout/TwoColumnSlide'

export function QuoteSlide({ assessment }: QuoteSlideProps) {
  const s7 = assessment.stage_7_data

  if (!s7) {
    return (
      <div className="flex w-full items-center justify-center">
        <div className="glass-card rounded-2xl px-12 py-10 text-center">
          <p className="text-lg leading-relaxed text-text-secondary">
            A quote has not yet been prepared for this assessment.
          </p>
        </div>
      </div>
    )
  }

  return (
    <TwoColumnSlide
      title="Investment Proposal"
      subtitle="Transparent pricing and deliverables for your tailored automation and tech stack upgrade."
      icon={
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      }
    >
      <div className="flex w-full flex-col gap-6">
        <div className="w-full">
          <PricingTable stage7Data={s7} />
        </div>
      </div>
    </TwoColumnSlide>
  )
}
