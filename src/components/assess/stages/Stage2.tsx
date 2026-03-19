'use client'

import { MultiSelectChips } from '@/components/ui/MultiSelectChips'
import { StageForm } from '../StageForm'

const SOFTWARE_OPTIONS: Record<string, { label: string; options: string[] }> = {
  email_calendar: {
    label: 'Email & Calendar',
    options: [
      'Google Workspace',
      'Microsoft 365',
      'Apple iCloud',
      'Zoho Mail',
      'ProtonMail',
      'Yahoo Mail',
      'Outlook (standalone)',
      'Thunderbird',
      'FastMail',
      'Calendly',
    ],
  },
  crm_tool: {
    label: 'CRM / Lead Management',
    options: [
      'HubSpot',
      'Salesforce',
      'Zoho CRM',
      'Pipedrive',
      'Monday CRM',
      'Freshsales',
      'ActiveCampaign',
      'Insightly',
      'Copper',
      'Nimble',
    ],
  },
  project_management: {
    label: 'Project Management & Internal Comms',
    options: [
      'Asana',
      'Trello',
      'Monday.com',
      'Jira',
      'ClickUp',
      'Basecamp',
      'Notion',
      'Microsoft Teams',
      'Slack',
      'Linear',
    ],
  },
  data_storage: {
    label: 'Client / Business Data Storage',
    options: [
      'Google Drive',
      'SharePoint',
      'Dropbox',
      'OneDrive',
      'Box',
      'iCloud Drive',
      'Local/Network Server',
      'AWS S3',
      'Notion',
      'Airtable',
    ],
  },
  accounting_software: {
    label: 'Accounting & Finance',
    options: [
      'Xero',
      'MYOB',
      'QuickBooks',
      'FreshBooks',
      'Sage',
      'Wave',
      'Reckon',
      'NetSuite',
      'Zoho Books',
      'Kashoo',
    ],
  },
  specialised_software: {
    label: 'Industry-Specific / Specialised Software',
    options: [
      'Procore',
      'ServiceM8',
      'Cliniko',
      'Rex',
      'Mindbody',
      'Canva',
      'Adobe Creative Suite',
      'AutoCAD',
      'Shopify',
      'WordPress',
    ],
  },
}

interface Stage2Props {
  answers: Record<string, string>
  onChange: (answers: Record<string, string>) => void
  onBack: () => void
  onContinue: () => void
  loading?: boolean
}

export function Stage2({ answers, onChange, onBack, onContinue, loading }: Stage2Props) {
  function update(field: string, value: string[]) {
    onChange({ ...answers, [field]: JSON.stringify(value) })
  }

  function getValues(field: string): string[] {
    if (!answers[field]) return []
    try {
      const parsed = JSON.parse(answers[field])
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return answers[field] ? [answers[field]] : []
    }
  }

  const REQUIRED_CATEGORIES = ['email_calendar', 'accounting_software']

  const isValid = REQUIRED_CATEGORIES.every((key) => {
    const vals = getValues(key).filter((v) => v !== '__other__')
    return vals.length > 0
  })

  return (
    <StageForm
      title="Software Stack"
      description="Select the tools and systems your business currently uses. You can pick multiple and add your own."
      onBack={onBack}
      onContinue={onContinue}
      continueDisabled={!isValid}
      loading={loading}
    >
      {Object.entries(SOFTWARE_OPTIONS).map(([key, config]) => (
        <MultiSelectChips
          key={key}
          id={key}
          label={config.label}
          options={config.options}
          value={getValues(key)}
          onChange={(selected) => update(key, selected)}
          required={REQUIRED_CATEGORIES.includes(key)}
        />
      ))}
    </StageForm>
  )
}
