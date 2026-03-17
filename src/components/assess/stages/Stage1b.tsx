'use client'

import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { StageForm } from '../StageForm'
import type { Industry } from '@/lib/types/database'

interface Stage1bProps {
  industry: Industry
  answers: Record<string, string>
  onChange: (answers: Record<string, string>) => void
  onBack: () => void
  onContinue: () => void
  loading?: boolean
}

const INDUSTRY_QUESTIONS: Record<string, { id: string; label: string; type: 'textarea' | 'number'; placeholder?: string }[]> = {
  'Construction & Trades': [
    { id: 'lead_tracking', label: 'How do you currently track and follow up on new leads?', type: 'textarea' },
    { id: 'quote_time_hours', label: 'How long does it typically take to get a quote to a client? (hours)', type: 'number', placeholder: 'e.g. 24' },
    { id: 'missed_calls_weekly', label: 'Roughly how many calls or enquiries do you miss after hours per week?', type: 'number', placeholder: 'e.g. 5' },
    { id: 'biggest_admin_task', label: 'What is the single biggest admin task slowing your team down?', type: 'textarea' },
  ],
  'Real Estate': [
    { id: 'weekly_enquiries', label: 'How many new buyer/tenant enquiries do you receive per week?', type: 'number', placeholder: 'e.g. 50' },
    { id: 'inspection_process', label: 'Describe your current inspection booking process', type: 'textarea' },
    { id: 'after_hours_leads', label: 'How are leads handled outside of business hours?', type: 'textarea' },
    { id: 'crm_system', label: 'Which CRM or lead management system are you using (if any)?', type: 'textarea' },
  ],
  'Professional Services': [
    { id: 'drafting_hours', label: 'How many hours per week does your team spend drafting documents or reports?', type: 'number', placeholder: 'e.g. 15' },
    { id: 'onboarding_process', label: 'Describe your client onboarding process from signed contract to first deliverable', type: 'textarea' },
    { id: 'repeat_questions', label: 'How often do clients ask the same questions? How do you handle this?', type: 'textarea' },
    { id: 'current_ai_tools', label: 'Are you currently using any AI tools in your practice?', type: 'textarea' },
  ],
  'Health & Beauty': [
    { id: 'weekly_appointments', label: 'How many appointments do you book per week on average?', type: 'number', placeholder: 'e.g. 100' },
    { id: 'noshow_rate', label: 'What is your estimated no-show or last-minute cancellation rate? (%)', type: 'number', placeholder: 'e.g. 15' },
    { id: 'booking_system', label: 'What booking or scheduling system do you use (if any)?', type: 'textarea' },
    { id: 'reception_struggles', label: 'What are the top 2–3 things your front desk or reception struggles with most?', type: 'textarea' },
  ],
}

export function Stage1b({ industry, answers, onChange, onBack, onContinue, loading }: Stage1bProps) {
  const questions = INDUSTRY_QUESTIONS[industry] || []

  function update(field: string, value: string) {
    onChange({ ...answers, [field]: value })
  }

  if (questions.length === 0) return null

  return (
    <StageForm
      title={`${industry} Details`}
      description="These industry-specific questions help us understand your unique challenges."
      onBack={onBack}
      onContinue={onContinue}
      loading={loading}
    >
      {questions.map((q) =>
        q.type === 'number' ? (
          <Input
            key={q.id}
            id={q.id}
            label={q.label}
            type="number"
            min={0}
            max={q.id === 'noshow_rate' ? 100 : 10000}
            value={answers[q.id] || ''}
            onChange={(e) => update(q.id, e.target.value)}
            placeholder={q.placeholder}
          />
        ) : (
          <Textarea
            key={q.id}
            id={q.id}
            label={q.label}
            value={answers[q.id] || ''}
            onChange={(e) => update(q.id, e.target.value)}
          />
        )
      )}
    </StageForm>
  )
}
