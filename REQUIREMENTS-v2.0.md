# Requirements Document — CBR AI Discovery Assessment Tool

**Version:** 2.0
**Company:** Canberra AI Agency (CBR AI)
**Document type:** Standalone build specification
**Purpose:** Complete requirements for an agent or developer to build this application from scratch
**Changelog:** v2.0 consolidates the original v1.0 spec with a comprehensive requirements review, resolving gaps, inconsistencies, and adding missing sections (8.1–8.4, 9).

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Business Context](#2-business-context)
3. [User Types & Access Model](#3-user-types--access-model)
4. [Questions Raised During Discovery](#4-questions-raised-during-discovery)
5. [Functional Requirements](#5-functional-requirements)
   - 5.1 Landing Page
   - 5.2 Consultant Authentication
   - 5.3 Consultant Dashboard
   - 5.4 Assessment Creation & Sharing
   - 5.5 Client Assessment Form (Stages 1–5)
   - 5.6 Consultant Recommendations (Stage 6)
   - 5.7 Consultant Quote Builder (Stage 7)
   - 5.8 PDF Report Generation
   - 5.9 Assessment Status Lifecycle
   - 5.10 AI Readiness Score
6. [Stage-by-Stage Question Specification](#6-stage-by-stage-question-specification)
7. [Non-Functional Requirements](#7-non-functional-requirements)
   - 7.1 Design System
   - 7.2 Security & Data Privacy
   - 7.3 Compliance
   - 7.4 Performance
   - 7.5 Accessibility
   - 7.6 Mobile Responsiveness
   - 7.7 Error Handling & Resilience
8. [Technical Architecture](#8-technical-architecture)
   - 8.1 Approved Tech Stack
   - 8.2 Database Schema
   - 8.3 API Routes
   - 8.4 Routing Structure
9. [Out of Scope (Phase 1)](#9-out-of-scope-phase-1)
10. [Acceptance Criteria](#10-acceptance-criteria)
11. [Open Questions for Stakeholder Decision](#11-open-questions-for-stakeholder-decision)

---

## 1. Project Overview

Build a **multi-stage Discovery Assessment Tool** for Canberra AI Agency (CBR AI), a Canberra-based company that sells AI automation services to local businesses.

The tool has two modes:

- **Client mode** — a guided multi-stage form (Stages 1–5) accessed via a unique tokenised URL. No login required.
- **Consultant mode** — a protected dashboard where the consultant manages all client assessments, adds recommendations (Stage 6), builds a quote (Stage 7), and generates a branded PDF report.

The end product is a downloadable PDF report delivered to the client, containing their AI Readiness Score, a summary of their responses, the consultant's recommendations, and a proposed investment quote.

---

## 2. Business Context

### Company Profile

- **Name:** Canberra AI Agency (brand abbreviation: CBR AI)
- **Website:** cbrai.com.au
- **Location:** Canberra, Australia
- **Business:** Sells AI automation solutions to local Canberra businesses

### Services Offered (9 total)

1. AI Receptionist
2. Scheduling Automation
3. Lead Qualification
4. Chatbot Solutions
5. Workflow Automation
6. Data Analytics
7. CRM Integration
8. AI-Powered Websites
9. Email Automation

### Packages (3 tiers)

| Package | Tagline | Includes |
|---------|---------|----------|
| **Foundation** | Essential baseline | AI Business Assessment, AI Receptionist, Basic Website, Team Training, Documentation |
| **Acceleration** | Most popular choice | Everything in Foundation + Chatbot, Lead Capture, Email Automation, CRM Integration |
| **Transformation** | For market leaders | Everything in Acceleration + Automated Workflows, Autonomous AI Agents, Data & Business Analytics |

### Target Industries (4 primary)

1. Construction & Trades
2. Real Estate
3. Professional Services (e.g. law, accounting, consulting)
4. Health & Beauty (e.g. clinics, salons, allied health)

### Sales Process

The Discovery Assessment Tool maps to Step 1 of CBR AI's 4-step client engagement process:

1. **Discovery** ← this tool
2. Custom Strategy
3. Build & Deploy
4. Optimise & Support

---

## 3. User Types & Access Model

### Two user types

| Attribute | Client | Consultant |
|-----------|--------|-----------|
| Authentication | None — tokenised URL | Email/password via Supabase Auth |
| Access | Stages 1–5 only via `/assess/[token]` | Full dashboard + Stages 1–7 via `/dashboard` |
| Creates account? | No | Yes — manually created in Supabase Auth |
| Sees Stage 6 (Recommendations)? | No | Yes |
| Sees Stage 7 (Quote)? | No | Yes |
| Sees PDF report? | Receives finished version only | Downloads and controls delivery |

### URL structure

- `/` — Public landing page
- `/login` — Consultant login (email + password)
- `/dashboard` — Consultant home — protected, redirects to `/login` if unauthenticated
- `/dashboard/assessment/[id]` — Individual assessment detail — protected
- `/assess/[token]` — Client form — public, token-gated (no login)

### Token rules

- Each assessment has a unique `share_token` (alphanumeric, 12 characters)
- Tokens expire after 30 days by default
- Expired tokens show an "expired" message — consultant must create a new assessment
- If the assessment status is `client_complete` or `accepted`, the link shows a "already completed" message

---

## 4. Questions Raised During Discovery

These are questions that were identified as gaps or ambiguities in the original brief. The decisions made are noted.

| # | Question | Decision Made |
|---|----------|--------------|
| Q1 | How does industry-specific conditional logic trigger if Stage 1 has no industry field? | Added an industry dropdown to Stage 1 as a required field |
| Q2 | How does the client access the form — is there a self-serve entry point? | No self-serve. Consultant creates the assessment and shares a unique link with the client |
| Q3 | Who is the decision-maker for tech purchases? The person filling the form may not be the buyer. | Added two fields to Stage 1: decision-maker name and "are you the decision-maker?" |
| Q4 | Stage 7 has a quote, but what is the client's budget? | Added a budget range question to Stage 5 (end of client journey) |
| Q5 | What is the lifecycle of an assessment from creation to close? | Defined a 9-state status workflow (see Section 5.9) |
| Q6 | How do consultants manage multiple clients? | Built a consultant dashboard with list view, status badges, and search |
| Q7 | What makes the report compelling vs a plain text summary? | Added an auto-calculated AI Readiness Score (0–100) displayed as gauges |
| Q8 | What is the "Other" industry case for the Stage 1b logic jump? | Industry "Other" skips Stage 1b entirely — no conditional questions |
| Q9 | Should clients be able to resume a partially completed assessment? | Yes — progress is auto-saved after each stage; the same token URL resumes from last saved stage |
| Q10 | Does the consultant see their own responses mixed with client responses? | No — Stages 1–5 are client-only. Stages 6–7 are consultant-only. Report tab assembles both. |

---

## 5. Functional Requirements

### 5.1 Landing Page

- **FR-01** The app root (`/`) shall display a public landing page
- **FR-02** The landing page shall communicate the assessment's purpose and value proposition
- **FR-03** The landing page shall include a link to `/login` for consultants
- **FR-04** The landing page shall inform clients that they need a link from their consultant to begin
- **FR-05** The landing page shall include an animated background (vortex particle animation on canvas)
- **FR-06** The landing page shall display three value proposition tiles: time estimate (~15 min), confidentiality (Privacy Act), and AI Readiness Score
- **FR-07** The landing page shall include a site header with the CBR AI logo and "Consultant Login" link

---

### 5.2 Consultant Authentication

- **FR-08** Consultants shall authenticate at `/login` using email and password
- **FR-09** Authentication shall be handled by Supabase Auth (no custom auth system)
- **FR-10** Consultant accounts are created manually in the Supabase Auth dashboard — there is no self-registration
- **FR-11** Successful login shall redirect to `/dashboard`
- **FR-12** Attempting to access any `/dashboard/*` route while unauthenticated shall redirect to `/login`
- **FR-13** Authenticated users visiting `/login` shall redirect to `/dashboard`
- **FR-14** The dashboard header shall display a sign-out button *(v2.0 fix: moved from login page to dashboard where it belongs)*
- **FR-15** Login errors (wrong credentials) shall display an inline error message

---

### 5.3 Consultant Dashboard

- **FR-16** `/dashboard` shall display a list of all assessments belonging to the authenticated consultant
- **FR-17** Each assessment row shall show: client name, company name, industry (if set), status badge, last updated date
- **FR-18** Each assessment row shall have a **Copy Link** button that copies the client URL to clipboard
- **FR-19** Copying the link shall update the assessment status from `draft` to `sent` (if currently `draft`)
- **FR-20** Each assessment row shall have a **View** button linking to `/dashboard/assessment/[id]`
- **FR-21** The dashboard shall have a search/filter input that filters assessments by client name, email, or company in real-time
- **FR-22** The dashboard shall have a **+ New Assessment** button
- **FR-23** The total assessment count shall be displayed below the page heading
- **FR-80** The dashboard shall support sorting by: status, date created, date updated, client name *(v2.0 addition)*
- **FR-81** The dashboard shall display an empty state message with a prompt to create the first assessment when no assessments exist *(v2.0 addition)*
- **FR-82** The dashboard shall support pagination (20 assessments per page) to handle large volumes *(v2.0 addition)*

---

### 5.4 Assessment Creation & Sharing

- **FR-24** Clicking **+ New Assessment** shall open a modal form with fields: client name (required), client email (optional), company name (optional)
- **FR-25** On submission, the system shall generate a unique 12-character alphanumeric `share_token`
- **FR-26** A new `assessment` record shall be created in the database with status `draft`, linked to the authenticated consultant
- **FR-27** The token shall expire 30 days from creation date
- **FR-28** The new assessment shall immediately appear in the dashboard list
- **FR-29** The consultant shall be able to copy the client URL (`/assess/[token]`) with one click from the dashboard row or the assessment detail page
- **FR-83** A consultant shall be able to create multiple assessments for the same client (e.g. annual re-assessment). Previous assessments remain accessible. *(v2.0 addition)*

---

### 5.5 Client Assessment Form (Stages 1–5)

#### General form behaviour

- **FR-30** The client form shall be accessible at `/assess/[token]` with no login required
- **FR-31** Before Stage 1 begins, the client shall see a **consent gate**: a data handling statement and a required checkbox: *"I consent to CBR AI Agency storing my responses for the purpose of this discovery assessment"*
- **FR-32** The **Begin Assessment** button on the consent gate shall be disabled until the checkbox is checked
- **FR-33** After consent, the client proceeds to Stage 1
- **FR-34** Each stage shall auto-save responses to the database on completion before advancing to the next stage
- **FR-35** Assessment status shall be set to `in_progress` on first save
- **FR-36** Progress shall persist — reopening the same token URL shall resume from the last completed stage
- **FR-37** A sticky top progress bar shall show the current stage name and overall percentage complete
- **FR-38** The progress bar shall show a "Saving..." / "Saved ✓" indicator
- **FR-39** Each stage form shall have a **Back** button (except Stage 1) and a **Continue** button
- **FR-40** Stage 5 **Continue** button label shall read "Submit Assessment ✓"
- **FR-41** Required fields shall be marked with an asterisk and the **Continue** button shall remain disabled until they are filled
- **FR-42** After Stage 5 submission, the assessment status shall be set to `client_complete`
- **FR-43** After Stage 5 submission, the client shall see a **completion screen** with a thank-you message and a 3-step "what happens next" timeline
- **FR-84** Clients may navigate back to previously completed stages to review and edit their answers before final submission of Stage 5 *(v2.0 addition)*
- **FR-85** The **Back** button on any stage shall preserve the current stage's unsaved input in local state (not lost on navigation) *(v2.0 addition)*

#### Input validation rules *(v2.0 addition)*

- **FR-86** The Website URL field (Stage 1) shall validate URL format
- **FR-87** Email fields shall validate email format
- **FR-88** Number fields shall enforce min/max ranges: hours/week (0–168), percentage fields (0–100), employee counts (non-negative)
- **FR-89** Textarea fields shall have a 2000-character limit with a visible character counter
- **FR-90** The slider field (Stage 3, manual data transfer) shall display the current numeric value alongside the slider

#### Stage 1b — Industry Logic Jump

- **FR-44** If the client selects an industry other than "Other" in Stage 1, the form shall present Stage 1b immediately after Stage 1
- **FR-45** Stage 1b questions are conditional on the selected industry (4 industry-specific question sets — see Section 6)
- **FR-46** If the client selects "Other" as their industry, Stage 1b is skipped entirely

---

### 5.6 Consultant Recommendations (Stage 6)

- **FR-47** Stage 6 is only accessible to the authenticated consultant via `/dashboard/assessment/[id]` → Recommendations tab
- **FR-48** Stage 6 shall display the AI Readiness Score (overall gauge + two sub-scores) calculated from Stages 2–4 responses
- **FR-49** Stage 6 shall contain an editable form with the following fields:
  - Executive Summary (textarea — appears on the report cover)
  - Recommended AI Model / Solution (text input)
  - Automation Logic (textarea — step-by-step flow description)
  - Key Business Benefit (text input)
  - Recommended CBR AI Services (multi-select toggle buttons from the 9 services list)
  - Detailed Recommendations (long textarea — full narrative for the report)
- **FR-50** Saving Stage 6 shall update the assessment status to `recommendations_added`
- **FR-51** Saving Stage 6 shall persist the AI Readiness Score to the assessment record in the database

---

### 5.7 Consultant Quote Builder (Stage 7)

- **FR-52** Stage 7 is only accessible to the authenticated consultant via `/dashboard/assessment/[id]` → Quote Builder tab
- **FR-53** Stage 7 shall include a **Package** dropdown with options: Foundation, Acceleration, Transformation
- **FR-54** Selecting a package shall display the services included in that package
- **FR-55** Stage 7 shall include three fixed cost fields: Setup/Implementation ($), Monthly Maintenance ($), Monthly API Costs ($)
- **FR-56** Stage 7 shall support dynamic add-on line items, each with: service name, description, one-time cost, monthly cost
- **FR-57** Consultant shall be able to add and remove line items
- **FR-58** A running total shall display: total one-time cost (setup + all one-time line items) and total monthly cost (maintenance + API + monthly line items)
- **FR-59** Stage 7 shall include: Proposed Timeline (text), Next Steps (textarea), Internal Notes (textarea — not shown in client report)
- **FR-60** Saving Stage 7 shall update the assessment status to `quote_added` *(v2.0 fix: renamed from `report_generated` to avoid conflict with FR-68)*

---

### 5.8 PDF Report Generation

- **FR-61** A consultant shall be able to download a PDF report from the Report tab of any assessment
- **FR-62** PDF generation shall be triggered by a server-side API call (`POST /api/assessments/[id]/report`)
- **FR-63** The PDF shall be generated using `@react-pdf/renderer` on the server
- **FR-64** The PDF filename shall be: `CBR-AI-Report-[ClientName].pdf`
- **FR-65** The PDF shall contain the following pages/sections:
  1. **Cover page** — CBR AI logo, client name, company, AI Readiness Score (large), date, industry
  2. **Executive Summary** — consultant-written summary + AI Readiness Score breakdown (bar charts)
  3. **Business Profile** — Stage 1 and Stage 1b responses
  4. **Current State Analysis** — Stage 2 (software stack) and Stage 3 (workflows) responses
  5. **Pain Points & Future Vision** — Stage 4 and Stage 5 responses
  6. **Recommendations** — Stage 6 content (only if Stage 6 has been saved)
  7. **Proposed Investment** — Stage 7 quote (only if Stage 7 has been saved)
- **FR-66** The PDF colour scheme shall match the app design system: dark background `#050505`, emerald accent `#10b981`, white text
- **FR-67** All question/answer pairs shall be formatted as labelled cards within each section
- **FR-68** After successful PDF generation, the assessment status shall update to `report_generated`
- **FR-91** The PDF shall be generated on-demand each time (not cached). The consultant can regenerate after updating Stage 6 or 7. *(v2.0 addition)*

---

### 5.9 Assessment Status Lifecycle

Assessments move through the following states. Transitions are automatic where noted, otherwise manual.

| Status | Label | Triggered By |
|--------|-------|-------------|
| `draft` | Draft | Assessment created |
| `sent` | Link Sent | Consultant copies the share link |
| `in_progress` | In Progress | Client saves their first stage response |
| `client_complete` | Client Complete | Client submits Stage 5 |
| `recommendations_added` | Recommendations Added | Consultant saves Stage 6 |
| `quote_added` | Quote Added | Consultant saves Stage 7 *(v2.0 fix: new state, separates quote from report)* |
| `report_generated` | Report Ready | Consultant downloads PDF (FR-68) |
| `quote_sent` | Quote Sent | Manual — consultant marks this |
| `accepted` | Accepted | Manual — consultant marks this |
| `lost` | Lost | Manual — consultant marks this |

- **FR-69** Status badges shall be colour-coded consistently across the dashboard and assessment detail view
- **FR-70** Status shall be visible at a glance on every assessment row in the dashboard

**Status badge colour mapping** *(v2.0 addition)*

| Status | Colour |
|--------|--------|
| `draft` | Grey |
| `sent` | Blue |
| `in_progress` | Amber |
| `client_complete` | Teal |
| `recommendations_added` | Emerald |
| `quote_added` | Emerald |
| `report_generated` | Emerald (bright) |
| `quote_sent` | Purple |
| `accepted` | Green |
| `lost` | Red |

---

### 5.10 AI Readiness Score

- **FR-71** The AI Readiness Score shall be automatically calculated when the client completes the assessment (Stage 5 submission). It is recalculated and persisted when the consultant saves Stage 6. *(v2.0 fix: clarified timing — calculated on client completion, persisted on Stage 6 save)*
- **FR-72** The score shall comprise three values:
  - **Digital Maturity** (0–10) — based on cloud tool adoption inferred from Stage 2 answers
  - **Automation Potential** (0–10) — based on manual hours (Stage 4) and manual data transfer scale (Stage 3)
  - **Overall AI Readiness Score** (0–100) — composite weighted score
- **FR-73** The score shall be displayed on the assessment detail page as SVG circle gauges
- **FR-74** The score shall be stored as a JSONB field on the assessment record when Stage 6 is saved
- **FR-75** The overall score shall appear prominently on the PDF report cover page
- **FR-76** Score colour shall be contextual: green (≥70), amber (40–69), red (<40)

#### AI Readiness Score Algorithm *(v2.0 addition)*

**FR-92** The scoring algorithm shall work as follows:

**Digital Maturity (0–10):**
Score based on Stage 2 (Software Stack) responses. For each of the 5 fields, award points based on whether the client uses a recognised cloud/SaaS tool:
- 2 points per field if a recognised cloud tool is mentioned (e.g. Google Workspace, HubSpot, Salesforce, Asana, Slack, Xero)
- 1 point per field if any tool is mentioned but not a recognised cloud platform
- 0 points if blank or "none"
- Maximum: 10 points

**Automation Potential (0–10):**
Score based on Stage 3 and Stage 4 responses:
- Manual data transfer scale (Stage 3 slider, 1–10): value is used directly as a base (0–10 range)
- Manual data entry hours (Stage 4): 0–2 hrs = 1pt, 3–10 hrs = 3pts, 11–20 hrs = 5pts, 21+ hrs = 7pts
- Blend: `(slider_value × 0.4) + (hours_score × 0.6)`, capped at 10

**Overall AI Readiness Score (0–100):**
`(Digital Maturity × 4) + (Automation Potential × 6)` — weighted 40/60 toward automation potential, as this indicates greater opportunity for AI impact.

---

## 6. Stage-by-Stage Question Specification

### Consent Gate (before Stage 1)

- Data handling statement explaining: what is collected, why, how long retained (12 months — see NFR-22), who sees it (assigned consultant only)
- Required checkbox: *"I consent to CBR AI Agency storing my responses for the purpose of this discovery assessment"*
- **Begin Assessment** button (disabled until checked)

---

### Stage 1 — Business Profile

| Field | Type | Required | Validation | Notes |
|-------|------|----------|------------|-------|
| Business name | Text | Yes | Max 200 chars | |
| Website URL | URL | No | Valid URL format | |
| Primary purpose of the business | Textarea | Yes | Max 2000 chars | |
| Core products or services | Textarea | No | Max 2000 chars | |
| Number of full-time employees | Dropdown | Yes | — | Options: Just me (1), 2–5, 6–20, 21–50, 51–200, 200+ |
| Biggest bottleneck department | Text | No | Max 200 chars | e.g. Sales, Admin, Customer Service |
| Industry | Dropdown | Yes | — | Construction & Trades, Real Estate, Professional Services, Health & Beauty, Other — **triggers Stage 1b** |
| Is the respondent the primary decision-maker for tech purchases? | Radio | Yes | — | Yes / No |
| If No: decision-maker's name/role | Text | Conditional | Max 200 chars | Only shown if "No" selected above |

---

### Stage 1b — Industry Logic Jump

Shown only when the client selects a specific industry in Stage 1. Skipped for "Other". All Stage 1b fields are **optional** unless otherwise noted.

**Construction & Trades**

| Field | Type | Validation |
|-------|------|------------|
| How do you currently track and follow up on new leads? | Textarea | Max 2000 chars |
| How long does it typically take to get a quote to a client? (hours) | Number | Min 0, max 720 |
| Roughly how many calls or enquiries do you miss after hours per week? | Number | Min 0, max 500 |
| What is the single biggest admin task slowing your team down? | Textarea | Max 2000 chars |

**Real Estate**

| Field | Type | Validation |
|-------|------|------------|
| How many new buyer/tenant enquiries do you receive per week? | Number | Min 0, max 10000 |
| Describe your current inspection booking process | Textarea | Max 2000 chars |
| How are leads handled outside of business hours? | Textarea | Max 2000 chars |
| Which CRM or lead management system are you using (if any)? | Text | Max 200 chars |

**Professional Services**

| Field | Type | Validation |
|-------|------|------------|
| How many hours per week does your team spend drafting documents or reports? | Number | Min 0, max 168 |
| Describe your client onboarding process from signed contract to first deliverable | Textarea | Max 2000 chars |
| How often do clients ask the same questions? How do you handle this? | Textarea | Max 2000 chars |
| Are you currently using any AI tools in your practice? | Text | Max 200 chars |

**Health & Beauty**

| Field | Type | Validation |
|-------|------|------------|
| How many appointments do you book per week on average? | Number | Min 0, max 10000 |
| What is your estimated no-show or last-minute cancellation rate? (%) | Number | Min 0, max 100 |
| What booking or scheduling system do you use (if any)? | Text | Max 200 chars |
| What are the top 2–3 things your front desk or reception struggles with most? | Textarea | Max 2000 chars |

---

### Stage 2 — Software Stack

| Field | Type | Validation | Notes |
|-------|------|------------|-------|
| Email and calendar suite | Text | Max 200 chars | e.g. Google Workspace, Microsoft 365 |
| CRM or lead management tool | Text | Max 200 chars | e.g. HubSpot, Salesforce, none |
| Project management and internal communications | Text | Max 200 chars | e.g. Asana, Slack, Teams |
| Client/business data storage | Text | Max 200 chars | e.g. Google Drive, SharePoint, local server |
| Industry-specific or specialised software | Textarea | Max 2000 chars | e.g. Xero, Procore, Rex, Mindbody |

All Stage 2 fields are **optional** (client may not know or use tools in every category).

---

### Stage 3 — Workflows & Automations

| Field | Type | Validation | Notes |
|-------|------|------------|-------|
| Current automation tools (if any) | Text | Max 200 chars | e.g. Zapier, Make, Power Automate |
| Describe your process when a new lead or enquiry comes in | Textarea | Max 2000 chars | Full step-by-step from first contact to first meeting |
| How are invoices and contracts generated and sent? | Textarea | Max 2000 chars | |
| Are there any auto-replies, chatbots, or automated responses currently active? | Text | Max 200 chars | |
| How much manual copy-paste / data transfer happens weekly? | Slider (1–10) | Integer 1–10 | 1 = None, 10 = Constant. Display current value as a label beside the slider. |

**Slider component spec** *(v2.0 addition)*: The slider shall use a glass-card track with an emerald-coloured thumb. The current numeric value shall display above the thumb. Labels "None" and "Constant" shall appear at left and right ends respectively.

---

### Stage 4 — Pain Points

| Field | Type | Validation | Notes |
|-------|------|------------|-------|
| What is the most repetitive, soul-crushing task your team does every week? | Textarea | Max 2000 chars | |
| Approximately how many hours per week does your team spend on manual data entry? | Number | Min 0, max 168 | All staff combined |
| Where do human errors most commonly occur in your business? | Textarea | Max 2000 chars | |
| What is your typical response time to a new customer enquiry? | Text | Max 200 chars | e.g. Same day, within the hour |
| If you could wave a magic wand and delete one recurring task forever, what would it be? | Textarea | Max 2000 chars | |

---

### Stage 5 — Future Vision

| Field | Type | Required | Validation | Notes |
|-------|------|----------|------------|-------|
| What does success look like for your business in 6 months' time? | Textarea | Yes | Max 2000 chars | Prompt for specific numbers and outcomes |
| If manual tasks were automated, what high-value work would you focus on instead? | Textarea | No | Max 2000 chars | |
| What level of AI autonomy are you comfortable with? | Dropdown | Yes | — | Human-in-loop / Semi-autonomous / Full autonomy |
| What is your primary concern about adopting AI automation? | Dropdown | No | — | Cost/ROI, Technical complexity, Data security, Staff resistance, Reliability, No concerns |
| What is your desired timeline for getting your first AI pilot running? | Dropdown | Yes | — | Immediately / 1–3 months / 3–6 months / 6+ months |
| Do you have an approximate budget in mind for an AI automation project? | Dropdown | Yes | — | Under $5k / $5k–$20k / $20k–$50k / $50k+ |

---

### Stage 6 — Recommendations (Consultant only)

| Field | Type | Notes |
|-------|------|-------|
| Executive Summary | Textarea | Appears on PDF report cover/summary |
| Recommended AI Model / Solution | Text | High-level solution name |
| Automation Logic | Textarea | Step-by-step automation flow description |
| Key Business Benefit | Text | Primary measurable outcome |
| Recommended CBR AI Services | Multi-select toggles | Choose from the 9 services |
| Detailed Recommendations | Long textarea | Full narrative for the report body |

---

### Stage 7 — Quote Builder (Consultant only)

| Field | Type | Notes |
|-------|------|-------|
| Package | Dropdown | Foundation / Acceleration / Transformation |
| Setup / Implementation cost | Number ($) | One-time |
| Monthly Maintenance cost | Number ($) | Recurring |
| Monthly API / usage costs | Number ($) | Recurring |
| Add-on line items | Dynamic list | Each item: name, description, one-time cost, monthly cost |
| Proposed implementation timeline | Text | |
| Next steps | Textarea | Shown in PDF |
| Internal notes | Textarea | NOT shown in PDF — consultant only |

---

## 7. Non-Functional Requirements

### 7.1 Design System

The app must match the CBR AI website design system exactly which is found at www.cbrai.com.au. There are to be no deviations.

**Colours**

| Token | Value |
|-------|-------|
| Background | `#050505` |
| Card background | `#0f0f12` |
| Accent (primary) | `#10b981` (Tailwind `emerald-500`) |
| Accent hover | `#34d399` (Tailwind `emerald-400`) |
| Text primary | `#ffffff` |
| Text secondary | `rgba(255, 255, 255, 0.6)` |
| Text muted | `rgba(255, 255, 255, 0.4)` / `rgba(255, 255, 255, 0.5)` |

**Glass / Frosted-glass utility classes**

```css
/* Standard glass card */
background: rgba(255, 255, 255, 0.05);
backdrop-filter: blur(16px);
border: 1px solid rgba(255, 255, 255, 0.10);
border-radius: 16px;

/* Glow effect */
box-shadow: 0 0 40px rgba(16, 185, 129, 0.2);
```

**Typography**

| Role | Font | Weights |
|------|------|---------|
| Body / UI | Inter | 400, 500, 600, 700 |
| Display / hero headings | Playfair Display | 700 |
| Code / mono labels | JetBrains Mono | 400 |

> Use `@fontsource/inter`, `@fontsource/playfair-display`, `@fontsource/jetbrains-mono` (npm packages) to self-host fonts. Do not rely on Google Fonts network requests at build time.

**Animations**

- Use Framer Motion for all enter/exit animations
- Standard pattern: blur + fade + slide (opacity 0→1, translateY +8px→0, blur 4px→0)
- Duration: 400–600ms ease-out

**Component patterns**

- All cards use the glass-card pattern
- All buttons use an emerald accent (`#10b981`) for primary, glass + border for secondary
- All text inputs use a glass background with emerald focus ring
- Status badges use subtle coloured backgrounds (e.g. amber for in-progress, emerald for accepted)
- Scrollbars: thin (6px), emerald thumb

**Vortex particle animation**

- Canvas-based particle animation on the landing page and consent gate backgrounds
- Particles: emerald (`#10b981`), pull toward canvas centre with slight vortex rotation
- 80 particles, opacity fades in/out over lifetime, size 0.5–2px

---

### 7.2 Security & Data Privacy

- **NFR-01** Supabase Row Level Security (RLS) must be enabled on all tables
- **NFR-02** Consultants may only read/write assessments where `consultant_id = auth.uid()`
- **NFR-03** Consultants may only read/write responses for assessments they own
- **NFR-04** Anonymous clients may read assessments (for token lookup) and write responses — the application validates the token before allowing any write
- **NFR-05** The `SUPABASE_SERVICE_ROLE_KEY` must only be used server-side (API routes, server components). It must never be exposed to the client
- **NFR-06** All data is encrypted at rest by Supabase (AES-256) and in transit (HTTPS/TLS)
- **NFR-07** No client passwords are stored — authentication is delegated entirely to Supabase Auth
- **NFR-08** The `share_token` must be cryptographically random and unique across all assessments

---

### 7.3 Compliance

- **NFR-09** The app must comply with the **Australian Privacy Act 1988**
- **NFR-10** Before a client begins the assessment, they must see a data handling statement explaining: what is collected, why, how long retained, and who can see it
- **NFR-11** A consent checkbox is mandatory — the assessment cannot begin without it
- **NFR-12** The consent statement language: *"I consent to CBR AI Agency storing my responses for the purpose of this discovery assessment"*
- **NFR-22** Assessment data shall be retained for **12 months** from the date of last status change. After 12 months of inactivity, records may be purged. *(v2.0 addition)*
- **NFR-23** A consultant shall be able to manually delete an assessment and all associated responses from the dashboard. Deletion is permanent and irreversible — a confirmation dialog is required. *(v2.0 addition)*

---

### 7.4 Performance

- **NFR-13** Each page load (excluding first paint of heavy animations) should complete in under 2 seconds on a standard Australian broadband connection
- **NFR-14** Form stage transitions (save + navigate) should feel instantaneous — optimistic UI, show saving indicator
- **NFR-15** PDF generation may take 3–10 seconds — show a loading state on the download button
- **NFR-16** The app must be deployed to a region close to Australia (Vercel `syd1` — Sydney)

---

### 7.5 Accessibility

- **NFR-17** All form inputs must have visible labels
- **NFR-18** Required fields must be visually indicated (asterisk)
- **NFR-19** Buttons must have descriptive labels (no icon-only buttons without aria labels)
- **NFR-20** Colour contrast for body text must meet WCAG AA minimum (4.5:1)
- **NFR-21** The app must be keyboard-navigable for core flows (login, form completion)

---

### 7.6 Mobile Responsiveness *(v2.0 addition)*

- **NFR-24** The client assessment form (Stages 1–5, consent gate, completion screen) must be fully responsive and usable on mobile devices (minimum 375px viewport width)
- **NFR-25** The consultant dashboard and assessment detail pages should be responsive but may prioritise desktop layout (minimum 768px for full functionality)
- **NFR-26** Touch targets (buttons, checkboxes, radio buttons) must be at least 44×44px on mobile

---

### 7.7 Error Handling & Resilience *(v2.0 addition)*

- **NFR-27** If auto-save fails during a stage transition, the app shall retry up to 3 times with exponential backoff (1s, 2s, 4s). If all retries fail, display an inline error message: *"Your answers couldn't be saved. Please check your connection and try again."* The user's input shall be preserved in local state.
- **NFR-28** If the token lookup fails (network error, not invalid token), display a generic error page with a "Try Again" button rather than a "not found" page
- **NFR-29** If PDF generation fails, display an error toast with the option to retry

---

## 8. Technical Architecture

### 8.1 Approved Tech Stack *(v2.0 addition — was missing in v1.0)*

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router) | 15.x |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS | v4 |
| Animation | Framer Motion | 11.x |
| Auth | Supabase Auth | — |
| Database | Supabase (PostgreSQL) | — |
| PDF Generation | @react-pdf/renderer | 4.x |
| Deployment | Vercel | syd1 region |
| Fonts | @fontsource/inter, @fontsource/playfair-display, @fontsource/jetbrains-mono | — |
| Package Manager | npm | — |

---

### 8.2 Database Schema *(v2.0 addition — was missing in v1.0)*

#### Table: `assessments`

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `uuid` | PK, default `gen_random_uuid()` | |
| `consultant_id` | `uuid` | FK → `auth.users(id)`, NOT NULL | RLS: consultant can only access own |
| `client_name` | `text` | NOT NULL | |
| `client_email` | `text` | NULLABLE | |
| `company_name` | `text` | NULLABLE | |
| `industry` | `text` | NULLABLE | Set when client completes Stage 1 |
| `status` | `text` | NOT NULL, default `'draft'` | One of the 10 lifecycle states |
| `share_token` | `text` | UNIQUE, NOT NULL | 12-char alphanumeric, cryptographically random |
| `token_expires_at` | `timestamptz` | NOT NULL | Default: created_at + 30 days |
| `current_stage` | `integer` | NOT NULL, default `0` | 0 = consent, 1–5 = client stages |
| `ai_readiness_score` | `jsonb` | NULLABLE | `{ overall: number, digital_maturity: number, automation_potential: number }` |
| `stage_6_data` | `jsonb` | NULLABLE | Consultant recommendations |
| `stage_7_data` | `jsonb` | NULLABLE | Consultant quote builder |
| `consent_given_at` | `timestamptz` | NULLABLE | Timestamp of consent checkbox |
| `created_at` | `timestamptz` | NOT NULL, default `now()` | |
| `updated_at` | `timestamptz` | NOT NULL, default `now()` | Auto-updated via trigger |

**Indexes:**
- `idx_assessments_consultant_id` on `consultant_id`
- `idx_assessments_share_token` on `share_token` (unique)
- `idx_assessments_status` on `status`

#### Table: `responses`

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `uuid` | PK, default `gen_random_uuid()` | |
| `assessment_id` | `uuid` | FK → `assessments(id)` ON DELETE CASCADE, NOT NULL | |
| `stage` | `text` | NOT NULL | `'stage_1'`, `'stage_1b'`, `'stage_2'`, `'stage_3'`, `'stage_4'`, `'stage_5'` |
| `answers` | `jsonb` | NOT NULL | Key-value pairs of field → answer |
| `created_at` | `timestamptz` | NOT NULL, default `now()` | |
| `updated_at` | `timestamptz` | NOT NULL, default `now()` | |

**Indexes:**
- `idx_responses_assessment_id` on `assessment_id`
- Unique constraint on `(assessment_id, stage)` — one response row per stage per assessment

#### RLS Policies

```sql
-- Consultants: full access to own assessments
CREATE POLICY "consultants_own_assessments" ON assessments
  FOR ALL USING (consultant_id = auth.uid());

-- Consultants: full access to responses for own assessments
CREATE POLICY "consultants_own_responses" ON responses
  FOR ALL USING (
    assessment_id IN (SELECT id FROM assessments WHERE consultant_id = auth.uid())
  );

-- Anonymous clients: read assessment by token (for lookup)
CREATE POLICY "anon_read_assessment_by_token" ON assessments
  FOR SELECT USING (true);
  -- App-level validation ensures token match + expiry check

-- Anonymous clients: insert/update responses for valid assessments
CREATE POLICY "anon_write_responses" ON responses
  FOR INSERT WITH CHECK (true);
  -- App-level validation ensures token match before allowing writes

CREATE POLICY "anon_update_responses" ON responses
  FOR UPDATE USING (true);
```

---

### 8.3 API Routes *(v2.0 addition — was missing in v1.0)*

All API routes are Next.js App Router Route Handlers under `app/api/`.

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| `POST` | `/api/assessments` | Consultant | Create a new assessment |
| `GET` | `/api/assessments` | Consultant | List all assessments for the authenticated consultant |
| `GET` | `/api/assessments/[id]` | Consultant | Get a single assessment with all responses |
| `PATCH` | `/api/assessments/[id]` | Consultant | Update assessment (status, Stage 6, Stage 7) |
| `DELETE` | `/api/assessments/[id]` | Consultant | Delete assessment and all responses |
| `PATCH` | `/api/assessments/[id]/status` | Consultant | Update status manually (quote_sent, accepted, lost) |
| `POST` | `/api/assessments/[id]/report` | Consultant | Generate and return PDF report |
| `GET` | `/api/assess/[token]` | Public | Look up assessment by token (validates expiry + status) |
| `POST` | `/api/assess/[token]/consent` | Public | Record consent timestamp |
| `POST` | `/api/assess/[token]/responses` | Public | Save stage responses (auto-save on stage completion) |

---

### 8.4 Routing Structure *(v2.0 addition — was missing in v1.0)*

Next.js App Router file structure:

```
app/
├── page.tsx                              # Landing page (/)
├── login/
│   └── page.tsx                          # Consultant login (/login)
├── dashboard/
│   ├── page.tsx                          # Dashboard (/dashboard) — protected
│   └── assessment/
│       └── [id]/
│           └── page.tsx                  # Assessment detail (/dashboard/assessment/[id]) — protected
├── assess/
│   └── [token]/
│       └── page.tsx                      # Client form (/assess/[token]) — public
├── api/
│   ├── assessments/
│   │   ├── route.ts                      # POST (create), GET (list)
│   │   └── [id]/
│   │       ├── route.ts                  # GET, PATCH, DELETE
│   │       ├── status/
│   │       │   └── route.ts              # PATCH (manual status update)
│   │       └── report/
│   │           └── route.ts              # POST (PDF generation)
│   └── assess/
│       └── [token]/
│           ├── route.ts                  # GET (token lookup)
│           ├── consent/
│           │   └── route.ts              # POST (record consent)
│           └── responses/
│               └── route.ts              # POST (save stage responses)
└── layout.tsx                            # Root layout (fonts, global styles)
```

---

## 9. Out of Scope (Phase 1) *(v2.0 addition — was missing in v1.0)*

The following features are explicitly **not included** in Phase 1. They may be considered for future phases.

| Feature | Rationale |
|---------|-----------|
| Email notifications (client completion, reminders) | Requires email service integration (e.g. Resend, SendGrid). Consider for Phase 2. |
| Multi-consultant / multi-tenancy | Phase 1 supports a single consultant. Multi-user with role management is Phase 2. |
| Client-facing email delivery of PDF report | Consultant manually delivers the report. Automated email delivery is Phase 2. |
| Analytics dashboard (conversion funnel, drop-off) | Valuable but not MVP. Phase 2. |
| Assessment comparison (year-over-year) | Requires multiple assessments per client over time. Phase 2. |
| CSV/data export | Phase 2. |
| Bulk actions on dashboard | Phase 2. |
| Real-time dashboard updates (Supabase Realtime) | Nice-to-have. Manual refresh is acceptable for Phase 1. |
| "Send via email" share option | Copy-to-clipboard is sufficient for Phase 1. |
| Assessment archival / soft delete | Hard delete is available (NFR-23). Archival is Phase 2. |
| Client review/summary screen before Stage 5 submission | Recommended for Phase 2 to improve client confidence. |

---

## 10. Acceptance Criteria

The following end-to-end flows must work before the build is considered complete:

### AC-01: Consultant creates and shares an assessment

1. Consultant logs in at `/login` with valid credentials
2. Dashboard loads showing empty state *(v2.0: explicitly includes empty state)*
3. Clicks **+ New Assessment** → fills client name → submits
4. New assessment appears in list with status `Draft`
5. Clicks **Copy Link** → link is copied, status changes to `Link Sent`

### AC-02: Client completes the assessment

1. Client opens the share link in an incognito window (no login)
2. Consent gate appears — **Begin Assessment** is disabled until checkbox checked
3. Client completes Stage 1 → selects an industry (not "Other") → Stage 1b appears with industry-specific questions
4. Client completes Stages 2, 3, 4, 5
5. Client clicks **Submit Assessment** → completion screen appears
6. Assessment status in the dashboard updates to `Client Complete`

### AC-03: Progress persists across sessions

1. Client opens the link, completes Stages 1 and 2, then closes the browser
2. Client reopens the same link → form resumes at Stage 3 (not Stage 1)

### AC-04: Consultant reviews responses and adds recommendations

1. Consultant opens the assessment → **Client Responses** tab shows all answers grouped by stage
2. AI Readiness Score gauges are visible (overall, digital maturity, automation potential)
3. Consultant opens **Recommendations** tab → fills all fields → clicks **Save Recommendations**
4. Status updates to `Recommendations Added`

### AC-05: Consultant builds a quote

1. Consultant opens **Quote Builder** tab → selects a package → enters costs → adds two line items → saves
2. Running totals display correctly
3. Status updates to `Quote Added` *(v2.0 fix: was `Report Ready`, now separated)*

### AC-06: PDF report downloads correctly

1. Consultant opens **Report** tab → clicks **Download PDF Report**
2. PDF downloads with correct filename `CBR-AI-Report-[ClientName].pdf`
3. PDF contains all 7 sections (cover, summary, profile, current state, pain points, recommendations, quote)
4. AI Readiness Score on cover page matches the gauge shown in the UI
5. Stage 6 and Stage 7 content is present and correct
6. Status updates to `Report Ready`

### AC-07: Access control is enforced

1. Opening `/dashboard` in a new incognito window redirects to `/login`
2. Opening `/assess/invalid-token-123` shows a 404 or not-found page
3. Opening an expired token URL shows an "expired" message (not the form)
4. Opening a completed assessment's token URL shows a "already complete" message (not the form)

### AC-08: Input validation works correctly *(v2.0 addition)*

1. Entering an invalid URL in the Website URL field shows a validation error
2. Number fields reject values outside their min/max range
3. Textarea character counter updates in real-time and prevents exceeding 2000 characters
4. Required fields prevent stage advancement when empty

### AC-09: Mobile assessment works *(v2.0 addition)*

1. Client opens the share link on a mobile device (375px viewport)
2. Consent gate is fully visible and usable without horizontal scrolling
3. All form fields are usable with touch input
4. Progress bar and navigation buttons are accessible

### AC-10: Error recovery works *(v2.0 addition)*

1. Simulate network failure during stage save → error message appears, input is preserved
2. Click retry → save completes successfully
3. PDF generation failure shows error toast with retry option

---

## 11. Open Questions for Stakeholder Decision *(v2.0 addition)*

These items were identified during requirements review and require stakeholder input before or during build:

| # | Question | Default Assumption |
|---|----------|--------------------|
| 1 | Should clients receive email notifications on assessment completion? | No — Phase 2 (see Section 9) |
| 2 | Is the AI Readiness Score algorithm (Section 5.10) acceptable, or do you have a preferred rubric? | Use the algorithm defined in FR-92 |
| 3 | Should the app support multiple consultants (multi-tenancy) in Phase 1? | No — single consultant, multi-tenancy in Phase 2 |
| 4 | Do you have brand assets (logo files, favicon) ready? | Use placeholders if not provided |
| 5 | For PDF reports — is on-demand generation acceptable, or should reports be cached? | On-demand (FR-91) |
| 6 | Should clients see a review/summary screen before Stage 5 submission? | No — Phase 2 (see Section 9) |
