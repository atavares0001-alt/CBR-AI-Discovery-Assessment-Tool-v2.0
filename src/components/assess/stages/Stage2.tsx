'use client'

import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { StageForm } from '../StageForm'

interface Stage2Props {
  answers: Record<string, string>
  onChange: (answers: Record<string, string>) => void
  onBack: () => void
  onContinue: () => void
  loading?: boolean
}

export function Stage2({ answers, onChange, onBack, onContinue, loading }: Stage2Props) {
  function update(field: string, value: string) {
    onChange({ ...answers, [field]: value })
  }

  return (
    <StageForm
      title="Software Stack"
      description="What tools and systems does your business currently use?"
      onBack={onBack}
      onContinue={onContinue}
      loading={loading}
    >
      <Input
        id="email_calendar"
        label="Email and calendar suite"
        value={answers.email_calendar || ''}
        onChange={(e) => update('email_calendar', e.target.value)}
        placeholder="e.g. Google Workspace, Microsoft 365"
        maxLength={200}
      />
      <Input
        id="crm_tool"
        label="CRM or lead management tool"
        value={answers.crm_tool || ''}
        onChange={(e) => update('crm_tool', e.target.value)}
        placeholder="e.g. HubSpot, Salesforce, none"
        maxLength={200}
      />
      <Input
        id="project_management"
        label="Project management and internal communications"
        value={answers.project_management || ''}
        onChange={(e) => update('project_management', e.target.value)}
        placeholder="e.g. Asana, Slack, Teams"
        maxLength={200}
      />
      <Input
        id="data_storage"
        label="Client/business data storage"
        value={answers.data_storage || ''}
        onChange={(e) => update('data_storage', e.target.value)}
        placeholder="e.g. Google Drive, SharePoint, local server"
        maxLength={200}
      />
      <Textarea
        id="specialised_software"
        label="Industry-specific or specialised software"
        value={answers.specialised_software || ''}
        onChange={(e) => update('specialised_software', e.target.value)}
        placeholder="e.g. Xero, Procore, Rex, Mindbody"
      />
    </StageForm>
  )
}
