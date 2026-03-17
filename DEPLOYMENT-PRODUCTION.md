# Production Deployment Guide

## CBR AI Discovery Assessment Tool v2.0

This guide covers deploying the application to production using **Vercel** (hosting) and **Supabase Cloud** (database + auth). This is the recommended production stack.

---

## Architecture Overview

```
┌─────────────┐        ┌──────────────────┐        ┌─────────────────┐
│   Browser    │───────>│   Vercel (CDN)   │───────>│  Supabase Cloud │
│  (Client)    │<───────│   Next.js SSR    │<───────│  PostgreSQL +   │
│              │        │   + API Routes   │        │  Auth + RLS     │
└─────────────┘        └──────────────────┘        └─────────────────┘
```

| Component | Service | Region |
|-----------|---------|--------|
| Frontend + API | Vercel | Sydney (syd1) |
| Database + Auth | Supabase | Sydney (ap-southeast-2) |
| DNS | Your domain registrar | — |

---

## Prerequisites

| Tool | Purpose | Sign Up |
|------|---------|---------|
| **Supabase account** | Database, auth, RLS | [supabase.com](https://supabase.com) |
| **Vercel account** | Hosting, CDN, serverless | [vercel.com](https://vercel.com) |
| **GitHub account** | Source repository (for Vercel auto-deploy) | [github.com](https://github.com) |
| **Custom domain** (optional) | e.g. `assess.cbrai.com.au` | Your registrar |
| **Node.js 18+** | Local build verification | [nodejs.org](https://nodejs.org) |
| **Vercel CLI** (optional) | CLI deployments | `npm i -g vercel` |

---

## Part 1: Supabase Cloud Setup

### 1.1 Create a Production Project

1. Log in to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Click **New Project**
3. Configuration:
   - **Name:** `cbr-ai-assessment-prod`
   - **Database Password:** Generate a strong password (save it securely — you'll need it for direct DB access if required)
   - **Region:** `Southeast Asia (Singapore)` or `Sydney (ap-southeast-2)` — choose the closest to your users
   - **Pricing Plan:** Free tier works for low volume; Pro ($25/mo) recommended for production
4. Click **Create new project**
5. Wait for provisioning (~2 minutes)

### 1.2 Run the Database Migration

1. In the Supabase dashboard, go to **SQL Editor**
2. Click **New query**
3. Copy the entire contents of `supabase/migrations/001_initial_schema.sql`
4. Paste into the editor
5. Click **Run**

**Expected result:** "Success. No rows returned"

**Verify:**
- Go to **Table Editor** — you should see `assessments` and `responses` tables
- Go to **Authentication** > **Policies** — you should see RLS policies listed for both tables

### 1.3 Create the Consultant User

1. Go to **Authentication** > **Users**
2. Click **Add user** > **Create new user**
3. Enter:
   - **Email:** The consultant's real email address
   - **Password:** A strong password (share securely with the consultant)
   - **Auto Confirm User:** Toggle **ON**
4. Click **Create user**

**For multiple consultants:** Repeat this step for each consultant. The RLS policies ensure each consultant can only see their own assessments.

### 1.4 Configure Auth Settings

1. Go to **Authentication** > **URL Configuration**
2. Set:
   - **Site URL:** `https://your-domain.com` (or your Vercel URL, e.g. `https://cbr-ai-assessment.vercel.app`)
   - **Redirect URLs:** Add `https://your-domain.com/**`
3. Go to **Authentication** > **Email Templates** (optional):
   - Customise the password reset email template with your branding

### 1.5 Collect API Credentials

Go to **Settings** > **API** and note down:

| Value | Environment Variable | Where to Find |
|-------|---------------------|---------------|
| Project URL | `NEXT_PUBLIC_SUPABASE_URL` | Under "Project URL" |
| `anon` `public` key | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Under "Project API keys" |
| `service_role` `secret` key | `SUPABASE_SERVICE_ROLE_KEY` | Under "Project API keys" (click "Reveal") |

**IMPORTANT:** The `service_role` key bypasses RLS and should NEVER be exposed to the client. It is only used in server-side API routes.

### 1.6 (Optional) Configure Supabase Security

For production hardening:

1. **Settings > API:**
   - Under "API Settings", consider enabling **JWT expiry** (default 3600s is fine)

2. **Database > Extensions:**
   - Verify `pgcrypto` is enabled (the migration enables it)

3. **Authentication > Settings:**
   - Disable sign-up if you don't want self-registration: Toggle **Enable email sign-up** to OFF
   - This means only users you manually create can log in

---

## Part 2: Vercel Deployment

### Option A: Deploy via GitHub (Recommended — Auto-Deploy)

This sets up continuous deployment: every push to `main` automatically deploys.

#### 2A.1 Push to GitHub

Ensure your repository is on GitHub:

```bash
git remote set-url origin https://github.com/your-org/CBR-AI-Discovery-Assessment-Tool-v2.0.git
git push origin main
```

#### 2A.2 Import to Vercel

1. Go to [https://vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **Add New** > **Project**
3. Click **Import Git Repository**
4. Select your GitHub repository
5. Vercel auto-detects it as a Next.js project

#### 2A.3 Configure Project Settings

On the import screen:

- **Framework Preset:** Next.js (auto-detected)
- **Root Directory:** `.` (leave as default)
- **Build Command:** `npm run build` (auto-detected)
- **Output Directory:** `.next` (auto-detected)
- **Install Command:** `npm install` (auto-detected)

#### 2A.4 Set Environment Variables

Before clicking Deploy, expand **Environment Variables** and add:

| Key | Value | Environment |
|-----|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://your-project-ref.supabase.co` | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIs...` | Production, Preview, Development |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOiJIUzI1NiIs...` | Production, Preview, Development |
| `NEXT_PUBLIC_APP_URL` | `https://your-domain.com` | Production |
| `NEXT_PUBLIC_APP_URL` | `https://cbr-ai-assessment-preview.vercel.app` | Preview |

**Note:** `NEXT_PUBLIC_` variables are exposed to the browser. This is intentional for the Supabase URL and anon key (they are safe to expose — RLS protects the data).

#### 2A.5 Set the Region

1. Go to **Settings** > **Functions**
2. Set **Function Region** to `Sydney, Australia (syd1)`
   - This minimises latency between Vercel's serverless functions and Supabase in Sydney

#### 2A.6 Deploy

Click **Deploy**. Vercel will:
1. Clone the repository
2. Run `npm install`
3. Run `npm run build`
4. Deploy to its global CDN

**First deploy takes ~2–3 minutes.** Subsequent deploys are faster.

After deployment, Vercel provides a URL like:
```
https://cbr-ai-assessment-xxxxx.vercel.app
```

#### 2A.7 Verify the Deployment

Open the Vercel URL and run through:

| Check | URL | Expected |
|-------|-----|----------|
| Landing page | `/` | Vortex animation, value tiles |
| Login | `/login` | Login form loads |
| Auth works | Log in with consultant creds | Redirects to `/dashboard` |
| Dashboard | `/dashboard` | Empty state or assessment list |
| Protected routes | Open `/dashboard` in incognito | Redirects to `/login` |

---

### Option B: Deploy via Vercel CLI

For manual deployments without GitHub integration.

#### 2B.1 Install Vercel CLI

```bash
npm install -g vercel
```

#### 2B.2 Log In

```bash
vercel login
```

#### 2B.3 Link the Project

```bash
cd CBR-AI-Discovery-Assessment-Tool-v2.0
vercel link
```

Follow the prompts to create or link to a Vercel project.

#### 2B.4 Set Environment Variables

```bash
# Public variables
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env add NEXT_PUBLIC_APP_URL production

# Secret variables
vercel env add SUPABASE_SERVICE_ROLE_KEY production
```

Enter each value when prompted.

#### 2B.5 Deploy to Production

```bash
# Preview deployment (for testing)
vercel

# Production deployment
vercel --prod
```

---

## Part 3: Custom Domain Setup

### 3.1 Add Domain in Vercel

1. Go to your project in Vercel dashboard
2. Click **Settings** > **Domains**
3. Enter your domain: `assess.cbrai.com.au`
4. Click **Add**

### 3.2 Configure DNS Records

Vercel will show you the required DNS records. Add them at your domain registrar:

**For apex domain (cbrai.com.au):**
| Type | Name | Value |
|------|------|-------|
| A | @ | `76.76.21.21` |

**For subdomain (assess.cbrai.com.au):**
| Type | Name | Value |
|------|------|-------|
| CNAME | assess | `cname.vercel-dns.com` |

### 3.3 SSL Certificate

Vercel automatically provisions and renews a free SSL certificate (Let's Encrypt) once DNS propagation completes (usually 1–10 minutes, up to 48 hours).

### 3.4 Update Environment Variables

After adding a custom domain, update:

1. **Vercel:** Update `NEXT_PUBLIC_APP_URL` to `https://assess.cbrai.com.au`
2. **Supabase:** Go to **Authentication** > **URL Configuration** and update the **Site URL** to `https://assess.cbrai.com.au`

Redeploy after changing environment variables:
```bash
vercel --prod
```

---

## Part 4: Post-Deployment Checklist

Run through this checklist after every production deployment:

### Functional Checks

- [ ] Landing page loads with vortex animation
- [ ] Consultant can log in at `/login`
- [ ] Dashboard loads with correct assessment count
- [ ] "New Assessment" modal works and creates an assessment
- [ ] "Copy Link" copies the correct production URL (not localhost)
- [ ] Client can open assessment link in incognito (no login required)
- [ ] Consent gate works (checkbox + Begin Assessment)
- [ ] All 5 stages can be completed
- [ ] Industry-specific questions (Stage 1b) appear for non-"Other" industries
- [ ] Completion screen appears after Stage 5 submission
- [ ] Dashboard shows "Client Complete" status after submission
- [ ] Consultant can add recommendations (Stage 6)
- [ ] Consultant can build a quote (Stage 7)
- [ ] PDF report downloads correctly
- [ ] Assessment can be marked as "Quote Sent", "Accepted", or "Lost"

### Security Checks

- [ ] `/dashboard` redirects to `/login` when unauthenticated
- [ ] Invalid token URLs show "not found" page
- [ ] Expired token URLs show "expired" message
- [ ] Completed assessment token URLs show "already complete" message
- [ ] `SUPABASE_SERVICE_ROLE_KEY` is not visible in browser network tab or page source

### Performance Checks

- [ ] Landing page loads in under 3 seconds
- [ ] Form stage transitions feel instantaneous
- [ ] PDF generation completes within 10 seconds

---

## Part 5: Ongoing Maintenance

### Redeployments

**With GitHub integration:** Push to `main` and Vercel deploys automatically.

**With CLI:**
```bash
vercel --prod
```

### Database Changes

For schema changes after the initial deployment:

1. Create a new migration file: `supabase/migrations/002_your_change.sql`
2. Test locally with `supabase db reset`
3. Apply to production via the Supabase SQL Editor

### Monitoring

**Vercel:**
- View function logs: **Project** > **Logs**
- View analytics: **Project** > **Analytics**
- Check build status: **Project** > **Deployments**

**Supabase:**
- View database usage: **Settings** > **Usage**
- View auth logs: **Authentication** > **Logs**
- Query data: **Table Editor** or **SQL Editor**

### Backups

Supabase provides:
- **Point-in-time recovery** (Pro plan and above)
- **Daily backups** (all plans)
- **Manual backups** via SQL dump: go to **Settings** > **Database** > **Backups**

### Scaling Considerations

| Concern | Threshold | Action |
|---------|-----------|--------|
| Database connections | >50 concurrent | Upgrade to Supabase Pro with connection pooling |
| API rate limits | >500 req/s | Vercel auto-scales; Supabase may need Pro plan |
| PDF generation | Large reports | Consider moving to a queue-based system |
| Storage | >500MB database | Monitor via Supabase dashboard |

---

## Environment Variable Reference

| Variable | Required | Exposed to Client | Description |
|----------|----------|-------------------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Yes | Supabase anonymous/public API key |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | No | Supabase service role key (server-side only) |
| `NEXT_PUBLIC_APP_URL` | Yes | Yes | Public URL of the deployed app |

---

## Rollback Procedure

If a deployment causes issues:

**Vercel dashboard:**
1. Go to **Deployments**
2. Find the last known-good deployment
3. Click the **...** menu > **Promote to Production**

**Vercel CLI:**
```bash
# List recent deployments
vercel ls

# Promote a specific deployment
vercel promote <deployment-url>
```

---

## Cost Estimate

| Service | Free Tier Includes | Pro Tier |
|---------|-------------------|----------|
| **Vercel** | 100GB bandwidth, 100 hrs compute | $20/mo (1TB bandwidth) |
| **Supabase** | 500MB DB, 50K auth users, 2GB bandwidth | $25/mo (8GB DB, unlimited auth) |
| **Domain** | — | ~$15–$40/year |
| **Total (Free)** | Suitable for < 100 assessments/month | — |
| **Total (Pro)** | — | ~$45/month + domain |
