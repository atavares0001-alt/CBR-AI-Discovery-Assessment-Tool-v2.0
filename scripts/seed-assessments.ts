/**
 * Seed script: Creates 5 fully completed assessments with varying detail levels.
 *
 * Usage:
 *   npx tsx scripts/seed-assessments.ts
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 */

import { createClient } from '@supabase/supabase-js'
import { randomBytes } from 'crypto'
import { readFileSync } from 'fs'
import { resolve } from 'path'

// Load .env.local manually (no dotenv dependency needed)
const envPath = resolve(__dirname, '..', '.env.local')
const envContent = readFileSync(envPath, 'utf-8')
for (const line of envContent.split('\n')) {
  const trimmed = line.trim()
  if (!trimmed || trimmed.startsWith('#')) continue
  const eqIdx = trimmed.indexOf('=')
  if (eqIdx === -1) continue
  const key = trimmed.slice(0, eqIdx).trim()
  const val = trimmed.slice(eqIdx + 1).trim()
  if (!process.env[key]) process.env[key] = val
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

function token() {
  return randomBytes(6).toString('base64url').slice(0, 12)
}
function expiry() {
  return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
}
function uuid() {
  return crypto.randomUUID()
}

// ---------------------------------------------------------------------------
// Assessment 1: Construction company — VERY detailed, all fields filled
// ---------------------------------------------------------------------------
const assessment1 = {
  client_name: 'Mark Thompson',
  client_email: 'mark@thompsonbuilders.com.au',
  company_name: 'Thompson Builders Pty Ltd',
  industry: 'Construction & Trades',
  status: 'quote_added',
  share_token: token(),
  token_expires_at: expiry(),
  current_stage: 5,
  consent_given_at: new Date().toISOString(),
  ai_readiness_score: { overall: 42, digital_maturity: 4, automation_potential: 3.8 },
  stage_6_data: {
    executive_summary:
      'Thompson Builders operates a successful mid-size construction business with 32 employees but relies heavily on manual processes. Lead tracking is done via spreadsheets, quotes take 24+ hours to produce, and the team misses an estimated 15 calls per week. There is significant opportunity to automate front-of-house operations, quote generation, and client communications. The business has a clear appetite for change with the owner as the decision maker and an immediate implementation timeline.',
    recommended_solution: 'AI Receptionist + Automated Quote Pipeline + CRM Integration',
    automation_logic:
      'Inbound calls → AI receptionist screens and qualifies → Qualified leads auto-entered into HubSpot → Quote template auto-populated from site details → Follow-up email sequence triggered → Weekly pipeline report to Mark',
    key_benefit: 'Recover 15+ missed calls/week, reduce quote turnaround from 24hrs to 2hrs, eliminate 20hrs/week of admin',
    recommended_services: ['AI Receptionist', 'Workflow Automation', 'CRM Integration', 'Email Automation'],
    detailed_recommendations:
      'Phase 1 (Weeks 1-2): Deploy AI receptionist to handle inbound calls, screen enquiries, and capture lead details. Integrate with existing Google Workspace for calendar booking.\n\nPhase 2 (Weeks 3-4): Set up HubSpot CRM with custom pipeline stages for construction projects. Migrate existing spreadsheet data. Configure automated quote template system using project specifications.\n\nPhase 3 (Weeks 5-6): Build email automation sequences for post-quote follow-up, project milestone updates, and review requests. Create weekly dashboard report for pipeline visibility.\n\nExpected ROI: Based on current missed call volume and average project value of $45,000, recovering even 30% of missed leads could generate an additional $200,000+ in annual revenue.',
  },
  stage_7_data: {
    package: 'Acceleration' as const,
    setup_cost: 6500,
    monthly_maintenance: 590,
    monthly_api_costs: 120,
    line_items: [
      { id: uuid(), name: 'AI Receptionist Setup', description: 'Configure AI phone system with call routing, voicemail transcription, and lead capture', one_time_cost: 2500, monthly_cost: 200 },
      { id: uuid(), name: 'HubSpot CRM Integration', description: 'CRM setup, data migration from spreadsheets, custom pipeline configuration', one_time_cost: 2000, monthly_cost: 150 },
      { id: uuid(), name: 'Automated Quote System', description: 'Template-based quote generation with project spec auto-fill', one_time_cost: 1500, monthly_cost: 100 },
      { id: uuid(), name: 'Email Automation Sequences', description: 'Post-quote follow-up, milestone updates, and review request campaigns', one_time_cost: 500, monthly_cost: 140 },
    ],
    proposed_timeline: '6 weeks',
    next_steps:
      '1. Sign proposal and schedule kickoff call\n2. Provide access to current phone system and Google Workspace\n3. Share existing client spreadsheet for CRM migration\n4. Review and approve quote templates\n5. Schedule team training session for Week 5',
    internal_notes: 'High-value prospect. Mark is the sole decision maker and wants to start immediately. Current pain around missed calls is acute — they lost a $120k job last month because they didn\'t return a call for 48hrs. Budget approved at board level.',
  },
}

const responses1 = [
  {
    stage: 'stage_1',
    answers: {
      contact_name: 'Mark Thompson',
      business_name: 'Thompson Builders Pty Ltd',
      website_url: 'https://thompsonbuilders.com.au',
      business_purpose: 'Residential and commercial construction services across the ACT and surrounding NSW regions. We specialise in new builds, renovations, and project management for projects ranging from $50k to $2M.',
      core_products: 'New home construction, commercial fit-outs, bathroom and kitchen renovations, project management services, and design-build packages. We also offer maintenance contracts for commercial clients.',
      employee_count: '21-50',
      bottleneck_department: 'Administration and front office — our office manager handles calls, quotes, scheduling, invoicing, and client follow-ups all manually. She\'s overwhelmed and we\'re dropping balls.',
      industry: 'Construction & Trades',
      is_decision_maker: 'Yes',
    },
  },
  {
    stage: 'stage_1b',
    answers: {
      lead_tracking: 'We use a shared Google Sheet that our office manager updates manually. Leads come in via phone, email, website contact form, and word-of-mouth referrals. Most phone leads get written on sticky notes first and entered into the spreadsheet later — sometimes days later. We have no way to track which leads convert or where they came from.',
      quote_time_hours: '24',
      missed_calls_weekly: '15',
      biggest_admin_task: 'Creating and sending quotes. Each quote requires measuring up, costing materials, calculating labour, formatting the document, and emailing it to the client. Our office manager spends about 3-4 hours per quote, and we do 8-10 quotes per week. Most of this is repetitive formatting and data entry.',
    },
  },
  {
    stage: 'stage_2',
    answers: {
      email_calendar: 'Google Workspace',
      crm_tool: 'None',
      project_management: 'Trello',
      data_storage: 'Google Drive',
      accounting_software: 'Xero',
      specialised_software: 'None',
    },
  },
  {
    stage: 'stage_3',
    answers: {
      automation_tools: 'None — everything is manual. We\'ve looked at Zapier before but never set it up.',
      lead_process: 'Phone call or email comes in → office manager writes down details → enters into Google Sheet within 1-2 days → Mark reviews the sheet weekly → calls back qualified leads → arranges site visit → creates quote manually in Word → emails to client → follows up by phone if no response after a week',
      invoice_process: 'Project manager emails completed milestone details to office → office manager creates invoice in Xero manually → emails to client → chases payment by phone if overdue → updates spreadsheet tracker',
      auto_replies: 'No automated responses at all. If someone calls after hours or on weekends, they get voicemail. We try to call back Monday morning but often miss the window.',
      manual_data_transfer: '8',
    },
  },
  {
    stage: 'stage_4',
    answers: {
      repetitive_task: 'Formatting quotes. Every single quote follows the same structure but our office manager types them up from scratch each time in Word. She copies sections from old quotes but still spends 3-4 hours per quote. With 8-10 quotes per week, that\'s 30+ hours just on quotes.',
      manual_data_entry_hours: '35',
      human_errors: 'Wrong pricing on quotes (using outdated material costs), double-booking site visits, forgetting to follow up on sent quotes, losing lead details from sticky notes, and invoicing for wrong amounts because milestone completion dates are tracked manually.',
      response_time: 'Usually 24-48 hours for phone enquiries, sometimes longer on weekends. Email enquiries can take 2-3 days if the office manager is busy with quotes.',
      magic_wand_task: 'I wish every phone call was automatically answered, the caller\'s details captured, and a qualified lead sent straight to my phone with all the info I need to decide if it\'s worth a site visit. No more sticky notes, no more missed calls, no more calling people back days later.',
    },
  },
  {
    stage: 'stage_5',
    answers: {
      success_vision: 'In 6 months I want: zero missed calls during business hours, quotes sent within 4 hours of a site visit instead of 2 days, a proper CRM showing me exactly where every lead and project sits, and my office manager freed up to focus on project coordination instead of admin. Measurably, I want to recover at least 5 of those 15 missed calls per week as real leads.',
      automated_focus: 'If admin was handled, I\'d spend more time on-site with my project managers, build relationships with architects and designers for referral partnerships, and finally develop our design-build service offering which has much higher margins.',
      ai_autonomy: 'Semi-autonomous',
      primary_concern: 'Reliability',
      timeline: 'Immediately',
      budget: '$5k–$20k',
    },
  },
]

// ---------------------------------------------------------------------------
// Assessment 2: Real Estate — detailed with moderate info
// ---------------------------------------------------------------------------
const assessment2 = {
  client_name: 'Sarah Chen',
  client_email: 'sarah@chenrealty.com.au',
  company_name: 'Chen Realty Group',
  industry: 'Real Estate',
  status: 'recommendations_added',
  share_token: token(),
  token_expires_at: expiry(),
  current_stage: 5,
  consent_given_at: new Date().toISOString(),
  ai_readiness_score: { overall: 68, digital_maturity: 8, automation_potential: 4.6 },
  stage_6_data: {
    executive_summary:
      'Chen Realty is digitally mature with strong cloud tool adoption but underutilises automation. The team handles 80+ enquiries per week manually. An AI receptionist and automated inspection booking system would dramatically reduce admin load.',
    recommended_solution: 'AI Receptionist + Inspection Booking Automation + Lead Nurture Sequences',
    automation_logic:
      'Website/phone enquiry → AI qualifies buyer/seller → Auto-schedules inspection from availability → Sends property pack → Follows up post-inspection → Updates Rex CRM',
    key_benefit: 'Handle 80+ weekly enquiries automatically, eliminate double-booked inspections, improve after-hours lead capture',
    recommended_services: ['AI Receptionist', 'Scheduling Automation', 'Email Automation', 'CRM Integration'],
    detailed_recommendations:
      'Deploy AI receptionist for after-hours lead capture. Integrate Calendly with Rex CRM for automated inspection scheduling. Build email drip campaigns for buyer nurture post-inspection.',
  },
  stage_7_data: null,
}

const responses2 = [
  {
    stage: 'stage_1',
    answers: {
      contact_name: 'Sarah Chen',
      business_name: 'Chen Realty Group',
      website_url: 'https://chenrealty.com.au',
      business_purpose: 'Boutique real estate agency specialising in residential sales and property management across Canberra\'s inner suburbs.',
      core_products: 'Residential property sales, property management, buyer advocacy, and off-market transactions.',
      employee_count: '6-20',
      bottleneck_department: 'Front desk and admin — managing inspection bookings and enquiry responses',
      industry: 'Real Estate',
      is_decision_maker: 'Yes',
    },
  },
  {
    stage: 'stage_1b',
    answers: {
      weekly_enquiries: '80',
      inspection_process: 'Buyers call or email to request an inspection. Our admin checks agent availability in Google Calendar, confirms a time, sends the address and access details via email, then adds it to the property\'s inspection schedule in Rex. Double-bookings happen weekly.',
      after_hours_leads: 'We get a lot of enquiries after 6pm and on weekends from portal listings. They sit in our inbox until the next business day. By then, buyers have often already booked with another agency.',
      crm_system: 'Rex CRM — we use it for listings and contact management but barely scratch the surface of its automation features.',
    },
  },
  {
    stage: 'stage_2',
    answers: {
      email_calendar: 'Google Workspace',
      crm_tool: 'Salesforce',
      project_management: 'Slack',
      data_storage: 'Google Drive',
      accounting_software: 'Xero',
      specialised_software: 'Rex',
    },
  },
  {
    stage: 'stage_3',
    answers: {
      automation_tools: 'Zapier — we have a few basic zaps but they break regularly and nobody knows how to fix them.',
      lead_process: 'Portal enquiry → email notification → admin manually responds with property info → books inspection via phone/email → adds to calendar → sends reminder day before',
      invoice_process: 'Commission calculated manually → invoice created in Xero → sent to solicitor → reconciled on settlement',
      auto_replies: 'Basic auto-reply on our website contact form that says "we\'ll be in touch"',
      manual_data_transfer: '6',
    },
  },
  {
    stage: 'stage_4',
    answers: {
      repetitive_task: 'Responding to inspection enquiries. Same questions, same property details, same booking process — repeated 80+ times a week.',
      manual_data_entry_hours: '12',
      human_errors: 'Double-booked inspections, sending wrong property details to buyers, forgetting to follow up post-inspection.',
      response_time: 'Same day during business hours, next business day for after-hours enquiries',
      magic_wand_task: 'Automatic inspection booking — buyer enquires, gets instant property details, picks a time that works for everyone, confirmation sent, reminder scheduled, all without a human touching it.',
    },
  },
  {
    stage: 'stage_5',
    answers: {
      success_vision: 'Zero double-bookings, all after-hours enquiries handled instantly, and our admin spending time on client relationships instead of booking inspections.',
      automated_focus: 'Building our buyer advocacy service and spending more time with vendors on marketing strategy.',
      ai_autonomy: 'Semi-autonomous',
      primary_concern: 'Data security',
      timeline: '1–3 months',
      budget: '$5k–$20k',
    },
  },
]

// ---------------------------------------------------------------------------
// Assessment 3: IT Consulting — minimal info, sparse answers
// ---------------------------------------------------------------------------
const assessment3 = {
  client_name: 'Dave Wilson',
  client_email: 'dave@wilsonit.com.au',
  company_name: 'Wilson IT Solutions',
  industry: 'IT & Technology',
  status: 'client_complete',
  share_token: token(),
  token_expires_at: expiry(),
  current_stage: 5,
  consent_given_at: new Date().toISOString(),
  ai_readiness_score: { overall: 76, digital_maturity: 10, automation_potential: 2.8 },
  stage_6_data: null,
  stage_7_data: null,
}

const responses3 = [
  {
    stage: 'stage_1',
    answers: {
      contact_name: 'Dave Wilson',
      business_name: 'Wilson IT Solutions',
      business_purpose: 'IT consulting and managed services',
      employee_count: '2–5',
      industry: 'IT & Technology',
      is_decision_maker: 'Yes',
    },
  },
  {
    stage: 'stage_2',
    answers: {
      email_calendar: 'Google Workspace',
      crm_tool: 'HubSpot',
      project_management: 'Jira',
      data_storage: 'Google Drive',
      accounting_software: 'Xero',
      specialised_software: 'Notion',
    },
  },
  {
    stage: 'stage_3',
    answers: {
      automation_tools: 'Zapier',
      lead_process: 'Website form → HubSpot → I call them',
      invoice_process: 'Xero, mostly automated',
      auto_replies: 'HubSpot auto-reply on form submission',
      manual_data_transfer: '2',
    },
  },
  {
    stage: 'stage_4',
    answers: {
      repetitive_task: 'Writing proposals',
      manual_data_entry_hours: '3',
      response_time: 'Within the hour',
    },
  },
  {
    stage: 'stage_5',
    answers: {
      success_vision: 'Automate proposal generation and follow-ups',
      ai_autonomy: 'Full autonomy',
      primary_concern: 'Cost/ROI',
      timeline: '3–6 months',
      budget: 'Under $5k',
    },
  },
]

// ---------------------------------------------------------------------------
// Assessment 4: Health & Beauty — good detail, complete with quote
// ---------------------------------------------------------------------------
const assessment4 = {
  client_name: 'Lisa Nguyen',
  client_email: 'lisa@glowskin.com.au',
  company_name: 'Glow Skin Clinic',
  industry: 'Health & Beauty',
  status: 'quote_added',
  share_token: token(),
  token_expires_at: expiry(),
  current_stage: 5,
  consent_given_at: new Date().toISOString(),
  ai_readiness_score: { overall: 52, digital_maturity: 6, automation_potential: 3.4 },
  stage_6_data: {
    executive_summary:
      'Glow Skin Clinic has 3 locations with 150+ weekly appointments but a 20% no-show rate costing an estimated $4,500/week in lost revenue. Their booking system (Fresha) is underutilised and the reception team is overwhelmed handling rebookings, confirmations, and product enquiries. There\'s a strong case for an AI receptionist to handle after-hours bookings and automated reminder sequences to reduce no-shows.',
    recommended_solution: 'AI Receptionist + Smart Booking Reminders + Post-Treatment Follow-up Automation',
    automation_logic:
      'Client calls/messages → AI handles booking/rescheduling via Fresha API → Automated SMS reminders at 48hr and 2hr → Post-treatment product recommendation email → Rebooking prompt at optimal interval',
    key_benefit: 'Reduce no-show rate from 20% to under 5%, saving ~$3,600/week in recovered appointments',
    recommended_services: ['AI Receptionist', 'Scheduling Automation', 'Email Automation', 'Chatbot Solutions'],
    detailed_recommendations:
      'Phase 1: Deploy AI receptionist for after-hours booking and rescheduling. Integrate with Fresha booking system.\n\nPhase 2: Implement tiered SMS/email reminder sequence (48hr, 24hr, 2hr) with easy reschedule link to reduce no-shows.\n\nPhase 3: Build post-treatment email automation with personalised product recommendations and optimal rebooking prompts based on treatment type.',
  },
  stage_7_data: {
    package: 'Foundation' as const,
    setup_cost: 3900,
    monthly_maintenance: 390,
    monthly_api_costs: 85,
    line_items: [
      { id: uuid(), name: 'AI Receptionist', description: 'After-hours call handling, booking, and rescheduling via Fresha', one_time_cost: 1800, monthly_cost: 180 },
      { id: uuid(), name: 'Smart Reminder System', description: 'Tiered SMS/email reminders with easy reschedule links', one_time_cost: 1200, monthly_cost: 120 },
      { id: uuid(), name: 'Post-Treatment Automation', description: 'Product recommendations and rebooking prompts', one_time_cost: 900, monthly_cost: 90 },
    ],
    proposed_timeline: '4 weeks',
    next_steps:
      '1. Sign proposal\n2. Grant Fresha API access\n3. Provide treatment menu and rebooking intervals\n4. Review and approve reminder message templates',
    internal_notes: 'Lisa is motivated by the no-show problem. $3,600/week in recovered revenue makes the ROI very clear. She wants to start with one location as a pilot.',
  },
}

const responses4 = [
  {
    stage: 'stage_1',
    answers: {
      contact_name: 'Lisa Nguyen',
      business_name: 'Glow Skin Clinic',
      website_url: 'https://glowskin.com.au',
      business_purpose: 'Premium skin clinic offering facials, laser treatments, injectables, and medical-grade skincare. Three locations across Canberra with a focus on results-driven treatments and client education.',
      core_products: 'Facial treatments, laser hair removal, skin rejuvenation, cosmetic injectables, LED therapy, and retail skincare products.',
      employee_count: '21-50',
      bottleneck_department: 'Reception — managing bookings across 3 locations, handling no-shows and last-minute cancellations, and answering repetitive product questions',
      industry: 'Health & Beauty',
      is_decision_maker: 'Yes',
    },
  },
  {
    stage: 'stage_1b',
    answers: {
      weekly_appointments: '150',
      noshow_rate: '20',
      booking_system: 'Fresha — we use it for bookings and POS but only about 30% of its features. Clients can book online but most still call. The system sends one reminder but our no-show rate is still terrible.',
      reception_struggles: 'We have two full-time receptionists across three locations. They spend most of their time on the phone handling bookings, rescheduling, cancellations, and answering questions about treatments and products. After hours, calls go to voicemail and many potential clients never call back. On Mondays, there are usually 20+ voicemails to work through.',
    },
  },
  {
    stage: 'stage_2',
    answers: {
      email_calendar: 'Google Workspace',
      crm_tool: 'None',
      project_management: 'None',
      data_storage: 'Google Drive',
      accounting_software: 'Xero',
      specialised_software: 'Fresha',
    },
  },
  {
    stage: 'stage_3',
    answers: {
      automation_tools: 'Fresha sends one booking confirmation and one reminder 24 hours before. That\'s all we have.',
      lead_process: 'Enquiries come via phone, Instagram DMs, website form, and walk-ins. Receptionists handle everything manually. Instagram DMs often go unanswered for hours because staff are busy with in-person clients.',
      invoice_process: 'Fresha handles payment at point of sale. Monthly product orders are invoiced separately through Xero.',
      auto_replies: 'Fresha booking confirmation only. No auto-replies on website, phone, or social media.',
      manual_data_transfer: '7',
    },
  },
  {
    stage: 'stage_4',
    answers: {
      repetitive_task: 'Calling no-show clients to rebook. With a 20% no-show rate across 150 appointments per week, that\'s 30 calls to make every week just to chase rebookings. Most don\'t answer the first time so it often takes 2-3 attempts.',
      manual_data_entry_hours: '18',
      human_errors: 'Double-bookings when clients book online and call at the same time, wrong treatment notes filed under wrong client, forgetting to log product samples given during consultations.',
      response_time: 'During clinic hours: within 30 minutes for calls, 1-2 hours for online. After hours: next business day.',
      magic_wand_task: 'A system that automatically contacts every client before their appointment with reminders, offers easy rescheduling, fills cancelled slots from a waitlist, and handles all the after-hours booking enquiries without needing a human.',
    },
  },
  {
    stage: 'stage_5',
    answers: {
      success_vision: 'No-show rate under 5%, all after-hours enquiries converted to bookings within minutes, and my receptionists freed up to focus on in-clinic client experience rather than being glued to the phone. I also want to track which treatments lead to rebookings so we can optimise our service menu.',
      automated_focus: 'Developing our training program for therapists, launching a membership/subscription model, and expanding our retail skincare range with better client-matched recommendations.',
      ai_autonomy: 'Human-in-loop',
      primary_concern: 'Reliability',
      timeline: '1–3 months',
      budget: '$5k–$20k',
    },
  },
]

// ---------------------------------------------------------------------------
// Assessment 5: Professional Services (Accounting) — moderate detail, no recs yet
// ---------------------------------------------------------------------------
const assessment5 = {
  client_name: 'James Patel',
  client_email: 'james@patelaccounting.com.au',
  company_name: 'Patel & Associates Accounting',
  industry: 'Professional Services',
  status: 'client_complete',
  share_token: token(),
  token_expires_at: expiry(),
  current_stage: 5,
  consent_given_at: new Date().toISOString(),
  ai_readiness_score: { overall: 58, digital_maturity: 6, automation_potential: 4 },
  stage_6_data: null,
  stage_7_data: null,
}

const responses5 = [
  {
    stage: 'stage_1',
    answers: {
      contact_name: 'James Patel',
      business_name: 'Patel & Associates Accounting',
      website_url: 'https://patelaccounting.com.au',
      business_purpose: 'Full-service accounting firm providing tax, BAS, bookkeeping, and advisory services to SMEs in the ACT.',
      core_products: 'Tax returns (individual and business), BAS lodgement, bookkeeping, payroll, financial reporting, and business advisory.',
      employee_count: '6-20',
      bottleneck_department: 'Client services — our team spends too much time answering the same tax deadline questions and chasing clients for documents.',
      industry: 'Professional Services',
      is_decision_maker: 'No',
      decision_maker_name: 'Raj Patel (Managing Partner)',
    },
  },
  {
    stage: 'stage_1b',
    answers: {
      drafting_hours: '12',
      onboarding_process: 'New client signs engagement letter → we send a document checklist via email → client sends documents in dribs and drabs over weeks → we chase missing items 3-4 times → finally have everything to start work. The whole process takes 3-6 weeks when it should take 3 days.',
      repeat_questions: 'When is my tax due? What can I claim? Do I need to lodge a BAS? What documents do you need from me? Can I get an extension? These come in every day, multiple times a day, especially around deadline periods.',
      current_ai_tools: 'None. We use Xero Practice Manager for workflow but everything else is manual — emails, phone calls, and a shared Outlook calendar.',
    },
  },
  {
    stage: 'stage_2',
    answers: {
      email_calendar: 'Microsoft 365',
      crm_tool: 'None',
      project_management: 'Microsoft Teams',
      data_storage: 'SharePoint',
      accounting_software: 'Xero',
      specialised_software: 'None',
    },
  },
  {
    stage: 'stage_3',
    answers: {
      automation_tools: 'Xero Practice Manager has some workflow automation for task assignment but we don\'t use it well.',
      lead_process: 'Referral or website enquiry → James or another partner calls them → discusses needs → sends engagement letter and fee estimate → follows up if not signed within a week',
      invoice_process: 'Time tracked in Practice Manager → monthly invoice generated → sent via Xero → payment chased manually if overdue',
      auto_replies: 'Out-of-office auto-replies during holidays only',
      manual_data_transfer: '5',
    },
  },
  {
    stage: 'stage_4',
    answers: {
      repetitive_task: 'Answering client questions about tax deadlines, BAS due dates, and what documents to provide. We answer the same 10 questions hundreds of times per year.',
      manual_data_entry_hours: '15',
      human_errors: 'Missing BAS lodgement deadlines because client document chasing goes on too long. Occasionally entering data into the wrong client file in Xero.',
      response_time: 'Usually within a few hours during business hours',
      magic_wand_task: 'A chatbot on our website and client portal that answers all the common tax questions instantly, sends clients their personalised document checklist, and automatically chases missing documents with reminders.',
    },
  },
  {
    stage: 'stage_5',
    answers: {
      success_vision: 'Client onboarding completed in under a week instead of 6 weeks, zero missed lodgement deadlines, and partners spending 50% less time on admin so we can take on more advisory work at higher margins.',
      automated_focus: 'Growing our advisory practice — helping clients with strategic financial planning, budgeting, and cashflow forecasting rather than just compliance work.',
      ai_autonomy: 'Human-in-loop',
      primary_concern: 'Data security',
      timeline: '1–3 months',
      budget: '$5k–$20k',
    },
  },
]

// ---------------------------------------------------------------------------
// Seed function
// ---------------------------------------------------------------------------

interface AssessmentData {
  client_name: string
  client_email: string
  company_name: string
  industry: string
  status: string
  share_token: string
  token_expires_at: string
  current_stage: number
  consent_given_at: string
  ai_readiness_score: { overall: number; digital_maturity: number; automation_potential: number } | null
  stage_6_data: Record<string, unknown> | null
  stage_7_data: Record<string, unknown> | null
}

interface ResponseData {
  stage: string
  answers: Record<string, unknown>
}

async function getConsultantId(): Promise<string> {
  // Get the first user from auth.users (the consultant)
  const { data, error } = await supabase.auth.admin.listUsers()
  if (error) throw new Error(`Failed to list users: ${error.message}`)
  if (!data.users.length) throw new Error('No users found. Please create a consultant account first.')
  console.log(`Using consultant: ${data.users[0].email}`)
  return data.users[0].id
}

async function seedAssessment(
  consultantId: string,
  assessment: AssessmentData,
  responses: ResponseData[],
  label: string,
) {
  // Insert assessment
  const { data: created, error: aErr } = await supabase
    .from('assessments')
    .insert({ ...assessment, consultant_id: consultantId })
    .select()
    .single()

  if (aErr) {
    console.error(`  ✗ ${label}: ${aErr.message}`)
    return
  }

  // Insert responses
  const responseRows = responses.map((r) => ({
    assessment_id: created.id,
    stage: r.stage,
    answers: r.answers,
  }))

  const { error: rErr } = await supabase.from('responses').insert(responseRows)

  if (rErr) {
    console.error(`  ✗ ${label} responses: ${rErr.message}`)
    return
  }

  console.log(`  ✓ ${label} — ${assessment.company_name} (${assessment.status}) — token: ${assessment.share_token}`)
}

async function main() {
  console.log('Seeding 5 assessments...\n')

  const consultantId = await getConsultantId()

  const all: [AssessmentData, ResponseData[], string][] = [
    [assessment1 as AssessmentData, responses1, 'Assessment 1'],
    [assessment2 as AssessmentData, responses2, 'Assessment 2'],
    [assessment3 as AssessmentData, responses3, 'Assessment 3'],
    [assessment4 as AssessmentData, responses4, 'Assessment 4'],
    [assessment5 as AssessmentData, responses5, 'Assessment 5'],
  ]

  for (const [assessment, responses, label] of all) {
    await seedAssessment(consultantId, assessment, responses, label)
  }

  console.log('\nDone! You can now view these assessments in the dashboard.')
}

main().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
