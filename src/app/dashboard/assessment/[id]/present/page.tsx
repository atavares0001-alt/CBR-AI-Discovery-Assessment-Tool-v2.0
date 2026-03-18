'use client'

import { useState, useMemo, use, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { PresentationShell } from '@/components/present/PresentationShell'
import type { AssessmentWithResponses, Assessment } from '@/lib/types/database'

export default function PresentationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [assessment, setAssessment] = useState<AssessmentWithResponses | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function fetchAssessment() {
    try {
      const res = await fetch(`/api/assessments/${id}`)
      if (res.ok) {
        const data = await res.json()
        setAssessment(data)
      } else {
        setError('Assessment not found')
      }
    } catch {
      setError('Failed to load assessment')
    }
    setLoading(false)
  }

  useMemo(() => {
    fetchAssessment()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSaveResponses = useCallback(async (stage: string, answers: Record<string, unknown>) => {
    // Merge with existing answers for this stage
    const existingResponse = assessment?.responses.find(r => r.stage === stage)
    const mergedAnswers = { ...(existingResponse?.answers || {}), ...answers }

    const res = await fetch(`/api/assessments/${id}/responses`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stage, answers: mergedAnswers }),
    })

    if (res.ok && assessment) {
      // Update local state optimistically
      const updatedResponses = assessment.responses.map(r =>
        r.stage === stage ? { ...r, answers: mergedAnswers } : r
      )
      // If this stage didn't exist yet, add it
      if (!existingResponse) {
        const newResponse = await res.json()
        updatedResponses.push(newResponse)
      }
      setAssessment({ ...assessment, responses: updatedResponses })
    }
  }, [assessment, id])

  const handleSaveAssessment = useCallback(async (data: Partial<Assessment>) => {
    const res = await fetch(`/api/assessments/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (res.ok && assessment) {
      setAssessment({ ...assessment, ...data } as AssessmentWithResponses)
    }
  }, [assessment, id])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
          <p className="text-text-muted">Loading presentation...</p>
        </div>
      </div>
    )
  }

  if (error || !assessment) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg">
        <div className="glass-card max-w-md p-8 text-center">
          <p className="text-lg font-semibold">{error || 'Assessment not found'}</p>
          <button
            onClick={() => router.push(`/dashboard/assessment/${id}`)}
            className="mt-4 rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-black"
          >
            Back to Assessment
          </button>
        </div>
      </div>
    )
  }

  return (
    <PresentationShell
      assessment={assessment}
      onSaveResponses={handleSaveResponses}
      onSaveAssessment={handleSaveAssessment}
    />
  )
}
