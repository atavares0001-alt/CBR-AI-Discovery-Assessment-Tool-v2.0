import type { AIReadinessScore, Response } from '@/lib/types/database'

const CLOUD_TOOLS = [
  'google workspace', 'microsoft 365', 'office 365', 'gmail', 'outlook',
  'hubspot', 'salesforce', 'zoho', 'pipedrive', 'freshsales',
  'asana', 'trello', 'monday', 'clickup', 'jira', 'notion',
  'slack', 'teams', 'microsoft teams',
  'google drive', 'sharepoint', 'dropbox', 'onedrive', 'box',
  'xero', 'myob', 'quickbooks', 'freshbooks',
  'procore', 'buildertrend', 'jobber',
  'rex', 'agentbox', 'vaultre',
  'mindbody', 'fresha', 'cliniko', 'timely',
  'zapier', 'make', 'power automate',
]

function isCloudTool(answer: string): 'cloud' | 'some' | 'none' {
  if (!answer || answer.trim() === '' || answer.toLowerCase() === 'none') {
    return 'none'
  }
  const lower = answer.toLowerCase()
  for (const tool of CLOUD_TOOLS) {
    if (lower.includes(tool)) {
      return 'cloud'
    }
  }
  return 'some'
}

function calculateDigitalMaturity(stage2Answers: Record<string, unknown>): number {
  const fields = [
    'email_calendar',
    'crm_tool',
    'project_management',
    'data_storage',
    'specialised_software',
  ]

  let score = 0
  for (const field of fields) {
    const answer = (stage2Answers[field] as string) || ''
    const result = isCloudTool(answer)
    if (result === 'cloud') score += 2
    else if (result === 'some') score += 1
  }

  return Math.min(score, 10)
}

function calculateAutomationPotential(
  stage3Answers: Record<string, unknown>,
  stage4Answers: Record<string, unknown>
): number {
  // Old assessments may have manual_data_transfer slider; use it if present
  const sliderValue = Number(stage3Answers['manual_data_transfer'] || 0)
  // New assessments store everything in stage_3; old ones used stage_4
  const manualHours = Number(stage3Answers['manual_data_entry_hours'] ?? stage4Answers['manual_data_entry_hours'] ?? 0)

  let hoursScore: number
  if (manualHours <= 2) hoursScore = 1
  else if (manualHours <= 10) hoursScore = 3
  else if (manualHours <= 20) hoursScore = 5
  else hoursScore = 7

  // If old slider data exists, blend it; otherwise use hours score alone
  if (sliderValue > 0) {
    const blended = (sliderValue * 0.4) + (hoursScore * 0.6)
    return Math.min(Math.round(blended * 10) / 10, 10)
  }
  return Math.min(hoursScore, 10)
}

export function calculateAIReadinessScore(responses: Response[]): AIReadinessScore {
  const stage2 = responses.find(r => r.stage === 'stage_2')
  const stage3 = responses.find(r => r.stage === 'stage_3')
  const stage4 = responses.find(r => r.stage === 'stage_4')

  const stage2Answers = (stage2?.answers || {}) as Record<string, unknown>
  const stage3Answers = (stage3?.answers || {}) as Record<string, unknown>
  const stage4Answers = (stage4?.answers || {}) as Record<string, unknown>

  const digitalMaturity = calculateDigitalMaturity(stage2Answers)
  const automationPotential = calculateAutomationPotential(stage3Answers, stage4Answers)
  const overall = Math.round((digitalMaturity * 4) + (automationPotential * 6))

  return {
    overall: Math.min(overall, 100),
    digital_maturity: digitalMaturity,
    automation_potential: automationPotential,
  }
}
