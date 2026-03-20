# CBR AI Discovery Tool — Assessment Questions Review

Use this document to review all questions the client sees. Mark any you'd like to remove or change.

**Last updated:** 2026-03-19 (v2.2 — added contact name, expanded industries, multi-select chips for Stage 2, suggestion chips for Stage 3)

---

## Stage 1: Business Profile (7 questions + 2 conditional)

| # | Field | Question / Label | Type | Required | Options / Notes |
|---|-------|-----------------|------|----------|-----------------|
| 1 | `contact_name` | Your Name | Text | Yes | First and last name |
| 2 | `business_name` | Business Name | Text | Yes | — |
| 3 | `website_url` | Website URL | URL | No | — |
| 4 | `business_purpose` | Primary purpose of the business | Textarea | Yes | — |
| 5 | `core_products` | Core products or services | Textarea | No | — |
| 6 | `employee_count` | Number of full-time employees | Select | Yes | Just me (1), 2–5, 6–20, 21–50, 51–200, 200+ |
| 7 | `bottleneck_department` | Biggest bottleneck department | Text | No | Placeholder: "e.g. Sales, Admin, Customer Service" |
| 8 | `industry` | Industry | Select | Yes | 38 industries alphabetically sorted (see full list below) |
| 9 | `is_decision_maker` | Are you the primary decision-maker for technology purchases? | Radio | Yes | Yes, No |
| 9b | `decision_maker_name` | Decision-maker's name/role | Text | Only if #9 = No | — |

### Industry Options (38)

Accounting & Finance, Agriculture & Farming, Architecture & Design, Automotive, Construction & Trades, Consulting & Advisory, Education & Training, Energy & Utilities, Engineering, Entertainment & Media, Environmental Services, Fashion & Apparel, Financial Services & Insurance, Food & Beverage, Government & Public Sector, Health & Beauty, Healthcare & Medical, Hospitality & Tourism, IT & Technology, Legal Services, Logistics & Supply Chain, Manufacturing, Marketing & Advertising, Mining & Resources, Non-Profit & Charity, Pharmaceutical, Professional Services, Property Management, Real Estate, Recruitment & Staffing, Retail & E-Commerce, Security Services, Sports & Recreation, Telecommunications, Transport & Freight, Veterinary & Animal Services, Wholesale & Distribution, Other

**Stage 1b triggered for:** Construction & Trades, Real Estate, Professional Services, Health & Beauty only. All other industries skip to Stage 2.

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

## Stage 2: Software Stack (6 categories, multi-select chips)

Each category shows the top 10 platforms as selectable chips. Clients can select multiple tools and add custom entries via an "Other" chip with free-text input. Data is stored as JSON arrays.

| # | Field | Category Label | Required | Top 10 Options |
|---|-------|---------------|----------|----------------|
| 1 | `email_calendar` | Email & Calendar | Yes | Google Workspace, Microsoft 365, Apple iCloud, Zoho Mail, ProtonMail, Yahoo Mail, Outlook (standalone), Thunderbird, FastMail, Calendly |
| 2 | `crm_tool` | CRM / Lead Management | No | HubSpot, Salesforce, Zoho CRM, Pipedrive, Monday CRM, Freshsales, ActiveCampaign, Insightly, Copper, Nimble |
| 3 | `project_management` | Project Management & Internal Comms | No | Asana, Trello, Monday.com, Jira, ClickUp, Basecamp, Notion, Microsoft Teams, Slack, Linear |
| 4 | `data_storage` | Client / Business Data Storage | No | Google Drive, SharePoint, Dropbox, OneDrive, Box, iCloud Drive, Local/Network Server, AWS S3, Notion, Airtable |
| 5 | `accounting_software` | Accounting & Finance | Yes | Xero, MYOB, QuickBooks, FreshBooks, Sage, Wave, Reckon, NetSuite, Zoho Books, Kashoo |
| 6 | `specialised_software` | Industry-Specific / Specialised Software | No | Procore, ServiceM8, Cliniko, Rex, Mindbody, Canva, Adobe Creative Suite, AutoCAD, Shopify, WordPress |

---

## Stage 3: Workflows & Automations (4 suggestion questions + 1 slider)

Each text-based question shows prepopulated suggestion chips. Clients pick one or click "Custom answer" to type their own response.

| # | Field | Question | Type | Required | Suggestions |
|---|-------|---------|------|----------|-------------|
| 1 | `automation_tools` | Current automation tools (if any) | Suggestion chips | Yes | Zapier, Make (Integromat), Power Automate, IFTTT, n8n, None — everything is manual |
| 2 | `lead_process` | Describe your process when a new lead or enquiry comes in | Suggestion chips | Yes | 4 options (e.g. "Lead comes via email/phone → manually add to spreadsheet → follow up within 24hrs") |
| 3 | `invoice_process` | How are invoices and contracts generated and sent? | Suggestion chips | No | 4 options (e.g. "Manually create in Word/Excel → email as PDF → track payments in spreadsheet") |
| 4 | `auto_replies` | Are there any auto-replies, chatbots, or automated responses currently active? | Suggestion chips | No | No automated responses at all, Basic email auto-reply only, Website chatbot for FAQs, Auto-reply on social media, SMS auto-confirmation |
| 5 | `manual_data_transfer` | How much manual copy-paste / data transfer happens weekly? | Slider (1–10) | No | 1 = None, 10 = Constant |

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

| Stage | Topic | Question Count | Input Types |
|-------|-------|---------------|-------------|
| Stage 1 | Business Profile | 9 (+ 1 conditional) | Text, URL, Textarea, Select, Radio |
| Stage 1B | Industry Details | 4 (varies by industry) | Textarea, Number |
| Stage 2 | Software Stack | 6 categories | Multi-select chips + Other |
| Stage 3 | Workflows & Automations | 5 | Suggestion chips, Slider |
| Stage 4 | Pain Points | 5 | Textarea, Number, Text |
| Stage 5 | Future Vision | 6 | Textarea, Select |
| **Total** | | **35 questions** (client sees ~27–31 depending on industry) |

---

## Notes for Review

- Stages 6 (Recommendations) and 7 (Quote/Pricing) are consultant-only — the client never sees those
- Stage 2 now uses multi-select chips instead of free-text fields — faster to complete, more structured data
- Stage 3 now offers suggestion chips with a custom answer option — reduces blank-page anxiety while still allowing detailed responses
- Required fields: Contact Name, Business Name, Business Purpose, Employee Count, Industry, Decision Maker, Email & Calendar, Accounting Software, Automation Tools, Lead Process, Success Vision, AI Autonomy, Timeline, Budget (14 required)
- Stage 1b is only triggered for 4 industries (Construction & Trades, Real Estate, Professional Services, Health & Beauty) — the remaining 34 industries skip directly to Stage 2
