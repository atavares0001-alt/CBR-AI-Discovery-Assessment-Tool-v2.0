# Local Development Deployment Guide

## CBR AI Discovery Assessment Tool v2.0

This guide walks through setting up the application for local development from a fresh clone.

---

## Prerequisites

Before you begin, ensure you have the following installed:

| Tool | Minimum Version | Check Command |
|------|-----------------|---------------|
| **Node.js** | 18.17 or later | `node --version` |
| **npm** | 9.x or later | `npm --version` |
| **Git** | 2.x or later | `git --version` |
| **Supabase CLI** (optional) | 1.x or later | `supabase --version` |
| **Docker** (optional, for local Supabase) | 20.x or later | `docker --version` |

---

## Option A: Using Supabase Cloud (Recommended for Quick Start)

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd CBR-AI-Discovery-Assessment-Tool-v2.0
```

### Step 2: Install Dependencies

```bash
npm install
```

This installs all required packages including:
- Next.js 16 (App Router)
- React 19
- Tailwind CSS v4
- Framer Motion
- @supabase/supabase-js + @supabase/ssr
- @react-pdf/renderer
- Font packages (Inter, Playfair Display, JetBrains Mono)

### Step 3: Create a Supabase Project

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Click **New Project**
3. Choose your organisation (or create one)
4. Enter a project name (e.g. `cbr-ai-assessment-dev`)
5. Set a secure database password (save this — you'll need it for direct DB access)
6. Select region: **Sydney (ap-southeast-2)** for lowest latency in Australia
7. Click **Create new project** and wait for provisioning (~2 minutes)

### Step 4: Run the Database Migration

1. In your Supabase dashboard, navigate to **SQL Editor** (left sidebar)
2. Click **New query**
3. Open the file `supabase/migrations/001_initial_schema.sql` from this repository
4. Copy the entire contents and paste into the SQL Editor
5. Click **Run** (or press Cmd/Ctrl+Enter)
6. You should see "Success. No rows returned" — this means the tables, indexes, triggers, and RLS policies were created successfully

**Verify the schema:**
- Navigate to **Table Editor** in the sidebar
- You should see two tables: `assessments` and `responses`
- Click on `assessments` to verify it has all columns (id, consultant_id, client_name, etc.)

### Step 5: Create a Consultant User

The app uses Supabase Auth for consultant login. You need to create at least one user:

1. In the Supabase dashboard, navigate to **Authentication** > **Users**
2. Click **Add user** > **Create new user**
3. Enter:
   - **Email:** Your consultant email (e.g. `consultant@cbrai.com.au`)
   - **Password:** A secure password
   - **Auto Confirm User:** Toggle ON (so the email doesn't need verification)
4. Click **Create user**

**Note:** This email and password is what you'll use to log in at `/login`.

### Step 6: Configure Environment Variables

1. Copy the example environment file:

```bash
cp .env.local.example .env.local
```

2. Open `.env.local` in your editor and fill in the values:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Where to find these values:**

1. In the Supabase dashboard, go to **Settings** > **API** (or **Project Settings** > **API**)
2. **Project URL** → Copy to `NEXT_PUBLIC_SUPABASE_URL`
3. **Project API keys:**
   - `anon` `public` key → Copy to `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` `secret` key → Copy to `SUPABASE_SERVICE_ROLE_KEY`

**IMPORTANT:** Never commit `.env.local` to version control. It is already in `.gitignore`.

### Step 7: Start the Development Server

```bash
npm run dev
```

The app will start on [http://localhost:3000](http://localhost:3000) using Turbopack for fast refresh.

### Step 8: Verify the Setup

Open your browser and walk through the following:

| Step | URL | Expected Result |
|------|-----|-----------------|
| 1 | `http://localhost:3000` | Landing page with vortex animation and value tiles |
| 2 | `http://localhost:3000/login` | Login form appears |
| 3 | Log in with your consultant credentials | Redirected to `/dashboard` |
| 4 | Dashboard shows empty state | "No assessments yet" with create button |
| 5 | Click **+ New Assessment** | Modal opens for client name/email |
| 6 | Create an assessment | Assessment appears in list with "Draft" badge |
| 7 | Click **Copy Link** | Link copied, status changes to "Link Sent" |
| 8 | Open the copied link in an incognito window | Consent gate appears |
| 9 | Complete the 5-stage assessment | Completion screen with "What happens next" |
| 10 | Return to dashboard | Assessment shows "Client Complete" status |

---

## Option B: Using Supabase Local (Full Offline Development)

This option runs Supabase locally via Docker. No cloud account needed.

### Step 1: Install the Supabase CLI

```bash
# macOS
brew install supabase/tap/supabase

# npm (cross-platform)
npm install -g supabase
```

### Step 2: Initialise Supabase Locally

```bash
# From the project root
supabase init
```

This creates a `supabase/config.toml` file if one doesn't exist.

### Step 3: Start Supabase Services

```bash
supabase start
```

This starts local instances of:
- PostgreSQL database (port 54322)
- Auth server (port 54321)
- Storage server
- REST API (PostgREST)
- Realtime server

After startup, the CLI outputs your local credentials:

```
API URL: http://127.0.0.1:54321
GraphQL URL: http://127.0.0.1:54321/graphql/v1
DB URL: postgresql://postgres:postgres@127.0.0.1:54322/postgres
Studio URL: http://127.0.0.1:54323
Inbucket URL: http://127.0.0.1:54324
anon key: eyJhbGciOiJIUzI1NiIs...
service_role key: eyJhbGciOiJIUzI1NiIs...
```

### Step 4: Run the Migration

```bash
supabase db reset
```

This applies all migrations in `supabase/migrations/` automatically.

Alternatively, apply manually:

```bash
psql postgresql://postgres:postgres@127.0.0.1:54322/postgres -f supabase/migrations/001_initial_schema.sql
```

### Step 5: Create a Consultant User

Open the local Supabase Studio at [http://127.0.0.1:54323](http://127.0.0.1:54323):

1. Navigate to **Authentication** > **Users**
2. Click **Add user**
3. Enter an email and password
4. Toggle **Auto Confirm**
5. Click **Create user**

### Step 6: Configure Environment Variables

```bash
cp .env.local.example .env.local
```

Update `.env.local` with the local values from Step 3:

```bash
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key from supabase start output>
SUPABASE_SERVICE_ROLE_KEY=<service_role key from supabase start output>
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 7: Start the Development Server

```bash
npm run dev
```

### Step 8: Stopping Supabase

When you're done developing:

```bash
supabase stop
```

To stop and reset all data:

```bash
supabase stop --no-backup
```

---

## Common Development Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with Turbopack (port 3000) |
| `npm run build` | Production build (type-check + compile) |
| `npm run start` | Start production server (after build) |
| `npm run lint` | Run ESLint |
| `npx eslint src/` | Run ESLint directly on src directory |

---

## Troubleshooting

### "Supabase URL and API key are required"
Your `.env.local` file is missing or has empty values. Ensure all four environment variables are set.

### Login fails with "Invalid email or password"
- Verify the user exists in Supabase Auth (Dashboard > Authentication > Users)
- Ensure you toggled "Auto Confirm" when creating the user
- Check that `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correct

### Assessment form shows "Assessment not found"
- The share token may be invalid or expired (30-day expiry)
- Check the `assessments` table in Supabase to verify the token exists

### PDF generation fails
- Ensure `SUPABASE_SERVICE_ROLE_KEY` is correctly set (PDF route uses server client)
- Check the browser console and terminal for error details

### Port 3000 already in use
```bash
# Kill the process on port 3000
lsof -ti:3000 | xargs kill -9

# Or start on a different port
npm run dev -- --port 3001
```

### Supabase local won't start
- Ensure Docker is running: `docker info`
- Check if ports are available: 54321, 54322, 54323, 54324
- Try `supabase stop` then `supabase start` again

---

## Project Structure

```
CBR-AI-Discovery-Assessment-Tool-v2.0/
├── src/
│   ├── app/                        # Next.js App Router pages
│   │   ├── page.tsx                # Landing page (/)
│   │   ├── layout.tsx              # Root layout
│   │   ├── globals.css             # Design system tokens + utilities
│   │   ├── login/                  # Consultant login (/login)
│   │   ├── dashboard/              # Dashboard + assessment detail
│   │   ├── assess/[token]/         # Client assessment form
│   │   └── api/                    # 11 API route handlers
│   ├── components/
│   │   ├── ui/                     # Reusable UI components
│   │   ├── layout/                 # Header, DashboardLayout
│   │   ├── dashboard/              # AssessmentList, AssessmentRow, NewModal
│   │   ├── assess/                 # ConsentGate, StageForm, stages/
│   │   ├── assessment/             # ResponsesTab, RecommendationsTab, etc.
│   │   └── VortexBackground.tsx    # Canvas particle animation
│   └── lib/
│       ├── supabase/               # Supabase client utilities
│       ├── hooks/                  # useAuth hook
│       ├── types/                  # TypeScript type definitions
│       ├── utils/                  # Token, scoring, validation utilities
│       └── pdf/                    # PDF report template
├── supabase/
│   └── migrations/                 # SQL migration files
├── .env.local.example              # Environment variable template
├── package.json
├── tsconfig.json
├── next.config.ts
├── postcss.config.mjs
└── eslint.config.mjs
```
