'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { MultiSelectChips } from '@/components/ui/MultiSelectChips'
import { StageForm } from '../StageForm'

interface Stage5Props {
  answers: Record<string, string>
  onChange: (answers: Record<string, string>) => void
  onBack: () => void
  onContinue: () => void
  loading?: boolean
}

const PREPOPULATED_VISIONS = [
  'Every lead gets a response within 5 minutes',
  'Admin time cut in half across the team',
  'No more missed calls or lost enquiries',
  'Clients receive automatic progress updates',
  'All quoting and invoicing handled automatically',
  'Team productivity and workflow efficiency doubled',
  '24/7 capability for handling common customer questions',
  'Data and metrics tracked instantly without manual entry',
  'Flawless, automated onboarding experience for every new client',
  'Significantly reduced human error across all admin tasks',
]

const PREPOPULATED_FOCUSES = [
  'Building client relationships and partnerships',
  'Growing revenue through new service offerings',
  'Strategic planning and business development',
  'Training and upskilling the team',
  'Improving service quality and client experience',
  'Mentoring junior staff and fostering company culture',
  'Expanding into new locations or markets',
  'Optimizing higher-level business and financial strategies',
  'Focusing on creative and high-impact project work',
  'Enhancing personal work-life balance for the entire team',
]

const VISION_FIELDS = [
  { id: 'vision_1', label: '1' },
  { id: 'vision_2', label: '2' },
  { id: 'vision_3', label: '3' },
  { id: 'vision_4', label: '4' },
  { id: 'vision_5', label: '5' },
]

const FOCUS_FIELDS = [
  { id: 'focus_1', label: '1' },
  { id: 'focus_2', label: '2' },
  { id: 'focus_3', label: '3' },
  { id: 'focus_4', label: '4' },
  { id: 'focus_5', label: '5' },
]

const AUTONOMY_OPTIONS = [
  { value: 'Human-in-loop', label: 'Human-in-loop' },
  { value: 'Semi-autonomous', label: 'Semi-autonomous' },
  { value: 'Full autonomy', label: 'Full autonomy' },
]

const CONCERN_OPTIONS = [
  'Cost/ROI',
  'Technical complexity',
  'Data security',
  'Staff resistance',
  'Reliability',
  'No concerns',
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
  const [customMode, setCustomMode] = useState<Record<string, boolean>>({})

  function update(field: string, value: string) {
    onChange({ ...answers, [field]: value })
  }

  function getConcernValues(): string[] {
    if (!answers.primary_concern) return []
    try {
      const parsed = JSON.parse(answers.primary_concern)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return answers.primary_concern ? [answers.primary_concern] : []
    }
  }

  function updateConcerns(selected: string[]) {
    onChange({ ...answers, primary_concern: JSON.stringify(selected) })
  }

  function getUsedVisions(): string[] {
    return VISION_FIELDS
      .map((f) => answers[f.id] || '')
      .filter((v) => v && PREPOPULATED_VISIONS.includes(v))
  }

  function getAvailableVisions(fieldId: string) {
    const used = getUsedVisions()
    const currentValue = answers[fieldId] || ''
    return PREPOPULATED_VISIONS
      .filter((opt) => !used.includes(opt) || opt === currentValue)
      .map((opt) => ({ value: opt, label: opt }))
  }

  function getUsedFocuses(): string[] {
    return FOCUS_FIELDS
      .map((f) => answers[f.id] || '')
      .filter((v) => v && PREPOPULATED_FOCUSES.includes(v))
  }

  function getAvailableFocuses(fieldId: string) {
    const used = getUsedFocuses()
    const currentValue = answers[fieldId] || ''
    return PREPOPULATED_FOCUSES
      .filter((opt) => !used.includes(opt) || opt === currentValue)
      .map((opt) => ({ value: opt, label: opt }))
  }

  function handleSelect(fieldId: string, value: string) {
    if (value === '__custom__') {
      setCustomMode((prev) => ({ ...prev, [fieldId]: true }))
      update(fieldId, '')
    } else {
      setCustomMode((prev) => ({ ...prev, [fieldId]: false }))
      update(fieldId, value)
    }
  }

  function handleCustomInput(fieldId: string, value: string) {
    update(fieldId, value)
  }

  function clearCustomMode(fieldId: string) {
    setCustomMode((prev) => ({ ...prev, [fieldId]: false }))
    update(fieldId, '')
  }

  const isValid = true

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
          Imagine it&apos;s 6 months from now and things are running exactly how you want — what&apos;s changed?
        </p>
        <p className="text-sm text-text-muted -mt-2">
          Select from common visions or type your own. Each option can only be used once.
        </p>
        <div className="space-y-3">
          {VISION_FIELDS.map((field) => {
            const isCustom = customMode[field.id] || false
            const currentValue = answers[field.id] || ''
            const isPrePopulatedValue = PREPOPULATED_VISIONS.includes(currentValue)

            return (
              <div key={field.id} className="flex items-start gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-semibold text-accent mt-2.5">
                  {field.label}
                </span>
                <div className="flex-1 space-y-2">
                  {isCustom ? (
                    <div className="space-y-2">
                      <input
                        id={field.id}
                        type="text"
                        value={currentValue}
                        onChange={(e) => handleCustomInput(field.id, e.target.value)}
                        placeholder="Type your own vision..."
                        className="glass-input w-full px-4 py-3 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => clearCustomMode(field.id)}
                        className="text-xs text-accent hover:text-accent/80 transition-colors"
                      >
                        ← Back to suggestions
                      </button>
                    </div>
                  ) : (
                    <Select
                      id={field.id}
                      label=""
                      options={[
                        { value: '__custom__', label: '✏️  Type my own response...' },
                        ...getAvailableVisions(field.id),
                      ]}
                      value={isPrePopulatedValue ? currentValue : ''}
                      onChange={(e) => handleSelect(field.id, e.target.value)}
                      placeholder="Select a common vision..."
                    />
                  )}
                </div>
              </div>
            )
          })}
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
        <p className="text-sm text-text-muted -mt-2">
          Select from common focus areas or type your own. Each option can only be used once.
        </p>
        <div className="space-y-3">
          {FOCUS_FIELDS.map((field) => {
            const isCustom = customMode[field.id] || false
            const currentValue = answers[field.id] || ''
            const isPrePopulatedValue = PREPOPULATED_FOCUSES.includes(currentValue)

            return (
              <div key={field.id} className="flex items-start gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-xs font-semibold text-blue-400 mt-2.5">
                  {field.label}
                </span>
                <div className="flex-1 space-y-2">
                  {isCustom ? (
                    <div className="space-y-2">
                      <input
                        id={field.id}
                        type="text"
                        value={currentValue}
                        onChange={(e) => handleCustomInput(field.id, e.target.value)}
                        placeholder="Type your own focus area..."
                        className="glass-input w-full px-4 py-3 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => clearCustomMode(field.id)}
                        className="text-xs text-accent hover:text-accent/80 transition-colors"
                      >
                        ← Back to suggestions
                      </button>
                    </div>
                  ) : (
                    <Select
                      id={field.id}
                      label=""
                      options={[
                        { value: '__custom__', label: '✏️  Type my own response...' },
                        ...getAvailableFocuses(field.id),
                      ]}
                      value={isPrePopulatedValue ? currentValue : ''}
                      onChange={(e) => handleSelect(field.id, e.target.value)}
                      placeholder="Select a common focus area..."
                    />
                  )}
                </div>
              </div>
            )
          })}
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
          options={AUTONOMY_OPTIONS}
          value={answers.ai_autonomy || ''}
          onChange={(e) => update('ai_autonomy', e.target.value)}
          placeholder="Select..."
        />
        <div>
          <p className="mb-3 text-sm font-medium text-text-secondary">
            What are your concerns about adopting AI automation? <span className="text-text-muted">(select all that apply)</span>
          </p>
          <MultiSelectChips
            id="primary_concern"
            label="Concerns about AI Adoption"
            options={CONCERN_OPTIONS}
            value={getConcernValues()}
            onChange={updateConcerns}
            showOther={true}
          />
        </div>
      </div>

      <div className="question-group space-y-5">
        <div className="question-group-label">
          <span className="label-dot" />
          <span>Timeline & Budget</span>
        </div>
        <Select
          id="timeline"
          label="What is your desired timeline for getting your first AI pilot running?"
          options={TIMELINE_OPTIONS}
          value={answers.timeline || ''}
          onChange={(e) => update('timeline', e.target.value)}
          placeholder="Select..."
        />
        <Select
          id="budget"
          label="Do you have an approximate budget in mind for an AI automation project?"
          options={BUDGET_OPTIONS}
          value={answers.budget || ''}
          onChange={(e) => update('budget', e.target.value)}
          placeholder="Select..."
        />
      </div>
    </StageForm>
  )
}
