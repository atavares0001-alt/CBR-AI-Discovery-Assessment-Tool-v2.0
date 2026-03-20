# Design & As Build Doco — CBR AI Discovery Assessment Tool

## 1. Executive Summary
The CBR AI Discovery Assessment Tool is a Next.js-powered web application designed to help businesses assess their AI readiness. It features a multi-stage assessment process, real-time data persistence via Supabase, and automated PDF report generation.

## 2. Technology Stack
The application is built using a modern, scalable web stack:
- **Frontend Framework**: [Next.js 16.1.7](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4.2.1](https://tailwindcss.com/) with PostCSS 8.5.8
- **Animations**: [Framer Motion 12.38.0](https://www.framer.com/motion/)
- **Backend/Database**: [Supabase](https://supabase.com/) (@supabase/supabase-js 2.99.2)
- **PDF Generation**: [@react-pdf/renderer 4.3.2](https://react-pdf.org/)
- **Fonts**: Inter (UI), JetBrains Mono (Technical/Monospace), Playfair Display (Serif/Display)

## 3. Architecture Overview

### 3.1. Directory Structure
```text
/src
  /app           # Next.js App Router pages and layouts
  /components    # Reusable UI components and feature-specific components
    /ui          # Atomic UI elements (buttons, inputs, MultiSelectChips, etc.)
    /assess      # Client assessment form components (stages, progress bar)
    /assessment  # Consultant assessment detail components (tabs)
    /dashboard   # Consultant dashboard components (list, row, modal)
    /layout      # Shared layout components (header, dashboard wrapper)
    /present     # Presentation dashboard (shell, slides, visualizations)
  /lib           # Core logic, Supabase client, utilities, and types
    /supabase    # Supabase initialization and schema-related logic
    /pdf         # PDF template and generation logic
    /constants   # Shared constants (field labels, stage labels)
/public
  /branding      # Logo SVG assets (10 variants)
/supabase
  /migrations    # SQL migration files for database schema
```

### 3.2. Data Model
The database is managed via Supabase (PostgreSQL) and consists of two primary tables:
- **`assessments`**: Stores the metadata for each discovery assessment, including client details, status, and the current stage.
- **`responses`**: Stores the actual answers provided by clients for each stage of the assessment, stored as JSONB for flexibility. Stage 2 (Software Stack) answers are stored as JSON arrays of selected tools per category. All other stages store string key-value pairs.

### 3.3. Security & Authentication
- **Authentication**: Managed by Supabase Auth (Consultant Login).
- **Authorization**: Row Level Security (RLS) is implemented at the database level.
    - Consultants have full access to assessments they own.
    - Clients can access and update their specific assessment using a unique `share_token`.

### 3.4. Presentation Dashboard
The application includes an interactive, client-facing presentation system at `/dashboard/assessment/[id]/present`. This allows consultants to present assessment results in a polished, slide-based format during in-person meetings.

**Components** (`src/components/present/`):
- **PresentationShell**: Orchestrator handling mode state, keyboard navigation, data fetching, and debounced auto-save
- **SlideContainer**: Per-slide wrapper with Framer Motion transitions
- **SlideNavigation**: Bottom progress dots, prev/next buttons, slide counter
- **SlideSidebar**: Collapsible sidebar with section links (responsive hamburger on mobile)
- **FloatingToolbar**: Mode toggle, edit mode switch, save indicator
- **InlineEditable**: Click-to-edit wrapper for any text field

**10-Slide Deck**:
| Slide | Content | Data Source |
|-------|---------|-------------|
| Cover | Client name, company, industry, date | Assessment metadata |
| AI Readiness Score | Overall, Digital Maturity, Automation Potential gauges | `ai_readiness_score` |
| Business Profile | Employee count, industry, bottleneck, key metrics | Stage 1 + 1b responses |
| Technology Stack | Tool cards from multi-select chip data, colour-coded by maturity | Stage 2 responses (JSON arrays) |
| Workflows | Suggestion-based or custom responses, manual data transfer gauge | Stage 3 responses |
| Pain Points | Hours/week metric, impact cards, magic wand highlight | Stage 4 responses |
| Future Vision | Timeline, budget, autonomy/concern cards | Stage 5 responses |
| Recommendations | Executive summary, solution, services, key benefit | Stage 6 data (editable) |
| Investment Quote | Package, pricing table, timeline | Stage 7 data (editable) |
| Next Steps | Action items, proposed timeline, closing | Stage 7 data (editable) |

**Two Viewing Modes**:
- **Dashboard Mode**: All slides stacked vertically with fixed sidebar navigation
- **Presentation Mode**: Fullscreen, one slide at a time, directional transitions

**Keyboard Shortcuts**: Arrow keys/Space (navigate), F (fullscreen), E (edit mode), Escape (exit), ? (help)

**Interactive Editing**: Consultants can toggle edit mode to modify any response field inline during the meeting. Changes auto-save with a 1.5s debounce via `PATCH /api/assessments/[id]/responses`.

### 3.5. Visualizations
Custom visualization components (`src/components/present/visualizations/`):
- **ScoreGaugeLarge**: Animated circular gauge with count-up and glow ring
- **MetricCard**: Large single-metric display with adaptive text sizing
- **AnimatedCounter**: Number count-up animation
- **TechStackGrid**: Responsive tool cards with colour-coded maturity indicators
- **ProcessFlow**: Numbered step chain with responsive mobile/desktop layouts
- **PricingTable**: Quote breakdown with animated totals

### 3.6. Assessment Form Components (v2.2)
The client assessment form uses specialised input components beyond standard text fields:

- **MultiSelectChips** (`src/components/ui/MultiSelectChips.tsx`): Renders a list of options as pill-shaped toggleable chips. Supports multi-selection with checkmark indicators, an "Other" chip that reveals a comma-separated free-text input, a selected count badge, and an optional `required` prop. Used in Stage 2 (Software Stack) for all 6 tool categories.

- **SuggestionField** (inline in `src/components/assess/stages/Stage3.tsx`): Renders prepopulated answer suggestions as card-style buttons with radio-like selection behaviour (one active at a time). Includes a "Custom answer" option that reveals a textarea for manual input. Used in Stage 3 (Workflows & Automations) for all text-based questions.

- **Stage 1 Industry Dropdown**: Expanded from 5 to 38 industry options. Stage 1b (industry-specific questions) is only triggered for 4 industries: Construction & Trades, Real Estate, Professional Services, Health & Beauty. All other industries skip directly to Stage 2.

- **Contact Name Field**: Stage 1 now includes a required "Your Name" field (`contact_name`) at the top of the form for identifying the person completing the assessment.

## 4. Key Design Principles
- **Glassmorphism**: The UI utilizes a "glassy" aesthetic with semi-transparent backgrounds and subtle borders.
- **Micro-animations**: Enhanced user experience through smooth transitions and hover effects using Framer Motion.
- **Mobile First**: Fully responsive design ensuring accessibility across all devices.
- **Privacy by Design**: Data encryption and secure handling in compliance with Australian privacy law.

## 5. Deployment & Build
- **Build Tool**: Integrated Next.js build system with Turbopack for development.
- **Environment Management**: Configuration via `.env.local` for Supabase credentials and other secrets.
- **Build Status**: Documented in `BUILD-STATUS.md`.
