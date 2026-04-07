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
 * Clean a display string — strip brackets, quotes, and extra whitespace.
 * Used for tool names, concerns, vision items, and any user-facing text.
 */
function cleanDisplayText(raw: string): string {
  // Try to parse as JSON array first and join nicely
  try {
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) {
      return parsed.map(item => String(item).replace(/[\[\]"']/g, '').trim()).filter(Boolean).join(', ')
    }
  } catch {
    // Not JSON, just clean the string
  }
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
    { key: 'accounting_software', label: 'Accounting & Finance' },
    { key: 'specialised_software', label: 'Specialised Software' },
    { key: 'social_media', label: 'Social Media' },
    { key: 'website_hosting', label: 'Website Hosting' },
    { key: 'automation_tools', label: 'Automation Tools' },
  ]

  const itemsByKey: Record<string, SoftwareItem> = {}
  const items: SoftwareItem[] = categories.map(({ key, label }) => {
    const raw = str(s2[key])
    const tool = cleanDisplayText(raw)
    const savedStatus = str(s2[`${key}_status`])
    const isNone =
      !tool || tool.toLowerCase() === 'none' || tool.toLowerCase() === 'n/a'

    let status: 'active' | 'gap'
    if (savedStatus === 'active') {
      status = 'active'
    } else if (savedStatus === 'gap' || savedStatus === 'n/a') {
      status = 'gap'
    } else {
      status = isNone ? 'gap' : 'active'
    }

    const item: SoftwareItem = {
      category: label,
      tool: savedStatus === 'n/a' ? 'N/A' : isNone ? 'None' : tool,
      status,
    }
    itemsByKey[key] = item
    return item
  })

  // Apply saved order if present (stored as category key array)
  const savedOrder = str(s2['techstack_order'])
  if (savedOrder) {
    try {
      const keyOrder: string[] = JSON.parse(savedOrder)
      const reordered: SoftwareItem[] = []
      for (const k of keyOrder) {
        if (itemsByKey[k]) reordered.push(itemsByKey[k])
      }
      // Append any items not in the saved order
      for (const item of items) {
        if (!reordered.includes(item)) reordered.push(item)
      }
      if (reordered.length > 0) return reordered
    } catch { }
  }

  return items
}

/**
 * Build pain points from stage 3 time drains.
 * Reads saved order, severity, impact, and process from responses.
 */
function buildPainPoints(s3: Record<string, unknown>): PainPoint[] {
  const drainKeys = ['time_drain_1', 'time_drain_2', 'time_drain_3', 'time_drain_4', 'time_drain_5']
  const icons: PainPoint['iconType'][] = ['chat', 'clock', 'bolt', 'rocket', 'cog']
  const colors: PainPoint['color'][] = ['danger', 'warm', 'warm', 'accent', 'accent-light']
  const severities = [95, 85, 75, 65, 55]

  const items = drainKeys
    .map((key, i) => {
      const val = str(s3[key])
      if (!val) return null
      const savedSeverity = s3[`${key}_severity`]
      return {
        sourceIndex: i,
        title: val,
        severity: savedSeverity != null ? Number(savedSeverity) : severities[i],
        currentState: val,
        businessImpact: str(s3[`${key}_impact`]) || 'Impact to be assessed during strategy workshop.',
        currentProcess: str(s3[`${key}_process`]) || 'Current process details to be refined.',
        iconType: icons[i],
        color: colors[i],
      } as PainPoint
    })
    .filter((p): p is PainPoint => p !== null)

  // Apply saved order if present
  const savedOrder = s3['pain_point_order']
  if (savedOrder && typeof savedOrder === 'string') {
    try {
      const orderIndices: number[] = JSON.parse(savedOrder)
      const reordered: PainPoint[] = []
      for (const idx of orderIndices) {
        if (items[idx]) reordered.push(items[idx])
      }
      // Append any items not in the saved order (e.g. newly added)
      for (let i = 0; i < items.length; i++) {
        if (!orderIndices.includes(i)) reordered.push(items[i])
      }
      if (reordered.length > 0) return reordered
    } catch { }
  }

  return items
}

/**
 * Build hero metrics for the vision slide.
 * Reads saved edits from stage_5 responses first, falls back to defaults.
 */
function buildHeroMetrics(s5: Record<string, unknown>): HeroMetric[] {
  const defaults: HeroMetric[] = [
    { value: '100', suffix: '%', label: 'Calls Answered', subtitle: 'AI handles every inbound', color: 'accent' },
    { value: '0', suffix: '', label: 'Missed Leads', subtitle: 'Every opportunity captured', color: 'accent-light' },
    { value: '100', suffix: '%', label: 'Admin Eliminated', subtitle: 'Team focused on delivery', color: 'warm' },
  ]

  return defaults.map((m, i) => {
    const idx = i + 1
    return {
      value: str(s5[`hero_metric_${idx}_value`]) || m.value,
      suffix: s5[`hero_metric_${idx}_suffix`] != null ? str(s5[`hero_metric_${idx}_suffix`]) : m.suffix,
      label: str(s5[`hero_metric_${idx}_label`]) || m.label,
      subtitle: str(s5[`hero_metric_${idx}_subtitle`]) || m.subtitle,
      color: m.color,
    }
  })
}

/**
 * Build roadmap steps.
 * Reads saved edits from stage_5 responses first, falls back to defaults.
 */
function buildRoadmapSteps(s5: Record<string, unknown>, contactName: string): RoadmapStep[] {
  const defaults: RoadmapStep[] = [
    { number: '01', title: 'Strategy Workshop', description: `Deep-dive session with ${contactName} to align on priorities and define the AI implementation roadmap.`, timeframe: 'Week 1' },
    { number: '02', title: 'Core Automation Build', description: 'Deploy the highest-priority automation solutions identified in this assessment.', timeframe: 'Weeks 2\u20134' },
    { number: '03', title: 'Integration & Testing', description: 'Connect systems, test workflows end-to-end, and train the team on new tools.', timeframe: 'Weeks 4\u20136' },
    { number: '04', title: 'Optimise & Scale', description: 'Fine-tune automations based on real usage data and expand to additional workflows.', timeframe: 'Weeks 6\u201312' },
  ]

  return defaults.map((step, i) => {
    const idx = i + 1
    return {
      number: step.number,
      title: str(s5[`roadmap_${idx}_title`]) || step.title,
      description: str(s5[`roadmap_${idx}_description`]) || step.description,
      timeframe: str(s5[`roadmap_${idx}_timeframe`]) || step.timeframe,
    }
  })
}

/**
 * Build vision current/future state items.
 * Reads from saved current_state_* / future_state_* fields first,
 * falls back to deriving from pain points / vision items.
 */
function buildVisionLists(s3: Record<string, unknown>, s5: Record<string, unknown>): {
  currentStateItems: string[]
  futureStateItems: string[]
} {
  // Check for saved comparison list edits first
  const savedCurrent: string[] = []
  const savedFuture: string[] = []
  for (let i = 1; i <= 10; i++) {
    const cs = s5[`current_state_${i}`]
    if (cs && typeof cs === 'string' && cs.trim()) savedCurrent.push(cleanDisplayText(cs))
    const fs = s5[`future_state_${i}`]
    if (fs && typeof fs === 'string' && fs.trim()) savedFuture.push(cleanDisplayText(fs))
  }

  // Use saved values if they exist, otherwise derive from source data
  const currentStateItems = savedCurrent.length > 0
    ? savedCurrent
    : ['time_drain_1', 'time_drain_2', 'time_drain_3', 'time_drain_4', 'time_drain_5']
      .map((key) => cleanDisplayText(str(s3[key])))
      .filter(Boolean)

  const futureStateItems = savedFuture.length > 0
    ? savedFuture
    : ['vision_1', 'vision_2', 'vision_3', 'vision_4', 'vision_5']
      .map((key) => cleanDisplayText(str(s5[key])))
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
 * Extract AI-generated solutions from stage_6_data, then overlay
 * any saved edits from stage_6 responses (title, description, effort, priority, order).
 */
function buildSolutions(assessment: AssessmentWithResponses): AISolution[] {
  const s6 = assessment.stage_6_data
  if (!s6?.recommended_services?.length) {
    return []
  }

  const s6Responses = getStageAnswers(assessment, 'stage_6')

  const icons: AISolution['iconType'][] = ['chat', 'bolt', 'cog', 'rocket', 'shield']
  const colors: AISolution['color'][] = ['accent-light', 'warm', 'accent', 'accent', 'accent-light']

  const items = s6.recommended_services.map((service, i) => {
    const idx = i + 1
    // Reconstruct impact from saved benefit edits if they exist
    const savedBenefits: string[] = []
    for (let b = 1; b <= 10; b++) {
      const val = s6Responses[`solution_${idx}_benefit_${b}`]
      if (val && typeof val === 'string' && val.trim()) savedBenefits.push(val.trim())
    }
    const rawPriority = s6Responses[`solution_${idx}_priority`] != null ? Number(s6Responses[`solution_${idx}_priority`]) : i + 1
    return {
      sourceIndex: i,
      title: str(s6Responses[`solution_${idx}_title`]) || service,
      description: str(s6Responses[`solution_${idx}_description`]) || (i === 0 && s6.recommended_solution ? s6.recommended_solution : ''),
      impact: savedBenefits.length > 0 ? savedBenefits.join(', ') : (s6.key_benefit || 'Efficiency improvement'),
      effort: (str(s6Responses[`solution_${idx}_effort`]) || 'Medium') as AISolution['effort'],
      priority: Math.min(Math.max(rawPriority, 1), 4),
      iconType: icons[i % icons.length],
      color: colors[i % colors.length],
    }
  })

  // Apply saved order if present
  const savedOrder = s6Responses['solution_order']
  if (savedOrder && typeof savedOrder === 'string') {
    try {
      const orderIndices: number[] = JSON.parse(savedOrder)
      const reordered: AISolution[] = []
      for (const idx of orderIndices) {
        if (items[idx]) reordered.push(items[idx])
      }
      for (let i = 0; i < items.length; i++) {
        if (!orderIndices.includes(i)) reordered.push(items[i])
      }
      if (reordered.length > 0) return reordered
    } catch { }
  }

  return items
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
    primaryConcern: cleanDisplayText(str(s5['primary_concern'], 'Reliability')),
    visionItems: visionKeys.map((k) => cleanDisplayText(str(s5[k]))).filter(Boolean),
    highValueFocus: focusKeys.map((k) => cleanDisplayText(str(s5[k]))).filter(Boolean),

    postAutomationFocus: str(s5['automated_focus'], 'Delivery & Growth'),

    solutions: buildSolutions(assessment),
    currentStateItems,
    futureStateItems,
    heroMetrics: buildHeroMetrics(s5),
    roadmapSteps: buildRoadmapSteps(s5, contactName),
  }
}
