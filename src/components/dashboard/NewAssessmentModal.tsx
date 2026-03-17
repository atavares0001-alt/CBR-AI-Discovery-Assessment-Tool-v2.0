'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

interface NewAssessmentModalProps {
  open: boolean
  onClose: () => void
  onCreated: () => void
}

export function NewAssessmentModal({ open, onClose, onCreated }: NewAssessmentModalProps) {
  const [clientName, setClientName] = useState('')
  const [clientEmail, setClientEmail] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/assessments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_name: clientName,
        client_email: clientEmail || undefined,
        company_name: companyName || undefined,
      }),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error || 'Failed to create assessment')
      setLoading(false)
      return
    }

    setClientName('')
    setClientEmail('')
    setCompanyName('')
    setLoading(false)
    onCreated()
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="New Assessment">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="client-name"
          label="Client Name"
          required
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          placeholder="Jane Smith"
        />
        <Input
          id="client-email"
          label="Client Email"
          type="email"
          value={clientEmail}
          onChange={(e) => setClientEmail(e.target.value)}
          placeholder="jane@example.com"
        />
        <Input
          id="company-name"
          label="Company Name"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          placeholder="Smith Construction Pty Ltd"
        />

        {error && <p className="text-sm text-red-400">{error}</p>}

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading || !clientName.trim()}>
            {loading ? 'Creating...' : 'Create Assessment'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
