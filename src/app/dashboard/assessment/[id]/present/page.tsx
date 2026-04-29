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

  const handleApplyChange = useCallback((stage: string, field: string, value: unknown) => {
    const assessmentFields = ['client_name', 'client_email', 'company_name', 'industry']

    setAssessment(prev => {
      if (!prev) return prev

      if (assessmentFields.includes(field)) {
        return { ...prev, [field]: value } as AssessmentWithResponses
      }

      const existingResponse = prev.responses.find(r => r.stage === stage)
      const mergedAnswers = { ...(existingResponse?.answers || {}), [field]: value }

      let updatedResponses = prev.responses.map(r =>
        r.stage === stage ? { ...r, answers: mergedAnswers } : r
      )

      if (!existingResponse) {
        updatedResponses = [
          ...updatedResponses,
          {
            id: crypto.randomUUID(),
            assessment_id: id,
            stage: stage as import('@/lib/types/database').StageName,
            answers: mergedAnswers,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ]
      }

      return { ...prev, responses: updatedResponses }
    })
  }, [id])

  const handleSaveResponses = useCallback(async (stage: string, answers: Record<string, unknown>) => {
    const res = await fetch(`/api/assessments/${id}/responses`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stage, answers }), // only send the explicit changes to be merged securely on the backend
    })

    if (res.ok) {
      // Use purely functional state updates to avoid React closure stale-state logic
      setAssessment(prev => {
        if (!prev) return prev
        const existingResponse = prev.responses.find(r => r.stage === stage)
        const mergedAnswers = { ...(existingResponse?.answers || {}), ...answers }
        
        const updatedResponses = prev.responses.map(r =>
          r.stage === stage ? { ...r, answers: mergedAnswers } : r
        )
        
        if (!existingResponse) {
          updatedResponses.push({
            id: crypto.randomUUID(), // Optimistic ID
            assessment_id: id,
            stage: stage as import('@/lib/types/database').StageName,
            answers: mergedAnswers,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
        }
        return { ...prev, responses: updatedResponses }
      })
    }
  }, [id])

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
      onApplyChange={handleApplyChange}
    />
  )
}
