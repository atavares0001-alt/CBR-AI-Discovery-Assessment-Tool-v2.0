'use client'

import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { StageForm } from '../StageForm'

interface Stage5Props {
  answers: Record<string, string>
  onChange: (answers: Record<string, string>) => void
  onBack: () => void
  onContinue: () => void
  loading?: boolean
}

const AUTONOMY_OPTIONS = [
  { value: 'Human-in-loop', label: 'Human-in-loop' },
  { value: 'Semi-autonomous', label: 'Semi-autonomous' },
  { value: 'Full autonomy', label: 'Full autonomy' },
]

const CONCERN_OPTIONS = [
  { value: 'Cost/ROI', label: 'Cost/ROI' },
  { value: 'Technical complexity', label: 'Technical complexity' },
  { value: 'Data security', label: 'Data security' },
  { value: 'Staff resistance', label: 'Staff resistance' },
  { value: 'Reliability', label: 'Reliability' },
  { value: 'No concerns', label: 'No concerns' },
]

const TIMELINE_OPTIONS = [
  { value: 'Immediately', label: 'Immediately' },
  { value: '1-3 months', label: '1–3 months' },
  { value: '3-6 months', label: '3–6 months' },
  { value: '6+ months', label: '6+ months' },
]

const BUDGET_OPTIONS = [
  { value: 'Under $5k', label: 'Under $5k' },
  { value: '$5k-$20k', label: '$5k–$20k' },
  { value: '$20k-$50k', label: '$20k–$50k' },
  { value: '$50k+', label: '$50k+' },
]

export function Stage5({ answers, onChange, onBack, onContinue, loading }: Stage5Props) {
  function update(field: string, value: string) {
    onChange({ ...answers, [field]: value })
  }

  const isValid =
    answers.success_vision?.trim() &&
    answers.ai_autonomy &&
    answers.timeline &&
    answers.budget

  return (
    <StageForm
      title="Future Vision"
      description="Help us understand where you want to go and how AI can get you there."
      onBack={onBack}
      onContinue={onContinue}
      continueLabel="Submit Assessment ✓"
      continueDisabled={!isValid}
      loading={loading}
    >
      <Textarea
        id="success_vision"
        label="What does success look like for your business in 6 months' time?"
        required
        value={answers.success_vision || ''}
        onChange={(e) => update('success_vision', e.target.value)}
        placeholder="Be specific — mention numbers, outcomes, or milestones"
      />
      <Textarea
        id="automated_focus"
        label="If manual tasks were automated, what high-value work would you focus on instead?"
        value={answers.automated_focus || ''}
        onChange={(e) => update('automated_focus', e.target.value)}
      />
      <Select
        id="ai_autonomy"
        label="What level of AI autonomy are you comfortable with?"
        required
        options={AUTONOMY_OPTIONS}
        value={answers.ai_autonomy || ''}
        onChange={(e) => update('ai_autonomy', e.target.value)}
        placeholder="Select..."
      />
      <Select
        id="primary_concern"
        label="What is your primary concern about adopting AI automation?"
        options={CONCERN_OPTIONS}
        value={answers.primary_concern || ''}
        onChange={(e) => update('primary_concern', e.target.value)}
        placeholder="Select..."
      />
      <Select
        id="timeline"
        label="What is your desired timeline for getting your first AI pilot running?"
        required
        options={TIMELINE_OPTIONS}
        value={answers.timeline || ''}
        onChange={(e) => update('timeline', e.target.value)}
        placeholder="Select..."
      />
      <Select
        id="budget"
        label="Do you have an approximate budget in mind for an AI automation project?"
        required
        options={BUDGET_OPTIONS}
        value={answers.budget || ''}
        onChange={(e) => update('budget', e.target.value)}
        placeholder="Select..."
      />
    </StageForm>
  )
}
