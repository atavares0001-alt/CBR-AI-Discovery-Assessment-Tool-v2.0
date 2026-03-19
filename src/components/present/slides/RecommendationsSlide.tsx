'use client'

import { motion } from 'framer-motion'
import type { AssessmentWithResponses } from '@/lib/types/database'
import { InlineEditable } from '../InlineEditable'
import { usePresentationContext } from '../PresentationShell'
import { container, fadeUp } from '../animations'
import { SlideWatermark } from '@/components/ui/Logo'

interface RecommendationsSlideProps {
  assessment: AssessmentWithResponses
}

function SectionHeader({ icon, label, accent }: { icon: string; label: string; accent?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${accent ? 'bg-accent/10' : 'bg-white/[0.06]'}`}>
        <svg className={`h-4 w-4 ${accent ? 'text-accent' : 'text-text-muted'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
        </svg>
      </div>
      <h3 className={`slide-section-label ${accent ? 'text-accent' : ''}`}>{label}</h3>
    </div>
  )
}

export function RecommendationsSlide({ assessment }: RecommendationsSlideProps) {
  const { onFieldChange } = usePresentationContext()
  const s6 = assessment.stage_6_data

  if (!s6) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 sm:px-6 md:px-8">
        <div className="glass-card rounded-2xl px-8 py-10 text-center sm:px-12">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10">
            <svg className="h-7 w-7 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
            </svg>
          </div>
          <h2 className="font-display text-2xl font-bold text-text-primary sm:text-3xl">
            Recommendations
          </h2>
          <p className="mt-4 text-base leading-relaxed text-text-secondary">
            Recommendations have not yet been added to this assessment.
          </p>
        </div>
      </div>
    )
  }

  const services = s6.recommended_services || []

  return (
    <div className="relative flex min-h-screen flex-col justify-center px-4 py-10 sm:px-6 md:px-8 md:py-16 lg:px-16">
      <SlideWatermark />
      <motion.div
        className="mx-auto w-full max-w-6xl"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        {/* Title */}
        <motion.h2
          className="font-display text-3xl font-bold tracking-tight text-text-primary sm:text-4xl md:text-5xl"
          variants={fadeUp}
          style={{ textWrap: 'balance' } as React.CSSProperties}
        >
          Recommendations
        </motion.h2>

        {/* Executive summary — callout with left emerald border */}
        <motion.div className="mt-8 sm:mt-10" variants={fadeUp}>
          <div className="glass-card card-accent-left rounded-2xl px-6 py-6 sm:px-8 sm:py-7">
            <SectionHeader
              icon="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
              label="Executive Summary"
            />
            <div className="mt-4 text-base leading-relaxed text-text-primary sm:text-lg">
              <InlineEditable
                value={s6.executive_summary || ''}
                onChange={(v) =>
                  onFieldChange('stage_6', 'executive_summary', v)
                }
                fieldType="textarea"
                placeholder="Executive summary not provided"
              />
            </div>
          </div>
        </motion.div>

        {/* Two-column layout for solution + automation logic */}
        <motion.div className="mt-6 grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2" variants={fadeUp}>
          {/* Recommended solution */}
          <div className="glass-card rounded-2xl px-6 py-6 sm:px-8 sm:py-7">
            <SectionHeader
              icon="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z"
              label="Recommended Solution"
              accent
            />
            <div className="mt-4 text-lg font-semibold leading-relaxed text-text-primary sm:text-xl">
              <InlineEditable
                value={s6.recommended_solution || ''}
                onChange={(v) =>
                  onFieldChange('stage_6', 'recommended_solution', v)
                }
                fieldType="textarea"
                placeholder="Solution not specified"
              />
            </div>
          </div>

          {/* Automation logic */}
          <div className="glass-card rounded-2xl px-6 py-6 sm:px-8 sm:py-7">
            <SectionHeader
              icon="M11.42 15.17l-5.645-5.645a4.5 4.5 0 010-6.364 4.5 4.5 0 016.364 0l.707.707.707-.707a4.5 4.5 0 016.364 0 4.5 4.5 0 010 6.364L13.414 15.17a2 2 0 01-2.828 0z"
              label="Automation Logic"
            />
            <div className="mt-4 text-sm leading-relaxed text-text-secondary sm:text-base">
              <InlineEditable
                value={s6.automation_logic || ''}
                onChange={(v) =>
                  onFieldChange('stage_6', 'automation_logic', v)
                }
                fieldType="textarea"
                placeholder="Automation logic not specified"
              />
            </div>
          </div>
        </motion.div>

        {/* Key benefit — shimmer highlight card */}
        <motion.div className="mt-6" variants={fadeUp}>
          <div className="glass-card-glow shimmer-bg relative overflow-hidden rounded-2xl px-6 py-7 sm:px-8 sm:py-8">
            <div className="relative">
              <SectionHeader
                icon="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                label="Key Benefit"
                accent
              />
              <div className="mt-4 text-lg font-medium leading-relaxed text-text-primary sm:text-xl md:text-2xl">
                <InlineEditable
                  value={s6.key_benefit || ''}
                  onChange={(v) =>
                    onFieldChange('stage_6', 'key_benefit', v)
                  }
                  fieldType="textarea"
                  placeholder="Key benefit not specified"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Recommended services — badge pills */}
        {services.length > 0 && (
          <motion.div className="mt-6 sm:mt-8" variants={fadeUp}>
            <div className="mb-3 flex items-center gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.06]">
                <svg className="h-4 w-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
                </svg>
              </div>
              <h3 className="slide-section-label">Recommended Services</h3>
            </div>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {services.map((service, i) => (
                <span
                  key={i}
                  className="inline-block rounded-full border border-accent/20 bg-accent/[0.06] px-4 py-1.5 text-sm font-medium text-accent sm:px-5 sm:py-2"
                >
                  {service}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Detailed recommendations */}
        {s6.detailed_recommendations && (
          <motion.div className="mt-6" variants={fadeUp}>
            <div className="glass-card rounded-2xl px-6 py-6 sm:px-8 sm:py-7">
              <SectionHeader
                icon="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                label="Detailed Recommendations"
              />
              <div className="mt-4 text-sm leading-relaxed text-text-secondary sm:text-base">
                <InlineEditable
                  value={s6.detailed_recommendations}
                  onChange={(v) =>
                    onFieldChange('stage_6', 'detailed_recommendations', v)
                  }
                  fieldType="textarea"
                  placeholder="Detailed recommendations not provided"
                />
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
