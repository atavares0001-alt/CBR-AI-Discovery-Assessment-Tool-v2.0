'use client'

import { motion } from 'framer-motion'
import type { AssessmentWithResponses } from '@/lib/types/database'
import { ScoreGaugeLarge } from '../visualizations/ScoreGaugeLarge'
import { container, fadeUp } from '../animations'
import { SlideWatermark } from '@/components/ui/Logo'

interface ScoreSlideProps {
  assessment: AssessmentWithResponses
}

import { TwoColumnSlide } from '../layout/TwoColumnSlide'

function getInterpretation(score: number): { text: string; color: string } {
  if (score >= 70) return { text: 'Strong digital foundation', color: '#10b981' }
  if (score >= 40) return { text: 'Room for improvement', color: '#f59e0b' }
  return { text: 'Early stage — high potential', color: '#ef4444' }
}

export function ScoreSlide({ assessment }: ScoreSlideProps) {
  const score = assessment.ai_readiness_score

  if (!score) {
    return (
      <div className="flex w-full items-center justify-center">
        <div className="glass-card rounded-2xl px-8 py-10 text-center sm:px-12">
          <p className="text-base text-text-secondary">
            Score has not yet been calculated.
          </p>
        </div>
      </div>
    )
  }

  const overall = getInterpretation(score.overall)
  const digital = getInterpretation(score.digital_maturity)
  const automation = getInterpretation(score.automation_potential)

  return (
    <TwoColumnSlide
      title="AI Readiness Score"
      subtitle="Based on your current technology stack, workflows, and automation maturity."
      icon={
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
        </svg>
      }
    >
      <div className="flex w-full flex-col gap-10">
        
        {/* Main Hero Metric (Overall) spanning full width */}
        <div className="glass-card-glow relative flex flex-col items-center rounded-3xl p-8 sm:p-12">
          {/* subtle radial behind the gauge */}
          <div className="pointer-events-none absolute inset-0 rounded-3xl" style={{ background: 'radial-gradient(ellipse, rgba(16,185,129,0.1), transparent 70%)' }} />
          <div className="w-56 sm:w-72 lg:w-80 relative z-10">
            <ScoreGaugeLarge value={score.overall} max={100} label="Overall Match" />
          </div>
          <p className="mt-2 text-lg font-semibold tracking-wide sm:text-xl relative z-10" style={{ color: overall.color }}>
            {overall.text}
          </p>
        </div>

        {/* Flanking Metrics in a sub-grid */}
        <div className="grid grid-cols-2 gap-6">
          <div className="glass-card flex flex-col items-center justify-center rounded-2xl p-6 sm:p-8">
            <div className="w-32 sm:w-40 lg:w-48">
              <ScoreGaugeLarge value={score.digital_maturity} max={100} label="Digital Maturity" />
            </div>
            <p className="mt-2 text-center text-sm font-medium" style={{ color: digital.color }}>
              {digital.text}
            </p>
          </div>

          <div className="glass-card flex flex-col items-center justify-center rounded-2xl p-6 sm:p-8">
            <div className="w-32 sm:w-40 lg:w-48">
              <ScoreGaugeLarge value={score.automation_potential} max={100} label="Automation Potential" />
            </div>
            <p className="mt-2 text-center text-sm font-medium" style={{ color: automation.color }}>
              {automation.text}
            </p>
          </div>
        </div>

      </div>
    </TwoColumnSlide>
  )
}
