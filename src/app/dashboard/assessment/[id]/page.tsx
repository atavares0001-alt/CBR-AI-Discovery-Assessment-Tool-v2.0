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
              {assessment.company_name && (
                <p className="mt-0.5 text-base font-medium text-text-secondary">{assessment.company_name}</p>
              )}
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-text-muted">
                {assessment.client_email && (
                  <span className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                    {assessment.client_email}
                  </span>
                )}
                {assessment.client_phone && (
                  <span className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    </svg>
                    {assessment.client_phone}
                  </span>
                )}
                {assessment.industry && (
                  <span className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                    </svg>
                    {assessment.industry}
                  </span>
                )}
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
              className={`flex-1 shrink-0 rounded-lg px-4 py-2.5 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${activeTab === tab.id
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
