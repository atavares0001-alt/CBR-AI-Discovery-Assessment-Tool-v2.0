'use client'

import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { StageForm } from '../StageForm'

const EMPLOYEE_OPTIONS = [
  { value: 'Just me (1)', label: 'Just me (1)' },
  { value: '2-5', label: '2–5' },
  { value: '6-20', label: '6–20' },
  { value: '21-50', label: '21–50' },
  { value: '51-200', label: '51–200' },
  { value: '200+', label: '200+' },
]

const INDUSTRY_OPTIONS = [
  { value: 'Accounting & Finance', label: 'Accounting & Finance' },
  { value: 'Agriculture & Farming', label: 'Agriculture & Farming' },
  { value: 'Architecture & Design', label: 'Architecture & Design' },
  { value: 'Automotive', label: 'Automotive' },
  { value: 'Construction & Trades', label: 'Construction & Trades' },
  { value: 'Consulting & Advisory', label: 'Consulting & Advisory' },
  { value: 'Education & Training', label: 'Education & Training' },
  { value: 'Energy & Utilities', label: 'Energy & Utilities' },
  { value: 'Engineering', label: 'Engineering' },
  { value: 'Entertainment & Media', label: 'Entertainment & Media' },
  { value: 'Environmental Services', label: 'Environmental Services' },
  { value: 'Fashion & Apparel', label: 'Fashion & Apparel' },
  { value: 'Financial Services & Insurance', label: 'Financial Services & Insurance' },
  { value: 'Food & Beverage', label: 'Food & Beverage' },
  { value: 'Government & Public Sector', label: 'Government & Public Sector' },
  { value: 'Health & Beauty', label: 'Health & Beauty' },
  { value: 'Healthcare & Medical', label: 'Healthcare & Medical' },
  { value: 'Hospitality & Tourism', label: 'Hospitality & Tourism' },
  { value: 'IT & Technology', label: 'IT & Technology' },
  { value: 'Legal Services', label: 'Legal Services' },
  { value: 'Logistics & Supply Chain', label: 'Logistics & Supply Chain' },
  { value: 'Manufacturing', label: 'Manufacturing' },
  { value: 'Marketing & Advertising', label: 'Marketing & Advertising' },
  { value: 'Mining & Resources', label: 'Mining & Resources' },
  { value: 'Non-Profit & Charity', label: 'Non-Profit & Charity' },
  { value: 'Pharmaceutical', label: 'Pharmaceutical' },
  { value: 'Professional Services', label: 'Professional Services' },
  { value: 'Property Management', label: 'Property Management' },
  { value: 'Real Estate', label: 'Real Estate' },
  { value: 'Recruitment & Staffing', label: 'Recruitment & Staffing' },
  { value: 'Retail & E-Commerce', label: 'Retail & E-Commerce' },
  { value: 'Security Services', label: 'Security Services' },
  { value: 'Sports & Recreation', label: 'Sports & Recreation' },
  { value: 'Telecommunications', label: 'Telecommunications' },
  { value: 'Transport & Freight', label: 'Transport & Freight' },
  { value: 'Veterinary & Animal Services', label: 'Veterinary & Animal Services' },
  { value: 'Wholesale & Distribution', label: 'Wholesale & Distribution' },
  { value: 'Other', label: 'Other' },
]

interface Stage1Props {
  answers: Record<string, string>
  onChange: (answers: Record<string, string>) => void
  onContinue: () => void
  loading?: boolean
}

export function Stage1({ answers, onChange, onContinue, loading }: Stage1Props) {
  function update(field: string, value: string) {
    onChange({ ...answers, [field]: value })
  }

  const isValid = true

  return (
    <StageForm
      title="Business Profile"
      description="Tell us about your business so we can tailor our recommendations."
      onContinue={onContinue}
      continueDisabled={!isValid}
      loading={loading}
      showBack={false}
    >
      {/* Contact & Business Info */}
      <div className="question-group space-y-5">
        <div className="question-group-label">
          <span className="label-dot" />
          <span>Contact & Business Details</span>
        </div>
        <Input
          id="contact_name"
          label="Your Name"
          value={answers.contact_name || ''}
          onChange={(e) => update('contact_name', e.target.value)}
          placeholder="First and last name"
          maxLength={200}
        />
        <Input
          id="business_name"
          label="Business Name"
          value={answers.business_name || ''}
          onChange={(e) => update('business_name', e.target.value)}
          maxLength={200}
        />
        <Textarea
          id="website_url"
          label="Website URL or Social Media Accounts"
          value={answers.website_url || ''}
          onChange={(e) => update('website_url', e.target.value)}
          placeholder="e.g. https://example.com.au, @business on Instagram"
        />
      </div>

      {/* About the Business */}
      <div className="question-group space-y-5">
        <div className="question-group-label">
          <span className="label-dot" />
          <span>About Your Business</span>
        </div>
        <Textarea
          id="business_purpose"
          label="What does your business do and what are your core products or services?"
          value={answers.business_purpose || ''}
          onChange={(e) => update('business_purpose', e.target.value)}
          placeholder="e.g. We provide residential plumbing services across Canberra, specialising in new builds and renovations"
        />
      </div>

      {/* Team & Industry */}
      <div className="question-group space-y-5">
        <div className="question-group-label">
          <span className="label-dot" />
          <span>Team & Industry</span>
        </div>
        <Select
          id="employee_count"
          label="Number of full-time employees"
          options={EMPLOYEE_OPTIONS}
          value={answers.employee_count || ''}
          onChange={(e) => update('employee_count', e.target.value)}
          placeholder="Select..."
        />
        <Select
          id="industry"
          label="Industry"
          options={INDUSTRY_OPTIONS}
          value={answers.industry || ''}
          onChange={(e) => update('industry', e.target.value)}
          placeholder="Select your industry..."
        />
      </div>

      {/* Decision Maker */}
      <div className="question-group">
        <div className="question-group-label">
          <span className="label-dot" />
          <span>Decision Making</span>
        </div>
        <p className="mb-3 text-sm font-medium text-text-secondary">
          Are you the primary decision-maker for technology purchases?
        </p>
        <div className="flex gap-3">
          {['Yes', 'No'].map((opt) => {
            const isSelected = answers.is_decision_maker === opt
            return (
              <label
                key={opt}
                className={`flex min-h-[48px] flex-1 cursor-pointer items-center justify-center gap-3 rounded-xl border px-4 py-3 transition-all duration-150 ${
                  isSelected
                    ? 'border-accent bg-accent/10 text-accent shadow-sm shadow-accent/10'
                    : 'border-glass-border bg-glass-bg text-text-secondary hover:border-accent/30 hover:bg-accent/5 hover:text-text-primary'
                }`}
              >
                <span className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                  isSelected
                    ? 'border-accent bg-accent'
                    : 'border-glass-border'
                }`}>
                  {isSelected && (
                    <span className="h-2 w-2 rounded-full bg-white" />
                  )}
                </span>
                <input
                  type="radio"
                  name="is_decision_maker"
                  value={opt}
                  checked={isSelected}
                  onChange={(e) => update('is_decision_maker', e.target.value)}
                  className="sr-only"
                />
                <span className="text-sm font-medium">{opt}</span>
              </label>
            )
          })}
        </div>
        {answers.is_decision_maker === 'No' && (
          <div className="mt-4">
            <Input
              id="decision_maker_name"
              label="Decision-maker's name/role"
              value={answers.decision_maker_name || ''}
              onChange={(e) => update('decision_maker_name', e.target.value)}
              maxLength={200}
            />
          </div>
        )}
      </div>
    </StageForm>
  )
}
