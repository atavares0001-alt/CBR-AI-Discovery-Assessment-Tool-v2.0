/**
 * Maps AssessmentWithResponses → DiscoveryData for the new slide components.
 *
 * Assessment responses are stored as generic Record<string, unknown> per stage.
 * This adapter extracts and shapes that data into the typed DiscoveryData format.
 */

import type { AssessmentWithResponses } from '@/lib/types/database'
import type {
  DiscoveryData,
  ProductItem,
  SoftwareItem,
  PainPoint,
  AISolution,
  HeroMetric,
  RoadmapStep,
} from '@/lib/types/discovery'

function getStageAnswers(
  assessment: AssessmentWithResponses,
  stage: string
): Record<string, unknown> {
  const response = assessment.responses.find((r) => r.stage === stage)
  return (response?.answers || {}) as Record<string, unknown>
}

function str(val: unknown, fallback = ''): string {
  if (typeof val === 'string') return val
  if (val == null) return fallback
  return String(val)
}

/**
 * Clean a tool name — strip brackets, quotes, and extra whitespace.
 */
function cleanToolName(raw: string): string {
  return raw
    .replace(/[\[\]"']/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Build the software stack from stage 2 answers.
 */
function buildSoftwareStack(s2: Record<string, unknown>): SoftwareItem[] {
  const categories: { key: string; label: string }[] = [
    { key: 'crm_tool', label: 'CRM / Lead Mgmt' },
    { key: 'data_storage', label: 'Data Storage' },
    { key: 'email_calendar', label: 'Email & Calendar' },
    { key: 'project_management', label: 'Project Mgmt & Comms' },
    { key: 'specialised_software', label: 'Specialised Software' },
    { key: 'automation_tools', label: 'Automation Tools' },
  ]

  return categories.map(({ key, label }) => {
    const raw = str(s2[key])
    const tool = cleanToolName(raw)
    const isNone =
      !tool || tool.toLowerCase() === 'none' || tool.toLowerCase() === 'n/a'
    return {
      category: label,
      tool: isNone ? 'None' : tool,
      status: isNone ? ('gap' as const) : ('active' as const),
    }
  })
}

/**
 * Build pain points from stage 3 time drains.
 */
function buildPainPoints(s3: Record<string, unknown>): PainPoint[] {
  const drainKeys = ['time_drain_1', 'time_drain_2', 'time_drain_3', 'time_drain_4', 'time_drain_5']
  const icons: PainPoint['iconType'][] = ['chat', 'clock', 'bolt', 'rocket', 'cog']
  const colors: PainPoint['color'][] = ['danger', 'warm', 'warm', 'accent', 'accent-light']
  const severities = [95, 85, 75, 65, 55]

  return drainKeys
    .map((key, i) => {
      const val = str(s3[key])
      if (!val) return null
      return {
        title: val,
        severity: severities[i],
        currentState: val,
        businessImpact: 'Impact to be assessed during strategy workshop.',
        currentProcess: 'Current process details to be refined.',
        iconType: icons[i],
        color: colors[i],
      } as PainPoint
    })
    .filter((p): p is PainPoint => p !== null)
}

/**
 * Build default hero metrics for the vision slide.
 */
function buildDefaultHeroMetrics(): HeroMetric[] {
  return [
    { value: '100', suffix: '%', label: 'Calls Answered', subtitle: 'AI handles every inbound', color: 'accent' },
    { value: '0', suffix: '', label: 'Missed Leads', subtitle: 'Every opportunity captured', color: 'accent-light' },
    { value: '100', suffix: '%', label: 'Admin Eliminated', subtitle: 'Team focused on delivery', color: 'warm' },
  ]
}

/**
 * Build default roadmap steps.
 */
function buildDefaultRoadmapSteps(contactName: string): RoadmapStep[] {
  return [
    { number: '01', title: 'Strategy Workshop', description: `Deep-dive session with ${contactName} to align on priorities and define the AI implementation roadmap.`, timeframe: 'Week 1' },
    { number: '02', title: 'Core Automation Build', description: 'Deploy the highest-priority automation solutions identified in this assessment.', timeframe: 'Weeks 2\u20134' },
    { number: '03', title: 'Integration & Testing', description: 'Connect systems, test workflows end-to-end, and train the team on new tools.', timeframe: 'Weeks 4\u20136' },
    { number: '04', title: 'Optimise & Scale', description: 'Fine-tune automations based on real usage data and expand to additional workflows.', timeframe: 'Weeks 6\u201312' },
  ]
}

/**
 * Build vision current/future state items from stage 5 answers.
 */
function buildVisionLists(s3: Record<string, unknown>, s5: Record<string, unknown>): {
  currentStateItems: string[]
  futureStateItems: string[]
} {
  // Build current state from pain points
  const drainKeys = ['time_drain_1', 'time_drain_2', 'time_drain_3', 'time_drain_4', 'time_drain_5']
  const currentStateItems = drainKeys
    .map((key) => str(s3[key]))
    .filter(Boolean)

  // Build future state from vision items
  const visionKeys = ['vision_1', 'vision_2', 'vision_3', 'vision_4', 'vision_5']
  const futureStateItems = visionKeys
    .map((key) => str(s5[key]))
    .filter(Boolean)

  // Provide defaults if empty
  if (currentStateItems.length === 0) {
    currentStateItems.push('Manual processes consuming team time', 'Growth constrained by admin bottleneck')
  }
  if (futureStateItems.length === 0) {
    futureStateItems.push('AI-powered automation handling routine tasks', 'Team focused on high-value work')
  }

  return { currentStateItems, futureStateItems }
}

/**
 * Extract AI-generated solutions from stage_6_data if available.
 */
function buildSolutions(assessment: AssessmentWithResponses): AISolution[] {
  const s6 = assessment.stage_6_data
  if (!s6?.recommended_services?.length) {
    return []
  }

  const icons: AISolution['iconType'][] = ['chat', 'bolt', 'cog', 'rocket', 'shield']
  const colors: AISolution['color'][] = ['accent-light', 'warm', 'accent', 'accent', 'accent-light']

  return s6.recommended_services.map((service, i) => ({
    title: service,
    description: i === 0 && s6.recommended_solution ? s6.recommended_solution : '',
    impact: s6.key_benefit || 'Efficiency improvement',
    effort: 'Medium' as const,
    priority: i + 1,
    iconType: icons[i % icons.length],
    color: colors[i % colors.length],
  }))
}

/**
 * Map autonomy comfort level string to typed value.
 */
function mapAutonomyLevel(val: unknown): DiscoveryData['aiAutonomyLevel'] {
  const s = str(val).toLowerCase()
  if (s.includes('fully') || s.includes('full')) return 'fully-autonomous'
  if (s.includes('human') || s.includes('loop')) return 'human-in-loop'
  return 'semi-autonomous'
}

/**
 * Main adapter: converts AssessmentWithResponses to DiscoveryData.
 */
export function toDiscoveryData(assessment: AssessmentWithResponses): DiscoveryData {
  const s1 = getStageAnswers(assessment, 'stage_1')
  const s2 = getStageAnswers(assessment, 'stage_2')
  const s3 = getStageAnswers(assessment, 'stage_3')
  const s5 = getStageAnswers(assessment, 'stage_5')

  const contactName = assessment.client_name || 'Client'
  const businessName = str(s1['business_name']) || assessment.company_name || 'Your Business'
  const { currentStateItems, futureStateItems } = buildVisionLists(s3, s5)

  const visionKeys = ['vision_1', 'vision_2', 'vision_3', 'vision_4', 'vision_5']
  const focusKeys = ['focus_1', 'focus_2', 'focus_3', 'focus_4', 'focus_5']

  return {
    contactName,
    businessName,
    industry: assessment.industry || str(s1['industry']) || 'Not specified',
    employeeRange: str(s1['employee_count'], 'Not specified'),
    description: str(s1['business_purpose'], `AI Discovery Assessment for ${businessName}.`),
    isDecisionMaker: s1['is_decision_maker'] === true || s1['is_decision_maker'] === 'yes',
    targetClients: str(s1['target_clients']),
    growthStage: str(s1['growth_stage']),
    keyDifferentiator: str(s1['key_differentiator']),
    products: [],

    softwareStack: buildSoftwareStack(s2),

    painPoints: buildPainPoints(s3),
    automationTools: str(s2['automation_tools'], 'None'),
    automationDetails: '',
    taskToEliminate: str(s3['magic_wand_task']),

    budgetRange: str(s5['budget'], 'To be discussed'),
    desiredTimeline: str(s5['timeline'], 'To be discussed'),
    aiAutonomyLevel: mapAutonomyLevel(s5['ai_autonomy']),
    primaryConcern: str(s5['primary_concern'], 'Reliability'),
    visionItems: visionKeys.map((k) => str(s5[k])).filter(Boolean),
    highValueFocus: focusKeys.map((k) => str(s5[k])).filter(Boolean),

    solutions: buildSolutions(assessment),
    currentStateItems,
    futureStateItems,
    heroMetrics: buildDefaultHeroMetrics(),
    roadmapSteps: buildDefaultRoadmapSteps(contactName),
  }
}
