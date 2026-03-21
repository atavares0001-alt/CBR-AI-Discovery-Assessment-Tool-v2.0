export const STAGE_LABELS: Record<string, string> = {
  stage_1: 'Stage 1 — Business Profile',

  stage_2: 'Stage 2 — Software Stack',
  stage_3: 'Stage 3 — How Things Run Today',
  stage_5: 'Stage 4 — Future Vision',
}

export const FIELD_LABELS: Record<string, string> = {
  business_name: 'Business Name',
  website_url: 'Website / Social Media',
  business_purpose: 'What They Do',
  employee_count: 'Number of Employees',
  industry: 'Industry',
  is_decision_maker: 'Is Decision Maker',
  decision_maker_name: 'Decision Maker',
  email_calendar: 'Email & Calendar',
  crm_tool: 'CRM/Lead Management',
  project_management: 'Project Management & Comms',
  data_storage: 'Data Storage',
  specialised_software: 'Specialised Software',
  automation_tools: 'Automation Tools',
  manual_data_transfer: 'Manual Data Transfer (1–10)',
  time_drain_1: 'Time Drain #1',
  time_drain_2: 'Time Drain #2',
  time_drain_3: 'Time Drain #3',
  time_drain_4: 'Time Drain #4',
  time_drain_5: 'Time Drain #5',
  manual_data_entry_hours: 'Manual Data Entry Hours/Week',
  magic_wand_task: 'Task to Eliminate',
  vision_1: 'Vision #1',
  vision_2: 'Vision #2',
  vision_3: 'Vision #3',
  vision_4: 'Vision #4',
  vision_5: 'Vision #5',
  focus_1: 'High-Value Focus #1',
  focus_2: 'High-Value Focus #2',
  focus_3: 'High-Value Focus #3',
  focus_4: 'High-Value Focus #4',
  focus_5: 'High-Value Focus #5',
  ai_autonomy: 'AI Autonomy Comfort Level',
  primary_concern: 'Primary AI Concern',
  timeline: 'Desired Timeline',
  budget: 'Budget Range',
}

export const STAGE_ORDER = ['stage_1', 'stage_2', 'stage_3', 'stage_5'] as const

export const SLIDE_TITLES: Record<string, string> = {
  cover: 'Discovery Assessment',
  score: 'AI Readiness Score',
  business: 'Business Profile',
  techstack: 'Technology Stack',
  workflows: 'Under the Hood',
  vision: 'Future Vision',
  recommendations: 'Recommendations',
  quote: 'Investment Proposal',
  closing: 'Next Steps',
}

export const SLIDE_ORDER = [
  'cover',
  'business',
  'techstack',
  'workflows',
  'vision',
  'score',
  'recommendations',
  'quote',
  'closing',
] as const
