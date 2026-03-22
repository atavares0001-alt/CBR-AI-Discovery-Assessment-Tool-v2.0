/**
 * Discovery Assessment — Data Schema
 *
 * This interface maps to every dynamic field across all 7 slides.
 */

export interface DiscoveryData {
  // ─── Stage 1: Business Profile ───────────────────
  contactName: string
  businessName: string
  industry: string
  employeeRange: string
  description: string
  isDecisionMaker: boolean
  targetClients?: string
  growthStage?: string
  keyDifferentiator?: string

  products: ProductItem[]

  // ─── Stage 2: Software Stack ─────────────────────
  softwareStack: SoftwareItem[]

  // ─── Stage 3: How Things Run Today ───────────────
  painPoints: PainPoint[]
  automationTools: string
  automationDetails: string
  taskToEliminate: string

  // ─── Stage 4: Future Vision ──────────────────────
  budgetRange: string
  desiredTimeline: string
  aiAutonomyLevel: 'fully-autonomous' | 'semi-autonomous' | 'human-in-loop'
  primaryConcern: string
  visionItems: string[]
  highValueFocus: string[]

  postAutomationFocus: string

  // ─── Computed / AI-generated fields ──────────────
  solutions: AISolution[]
  currentStateItems: string[]
  futureStateItems: string[]
  heroMetrics: HeroMetric[]
  roadmapSteps: RoadmapStep[]
}

export interface ProductItem {
  title: string
  description: string
  type: 'core' | 'product' | 'service'
}

export interface SoftwareItem {
  category: string
  tool: string
  status: 'active' | 'gap'
}

export interface PainPoint {
  sourceIndex: number
  title: string
  severity: number
  currentState: string
  businessImpact: string
  currentProcess: string
  iconType: 'chat' | 'clock' | 'bolt' | 'rocket' | 'shield' | 'cog'
  color: 'danger' | 'warm' | 'accent' | 'accent-light'
}

export interface AISolution {
  sourceIndex: number
  title: string
  description: string
  impact: string
  effort: 'Low' | 'Medium' | 'High'
  priority: number
  iconType: 'chat' | 'bolt' | 'cog' | 'shield' | 'rocket'
  color: 'accent' | 'accent-light' | 'warm' | 'danger'
}

export interface HeroMetric {
  value: string
  suffix: string
  label: string
  subtitle: string
  color: 'accent' | 'accent-light' | 'warm' | 'danger'
}

export interface RoadmapStep {
  number: string
  title: string
  description: string
  timeframe: string
}
