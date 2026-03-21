'use client'

import { useState, useEffect, useCallback, use } from 'react'
import { ProgressBar } from '@/components/assess/ProgressBar'
import { ConsentGate } from '@/components/assess/ConsentGate'
import { CompletionScreen } from '@/components/assess/CompletionScreen'
import { Stage1 } from '@/components/assess/stages/Stage1'

import { Stage2 } from '@/components/assess/stages/Stage2'
import { Stage3 } from '@/components/assess/stages/Stage3'

import { Stage5 } from '@/components/assess/stages/Stage5'
import type { Industry, StageName } from '@/lib/types/database'
import { motion } from 'framer-motion'

type ViewState = 'loading' | 'error' | 'expired' | 'complete' | 'consent' | 'form'

const STAGE_NAMES: Record<string, string> = {
  stage_1: 'Business Profile',
  stage_2: 'Software Stack',
  stage_3: 'How Things Run Today',
  stage_5: 'Future Vision',
}

export default function AssessPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params)
  const [view, setView] = useState<ViewState>('loading')
  const [errorMsg, setErrorMsg] = useState('')
  const [currentStage, setCurrentStage] = useState<StageName>('stage_1')
  const [stageAnswers, setStageAnswers] = useState<Record<StageName, Record<string, string>>>({
    stage_1: {},
    stage_2: {},
    stage_3: {},
    stage_4: {},
    stage_5: {},
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [industry, setIndustry] = useState<Industry | null>(null)
  const [assessmentId, setAssessmentId] = useState('')

  const fetchAssessment = useCallback(async () => {
    try {
      const res = await fetch(`/api/assess/${token}`)
      const data = await res.json()

      if (!res.ok) {
        if (data.code === 'TOKEN_EXPIRED') {
          setView('expired')
        } else if (data.code === 'ALREADY_COMPLETE') {
          setView('complete')
        } else {
          setErrorMsg(data.error || 'Assessment not found')
          setView('error')
        }
        return
      }

      setAssessmentId(data.id)

      // Load existing responses
      if (data.responses) {
        setStageAnswers(prev => {
          const loaded = { ...prev }
          for (const r of data.responses) {
            loaded[r.stage as StageName] = r.answers as Record<string, string>
          }
          // Detect industry from stage 1
          if (loaded.stage_1?.industry) {
            setIndustry(loaded.stage_1.industry as Industry)
          }
          return loaded
        })
      }

      // Determine where to resume
      if (data.consent_given_at) {
        setView('form')
        // Resume from the appropriate stage
        const stageOrder: StageName[] = ['stage_1', 'stage_2', 'stage_3', 'stage_5']

        for (const stage of stageOrder) {
          const hasResponse = data.responses?.some((r: { stage: string }) => r.stage === stage)
          if (!hasResponse) {
            setCurrentStage(stage)
            break
          }
          // If we've gone through all stages, they're done
          if (stage === 'stage_5' && hasResponse) {
            setView('complete')
          }
        }
      } else {
        setView('consent')
      }
    } catch {
      setErrorMsg('Unable to load assessment. Please check your connection and try again.')
      setView('error')
    }
  }, [token])

  useEffect(() => {
    fetchAssessment()
  }, [fetchAssessment])

  async function handleConsent() {
    setSaving(true)
    try {
      await fetch(`/api/assess/${token}/consent`, { method: 'POST' })
      setView('form')
    } catch {
      setErrorMsg('Failed to record consent. Please try again.')
    }
    setSaving(false)
  }

  async function saveStage(stage: StageName, isFinal = false) {
    setSaving(true)
    setSaved(false)

    const maxRetries = 3
    const delays = [1000, 2000, 4000]

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const res = await fetch(`/api/assess/${token}/responses`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            stage,
            answers: stageAnswers[stage],
            is_final: isFinal,
          }),
        })

        if (res.ok) {
          setSaving(false)
          setSaved(true)
          setTimeout(() => setSaved(false), 2000)
          return true
        }

        throw new Error('Save failed')
      } catch {
        if (attempt < maxRetries) {
          await new Promise((r) => setTimeout(r, delays[attempt]))
        }
      }
    }

    setSaving(false)
    setErrorMsg("Your answers couldn't be saved. Please check your connection and try again.")
    return false
  }

  function getStageOrder(): StageName[] {
    return ['stage_1', 'stage_2', 'stage_3', 'stage_5']
  }

  function getStageIndex(): number {
    return getStageOrder().indexOf(currentStage)
  }

  async function goToNext() {
    const order = getStageOrder()
    const idx = order.indexOf(currentStage)

    // Save current stage
    const isFinal = currentStage === 'stage_5'
    const success = await saveStage(currentStage, isFinal)
    if (!success) return

    if (isFinal) {
      setView('complete')
      return
    }

    // After Stage 1, set industry and continue
    if (currentStage === 'stage_1') {
      const selectedIndustry = stageAnswers.stage_1.industry as Industry
      setIndustry(selectedIndustry)
    }

    // Normal next stage
    if (idx < order.length - 1) {
      setCurrentStage(order[idx + 1])
    }
  }

  function goToPrev() {
    const order = getStageOrder()
    const idx = order.indexOf(currentStage)
    if (idx > 0) {
      setCurrentStage(order[idx - 1])
    }
  }

  // Render states
  if (view === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-text-muted">Loading assessment...</p>
      </div>
    )
  }

  if (view === 'error') {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="glass-card p-8 text-center max-w-md">
          <p className="text-lg font-semibold">Something went wrong</p>
          <p className="mt-2 text-sm text-text-muted">{errorMsg}</p>
          <button
            onClick={() => { setView('loading'); fetchAssessment() }}
            className="mt-4 rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-black"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (view === 'expired') {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="glass-card p-8 text-center max-w-md">
          <p className="text-lg font-semibold">Assessment Link Expired</p>
          <p className="mt-2 text-sm text-text-muted">
            This assessment link has expired. Please contact your CBR AI Agency consultant for a new link.
          </p>
        </div>
      </div>
    )
  }

  if (view === 'complete') {
    return <CompletionScreen />
  }

  if (view === 'consent') {
    return <ConsentGate onConsent={handleConsent} loading={saving} />
  }

  // Form view
  const stageOrder = getStageOrder()
  const totalStages = stageOrder.length

  return (
    <div className="min-h-screen">
      <ProgressBar
        currentStage={getStageIndex() + 1}
        totalStages={totalStages}
        stageName={STAGE_NAMES[currentStage] || currentStage}
        saving={saving}
        saved={saved}
      />

      {errorMsg && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed top-16 left-0 right-0 z-20 mx-auto max-w-2xl px-4 pt-2"
        >
          <div className="glass-card border-red-500/30 p-3 text-center text-sm text-red-400">
            {errorMsg}
            <button onClick={() => setErrorMsg('')} className="ml-2 underline">Dismiss</button>
          </div>
        </motion.div>
      )}

      {currentStage === 'stage_1' && (
        <Stage1
          answers={stageAnswers.stage_1}
          onChange={(a) => setStageAnswers({ ...stageAnswers, stage_1: a })}
          onContinue={goToNext}
          loading={saving}
        />
      )}

      {currentStage === 'stage_2' && (
        <Stage2
          answers={stageAnswers.stage_2}
          onChange={(a) => setStageAnswers({ ...stageAnswers, stage_2: a })}
          onBack={goToPrev}
          onContinue={goToNext}
          loading={saving}
        />
      )}

      {currentStage === 'stage_3' && (
        <Stage3
          answers={stageAnswers.stage_3}
          onChange={(a) => setStageAnswers({ ...stageAnswers, stage_3: a })}
          onBack={goToPrev}
          onContinue={goToNext}
          loading={saving}
        />
      )}

{currentStage === 'stage_5' && (
        <Stage5
          answers={stageAnswers.stage_5}
          onChange={(a) => setStageAnswers({ ...stageAnswers, stage_5: a })}
          onBack={goToPrev}
          onContinue={goToNext}
          loading={saving}
        />
      )}
    </div>
  )
}
