'use client'

import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Slider } from '@/components/ui/Slider'
import { StageForm } from '../StageForm'

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

  return (
    <StageForm
      title="Workflows & Automations"
      description="Help us understand how work flows through your business today."
      onBack={onBack}
      onContinue={onContinue}
      loading={loading}
    >
      <Input
        id="automation_tools"
        label="Current automation tools (if any)"
        value={answers.automation_tools || ''}
        onChange={(e) => update('automation_tools', e.target.value)}
        placeholder="e.g. Zapier, Make, Power Automate"
        maxLength={200}
      />
      <Textarea
        id="lead_process"
        label="Describe your process when a new lead or enquiry comes in"
        value={answers.lead_process || ''}
        onChange={(e) => update('lead_process', e.target.value)}
        placeholder="Full step-by-step from first contact to first meeting"
      />
      <Textarea
        id="invoice_process"
        label="How are invoices and contracts generated and sent?"
        value={answers.invoice_process || ''}
        onChange={(e) => update('invoice_process', e.target.value)}
      />
      <Input
        id="auto_replies"
        label="Are there any auto-replies, chatbots, or automated responses currently active?"
        value={answers.auto_replies || ''}
        onChange={(e) => update('auto_replies', e.target.value)}
        maxLength={200}
      />
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
