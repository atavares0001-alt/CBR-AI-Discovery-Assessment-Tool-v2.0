# CBR AI Discovery Tool — Assessment Questions Review

Use this document to review all questions the client sees. Mark any you'd like to remove or change.

---

## Stage 1: Business Profile (6 questions + 2 conditional)

| # | Field | Question / Label | Type | Required | Options |
|---|-------|-----------------|------|----------|---------|
| 1 | `business_name` | Business Name | Text | Yes | — |
| 2 | `website_url` | Website URL | URL | No | — |
| 3 | `business_purpose` | Primary purpose of the business | Textarea | Yes | — |
| 4 | `core_products` | Core products or services | Textarea | No | — |
| 5 | `employee_count` | Number of full-time employees | Select | Yes | Just me (1), 2–5, 6–20, 21–50, 51–200, 200+ |
| 6 | `bottleneck_department` | Biggest bottleneck department | Text | No | Placeholder: "e.g. Sales, Admin, Customer Service" |
| 7 | `industry` | Industry | Select | Yes | Construction & Trades, Real Estate, Professional Services, Health & Beauty, Other |
| 8 | `is_decision_maker` | Are you the primary decision-maker for technology purchases? | Radio | Yes | Yes, No |
| 8b | `decision_maker_name` | Decision-maker's name/role | Text | Only if #8 = No | — |

---

## Stage 1B: Industry-Specific Questions (4 questions per industry)

### Construction & Trades

| # | Field | Question | Type |
|---|-------|---------|------|
| 1 | `lead_tracking` | How do you currently track and follow up on new leads? | Textarea |
| 2 | `quote_time_hours` | How long does it typically take to get a quote to a client? (hours) | Number |
| 3 | `missed_calls_weekly` | Roughly how many calls or enquiries do you miss after hours per week? | Number |
| 4 | `biggest_admin_task` | What is the single biggest admin task slowing your team down? | Textarea |

### Real Estate

| # | Field | Question | Type |
|---|-------|---------|------|
| 1 | `weekly_enquiries` | How many new buyer/tenant enquiries do you receive per week? | Number |
| 2 | `inspection_process` | Describe your current inspection booking process | Textarea |
| 3 | `after_hours_leads` | How are leads handled outside of business hours? | Textarea |
| 4 | `crm_system` | Which CRM or lead management system are you using (if any)? | Textarea |

### Professional Services

| # | Field | Question | Type |
|---|-------|---------|------|
| 1 | `drafting_hours` | How many hours per week does your team spend drafting documents or reports? | Number |
| 2 | `onboarding_process` | Describe your client onboarding process from signed contract to first deliverable | Textarea |
| 3 | `repeat_questions` | How often do clients ask the same questions? How do you handle this? | Textarea |
| 4 | `current_ai_tools` | Are you currently using any AI tools in your practice? | Textarea |

### Health & Beauty

| # | Field | Question | Type |
|---|-------|---------|------|
| 1 | `weekly_appointments` | How many appointments do you book per week on average? | Number |
| 2 | `noshow_rate` | What is your estimated no-show or last-minute cancellation rate? (%) | Number |
| 3 | `booking_system` | What booking or scheduling system do you use (if any)? | Textarea |
| 4 | `reception_struggles` | What are the top 2–3 things your front desk or reception struggles with most? | Textarea |

---

## Stage 2: Software Stack (5 questions)

| # | Field | Question | Type | Placeholder |
|---|-------|---------|------|-------------|
| 1 | `email_calendar` | Email and calendar suite | Text | "e.g. Google Workspace, Microsoft 365" |
| 2 | `crm_tool` | CRM or lead management tool | Text | "e.g. HubSpot, Salesforce, none" |
| 3 | `project_management` | Project management and internal communications | Text | "e.g. Asana, Slack, Teams" |
| 4 | `data_storage` | Client/business data storage | Text | "e.g. Google Drive, SharePoint, local server" |
| 5 | `specialised_software` | Industry-specific or specialised software | Textarea | "e.g. Xero, Procore, Rex, Mindbody" |

---

## Stage 3: Workflows & Automations (5 questions)

| # | Field | Question | Type |
|---|-------|---------|------|
| 1 | `automation_tools` | Current automation tools (if any) | Text |
| 2 | `lead_process` | Describe your process when a new lead or enquiry comes in | Textarea |
| 3 | `invoice_process` | How are invoices and contracts generated and sent? | Textarea |
| 4 | `auto_replies` | Are there any auto-replies, chatbots, or automated responses currently active? | Text |
| 5 | `manual_data_transfer` | How much manual copy-paste / data transfer happens weekly? | Slider (1–10) |

---

## Stage 4: Pain Points (5 questions)

| # | Field | Question | Type |
|---|-------|---------|------|
| 1 | `repetitive_task` | What is the most repetitive, soul-crushing task your team does every week? | Textarea |
| 2 | `manual_data_entry_hours` | Approximately how many hours per week does your team spend on manual data entry? | Number |
| 3 | `human_errors` | Where do human errors most commonly occur in your business? | Textarea |
| 4 | `response_time` | What is your typical response time to a new customer enquiry? | Text |
| 5 | `magic_wand_task` | If you could wave a magic wand and delete one recurring task forever, what would it be? | Textarea |

---

## Stage 5: Future Vision (6 questions)

| # | Field | Question | Type | Options |
|---|-------|---------|------|---------|
| 1 | `success_vision` | What does success look like for your business in 6 months' time? | Textarea | — |
| 2 | `automated_focus` | If manual tasks were automated, what high-value work would you focus on instead? | Textarea | — |
| 3 | `ai_autonomy` | What level of AI autonomy are you comfortable with? | Select | Human-in-loop, Semi-autonomous, Full autonomy |
| 4 | `primary_concern` | What is your primary concern about adopting AI automation? | Select | Cost/ROI, Technical complexity, Data security, Staff resistance, Reliability, No concerns |
| 5 | `timeline` | What is your desired timeline for getting your first AI pilot running? | Select | Immediately, 1–3 months, 3–6 months, 6+ months |
| 6 | `budget` | Do you have an approximate budget in mind for an AI automation project? | Select | Under $5k, $5k–$20k, $20k–$50k, $50k+ |

---

## Summary

| Stage | Topic | Question Count |
|-------|-------|---------------|
| Stage 1 | Business Profile | 8 (+ 1 conditional) |
| Stage 1B | Industry Details | 4 (varies by industry) |
| Stage 2 | Software Stack | 5 |
| Stage 3 | Workflows & Automations | 5 |
| Stage 4 | Pain Points | 5 |
| Stage 5 | Future Vision | 6 |
| **Total** | | **33 questions** (client sees ~29 depending on industry) |

---

## Notes for Review

- Stages 6 (Recommendations) and 7 (Quote/Pricing) are consultant-only — the client never sees those
- The client sees roughly 29 questions across 6 screens
- Required fields: Business Name, Business Purpose, Employee Count, Industry, Decision Maker, Success Vision, AI Autonomy, Timeline, Budget (9 required)
- Consider removing or combining questions that overlap (e.g. `automation_tools` in Stage 3 vs `current_ai_tools` in Stage 1B Professional Services)
