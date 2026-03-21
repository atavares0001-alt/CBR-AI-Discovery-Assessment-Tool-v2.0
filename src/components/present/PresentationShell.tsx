'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { AnimatePresence } from 'framer-motion'
import { SLIDE_ORDER, SLIDE_TITLES } from '@/lib/constants/labels'
import type { AssessmentWithResponses } from '@/lib/types/database'
import { SlideContainer } from './SlideContainer'
import { SlideNavigation } from './SlideNavigation'
import { SlideSidebar } from './SlideSidebar'
import { FloatingToolbar } from './FloatingToolbar'
import { CoverSlide } from './slides/CoverSlide'
import { ScoreSlide } from './slides/ScoreSlide'
import { BusinessSlide } from './slides/BusinessSlide'
import { TechstackSlide } from './slides/TechstackSlide'
import { WorkflowsSlide } from './slides/WorkflowsSlide'
import { VisionSlide } from './slides/VisionSlide'
import { RecommendationsSlide } from './slides/RecommendationsSlide'
import { QuoteSlide } from './slides/QuoteSlide'
import { ClosingSlide } from './slides/ClosingSlide'

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

export const PresentationContext = createContext<{
  editMode: boolean
  onFieldChange: (stage: string, field: string, value: unknown) => void
}>({ editMode: false, onFieldChange: () => {} })

export const usePresentationContext = () => useContext(PresentationContext)

// ---------------------------------------------------------------------------
// Slide component map
// ---------------------------------------------------------------------------

const SLIDE_COMPONENTS: Record<
  (typeof SLIDE_ORDER)[number],
  React.ComponentType<{ assessment: AssessmentWithResponses }>
> = {
  cover: CoverSlide,
  score: ScoreSlide,
  business: BusinessSlide,
  techstack: TechstackSlide,
  workflows: WorkflowsSlide,
  vision: VisionSlide,
  recommendations: RecommendationsSlide,
  quote: QuoteSlide,
  closing: ClosingSlide,
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface PresentationShellProps {
  assessment: AssessmentWithResponses
  onSaveResponses: (stage: string, answers: Record<string, unknown>) => Promise<void>
  onSaveAssessment: (data: Partial<AssessmentWithResponses>) => Promise<void>
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function PresentationShell({
  assessment,
  onSaveResponses,
  onSaveAssessment,
}: PresentationShellProps) {
  // State
  const [mode, setMode] = useState<'dashboard' | 'presentation'>('dashboard')
  const [currentSlide, setCurrentSlide] = useState(0)
  const [editMode, setEditMode] = useState(false)
  const [saving, setSaving] = useState<'idle' | 'saving' | 'saved'>('idle')
  const [direction, setDirection] = useState(1)
  const [showHelp, setShowHelp] = useState(false)

  // Refs for debounced saving
  const pendingChanges = useRef<Record<string, Record<string, unknown>>>({})
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const savedTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // ------------------------------------------
  // Save logic
  // ------------------------------------------

  const flushSave = useCallback(async () => {
    const changes = { ...pendingChanges.current }
    pendingChanges.current = {}

    if (Object.keys(changes).length === 0) return

    setSaving('saving')

    try {
      const stageKeys = Object.keys(changes)
      const assessmentFields = ['client_name', 'client_email', 'company_name', 'industry']

      // Separate assessment-level vs response-level changes
      const assessmentChanges: Record<string, unknown> = {}
      const responseChanges: Record<string, Record<string, unknown>> = {}

      for (const stage of stageKeys) {
        for (const [field, value] of Object.entries(changes[stage])) {
          if (assessmentFields.includes(field)) {
            assessmentChanges[field] = value
          } else {
            if (!responseChanges[stage]) responseChanges[stage] = {}
            responseChanges[stage][field] = value
          }
        }
      }

      const promises: Promise<void>[] = []

      if (Object.keys(assessmentChanges).length > 0) {
        promises.push(onSaveAssessment(assessmentChanges as Partial<AssessmentWithResponses>))
      }

      for (const [stage, answers] of Object.entries(responseChanges)) {
        promises.push(onSaveResponses(stage, answers))
      }

      await Promise.all(promises)
      setSaving('saved')

      if (savedTimer.current) clearTimeout(savedTimer.current)
      savedTimer.current = setTimeout(() => setSaving('idle'), 2000)
    } catch {
      setSaving('idle')
    }
  }, [onSaveAssessment, onSaveResponses])

  const onFieldChange = useCallback(
    (stage: string, field: string, value: unknown) => {
      if (!pendingChanges.current[stage]) {
        pendingChanges.current[stage] = {}
      }
      pendingChanges.current[stage][field] = value

      if (debounceTimer.current) clearTimeout(debounceTimer.current)
      debounceTimer.current = setTimeout(() => {
        flushSave()
      }, 1500)
    },
    [flushSave],
  )

  // ------------------------------------------
  // Navigation
  // ------------------------------------------

  const goToSlide = useCallback(
    (index: number) => {
      if (index < 0 || index >= SLIDE_ORDER.length) return
      setDirection(index > currentSlide ? 1 : -1)
      setCurrentSlide(index)
    },
    [currentSlide],
  )

  const nextSlide = useCallback(() => {
    if (currentSlide < SLIDE_ORDER.length - 1) {
      setDirection(1)
      setCurrentSlide((s) => s + 1)
    }
  }, [currentSlide])

  const prevSlide = useCallback(() => {
    if (currentSlide > 0) {
      setDirection(-1)
      setCurrentSlide((s) => s - 1)
    }
  }, [currentSlide])

  // ------------------------------------------
  // Fullscreen
  // ------------------------------------------

  const enterPresentation = useCallback(() => {
    setMode('presentation')
    document.documentElement.requestFullscreen?.().catch(() => {})
  }, [])

  const exitPresentation = useCallback(() => {
    setMode('dashboard')
    if (document.fullscreenElement) {
      document.exitFullscreen?.().catch(() => {})
    }
  }, [])

  const toggleMode = useCallback(() => {
    if (mode === 'dashboard') {
      enterPresentation()
    } else {
      exitPresentation()
    }
  }, [mode, enterPresentation, exitPresentation])

  useEffect(() => {
    const handler = () => {
      if (!document.fullscreenElement && mode === 'presentation') {
        setMode('dashboard')
      }
    }
    document.addEventListener('fullscreenchange', handler)
    return () => document.removeEventListener('fullscreenchange', handler)
  }, [mode])

  // ------------------------------------------
  // Keyboard shortcuts
  // ------------------------------------------

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Ignore shortcuts when typing in inputs
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return

      switch (e.key) {
        case 'ArrowRight':
        case ' ':
          e.preventDefault()
          if (mode === 'presentation') nextSlide()
          break
        case 'ArrowLeft':
          e.preventDefault()
          if (mode === 'presentation') prevSlide()
          break
        case 'f':
        case 'F':
          e.preventDefault()
          toggleMode()
          break
        case 'e':
        case 'E':
          e.preventDefault()
          setEditMode((v) => !v)
          break
        case 'Escape':
          e.preventDefault()
          if (showHelp) {
            setShowHelp(false)
          } else if (editMode) {
            setEditMode(false)
          } else if (mode === 'presentation') {
            exitPresentation()
          }
          break
        case '?':
          e.preventDefault()
          setShowHelp((v) => !v)
          break
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [mode, currentSlide, editMode, showHelp, nextSlide, prevSlide, toggleMode, exitPresentation])

  // Cleanup timers
  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current)
      if (savedTimer.current) clearTimeout(savedTimer.current)
    }
  }, [])

  // ------------------------------------------
  // Scroll-to for dashboard sidebar nav
  // ------------------------------------------

  const scrollToSlide = useCallback((index: number) => {
    const id = SLIDE_ORDER[index]
    const el = document.getElementById(`slide-${id}`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    setCurrentSlide(index)
  }, [])

  // ------------------------------------------
  // Render
  // ------------------------------------------

  const slideNames = SLIDE_ORDER.map((key) => SLIDE_TITLES[key])

  return (
    <PresentationContext.Provider value={{ editMode, onFieldChange }}>
      <div className="relative min-h-screen bg-bg text-text-primary">
        {/* Dashboard mode */}
        {mode === 'dashboard' && (
          <div className="flex">
            {/* Sidebar */}
            <SlideSidebar
              activeSlide={SLIDE_ORDER[currentSlide]}
              onNavigate={(slideId: string) => {
                const index = SLIDE_ORDER.indexOf(slideId as (typeof SLIDE_ORDER)[number])
                if (index >= 0) scrollToSlide(index)
              }}
            />

            {/* Main scrollable area */}
            <main className="flex-1 ml-0 lg:ml-56">
              {SLIDE_ORDER.map((key, index) => {
                const SlideComponent = SLIDE_COMPONENTS[key]
                return (
                  <SlideContainer
                    key={key}
                    id={`slide-${key}`}
                    isActive={false}
                    direction={direction}
                    mode="dashboard"
                  >
                    <SlideComponent assessment={assessment} />
                  </SlideContainer>
                )
              })}
            </main>
          </div>
        )}

        {/* Presentation mode */}
        {mode === 'presentation' && (
          <div className="fixed inset-0 bg-bg overflow-hidden">
            <AnimatePresence mode="wait" custom={direction}>
              {SLIDE_ORDER.map((key, index) => {
                if (index !== currentSlide) return null
                const SlideComponent = SLIDE_COMPONENTS[key]
                return (
                  <SlideContainer
                    key={key}
                    id={`slide-${key}`}
                    isActive={true}
                    direction={direction}
                    mode="presentation"
                  >
                    <SlideComponent assessment={assessment} />
                  </SlideContainer>
                )
              })}
            </AnimatePresence>

            <SlideNavigation
              currentSlide={currentSlide}
              totalSlides={SLIDE_ORDER.length}
              onNavigate={goToSlide}
              slideNames={slideNames}
            />
          </div>
        )}

        {/* Floating toolbar */}
        <FloatingToolbar
          mode={mode}
          editMode={editMode}
          saving={saving}
          onToggleMode={toggleMode}
          onToggleEdit={() => setEditMode((v) => !v)}
        />

        {/* Help overlay */}
        <AnimatePresence>
          {showHelp && (
            <div
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
              onClick={() => setShowHelp(false)}
            >
              <div
                className="glass-card p-8 max-w-md w-full mx-4"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-lg font-semibold mb-4 text-accent">
                  Keyboard Shortcuts
                </h3>
                <div className="space-y-2 text-sm">
                  {[
                    ['Arrow Left / Right', 'Navigate slides'],
                    ['Space', 'Next slide'],
                    ['F', 'Toggle fullscreen presentation'],
                    ['E', 'Toggle edit mode'],
                    ['Escape', 'Exit presentation / edit mode'],
                    ['?', 'Toggle this help'],
                  ].map(([key, desc]) => (
                    <div key={key} className="flex justify-between">
                      <kbd className="px-2 py-0.5 rounded bg-white/10 font-mono text-xs">
                        {key}
                      </kbd>
                      <span className="text-text-secondary">{desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </PresentationContext.Provider>
  )
}
