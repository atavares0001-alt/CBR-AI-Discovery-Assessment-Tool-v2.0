'use client'

import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { StageForm } from '../StageForm'

interface Stage5Props {
  answers: Record<string, string>
  onChange: (answers: Record<string, string>) => void
  onBack: () => void
  onContinue: () => void
  loading?: boolean
}

const VISION_FIELDS = [
  { id: 'vision_1', placeholder: 'e.g. Every lead gets a response within 5 minutes' },
  { id: 'vision_2', placeholder: 'e.g. Admin time cut in half across the team' },
  { id: 'vision_3', placeholder: 'e.g. No more missed calls or lost enquiries' },
  { id: 'vision_4', placeholder: 'e.g. Clients receive automatic progress updates' },
  { id: 'vision_5', placeholder: 'e.g. All quoting and invoicing handled automatically' },
]

const FOCUS_FIELDS = [
  { id: 'focus_1', placeholder: 'e.g. Building client relationships and partnerships' },
  { id: 'focus_2', placeholder: 'e.g. Growing revenue through new service offerings' },
  { id: 'focus_3', placeholder: 'e.g. Strategic planning and business development' },
  { id: 'focus_4', placeholder: 'e.g. Training and upskilling the team' },
  { id: 'focus_5', placeholder: 'e.g. Improving service quality and client experience' },
]

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
    answers.vision_1?.trim() &&
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
      {/* Your Vision */}
      <div className="question-group space-y-4">
        <div className="question-group-label">
          <span className="label-dot" />
          <span>Your Vision</span>
        </div>
        <p className="text-sm text-text-muted -mt-1">
          Imagine it&apos;s 6 months from now and things are running exactly how you want — what&apos;s changed? At least one is required.
        </p>
        <div className="space-y-3">
          {VISION_FIELDS.map((field, i) => (
            <div key={field.id} className="flex items-center gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-semibold text-accent">
                {i + 1}
              </span>
              <div className="flex-1">
                <Input
                  id={field.id}
                  label=""
                  required={i === 0}
                  value={answers[field.id] || ''}
                  onChange={(e) => update(field.id, e.target.value)}
                  placeholder={field.placeholder}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* High-Value Focus */}
      <div className="question-group space-y-4">
        <div className="question-group-label">
          <span className="label-dot" />
          <span>High-Value Focus</span>
        </div>
        <p className="text-sm text-text-muted -mt-1">
          If manual tasks were automated, what high-value work would you or your team focus on instead?
        </p>
        <div className="space-y-3">
          {FOCUS_FIELDS.map((field, i) => (
            <div key={field.id} className="flex items-center gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-xs font-semibold text-blue-400">
                {i + 1}
              </span>
              <div className="flex-1">
                <Input
                  id={field.id}
                  label=""
                  value={answers[field.id] || ''}
                  onChange={(e) => update(field.id, e.target.value)}
                  placeholder={field.placeholder}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="question-group space-y-5">
        <div className="question-group-label">
          <span className="label-dot" />
          <span>AI Preferences</span>
        </div>
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
      </div>

      <div className="question-group space-y-5">
        <div className="question-group-label">
          <span className="label-dot" />
          <span>Timeline & Budget</span>
        </div>
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
      </div>
    </StageForm>
  )
}
