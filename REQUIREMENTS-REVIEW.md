# Requirements Review — CBR AI Discovery Assessment Tool

## Context
Review of v1.0 requirements document for completeness, gaps, and improvement opportunities before building a multi-stage Discovery Assessment Tool for Canberra AI Agency.

---

## 1. Missing Sections (Referenced in TOC but absent)

The following sections are listed in the Table of Contents but **not included** in the document body:

| Section | Impact |
|---------|--------|
| **8.1 Approved Tech Stack** | Critical — cannot build without knowing framework, runtime, deployment target |
| **8.2 Database Schema** | Critical — need table definitions, relationships, indexes |
| **8.3 API Routes** | High — need endpoint specifications |
| **8.4 Routing Structure** | Medium — partially covered by URL structure in Section 3, but formal route table missing |
| **9. Out of Scope (Phase 1)** | Medium — important for boundary-setting to avoid scope creep |

**These must be defined before build begins.** Based on the mentions of Supabase, `@react-pdf/renderer`, and Vercel in the doc, I'd infer: Next.js (App Router) + Supabase + Tailwind + Vercel — but this needs confirmation.

---

## 2. Gaps & Missing Requirements

### A. Notifications & Communication
- **No notification when a client completes the assessment.** The consultant must manually check the dashboard. Consider: email notification via Supabase Edge Function or webhook when status changes to `client_complete`.
- **No mechanism for sharing the link** beyond copy-to-clipboard. Should there be a "Send via email" option?

### B. Mobile Responsiveness
- **No responsive/mobile requirements specified.** Clients will likely open the assessment link on mobile devices. The form must be mobile-friendly. This should be an explicit NFR.

### C. AI Readiness Score Algorithm
- FR-72 says the score is "based on cloud tool adoption inferred from Stage 2 answers" and "manual hours (Stage 4) and manual data transfer scale (Stage 3)" — but **no formula or scoring rubric is defined**.
- How are free-text answers in Stage 2 scored? Is there keyword matching? A lookup table of known tools?
- What are the weights for the composite score? (e.g., Digital Maturity × 40% + Automation Potential × 60%?)
- This needs a concrete algorithm or at minimum a scoring heuristic.

### D. Data Retention & Deletion
- The Privacy Act compliance (NFR-09) requires a data retention policy, but **none is specified**.
- How long are assessment records kept?
- Can a consultant delete an assessment? Can a client request deletion?
- No GDPR-style "right to erasure" workflow defined (relevant if non-AU clients use the tool).

### E. Assessment Editing & Re-entry
- Can a client **edit previously submitted stages** (go back to Stage 1 after completing Stage 3)?
- Can a consultant **edit client responses**? The doc says Stages 1–5 are client-only, but what if there's a typo?
- Can a consultant **create multiple assessments for the same client**? (e.g., annual re-assessment)

### F. Token Management
- Can a consultant **regenerate a token** for an expired assessment (rather than creating a whole new assessment)?
- What happens to the existing responses if a new assessment is created for the same client?

### G. Validation Rules
- No **input validation rules** beyond "required" — e.g.:
  - URL format validation for website field
  - Email format validation
  - Number field min/max ranges (e.g., hours per week, no-show rate %)
  - Character limits on textareas
  - Phone number format (not collected, but should it be?)

### H. Error Handling
- No requirements for error states: Supabase down, network failure during save, token lookup failure
- What happens if auto-save fails mid-stage? Is there retry logic? Local storage fallback?

### I. Empty & Edge States
- What does the dashboard look like with **zero assessments** (empty state)?
- What if a consultant has **hundreds of assessments** — is there pagination?
- What happens if two browser tabs open the same token URL simultaneously?

### J. PDF Storage
- Is the PDF **generated on-demand** each time, or **stored** after first generation?
- If stored, where? Supabase Storage?
- Can the consultant regenerate the PDF after updating Stage 6 or 7?

### K. Assessment Deletion / Archival
- No requirement for deleting or archiving assessments
- Over time, the dashboard will grow — need archive/filter-by-status capability

### L. Stage 1b Required/Optional Fields
- Stage 1b question tables don't specify which fields are **required vs optional**

---

## 3. Inconsistencies & Issues

| # | Issue | Location |
|---|-------|----------|
| 1 | **FR-14** says "The login page shall display a sign-out button in the dashboard header" — contradictory. Sign-out belongs on the dashboard, not the login page. | Section 5.2 |
| 2 | **FR-60** says saving Stage 7 sets status to `report_generated`, but **FR-68** says PDF generation also sets `report_generated`. Which is the actual trigger? These are two different events. | Sections 5.7 & 5.8 |
| 3 | **FR-51** says the AI Readiness Score is persisted when Stage 6 is saved, but **FR-71** says it's calculated when the client completes the assessment. When is it actually calculated vs stored? | Sections 5.6 & 5.10 |
| 4 | Stage 3 has a **Slider (1–10)** for manual data transfer — sliders are non-standard in the design system. Need specification for the slider component styling. | Section 6, Stage 3 |
| 5 | No **confirmation/review step** before the client submits Stage 5 — they can't review all their answers before final submission. | Section 5.5 |

---

## 4. Improvement Opportunities

### A. Client Experience
1. **Add a review/summary screen before Stage 5 submission** — let clients see all their answers before clicking "Submit Assessment". Reduces anxiety and errors.
2. **Email the client a confirmation** after submission with a reference number and "what happens next" info.
3. **Add a "Save & Continue Later" button** — while auto-save works on stage completion, explicitly letting clients know they can leave and return builds trust.

### B. Consultant Experience
4. **Dashboard sorting** — sort by status, date created, date updated, client name. Currently only search/filter is specified.
5. **Bulk actions** — mark multiple assessments as "lost", export a list, etc.
6. **Assessment notes/activity log** — timestamped log of status changes and consultant actions for audit trail.
7. **Duplicate assessment** — copy an existing assessment's Stage 6/7 as a template for a similar client.

### C. Technical
8. **Optimistic auto-save with local storage fallback** — if network fails, queue saves locally and sync when reconnected.
9. **Real-time dashboard updates** — use Supabase Realtime subscriptions so the dashboard updates when a client completes an assessment (no manual refresh needed).
10. **PDF preview before download** — render an in-browser preview of the report before generating the final PDF.

### D. Business Value
11. **Analytics dashboard** — conversion funnel: how many assessments created → sent → completed → accepted. Average completion time. Drop-off stage.
12. **Assessment comparison** — if a client does a second assessment, show progress/changes over time.
13. **Export to CSV** — export assessment data for CRM import or reporting.

---

## 5. Questions for the Client

1. What is the **confirmed tech stack**? (I'm assuming Next.js 14+ App Router, Supabase, Tailwind CSS, Vercel — please confirm)
2. Should clients receive any **email notifications** (confirmation after submission, reminder if incomplete)?
3. Is **mobile responsiveness** required for Phase 1? (I'd strongly recommend yes)
4. How should the **AI Readiness Score** be calculated? Do you have a scoring rubric, or should I design one?
5. Should consultants be able to **delete assessments**?
6. Is **pagination** needed for the dashboard, or will the assessment count stay small?
7. For **PDF reports** — generate on-demand each time, or cache/store them?
8. Are all **Stage 1b questions optional**, or are some required?
9. Should the app support **multiple consultants** (multi-tenancy), or is this single-consultant for now?
10. Do you have **brand assets** (logo files, favicon) ready, or should I use placeholders?

---

## 6. Recommended Tech Stack (pending confirmation)

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion |
| Auth | Supabase Auth |
| Database | Supabase (PostgreSQL) |
| PDF | @react-pdf/renderer |
| Deployment | Vercel (syd1 region) |
| Fonts | @fontsource/inter, @fontsource/playfair-display, @fontsource/jetbrains-mono |

---

## 7. Verification Plan
- Run locally with `npm run dev` and test all 7 acceptance criteria (AC-01 through AC-07)
- Supabase local development via `supabase start` for local DB + Auth
- Test PDF generation with sample data
- Test token expiry and edge cases
- Test mobile responsiveness across viewports
- Verify RLS policies by attempting cross-consultant data access
