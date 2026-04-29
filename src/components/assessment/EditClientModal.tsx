'use client'

import { useState, useEffect } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import type { Assessment, Industry } from '@/lib/types/database'

const INDUSTRY_OPTIONS: { value: string; label: string }[] = [
  { value: '', label: 'Select an industry...' },
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
  { value: 'Social Media & Influencer', label: 'Social Media & Influencer' },
  { value: 'Sports & Recreation', label: 'Sports & Recreation' },
  { value: 'Telecommunications', label: 'Telecommunications' },
  { value: 'Transport & Freight', label: 'Transport & Freight' },
  { value: 'Veterinary & Animal Services', label: 'Veterinary & Animal Services' },
  { value: 'Wholesale & Distribution', label: 'Wholesale & Distribution' },
  { value: 'Other', label: 'Other' },
]

interface EditClientModalProps {
  open: boolean
  onClose: () => void
  assessment: Assessment
  onSaved: () => void
}

export function EditClientModal({ open, onClose, assessment, onSaved }: EditClientModalProps) {
  const [clientName, setClientName] = useState(assessment.client_name)
  const [clientEmail, setClientEmail] = useState(assessment.client_email || '')
  const [clientPhone, setClientPhone] = useState(assessment.client_phone || '')
  const [companyName, setCompanyName] = useState(assessment.company_name || '')
  const [industry, setIndustry] = useState(assessment.industry || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Reset form when assessment changes or modal opens
  useEffect(() => {
    if (open) {
      setClientName(assessment.client_name)
      setClientEmail(assessment.client_email || '')
      setClientPhone(assessment.client_phone || '')
      setCompanyName(assessment.company_name || '')
      setIndustry(assessment.industry || '')
      setError('')
    }
  }, [open, assessment])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch(`/api/assessments/${assessment.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_name: clientName,
        client_email: clientEmail || null,
        client_phone: clientPhone || null,
        company_name: companyName || null,
        industry: (industry as Industry) || null,
      }),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error || 'Failed to update client details')
      setLoading(false)
      return
    }

    setLoading(false)
    onSaved()
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="Edit Client Details">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="edit-client-name"
          label="Client Name"
          required
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          placeholder="Jane Smith"
        />
        <Input
          id="edit-client-email"
          label="Client Email"
          type="email"
          value={clientEmail}
          onChange={(e) => setClientEmail(e.target.value)}
          placeholder="jane@example.com"
        />
        <Input
          id="edit-client-phone"
          label="Phone Number"
          type="tel"
          value={clientPhone}
          onChange={(e) => setClientPhone(e.target.value)}
          placeholder="0412 345 678"
        />
        <Input
          id="edit-company-name"
          label="Company Name"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          placeholder="Smith Construction Pty Ltd"
        />
        <Select
          id="edit-industry"
          label="Industry"
          options={INDUSTRY_OPTIONS}
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
        />

        {error && <p className="text-sm text-red-400">{error}</p>}

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading || !clientName.trim()}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
