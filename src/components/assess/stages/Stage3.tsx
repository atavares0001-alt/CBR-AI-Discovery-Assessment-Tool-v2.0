'use client'

import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { StageForm } from '../StageForm'

const AUTOMATION_OPTIONS = [
  { value: 'No — everything is done manually', label: 'No — everything is done manually' },
  { value: 'A little — we use basic tools like Zapier or auto-replies', label: 'A little — we use basic tools like Zapier or auto-replies' },
  { value: 'Somewhat — a few workflows are automated (e.g. invoicing, lead capture)', label: 'Somewhat — a few workflows are automated (e.g. invoicing, lead capture)' },
  { value: 'Mostly — we have several automations in place but still have gaps', label: 'Mostly — we have several automations in place but still have gaps' },
]

const TIME_DRAIN_FIELDS = [
  { id: 'time_drain_1', label: '1', placeholder: 'e.g. Chasing unpaid invoices' },
  { id: 'time_drain_2', label: '2', placeholder: 'e.g. Answering the same client questions' },
  { id: 'time_drain_3', label: '3', placeholder: 'e.g. Manual data entry between systems' },
  { id: 'time_drain_4', label: '4', placeholder: 'e.g. Scheduling and rescheduling appointments' },
  { id: 'time_drain_5', label: '5', placeholder: 'e.g. Creating quotes or proposals from scratch' },
]

interface Stage3Props {
  answers: Record<string, string>
  onChange: (answers: Record<string, string>) => void
  onBack: () => void
  onContinue: () => void
  loading?: boolean
}

export function Stage3({ answers, onChange, onBack, onContinue, loading }: Stage3Props) {
  function update(field: string, value: string) {
    onChange({ ...answers, [field]: value })
  }

  const isValid =
    answers.automation_tools?.trim() &&
    answers.time_drain_1?.trim()

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
          required
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
          List the tasks that eat up the most time or cause the most frustration. At least one is required.
        </p>
        <div className="space-y-3">
          {TIME_DRAIN_FIELDS.map((field, i) => (
            <div key={field.id} className="flex items-center gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-semibold text-accent">
                {field.label}
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
