'use client'

import { useState, useEffect, use, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { ResponsesTab } from '@/components/assessment/ResponsesTab'
import { RecommendationsTab } from '@/components/assessment/RecommendationsTab'
import { QuoteBuilderTab } from '@/components/assessment/QuoteBuilderTab'
import { ReportTab } from '@/components/assessment/ReportTab'
import { StatusControls } from '@/components/assessment/StatusControls'
import type { AssessmentWithResponses, Assessment, AssessmentStatus } from '@/lib/types/database'

type Tab = 'responses' | 'recommendations' | 'quote' | 'report'

const TABS: { id: Tab; label: string }[] = [
  { id: 'responses', label: 'Client Responses' },
  { id: 'recommendations', label: 'Recommendations' },
  { id: 'quote', label: 'Quote Builder' },
  { id: 'report', label: 'Report' },
]

export default function AssessmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [assessment, setAssessment] = useState<AssessmentWithResponses | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<Tab>('responses')

  const fetchAssessment = useCallback(async () => {
    const res = await fetch(`/api/assessments/${id}`)
    if (res.ok) {
      const data = await res.json()
      setAssessment(data)
    }
    setLoading(false)
  }, [id])

  useEffect(() => {
    fetchAssessment()
  }, [fetchAssessment])

  async function handleSave(data: Partial<Assessment>) {
    const res = await fetch(`/api/assessments/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (res.ok) {
      await fetchAssessment()
    }
  }

  async function handleStatusChange(status: AssessmentStatus) {
    const res = await fetch(`/api/assessments/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    if (res.ok) {
      await fetchAssessment()
    }
  }

  async function handleDelete() {
    const res = await fetch(`/api/assessments/${id}`, { method: 'DELETE' })
    if (res.ok) {
      router.push('/dashboard')
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="py-12 text-center text-text-muted">Loading assessment...</div>
      </DashboardLayout>
    )
  }

  if (!assessment) {
    return (
      <DashboardLayout>
        <div className="py-12 text-center text-text-muted">Assessment not found.</div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/dashboard')}
            className="mb-4 text-sm text-text-muted hover:text-text-primary transition-colors"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-2xl font-bold">{assessment.client_name}</h1>
          <div className="mt-1 flex flex-wrap items-center gap-x-4 text-sm text-text-muted">
            {assessment.company_name && <span>{assessment.company_name}</span>}
            {assessment.industry && <span>{assessment.industry}</span>}
            {assessment.client_email && <span>{assessment.client_email}</span>}
          </div>
        </div>

        {/* Status controls */}
        <div className="mb-6">
          <StatusControls
            assessment={assessment}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
          />
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-1 rounded-xl border border-glass-border bg-glass-bg p-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-accent/20 text-accent'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'responses' && (
            <ResponsesTab responses={assessment.responses} />
          )}
          {activeTab === 'recommendations' && (
            <RecommendationsTab assessment={assessment} onSave={handleSave} />
          )}
          {activeTab === 'quote' && (
            <QuoteBuilderTab assessment={assessment} onSave={handleSave} />
          )}
          {activeTab === 'report' && (
            <ReportTab assessment={assessment} />
          )}
        </motion.div>
      </motion.div>
    </DashboardLayout>
  )
}
