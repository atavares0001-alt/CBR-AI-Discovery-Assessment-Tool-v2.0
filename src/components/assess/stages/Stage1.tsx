'use client'

import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { StageForm } from '../StageForm'
import { isValidUrl } from '@/lib/utils/validation'
import { useState } from 'react'

const EMPLOYEE_OPTIONS = [
  { value: 'Just me (1)', label: 'Just me (1)' },
  { value: '2-5', label: '2–5' },
  { value: '6-20', label: '6–20' },
  { value: '21-50', label: '21–50' },
  { value: '51-200', label: '51–200' },
  { value: '200+', label: '200+' },
]

const INDUSTRY_OPTIONS = [
  { value: 'Construction & Trades', label: 'Construction & Trades' },
  { value: 'Real Estate', label: 'Real Estate' },
  { value: 'Professional Services', label: 'Professional Services' },
  { value: 'Health & Beauty', label: 'Health & Beauty' },
  { value: 'Other', label: 'Other' },
]

interface Stage1Props {
  answers: Record<string, string>
  onChange: (answers: Record<string, string>) => void
  onContinue: () => void
  loading?: boolean
}

export function Stage1({ answers, onChange, onContinue, loading }: Stage1Props) {
  const [urlError, setUrlError] = useState('')

  function update(field: string, value: string) {
    onChange({ ...answers, [field]: value })
    if (field === 'website_url') {
      setUrlError(value && !isValidUrl(value) ? 'Please enter a valid URL' : '')
    }
  }

  const isValid =
    answers.business_name?.trim() &&
    answers.business_purpose?.trim() &&
    answers.employee_count &&
    answers.industry &&
    answers.is_decision_maker &&
    !urlError

  return (
    <StageForm
      title="Business Profile"
      description="Tell us about your business so we can tailor our recommendations."
      onContinue={onContinue}
      continueDisabled={!isValid}
      loading={loading}
      showBack={false}
    >
      <Input
        id="business_name"
        label="Business Name"
        required
        value={answers.business_name || ''}
        onChange={(e) => update('business_name', e.target.value)}
        maxLength={200}
      />
      <Input
        id="website_url"
        label="Website URL"
        type="url"
        value={answers.website_url || ''}
        onChange={(e) => update('website_url', e.target.value)}
        error={urlError}
        placeholder="https://example.com.au"
      />
      <Textarea
        id="business_purpose"
        label="Primary purpose of the business"
        required
        value={answers.business_purpose || ''}
        onChange={(e) => update('business_purpose', e.target.value)}
      />
      <Textarea
        id="core_products"
        label="Core products or services"
        value={answers.core_products || ''}
        onChange={(e) => update('core_products', e.target.value)}
      />
      <Select
        id="employee_count"
        label="Number of full-time employees"
        required
        options={EMPLOYEE_OPTIONS}
        value={answers.employee_count || ''}
        onChange={(e) => update('employee_count', e.target.value)}
        placeholder="Select..."
      />
      <Input
        id="bottleneck_department"
        label="Biggest bottleneck department"
        value={answers.bottleneck_department || ''}
        onChange={(e) => update('bottleneck_department', e.target.value)}
        placeholder="e.g. Sales, Admin, Customer Service"
        maxLength={200}
      />
      <Select
        id="industry"
        label="Industry"
        required
        options={INDUSTRY_OPTIONS}
        value={answers.industry || ''}
        onChange={(e) => update('industry', e.target.value)}
        placeholder="Select your industry..."
      />

      <div>
        <p className="mb-2 text-sm font-medium text-text-secondary">
          Are you the primary decision-maker for technology purchases?
          <span className="ml-1 text-accent">*</span>
        </p>
        <div className="flex gap-4">
          {['Yes', 'No'].map((opt) => (
            <label key={opt} className="flex min-h-[44px] cursor-pointer items-center gap-3 rounded-lg border border-glass-border px-4 py-2 transition-colors hover:border-accent/30">
              <input
                type="radio"
                name="is_decision_maker"
                value={opt}
                checked={answers.is_decision_maker === opt}
                onChange={(e) => update('is_decision_maker', e.target.value)}
                className="h-5 w-5 accent-accent"
              />
              <span className="text-sm">{opt}</span>
            </label>
          ))}
        </div>
      </div>

      {answers.is_decision_maker === 'No' && (
        <Input
          id="decision_maker_name"
          label="Decision-maker's name/role"
          value={answers.decision_maker_name || ''}
          onChange={(e) => update('decision_maker_name', e.target.value)}
          maxLength={200}
        />
      )}
    </StageForm>
  )
}
