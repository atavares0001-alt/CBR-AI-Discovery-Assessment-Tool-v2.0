'use client'

import { useState } from 'react'
import { Textarea } from '@/components/ui/Textarea'
import { Slider } from '@/components/ui/Slider'
import { StageForm } from '../StageForm'

interface SuggestionFieldProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  suggestions: string[]
  placeholder?: string
  required?: boolean
}

function SuggestionField({ id, label, value, onChange, suggestions, placeholder, required = false }: SuggestionFieldProps) {
  const [showManual, setShowManual] = useState(false)

  function selectSuggestion(suggestion: string) {
    if (value === suggestion) {
      onChange('')
    } else {
      onChange(suggestion)
    }
    setShowManual(false)
  }

  function enableManual() {
    setShowManual(true)
    if (suggestions.includes(value)) {
      onChange('')
    }
  }

  const isManualActive = showManual || (value.length > 0 && !suggestions.includes(value))

  return (
    <div className="question-group">
      <div className="question-group-label">
        <span className="label-dot" />
        <span>{label}{required && <span className="ml-1 text-accent">*</span>}</span>
      </div>
      <div className="flex flex-col gap-2">
        {suggestions.map((suggestion) => {
          const isSelected = value === suggestion
          return (
            <button
              key={suggestion}
              type="button"
              onClick={() => selectSuggestion(suggestion)}
              className={`rounded-xl border px-4 py-3 text-left text-sm leading-relaxed transition-all duration-150 ${
                isSelected
                  ? 'border-accent bg-accent/10 font-medium text-accent shadow-sm shadow-accent/10'
                  : 'border-glass-border bg-glass-bg text-text-secondary hover:border-accent/30 hover:bg-accent/5 hover:text-text-primary'
              }`}
            >
              <span className="flex items-start gap-2.5">
                <span className={`mt-0.5 flex h-4.5 w-4.5 flex-shrink-0 items-center justify-center rounded-full border text-[10px] ${
                  isSelected
                    ? 'border-accent bg-accent text-white'
                    : 'border-glass-border'
                }`}>
                  {isSelected && '✓'}
                </span>
                <span>{suggestion}</span>
              </span>
            </button>
          )
        })}
        <button
          type="button"
          onClick={enableManual}
          className={`rounded-xl border px-4 py-3 text-left text-sm transition-all duration-150 ${
            isManualActive
              ? 'border-accent bg-accent/10 font-medium text-accent shadow-sm shadow-accent/10'
              : 'border-glass-border bg-glass-bg text-text-secondary hover:border-accent/30 hover:bg-accent/5 hover:text-text-primary'
          }`}
        >
          <span className="flex items-start gap-2.5">
            <span className={`mt-0.5 flex h-4.5 w-4.5 flex-shrink-0 items-center justify-center rounded-full border text-[10px] ${
              isManualActive
                ? 'border-accent bg-accent text-white'
                : 'border-glass-border'
            }`}>
              {isManualActive && '✓'}
            </span>
            <span>Custom answer</span>
          </span>
        </button>
      </div>
      {isManualActive && (
        <div className="mt-3">
          <Textarea
            id={id}
            label=""
            value={suggestions.includes(value) ? '' : value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder || 'Type your answer...'}
          />
        </div>
      )}
    </div>
  )
}

const FIELD_CONFIG: {
  id: string
  label: string
  suggestions: string[]
  placeholder?: string
  required?: boolean
}[] = [
  {
    id: 'automation_tools',
    label: 'Current automation tools (if any)',
    required: true,
    suggestions: [
      'Zapier',
      'Make (Integromat)',
      'Power Automate',
      'IFTTT',
      'n8n',
      'None — everything is manual',
    ],
    placeholder: 'e.g. Zapier, Make, Power Automate',
  },
  {
    id: 'lead_process',
    label: 'Describe your process when a new lead or enquiry comes in',
    required: true,
    suggestions: [
      'Lead comes via email/phone → manually add to spreadsheet → follow up within 24hrs',
      'Lead fills web form → auto-email response → manually assign to team member → follow up call',
      'Lead comes via multiple channels → no centralised tracking → follow up when we remember',
      'Lead enters CRM automatically → assigned by round-robin → follow up within same day',
    ],
    placeholder: 'Full step-by-step from first contact to first meeting',
  },
  {
    id: 'invoice_process',
    label: 'How are invoices and contracts generated and sent?',
    suggestions: [
      'Manually create in Word/Excel → email as PDF → track payments in spreadsheet',
      'Generated from accounting software (Xero/MYOB/QuickBooks) → sent via email',
      'Use proposal tool (e.g. PandaDoc, HoneyBook) → e-signature → auto-invoice',
      'Mix of manual and automated — depends on the type of job',
    ],
  },
  {
    id: 'auto_replies',
    label: 'Are there any auto-replies, chatbots, or automated responses currently active?',
    suggestions: [
      'No automated responses at all',
      'Basic email auto-reply only (out-of-office style)',
      'Website chatbot for FAQs',
      'Auto-reply on social media / Facebook Messenger',
      'SMS auto-confirmation for bookings',
    ],
  },
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

  const isValid = FIELD_CONFIG
    .filter((f) => f.required)
    .every((f) => answers[f.id]?.trim())

  return (
    <StageForm
      title="Workflows & Automations"
      description="Help us understand how work flows through your business today. Pick a suggestion or write your own."
      onBack={onBack}
      onContinue={onContinue}
      continueDisabled={!isValid}
      loading={loading}
    >
      {FIELD_CONFIG.map((field) => (
        <SuggestionField
          key={field.id}
          id={field.id}
          label={field.label}
          value={answers[field.id] || ''}
          onChange={(v) => update(field.id, v)}
          suggestions={field.suggestions}
          placeholder={field.placeholder}
          required={field.required}
        />
      ))}
      <Slider
        id="manual_data_transfer"
        label="How much manual copy-paste / data transfer happens weekly?"
        value={parseInt(answers.manual_data_transfer || '5')}
        onChange={(v) => update('manual_data_transfer', String(v))}
        min={1}
        max={10}
        leftLabel="None"
        rightLabel="Constant"
      />
    </StageForm>
  )
}
