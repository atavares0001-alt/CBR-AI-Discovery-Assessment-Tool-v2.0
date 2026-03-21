/**
 * Seed script: Clears existing data then creates 5 assessments with varying detail levels.
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
  current_stage: 4,
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
      website_url: 'https://thompsonbuilders.com.au\n@thompsonbuilders on Instagram\nFacebook.com/ThompsonBuildersCBR',
      business_purpose: 'Residential and commercial construction services across the ACT and surrounding NSW regions. We specialise in new builds, renovations, and project management for projects ranging from $50k to $2M. We also offer maintenance contracts for commercial clients and design-build packages.',
      employee_count: '21-50',
      industry: 'Construction & Trades',
      is_decision_maker: 'Yes',
    },
  },
  {
    stage: 'stage_2',
    answers: {
      email_calendar: JSON.stringify(['Google Workspace']),
      crm_tool: JSON.stringify([]),
      project_management: JSON.stringify(['Trello']),
      data_storage: JSON.stringify(['Google Drive']),
      accounting_software: JSON.stringify(['Xero']),
      specialised_software: JSON.stringify([]),
    },
  },
  {
    stage: 'stage_3',
    answers: {
      automation_tools: 'No — everything is done manually',
      automation_details: 'We\'ve looked at Zapier before but never set it up. Our office manager writes down phone leads on sticky notes and enters them into a Google Sheet later. Quotes are typed up from scratch each time in Word. Invoices are created manually in Xero.',
      magic_wand_task: 'Every phone call automatically answered and the caller\'s details captured. A qualified lead sent straight to my phone with all the info I need. No more sticky notes, no more missed calls, no more calling people back days later. Also, quotes that generate themselves from a template — I\'m sick of my office manager spending 30 hours a week just formatting quotes.',
      time_drain_1: 'Formatting quotes from scratch in Word — 3-4 hours each, 8-10 per week',
      time_drain_2: 'Manually entering phone leads into the Google Sheet',
      time_drain_3: 'Chasing up missed calls and returning voicemails days later',
      time_drain_4: 'Creating invoices manually in Xero',
      time_drain_5: 'Emailing clients back-and-forth to schedule site visits',
    },
  },
  {
    stage: 'stage_5',
    answers: {
      vision_1: 'Zero missed calls during business hours',
      vision_2: 'Quotes sent within 4 hours of a site visit instead of 2 days',
      vision_3: 'A proper CRM showing exactly where every lead and project sits',
      vision_4: 'Office manager freed up to focus on project coordination',
      vision_5: 'Recover at least 5 of those 15 missed calls per week as real leads',
      focus_1: 'Spending more time on-site with project managers',
      focus_2: 'Building relationships with architects and designers for referrals',
      focus_3: 'Developing the design-build service offering with higher margins',
      ai_autonomy: 'Semi-autonomous',
      primary_concern: 'Reliability',
      timeline: 'Immediately',
      budget: '$5k-$20k',
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
  current_stage: 4,
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
      business_purpose: 'Boutique real estate agency specialising in residential sales and property management across Canberra\'s inner suburbs. We handle property sales, buyer advocacy, and off-market transactions.',
      employee_count: '6-20',
      industry: 'Real Estate',
      is_decision_maker: 'Yes',
    },
  },
  {
    stage: 'stage_2',
    answers: {
      email_calendar: JSON.stringify(['Google Workspace']),
      crm_tool: JSON.stringify(['Salesforce']),
      project_management: JSON.stringify(['Slack']),
      data_storage: JSON.stringify(['Google Drive']),
      accounting_software: JSON.stringify(['Xero']),
      specialised_software: JSON.stringify(['Rex']),
    },
  },
  {
    stage: 'stage_3',
    answers: {
      automation_tools: 'A little — we use basic tools like Zapier or auto-replies',
      automation_details: 'We have a few basic Zapier zaps but they break regularly and nobody knows how to fix them. Our website contact form sends a basic auto-reply that just says "we\'ll be in touch". Rex CRM has automation features but we barely use them.',
      magic_wand_task: 'Automatic inspection booking — buyer enquires, gets instant property details, picks a time that works for everyone, confirmation sent, reminder scheduled, all without a human touching it. Also, instant after-hours responses so we stop losing buyers to other agencies.',
      time_drain_1: 'Responding to the same inspection enquiries 80+ times a week',
      time_drain_2: 'Manually checking agent availability and booking inspections',
      time_drain_3: 'Following up after-hours leads the next business day',
      time_drain_4: 'Updating Rex CRM with inspection notes and feedback',
    },
  },
  {
    stage: 'stage_5',
    answers: {
      vision_1: 'Zero double-bookings across all agents',
      vision_2: 'All after-hours enquiries handled instantly',
      vision_3: 'Every lead captured and followed up within 5 minutes',
      vision_4: 'Admin spending time on client relationships instead of booking',
      focus_1: 'Building the buyer advocacy service',
      focus_2: 'Spending more time with vendors on marketing strategy',
      ai_autonomy: 'Semi-autonomous',
      primary_concern: 'Data security',
      timeline: '1-3 months',
      budget: '$5k-$20k',
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
  current_stage: 4,
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
      employee_count: '2-5',
      industry: 'IT & Technology',
      is_decision_maker: 'Yes',
    },
  },
  {
    stage: 'stage_2',
    answers: {
      email_calendar: JSON.stringify(['Google Workspace']),
      crm_tool: JSON.stringify(['HubSpot']),
      project_management: JSON.stringify(['Jira']),
      data_storage: JSON.stringify(['Google Drive']),
      accounting_software: JSON.stringify(['Xero']),
      specialised_software: JSON.stringify(['Notion']),
    },
  },
  {
    stage: 'stage_3',
    answers: {
      automation_tools: 'Somewhat — a few workflows are automated (e.g. invoicing, lead capture)',
      automation_details: 'Zapier connects our website form to HubSpot. Xero handles invoicing.',
      time_drain_1: 'Writing proposals from scratch each time',
      time_drain_2: 'Following up on sent proposals',
    },
  },
  {
    stage: 'stage_5',
    answers: {
      vision_1: 'Automated proposal generation and follow-ups',
      vision_2: 'More time focused on client delivery',
      focus_1: 'Focusing on delivery and client outcomes',
      ai_autonomy: 'Full autonomy',
      primary_concern: 'Cost/ROI',
      timeline: '3-6 months',
      budget: 'Under $5k',
    },
  },
]

// ---------------------------------------------------------------------------
// Assessment 4: Health & Beauty — very comprehensive, complete with quote
// ---------------------------------------------------------------------------
const assessment4 = {
  client_name: 'Lisa Nguyen',
  client_email: 'lisa@glowskin.com.au',
  company_name: 'Glow Skin Clinic',
  industry: 'Health & Beauty',
  status: 'quote_added',
  share_token: token(),
  token_expires_at: expiry(),
  current_stage: 4,
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
      website_url: 'https://glowskin.com.au\n@glowskinclinic on Instagram\nFacebook.com/GlowSkinCBR',
      business_purpose: 'Premium skin clinic offering facials, laser treatments, injectables, and medical-grade skincare. Three locations across Canberra with a focus on results-driven treatments, client education, and retail skincare products.',
      employee_count: '21-50',
      industry: 'Health & Beauty',
      is_decision_maker: 'Yes',
    },
  },
  {
    stage: 'stage_2',
    answers: {
      email_calendar: JSON.stringify(['Google Workspace']),
      crm_tool: JSON.stringify([]),
      project_management: JSON.stringify([]),
      data_storage: JSON.stringify(['Google Drive']),
      accounting_software: JSON.stringify(['Xero']),
      specialised_software: JSON.stringify(['Fresha']),
    },
  },
  {
    stage: 'stage_3',
    answers: {
      automation_tools: 'A little — we use basic tools like Zapier or auto-replies',
      automation_details: 'Fresha sends one booking confirmation and one reminder 24 hours before. That\'s the only automation we have. No auto-replies on website, phone, or social media. Instagram DMs often go unanswered for hours because staff are busy with in-person clients.',
      magic_wand_task: 'A system that automatically contacts every client before their appointment with reminders, offers easy rescheduling, fills cancelled slots from a waitlist, handles all after-hours booking enquiries without needing a human, and stops us losing clients to competitors because we didn\'t pick up the phone on a Sunday afternoon.',
      time_drain_1: 'Calling no-show clients to rebook — 30 calls/week, 2-3 attempts each',
      time_drain_2: 'Handling phone bookings, rescheduling, and cancellations all day',
      time_drain_3: 'Working through 20+ Monday morning voicemails',
      time_drain_4: 'Answering repetitive questions about treatments and products',
      time_drain_5: 'Manually managing Instagram DMs for booking enquiries',
    },
  },
  {
    stage: 'stage_5',
    answers: {
      vision_1: 'No-show rate under 5%',
      vision_2: 'All after-hours enquiries converted to bookings within minutes',
      vision_3: 'Receptionists focused on in-clinic client experience',
      vision_4: 'Track which treatments lead to rebookings to optimise the menu',
      focus_1: 'Developing the training program for therapists',
      focus_2: 'Launching a membership/subscription model',
      focus_3: 'Expanding retail skincare range with client-matched recommendations',
      ai_autonomy: 'Human-in-loop',
      primary_concern: 'Reliability',
      timeline: '1-3 months',
      budget: '$5k-$20k',
    },
  },
]

// ---------------------------------------------------------------------------
// Assessment 5: Professional Services (Accounting) — moderate detail
// ---------------------------------------------------------------------------
const assessment5 = {
  client_name: 'James Patel',
  client_email: 'james@patelaccounting.com.au',
  company_name: 'Patel & Associates Accounting',
  industry: 'Professional Services',
  status: 'client_complete',
  share_token: token(),
  token_expires_at: expiry(),
  current_stage: 4,
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
      business_purpose: 'Full-service accounting firm providing tax, BAS, bookkeeping, payroll, financial reporting, and advisory services to SMEs in the ACT.',
      employee_count: '6-20',
      industry: 'Professional Services',
      is_decision_maker: 'No',
      decision_maker_name: 'Raj Patel (Managing Partner)',
    },
  },
  {
    stage: 'stage_2',
    answers: {
      email_calendar: JSON.stringify(['Microsoft 365']),
      crm_tool: JSON.stringify([]),
      project_management: JSON.stringify(['Microsoft Teams']),
      data_storage: JSON.stringify(['SharePoint']),
      accounting_software: JSON.stringify(['Xero']),
      specialised_software: JSON.stringify([]),
    },
  },
  {
    stage: 'stage_3',
    answers: {
      automation_tools: 'A little — we use basic tools like Zapier or auto-replies',
      automation_details: 'Xero Practice Manager has some workflow automation for task assignment but we don\'t use it well. Out-of-office auto-replies during holidays only.',
      magic_wand_task: 'A chatbot on our website and client portal that answers all the common tax questions instantly, sends clients their personalised document checklist, automatically chases missing documents with reminders, and stops my staff from answering the same 10 questions hundreds of times a year.',
      time_drain_1: 'Answering the same 10 tax/BAS questions hundreds of times a year',
      time_drain_2: 'Chasing clients for missing documents — 3-4 follow-ups each',
      time_drain_3: 'Manually drafting reports and engagement letters',
      time_drain_4: 'Coordinating lodgement deadlines across all clients',
    },
  },
  {
    stage: 'stage_5',
    answers: {
      vision_1: 'Client onboarding completed in under a week instead of 6 weeks',
      vision_2: 'Zero missed lodgement deadlines',
      vision_3: 'Partners spending 50% less time on admin',
      vision_4: 'Taking on more advisory work at higher margins',
      focus_1: 'Strategic financial planning and advisory for clients',
      focus_2: 'Budgeting and cashflow forecasting services',
      focus_3: 'Growing the advisory practice beyond compliance work',
      ai_autonomy: 'Human-in-loop',
      primary_concern: 'Data security',
      timeline: '1-3 months',
      budget: '$5k-$20k',
    },
  },
]

// ---------------------------------------------------------------------------
// Assessment 6: Construction (3D Concrete Printing) — early-stage, fully manual
// ---------------------------------------------------------------------------
const assessment6 = {
  client_name: 'Tim',
  client_email: 'tim@contour3d.com.au',
  company_name: 'Contour 3D',
  industry: 'Construction & Trades',
  status: 'quote_added',
  share_token: token(),
  token_expires_at: expiry(),
  current_stage: 4,
  consent_given_at: new Date().toISOString(),
  ai_readiness_score: { overall: 38, digital_maturity: 8, automation_potential: 1 },
  stage_6_data: {
    executive_summary:
      'Contour 3D is an early-stage construction technology company specialising in 3D concrete printing for residential homes, decorative garden beds, and concrete pools. With only two staff, the business has adopted solid foundational tools — Google Workspace, Xero, Trello, and AutoCAD — but none are automated or integrated. Invoicing is created manually in Xero, project tracking in Trello is inconsistent, and lead management is non-existent. Tim is the sole decision-maker and needs to spend his time securing building contracts with builders and government agencies rather than fielding calls, responding to emails, and managing day-to-day admin. There is an exceptional opportunity to deploy AI across the entire front-of-house operation, connecting existing tools into automated workflows and freeing Tim to focus on business development and market expansion.',
    recommended_solution: 'AI Receptionist + Website Chatbot + Automated Scheduling & Invoicing + Social Media Automation + Lead Management Pipeline',
    automation_logic:
      'Inbound call/web enquiry → AI receptionist qualifies lead (builder vs homeowner vs product enquiry) → Automated scheduling for consultations → Chatbot handles FAQs on products, pricing, and process → Post-consultation follow-up email sequence triggered → Invoice generated automatically on project milestones → Social media content auto-generated from project photos and videos → Weekly pipeline report to Tim',
    key_benefit: 'Eliminate 15+ hours per week of admin, capture every lead 24/7, and free Tim to focus exclusively on securing building contracts and expanding the business',
    recommended_services: ['AI Receptionist', 'Chatbot Solutions', 'Scheduling Automation', 'Email Automation', 'Workflow Automation', 'Social Media Automation'],
    detailed_recommendations:
      'Phase 1 (Weeks 1–2): Deploy AI receptionist with Australian accent, trained on Contour 3D\'s products and services — 3D printed homes, garden beds, and concrete pools. Configure lead qualification to triage builders, homeowners, and product enquiries into separate workflows. Set up website chatbot with product knowledge base covering specifications, pricing ranges, and the 3D printing process.\n\nPhase 2 (Weeks 3–4): Implement automated scheduling for site consultations and project meetings. Build invoicing automation triggered by project milestones. Set up CRM pipeline to track leads from first contact through to signed contract.\n\nPhase 3 (Weeks 5–6): Configure social media automation — convert project photos and drone footage into instant posts across Instagram, Facebook, and LinkedIn. Build email nurture sequences for leads at different stages (initial enquiry, post-consultation, proposal sent). Create weekly dashboard summarising pipeline status, lead sources, and conversion rates.\n\nExpected ROI: With the average residential 3D print project valued at $150,000+, recovering even one lost lead per month through 24/7 availability and faster response times would generate significant additional revenue. Admin time savings of 15+ hours per week directly translates to more builder meetings and government tender submissions.',
  },
  stage_7_data: {
    package: 'Acceleration' as const,
    setup_cost: 7500,
    monthly_maintenance: 690,
    monthly_api_costs: 150,
    line_items: [
      { id: uuid(), name: 'AI Receptionist (Australian Accent)', description: 'Inbound call handling with product/service knowledge, lead qualification, and appointment booking', one_time_cost: 2800, monthly_cost: 220 },
      { id: uuid(), name: 'Website Chatbot', description: 'AI chatbot trained on 3D printing process, products, pricing, and FAQs', one_time_cost: 1500, monthly_cost: 120 },
      { id: uuid(), name: 'Scheduling & Invoicing Automation', description: 'Automated consultation booking, calendar management, and milestone-based invoicing', one_time_cost: 1800, monthly_cost: 150 },
      { id: uuid(), name: 'Social Media Automation', description: 'Auto-generate posts from project media, schedule across Instagram, Facebook, and LinkedIn', one_time_cost: 1400, monthly_cost: 200 },
    ],
    proposed_timeline: '6 weeks',
    next_steps:
      '1. Sign proposal and schedule kickoff call\n2. Provide product specifications, pricing guides, and FAQ content for AI training\n3. Share project photos and video footage for social media automation setup\n4. Review and approve AI receptionist scripts and chatbot responses\n5. Schedule training session on CRM dashboard and lead pipeline',
    internal_notes: 'Early-stage business with massive growth potential. Tim is the decision-maker and wants to move quickly. The 3D concrete printing space is niche — being first to market with a professional AI-powered front-of-house will be a significant competitive advantage. No existing systems means a clean slate with no migration complexity.',
  },
}

const responses6 = [
  {
    stage: 'stage_1',
    answers: {
      contact_name: 'Tim',
      business_name: 'Contour 3D',
      website_url: '',
      business_purpose: 'Contour 3D specialises in 3D concrete printing technology for the construction industry. Our core offering is 3D printed residential homes — a faster, more sustainable alternative to traditional construction. We also manufacture and sell decorative concrete products including 3D printed garden beds and concrete pools. As an early-stage company, we are focused on establishing partnerships with builders and government agencies to scale operations domestically.',
      employee_count: '2-5',
      industry: 'Construction & Trades',
      is_decision_maker: 'Yes',
    },
  },
  {
    stage: 'stage_2',
    answers: {
      email_calendar: JSON.stringify(['Google Workspace']),
      crm_tool: JSON.stringify([]),
      project_management: JSON.stringify(['Trello']),
      data_storage: JSON.stringify(['Google Drive']),
      accounting_software: JSON.stringify(['Xero']),
      specialised_software: JSON.stringify(['AutoCAD', 'Canva']),
    },
  },
  {
    stage: 'stage_3',
    answers: {
      automation_tools: 'No — everything is done manually',
      automation_details: 'We use Google Workspace for email and Xero for invoicing, but nothing is automated — invoices are created manually each time. Trello is used loosely to track projects but it\'s not consistently updated. Google Drive stores files but there\'s no structured system. AutoCAD is used for print designs and Canva for occasional social media graphics. Phone calls, scheduling, lead tracking, and follow-ups are all handled manually.',
      time_drain_1: 'Responding to emails and enquiries — constant interruptions throughout the day',
      time_drain_2: 'Fielding phone calls and returning missed calls from potential clients',
      time_drain_3: 'Triaging leads manually — determining which enquiries are genuine opportunities',
      time_drain_4: 'Creating and sending invoices by hand for each project milestone',
      time_drain_5: 'Scheduling and rescheduling site consultations via text and email',
      magic_wand_task: 'Every inbound call answered instantly by an AI that knows our products inside and out — whether it\'s a builder asking about 3D printed home specifications, a homeowner enquiring about a concrete pool, or someone wanting a quote on garden beds. All leads triaged and qualified automatically so I only spend time on the ones that matter. Invoices generated and sent without me touching them. Social media posts created automatically from our project photos and drone footage so we maintain a consistent online presence without it eating into productive hours.',
    },
  },
  {
    stage: 'stage_5',
    answers: {
      vision_1: 'Every call and enquiry handled instantly — even when we\'re on-site printing',
      vision_2: 'Leads automatically qualified and prioritised so no opportunity is missed',
      vision_3: 'Invoicing and scheduling running on autopilot without manual intervention',
      vision_4: 'A consistent social media presence generated automatically from project content',
      vision_5: 'All admin eliminated so both team members focus purely on delivery and growth',
      focus_1: 'Meeting with builders and government agencies to secure building contracts',
      focus_2: 'Expanding the product range and developing new concrete printing applications',
      focus_3: 'Building relationships and securing contracts through industry networking',
      focus_4: 'Scaling the business domestically into new regions and markets',
      focus_5: 'Developing the long-term strategic direction and vision for the company',
      ai_autonomy: 'Semi-autonomous',
      primary_concern: 'Reliability',
      timeline: '1-3 months',
      budget: '$5k-$20k',
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
  const { data, error } = await supabase.auth.admin.listUsers()
  if (error) throw new Error(`Failed to list users: ${error.message}`)
  if (!data.users.length) throw new Error('No users found. Please create a consultant account first.')
  console.log(`Using consultant: ${data.users[0].email}`)
  return data.users[0].id
}

async function clearExistingData() {
  console.log('Clearing existing data...')

  // Delete all responses first (foreign key constraint)
  const { error: rErr } = await supabase.from('responses').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  if (rErr) console.error(`  Warning: ${rErr.message}`)

  // Delete all assessments
  const { error: aErr } = await supabase.from('assessments').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  if (aErr) console.error(`  Warning: ${aErr.message}`)

  console.log('  ✓ Existing data cleared\n')
}

async function seedAssessment(
  consultantId: string,
  assessment: AssessmentData,
  responses: ResponseData[],
  label: string,
) {
  const { data: created, error: aErr } = await supabase
    .from('assessments')
    .insert({ ...assessment, consultant_id: consultantId })
    .select()
    .single()

  if (aErr) {
    console.error(`  ✗ ${label}: ${aErr.message}`)
    return
  }

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
  await clearExistingData()

  console.log('Seeding 6 assessments...\n')

  const consultantId = await getConsultantId()

  const all: [AssessmentData, ResponseData[], string][] = [
    [assessment1 as AssessmentData, responses1, 'Assessment 1'],
    [assessment2 as AssessmentData, responses2, 'Assessment 2'],
    [assessment3 as AssessmentData, responses3, 'Assessment 3'],
    [assessment4 as AssessmentData, responses4, 'Assessment 4'],
    [assessment5 as AssessmentData, responses5, 'Assessment 5'],
    [assessment6 as AssessmentData, responses6, 'Assessment 6'],
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
