export type AssessmentStatus =
  | 'draft'
  | 'sent'
  | 'in_progress'
  | 'client_complete'
  | 'recommendations_added'
  | 'quote_added'
  | 'report_generated'
  | 'quote_sent'
  | 'accepted'
  | 'lost'

export type Industry =
  | 'Construction & Trades'
  | 'Real Estate'
  | 'Professional Services'
  | 'Health & Beauty'
  | 'Other'

export type StageName =
  | 'stage_1'
  | 'stage_1b'
  | 'stage_2'
  | 'stage_3'
  | 'stage_4'
  | 'stage_5'

export interface AIReadinessScore {
  overall: number
  digital_maturity: number
  automation_potential: number
}

export interface Stage6Data {
  executive_summary: string
  recommended_solution: string
  automation_logic: string
  key_benefit: string
  recommended_services: string[]
  detailed_recommendations: string
}

export interface QuoteLineItem {
  id: string
  name: string
  description: string
  one_time_cost: number
  monthly_cost: number
}

export interface Stage7Data {
  package: 'Foundation' | 'Acceleration' | 'Transformation'
  setup_cost: number
  monthly_maintenance: number
  monthly_api_costs: number
  line_items: QuoteLineItem[]
  proposed_timeline: string
  next_steps: string
  internal_notes: string
}

export interface Assessment {
  id: string
  consultant_id: string
  client_name: string
  client_email: string | null
  company_name: string | null
  industry: Industry | null
  status: AssessmentStatus
  share_token: string
  token_expires_at: string
  current_stage: number
  ai_readiness_score: AIReadinessScore | null
  stage_6_data: Stage6Data | null
  stage_7_data: Stage7Data | null
  consent_given_at: string | null
  created_at: string
  updated_at: string
}

export interface Response {
  id: string
  assessment_id: string
  stage: StageName
  answers: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface AssessmentWithResponses extends Assessment {
  responses: Response[]
}
