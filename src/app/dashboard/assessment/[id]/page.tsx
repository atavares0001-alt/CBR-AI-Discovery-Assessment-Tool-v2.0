'use client'

import { useState, useMemo, use } from 'react'
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
  const [fetchCount, setFetchCount] = useState(0)

  async function fetchAssessment() {
    const res = await fetch(`/api/assessments/${id}`)
    if (res.ok) {
      const data = await res.json()
      setAssessment(data)
    }
    setLoading(false)
  }

  // Initial fetch
  useMemo(() => {
    fetchAssessment()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchCount])

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
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">{assessment.client_name}</h1>
              <div className="mt-1 flex flex-wrap items-center gap-x-4 text-sm text-text-muted">
                {assessment.company_name && <span>{assessment.company_name}</span>}
                {assessment.industry && <span>{assessment.industry}</span>}
                {assessment.client_email && <span>{assessment.client_email}</span>}
              </div>
            </div>
            <button
              onClick={() => router.push(`/dashboard/assessment/${id}/present`)}
              className="flex shrink-0 items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-accent-hover"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 4v16l13-8z" />
              </svg>
              Present
            </button>
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
        <div className="mb-6 flex gap-1 overflow-x-auto rounded-xl border border-glass-border bg-glass-bg p-1" role="tablist">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 shrink-0 rounded-lg px-4 py-2.5 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
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
          role="tabpanel"
          aria-label={TABS.find(t => t.id === activeTab)?.label}
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
