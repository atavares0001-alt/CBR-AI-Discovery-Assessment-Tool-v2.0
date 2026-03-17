'use client'

import { GlassCard } from '@/components/ui/GlassCard'
import type { Response } from '@/lib/types/database'

const STAGE_LABELS: Record<string, string> = {
  stage_1: 'Stage 1 — Business Profile',
  stage_1b: 'Stage 1b — Industry Details',
  stage_2: 'Stage 2 — Software Stack',
  stage_3: 'Stage 3 — Workflows & Automations',
  stage_4: 'Stage 4 — Pain Points',
  stage_5: 'Stage 5 — Future Vision',
}

const FIELD_LABELS: Record<string, string> = {
  business_name: 'Business Name',
  website_url: 'Website URL',
  business_purpose: 'Primary Purpose',
  core_products: 'Core Products/Services',
  employee_count: 'Number of Employees',
  bottleneck_department: 'Biggest Bottleneck',
  industry: 'Industry',
  is_decision_maker: 'Is Decision Maker',
  decision_maker_name: 'Decision Maker',
  email_calendar: 'Email & Calendar',
  crm_tool: 'CRM/Lead Management',
  project_management: 'Project Management & Comms',
  data_storage: 'Data Storage',
  specialised_software: 'Specialised Software',
  automation_tools: 'Automation Tools',
  lead_process: 'Lead/Enquiry Process',
  invoice_process: 'Invoice & Contract Process',
  auto_replies: 'Auto-replies/Chatbots',
  manual_data_transfer: 'Manual Data Transfer (1–10)',
  repetitive_task: 'Most Repetitive Task',
  manual_data_entry_hours: 'Manual Data Entry Hours/Week',
  human_errors: 'Common Human Errors',
  response_time: 'Customer Enquiry Response Time',
  magic_wand_task: 'Task to Eliminate',
  success_vision: '6-Month Success Vision',
  automated_focus: 'Focus After Automation',
  ai_autonomy: 'AI Autonomy Comfort Level',
  primary_concern: 'Primary AI Concern',
  timeline: 'Desired Timeline',
  budget: 'Budget Range',
  lead_tracking: 'Lead Tracking',
  quote_time_hours: 'Quote Time (hours)',
  missed_calls_weekly: 'Missed Calls/Week',
  biggest_admin_task: 'Biggest Admin Task',
  weekly_enquiries: 'Weekly Enquiries',
  inspection_process: 'Inspection Booking Process',
  after_hours_leads: 'After-Hours Lead Handling',
  crm_system: 'CRM System',
  drafting_hours: 'Drafting Hours/Week',
  onboarding_process: 'Client Onboarding Process',
  repeat_questions: 'Repeat Questions Handling',
  current_ai_tools: 'Current AI Tools',
  weekly_appointments: 'Weekly Appointments',
  noshow_rate: 'No-Show Rate (%)',
  booking_system: 'Booking System',
  reception_struggles: 'Reception Struggles',
}

interface ResponsesTabProps {
  responses: Response[]
}

export function ResponsesTab({ responses }: ResponsesTabProps) {
  const stageOrder = ['stage_1', 'stage_1b', 'stage_2', 'stage_3', 'stage_4', 'stage_5']
  const sorted = stageOrder
    .map((stage) => responses.find((r) => r.stage === stage))
    .filter(Boolean) as Response[]

  if (sorted.length === 0) {
    return (
      <div className="py-12 text-center text-text-muted">
        No client responses yet. The client has not started the assessment.
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {sorted.map((response) => (
        <div key={response.stage}>
          <h3 className="mb-4 text-sm font-semibold text-accent">
            {STAGE_LABELS[response.stage] || response.stage}
          </h3>
          <div className="space-y-3">
            {Object.entries(response.answers as Record<string, unknown>).map(([key, value]) => {
              if (!value && value !== 0) return null
              return (
                <GlassCard key={key} className="p-4">
                  <p className="text-xs uppercase text-text-muted">
                    {FIELD_LABELS[key] || key.replace(/_/g, ' ')}
                  </p>
                  <p className="mt-1 text-sm">{String(value)}</p>
                </GlassCard>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
