# Local Development Deployment Guide (Windows)

## CBR AI Discovery Assessment Tool v2.0

This guide walks through setting up the application for local development on **Windows 10/11** from a fresh clone.

---

## Prerequisites

Before you begin, install the following on your Windows machine:

### 1. Node.js (includes npm)

1. Go to [https://nodejs.org](https://nodejs.org)
2. Download the **LTS** installer (`.msi`) — version 18.17 or later
3. Run the installer, accepting all defaults
4. **Important:** On the "Tools for Native Modules" screen, tick the checkbox to install build tools if prompted
5. Verify in a **new** Command Prompt or PowerShell window:

```powershell
node --version
npm --version
```

### 2. Git for Windows

1. Go to [https://git-scm.com/download/win](https://git-scm.com/download/win)
2. Download and run the installer
3. Recommended settings during install:
   - **Default editor:** Choose your preference (VS Code recommended)
   - **PATH environment:** Select "Git from the command line and also from 3rd-party software"
   - **Line ending conversions:** Select "Checkout as-is, commit Unix-style line endings"
4. Verify:

```powershell
git --version
```

### 3. A Code Editor

[Visual Studio Code](https://code.visualstudio.com/) is recommended. Useful extensions:
- ESLint
- Tailwind CSS IntelliSense
- Prettier

### 4. Docker Desktop (Optional — only needed for local Supabase)

1. Go to [https://www.docker.com/products/docker-desktop/](https://www.docker.com/products/docker-desktop/)
2. Download and install Docker Desktop for Windows
3. **Requires:** WSL 2 backend (the installer will guide you through enabling it)
4. After install, open Docker Desktop and ensure it is running (whale icon in system tray)

### Prerequisites Checklist

Open **PowerShell** or **Command Prompt** and verify:

```powershell
node --version       # Should show v18.17.0 or later
npm --version        # Should show 9.x or later
git --version        # Should show 2.x or later
```

---

## Option A: Using Supabase Cloud (Recommended for Quick Start)

This is the fastest way to get running. You use a free Supabase cloud project for the database.

### Step 1: Clone the Repository

Open **PowerShell** or **Command Prompt**:

```powershell
git clone <repository-url>
cd CBR-AI-Discovery-Assessment-Tool-v2.0
```

Or if you prefer, clone via **VS Code**:
1. Open VS Code
2. Press `Ctrl+Shift+P` → type "Git: Clone" → paste the repository URL
3. Choose a folder → Open the cloned project

### Step 2: Install Dependencies

```powershell
npm install
```

This takes 1–2 minutes and installs all required packages including:
- Next.js 16 (App Router)
- React 19
- Tailwind CSS v4
- Framer Motion
- @supabase/supabase-js + @supabase/ssr
- @react-pdf/renderer
- Font packages (Inter, Playfair Display, JetBrains Mono)

**If you see permission errors:** Run PowerShell as Administrator, or use `npm install --force`.

### Step 3: Create a Supabase Project

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard) and sign up or log in
2. Click **New Project**
3. Choose your organisation (or create one)
4. Enter a project name (e.g. `cbr-ai-assessment-dev`)
5. Set a secure database password (save this somewhere safe — you'll need it for direct DB access)
6. Select region: **Sydney (ap-southeast-2)** for lowest latency in Australia
7. Click **Create new project** and wait for provisioning (~2 minutes)

### Step 4: Run the Database Migration

1. In your Supabase dashboard, navigate to **SQL Editor** (left sidebar)
2. Click **New query**
3. In your file explorer, navigate to the project folder and open: `supabase\migrations\001_initial_schema.sql`
4. Open this file in Notepad, VS Code, or any text editor
5. Select all (`Ctrl+A`), copy (`Ctrl+C`)
6. Paste (`Ctrl+V`) into the Supabase SQL Editor
7. Click **Run** (or press `Ctrl+Enter`)
8. You should see "Success. No rows returned" — this means the tables, indexes, triggers, and RLS policies were created

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
   - **Auto Confirm User:** Toggle **ON** (so the email doesn't need verification)
4. Click **Create user**

**Note:** This email and password is what you'll use to log in at `/login`.

### Step 6: Configure Environment Variables

1. Copy the example environment file. In **PowerShell**:

```powershell
Copy-Item .env.local.example .env.local
```

Or in **Command Prompt**:

```cmd
copy .env.local.example .env.local
```

Or simply duplicate the file in File Explorer and rename it.

2. Open `.env.local` in your editor (e.g. VS Code, Notepad) and fill in the values:

```
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

```powershell
npm run dev
```

You should see output like:

```
  ▲ Next.js 16.x.x (Turbopack)
  - Local:    http://localhost:3000
  - Network:  http://192.168.x.x:3000
```

Open [http://localhost:3000](http://localhost:3000) in your browser (Chrome, Edge, or Firefox recommended).

**To stop the server:** Press `Ctrl+C` in the terminal.

### Step 8: Verify the Setup

Open your browser and walk through the following:

| Step | URL / Action | Expected Result |
|------|-------------|-----------------|
| 1 | Open `http://localhost:3000` | Landing page with vortex animation and value tiles |
| 2 | Open `http://localhost:3000/login` | Login form appears |
| 3 | Log in with your consultant credentials | Redirected to `/dashboard` |
| 4 | Dashboard loads | "No assessments yet" with create button (empty state) |
| 5 | Click **+ New Assessment** | Modal opens for client name/email |
| 6 | Fill in client name, click Create | Assessment appears in list with "Draft" badge |
| 7 | Click **Copy Link** | Link copied to clipboard, status changes to "Link Sent" |
| 8 | Open the copied link in an InPrivate/Incognito window | Consent gate appears |
| 9 | Tick the consent checkbox, complete all 5 stages | Completion screen with "What happens next" |
| 10 | Return to dashboard (original window) | Assessment shows "Client Complete" status |

---

## Option B: Using Supabase Local (Full Offline Development)

This option runs Supabase entirely on your machine via Docker. No cloud account needed, but requires Docker Desktop.

### Step 1: Ensure Docker Desktop is Running

1. Open Docker Desktop from the Start menu
2. Wait for it to fully start (whale icon in system tray should be steady, not animating)
3. Verify in PowerShell:

```powershell
docker --version
docker info
```

If `docker info` shows an error, Docker Desktop isn't fully started yet — wait and try again.

### Step 2: Install the Supabase CLI

```powershell
npm install -g supabase
```

Verify:

```powershell
supabase --version
```

**Alternative (using Scoop package manager):**

```powershell
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

### Step 3: Initialise Supabase Locally

From the project root in PowerShell:

```powershell
supabase init
```

This creates a `supabase\config.toml` file if one doesn't exist.

### Step 4: Start Supabase Services

```powershell
supabase start
```

**First run:** This downloads Docker images (~2–5 minutes depending on your internet speed).

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

**Save these values** — you'll need them for `.env.local`.

**If startup fails:**
- Ensure Docker Desktop is running and has at least 4 GB RAM allocated
- Check that ports 54321–54324 are not in use by other applications
- Try `supabase stop` then `supabase start` again

### Step 5: Run the Migration

```powershell
supabase db reset
```

This applies all migrations in `supabase\migrations\` automatically.

### Step 6: Create a Consultant User

Open the local Supabase Studio at [http://127.0.0.1:54323](http://127.0.0.1:54323) in your browser:

1. Navigate to **Authentication** > **Users**
2. Click **Add user**
3. Enter an email and password
4. Toggle **Auto Confirm**
5. Click **Create user**

### Step 7: Configure Environment Variables

In PowerShell:

```powershell
Copy-Item .env.local.example .env.local
```

Open `.env.local` in your editor and update with the local values from Step 4:

```
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key from supabase start output>
SUPABASE_SERVICE_ROLE_KEY=<service_role key from supabase start output>
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 8: Start the Development Server

```powershell
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Step 9: Stopping Supabase

When you're done developing:

```powershell
supabase stop
```

To stop and reset all data:

```powershell
supabase stop --no-backup
```

---

## Common Development Commands

Run these in **PowerShell** or **Command Prompt** from the project root:

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with Turbopack (port 3000) |
| `npm run build` | Production build (type-check + compile) |
| `npm run start` | Start production server (after build) |
| `npm run lint` | Run ESLint |
| `npx eslint src/` | Run ESLint directly on src directory |

---

## Troubleshooting (Windows-Specific)

### "Supabase URL and API key are required"
Your `.env.local` file is missing or has empty values. Ensure all four environment variables are set. Open the file in VS Code to check — sometimes Windows Notepad adds a `.txt` extension (the file must be exactly `.env.local`, not `.env.local.txt`).

### `.env.local` file not being detected
- Ensure the file is named exactly `.env.local` (no `.txt` extension)
- In File Explorer: **View** > **Show** > **File name extensions** to verify
- If you created it with Notepad, save as "All Files (*.*)" type, not "Text Documents"

### Login fails with "Invalid email or password"
- Verify the user exists in Supabase Auth (Dashboard > Authentication > Users)
- Ensure you toggled "Auto Confirm" when creating the user
- Check that `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correct

### Assessment form shows "Assessment not found"
- The share token may be invalid or expired (30-day expiry)
- Check the `assessments` table in Supabase to verify the token exists

### PDF generation fails
- Ensure `SUPABASE_SERVICE_ROLE_KEY` is correctly set (PDF route uses server client)
- Check the browser console (`F12` > Console tab) and terminal for error details

### Port 3000 already in use

In **PowerShell**:

```powershell
# Find the process using port 3000
netstat -ano | findstr :3000

# Kill the process (replace <PID> with the number from the last column)
taskkill /PID <PID> /F
```

Or start on a different port:

```powershell
npm run dev -- --port 3001
```

### "execution of scripts is disabled on this system" (PowerShell)

If you see this error when running npm commands:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Then retry the command.

### node-gyp or native module build errors during npm install

Some packages require C++ build tools:

1. Open PowerShell **as Administrator**
2. Run:

```powershell
npm install -g windows-build-tools
```

Or install **Build Tools for Visual Studio** from [https://visualstudio.microsoft.com/visual-cpp-build-tools/](https://visualstudio.microsoft.com/visual-cpp-build-tools/) — select "Desktop development with C++" workload.

### Long file paths cause errors

Windows has a 260-character path limit by default. If `npm install` fails with path-related errors:

1. Open **Registry Editor** (`Win+R` → `regedit`)
2. Navigate to: `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\FileSystem`
3. Set `LongPathsEnabled` to `1`
4. Restart your computer

Or in **PowerShell (Administrator)**:

```powershell
New-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem" -Name "LongPathsEnabled" -Value 1 -PropertyType DWORD -Force
```

### Docker/Supabase local won't start

- Ensure **Docker Desktop** is running (check system tray)
- Ensure **WSL 2** is installed: `wsl --status` in PowerShell
- If WSL isn't installed: `wsl --install` (requires restart)
- Ensure Docker has at least **4 GB RAM** allocated: Docker Desktop > Settings > Resources
- Check if ports are in use: `netstat -ano | findstr "54321 54322 54323 54324"`

### Windows Defender / antivirus slows npm install

Add the project folder and `node_modules` to your antivirus exclusion list:
1. Open **Windows Security** > **Virus & threat protection** > **Manage settings**
2. Scroll to **Exclusions** > **Add or remove exclusions**
3. Add the project folder path

---

## Using VS Code (Recommended Setup)

### Opening the Project

```powershell
cd CBR-AI-Discovery-Assessment-Tool-v2.0
code .
```

### Recommended Extensions

Install these via the Extensions panel (`Ctrl+Shift+X`):

| Extension | Purpose |
|-----------|---------|
| ESLint | Inline linting |
| Tailwind CSS IntelliSense | Autocomplete for Tailwind classes |
| Prettier | Code formatting |
| GitLens | Enhanced Git integration |

### Integrated Terminal

Use VS Code's built-in terminal (`Ctrl+``) to run all commands. Set PowerShell as the default:
1. `Ctrl+Shift+P` → "Terminal: Select Default Profile"
2. Choose **PowerShell**

### Environment Variable Support

Install the "DotENV" extension for syntax highlighting in `.env.local` files.

---

## Project Structure

```
CBR-AI-Discovery-Assessment-Tool-v2.0\
├── src\
│   ├── app\                        # Next.js App Router pages
│   │   ├── page.tsx                # Landing page (/)
│   │   ├── layout.tsx              # Root layout
│   │   ├── globals.css             # Design system tokens + utilities
│   │   ├── login\                  # Consultant login (/login)
│   │   ├── dashboard\              # Dashboard + assessment detail
│   │   ├── assess\[token]\         # Client assessment form
│   │   └── api\                    # 11 API route handlers
│   ├── components\
│   │   ├── ui\                     # Reusable UI components
│   │   ├── layout\                 # Header, DashboardLayout
│   │   ├── dashboard\              # AssessmentList, AssessmentRow, NewModal
│   │   ├── assess\                 # ConsentGate, StageForm, stages\
│   │   ├── assessment\             # ResponsesTab, RecommendationsTab, etc.
│   │   └── VortexBackground.tsx    # Canvas particle animation
│   └── lib\
│       ├── supabase\               # Supabase client utilities
│       ├── hooks\                  # useAuth hook
│       ├── types\                  # TypeScript type definitions
│       ├── utils\                  # Token, scoring, validation utilities
│       └── pdf\                    # PDF report template
├── supabase\
│   └── migrations\                 # SQL migration files
├── .env.local.example              # Environment variable template
├── package.json
├── tsconfig.json
├── next.config.ts
├── postcss.config.mjs
└── eslint.config.mjs
```
