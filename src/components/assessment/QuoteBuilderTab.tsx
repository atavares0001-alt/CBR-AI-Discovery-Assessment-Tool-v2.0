'use client'

import { useState, useCallback } from 'react'
import { useAutoSave } from '@/hooks/useAutoSave'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import type { Assessment, Stage7Data, QuoteLineItem } from '@/lib/types/database'

const PACKAGE_OPTIONS = [
  { value: 'Foundation', label: 'Foundation — Essential baseline' },
  { value: 'Acceleration', label: 'Acceleration — Most popular choice' },
  { value: 'Transformation', label: 'Transformation — For market leaders' },
]

const PACKAGE_SERVICES: Record<string, string[]> = {
  Foundation: ['AI Business Assessment', 'AI Receptionist', 'Basic Website', 'Team Training', 'Documentation'],
  Acceleration: ['AI Business Assessment', 'AI Receptionist', 'Basic Website', 'Team Training', 'Documentation', 'Chatbot', 'Lead Capture', 'Email Automation', 'CRM Integration'],
  Transformation: ['AI Business Assessment', 'AI Receptionist', 'Basic Website', 'Team Training', 'Documentation', 'Chatbot', 'Lead Capture', 'Email Automation', 'CRM Integration', 'Automated Workflows', 'Autonomous AI Agents', 'Data & Business Analytics'],
}

interface QuoteBuilderTabProps {
  assessment: Assessment
  onSave: (data: Partial<Assessment>) => Promise<void>
}

export function QuoteBuilderTab({ assessment, onSave }: QuoteBuilderTabProps) {
  const [data, setData] = useState<Stage7Data>(
    assessment.stage_7_data || {
      package: 'Foundation',
      setup_cost: 0,
      monthly_maintenance: 0,
      monthly_api_costs: 0,
      line_items: [],
      proposed_timeline: '',
      next_steps: '',
      internal_notes: '',
    }
  )
  const handleAutoSave = useCallback(async (dataToSave: Stage7Data) => {
    await onSave({
      stage_7_data: dataToSave,
      status: 'quote_added',
    })
  }, [onSave])

  const { status: autoSaveStatus, manualSave } = useAutoSave(data, handleAutoSave, 1500)
  const isSaving = autoSaveStatus === 'saving'
  const isSaved = autoSaveStatus === 'saved'

  function update<K extends keyof Stage7Data>(field: K, value: Stage7Data[K]) {
    setData({ ...data, [field]: value })
  }

  function addLineItem() {
    const item: QuoteLineItem = {
      id: crypto.randomUUID(),
      name: '',
      description: '',
      one_time_cost: 0,
      monthly_cost: 0,
    }
    update('line_items', [...data.line_items, item])
  }

  function updateLineItem(id: string, field: keyof QuoteLineItem, value: string | number) {
    update(
      'line_items',
      data.line_items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    )
  }

  function removeLineItem(id: string) {
    update('line_items', data.line_items.filter((item) => item.id !== id))
  }

  const totalOneTime = data.setup_cost + data.line_items.reduce((sum, i) => sum + i.one_time_cost, 0)
  const totalMonthly = data.monthly_maintenance + data.monthly_api_costs + data.line_items.reduce((sum, i) => sum + i.monthly_cost, 0)

  return (
    <div className="space-y-6">
      <Select
        id="package"
        label="Package"
        options={PACKAGE_OPTIONS}
        value={data.package}
        onChange={(e) => update('package', e.target.value as Stage7Data['package'])}
      />

      {data.package && PACKAGE_SERVICES[data.package] && (
        <div className="glass-card p-4">
          <p className="mb-2 text-xs font-medium text-text-muted uppercase">Included Services</p>
          <div className="flex flex-wrap gap-2">
            {PACKAGE_SERVICES[data.package].map((s) => (
              <span key={s} className="rounded-full bg-accent/10 px-2.5 py-1 text-xs text-accent">
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <Input
          id="setup_cost"
          label="Setup / Implementation ($)"
          type="number"
          min={0}
          value={data.setup_cost || ''}
          onChange={(e) => update('setup_cost', Number(e.target.value) || 0)}
        />
        <Input
          id="monthly_maintenance"
          label="Monthly Maintenance ($)"
          type="number"
          min={0}
          value={data.monthly_maintenance || ''}
          onChange={(e) => update('monthly_maintenance', Number(e.target.value) || 0)}
        />
        <Input
          id="monthly_api_costs"
          label="Monthly API Costs ($)"
          type="number"
          min={0}
          value={data.monthly_api_costs || ''}
          onChange={(e) => update('monthly_api_costs', Number(e.target.value) || 0)}
        />
      </div>

      {/* Line items */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-medium text-text-secondary">Add-on Line Items</p>
          <Button variant="secondary" size="sm" onClick={addLineItem}>
            + Add Item
          </Button>
        </div>

        {data.line_items.map((item) => (
          <div key={item.id} className="glass-card mb-3 p-4">
            <div className="mb-3 flex items-start justify-between">
              <Input
                id={`item-name-${item.id}`}
                label="Service Name"
                value={item.name}
                onChange={(e) => updateLineItem(item.id, 'name', e.target.value)}
                className="flex-1"
              />
              <button
                onClick={() => removeLineItem(item.id)}
                className="ml-2 mt-6 text-red-400 hover:text-red-300"
                aria-label="Remove line item"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <Input
              id={`item-desc-${item.id}`}
              label="Description"
              value={item.description}
              onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
            />
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <Input
                id={`item-onetime-${item.id}`}
                label="One-time Cost ($)"
                type="number"
                min={0}
                value={item.one_time_cost || ''}
                onChange={(e) => updateLineItem(item.id, 'one_time_cost', Number(e.target.value) || 0)}
              />
              <Input
                id={`item-monthly-${item.id}`}
                label="Monthly Cost ($)"
                type="number"
                min={0}
                value={item.monthly_cost || ''}
                onChange={(e) => updateLineItem(item.id, 'monthly_cost', Number(e.target.value) || 0)}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="glass-card-glow p-4">
        <div className="flex justify-between text-sm">
          <span className="text-text-secondary">Total One-Time Cost</span>
          <span className="font-mono font-bold text-accent">${totalOneTime.toLocaleString()}</span>
        </div>
        <div className="mt-2 flex justify-between text-sm">
          <span className="text-text-secondary">Total Monthly Cost</span>
          <span className="font-mono font-bold text-accent">${totalMonthly.toLocaleString()}/mo</span>
        </div>
      </div>

      <Input
        id="proposed_timeline"
        label="Proposed Implementation Timeline"
        value={data.proposed_timeline}
        onChange={(e) => update('proposed_timeline', e.target.value)}
        placeholder="e.g. 4–6 weeks"
      />
      <Textarea
        id="next_steps"
        label="Next Steps"
        value={data.next_steps}
        onChange={(e) => update('next_steps', e.target.value)}
        placeholder="What the client should do next..."
      />
      <Textarea
        id="internal_notes"
        label="Internal Notes (not shown in report)"
        value={data.internal_notes}
        onChange={(e) => update('internal_notes', e.target.value)}
        placeholder="Private notes for your reference..."
      />

      <div className="flex justify-end">
        <Button onClick={manualSave} disabled={isSaving || isSaved}>
          {isSaving ? 'Saving...' : isSaved ? 'Saved' : 'Save Quote'}
        </Button>
      </div>
    </div>
  )
}
