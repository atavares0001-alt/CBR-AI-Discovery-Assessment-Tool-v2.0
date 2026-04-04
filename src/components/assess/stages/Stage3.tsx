'use client'

import { useState } from 'react'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { StageForm } from '../StageForm'

const AUTOMATION_OPTIONS = [
  { value: 'No — everything is done manually', label: 'No — everything is done manually' },
  { value: 'A little – we use basic tools or software', label: 'A little – we use basic tools or software' },
  { value: 'Somewhat — a few workflows are automated (e.g. invoicing, lead capture)', label: 'Somewhat — a few workflows are automated (e.g. invoicing, lead capture)' },
  { value: 'Mostly — we have several automations in place but still have gaps', label: 'Mostly — we have several automations in place but still have gaps' },
]

const PREPOPULATED_DRAINS = [
  'Chasing unpaid invoices and following up on overdue payments',
  'Answering the same client questions repeatedly',
  'Manual data entry between systems or spreadsheets',
  'Scheduling and rescheduling appointments',
  'Creating quotes or proposals from scratch',
  'Following up on leads that go cold',
  'Generating reports and compiling data manually',
  'Onboarding new clients or employees',
  'Managing social media and marketing content',
  'Handling phone calls and voicemails during business hours',
]

const TIME_DRAIN_FIELDS = [
  { id: 'time_drain_1', label: '1' },
  { id: 'time_drain_2', label: '2' },
  { id: 'time_drain_3', label: '3' },
  { id: 'time_drain_4', label: '4' },
  { id: 'time_drain_5', label: '5' },
]

interface Stage3Props {
  answers: Record<string, string>
  onChange: (answers: Record<string, string>) => void
  onBack: () => void
  onContinue: () => void
  loading?: boolean
}

export function Stage3({ answers, onChange, onBack, onContinue, loading }: Stage3Props) {
  // Track which fields are using custom (manual) input
  const [customMode, setCustomMode] = useState<Record<string, boolean>>({})

  function update(field: string, value: string) {
    onChange({ ...answers, [field]: value })
  }

  // Get all currently selected pre-populated values across all drain fields
  function getUsedPrePopulated(): string[] {
    return TIME_DRAIN_FIELDS
      .map((f) => answers[f.id] || '')
      .filter((v) => v && PREPOPULATED_DRAINS.includes(v))
  }

  // Get available options for a specific drain field (exclude already-selected ones, except the current field's own value)
  function getAvailableOptions(fieldId: string) {
    const used = getUsedPrePopulated()
    const currentValue = answers[fieldId] || ''
    return PREPOPULATED_DRAINS
      .filter((opt) => !used.includes(opt) || opt === currentValue)
      .map((opt) => ({ value: opt, label: opt }))
  }

  function handleDrainSelect(fieldId: string, value: string) {
    if (value === '__custom__') {
      // Switch to custom mode, clear the value
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
      title="How Things Run Today"
      description="Tell us about your current processes — what's automated, what's manual, and where the biggest time drains are."
      onBack={onBack}
      onContinue={onContinue}
      continueDisabled={!isValid}
      loading={loading}
    >
      {/* Automation status */}
      <div className="question-group space-y-5">
        <div className="question-group-label">
          <span className="label-dot" />
          <span>Automation Status</span>
        </div>
        <Select
          id="automation_tools"
          label="Are any of your business processes currently automated?"
          options={AUTOMATION_OPTIONS}
          value={answers.automation_tools || ''}
          onChange={(e) => update('automation_tools', e.target.value)}
          placeholder="Select an option..."
        />
        <Textarea
          id="automation_details"
          label="Tell us more — what tools do you use or what's still manual?"
          value={answers.automation_details || ''}
          onChange={(e) => update('automation_details', e.target.value)}
          placeholder="e.g. Invoicing is done manually in Xero, phone calls go to voicemail after hours, scheduling is managed via email back-and-forth, quotes are typed up from scratch each time..."
        />
      </div>

      {/* Time & Effort Drains */}
      <div className="question-group space-y-4">
        <div className="question-group-label">
          <span className="label-dot" />
          <span>Top 5 Time & Effort Drains</span>
        </div>
        <p className="text-sm text-text-muted -mt-1">
          Select from common time drains or type your own. Each option can only be used once.
        </p>
        <div className="space-y-3">
          {TIME_DRAIN_FIELDS.map((field) => {
            const isCustom = customMode[field.id] || false
            const currentValue = answers[field.id] || ''
            const isPrePopulatedValue = PREPOPULATED_DRAINS.includes(currentValue)

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
                        placeholder="Type your own time drain..."
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
                        ...getAvailableOptions(field.id),
                      ]}
                      value={isPrePopulatedValue ? currentValue : ''}
                      onChange={(e) => handleDrainSelect(field.id, e.target.value)}
                      placeholder="Select a common time drain..."
                    />
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Magic wand */}
      <div className="question-group">
        <div className="question-group-label">
          <span className="label-dot" />
          <span>If You Had a Magic Wand</span>
        </div>
        <Textarea
          id="magic_wand_task"
          label="If you could wave a magic wand, what tasks or frustrations would you get rid of? List as many as you like."
          value={answers.magic_wand_task || ''}
          onChange={(e) => update('magic_wand_task', e.target.value)}
          placeholder="e.g. Chasing invoices, manually entering data into spreadsheets, answering the same customer questions over and over..."
        />
      </div>
    </StageForm>
  )
}
