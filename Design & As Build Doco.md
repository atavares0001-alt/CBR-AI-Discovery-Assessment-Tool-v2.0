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
    /ui          # Atomic UI elements (buttons, inputs, etc.)
    /assessment  # Assessment stage components
    /dashboard   # Consultant dashboard components
  /lib           # Core logic, Supabase client, utilities, and types
    /supabase    # Supabase initialization and schema-related logic
    /pdf         # PDF template and generation logic
/supabase
  /migrations    # SQL migration files for database schema
```

### 3.2. Data Model
The database is managed via Supabase (PostgreSQL) and consists of two primary tables:
- **`assessments`**: Stores the metadata for each discovery assessment, including client details, status, and the current stage.
- **`responses`**: Stores the actual answers provided by clients for each stage of the assessment, stored as JSONB for flexibility.

### 3.3. Security & Authentication
- **Authentication**: Managed by Supabase Auth (Consultant Login).
- **Authorization**: Row Level Security (RLS) is implemented at the database level.
    - Consultants have full access to assessments they own.
    - Clients can access and update their specific assessment using a unique `share_token`.

## 4. Key Design Principles
- **Glassmorphism**: The UI utilizes a "glassy" aesthetic with semi-transparent backgrounds and subtle borders.
- **Micro-animations**: Enhanced user experience through smooth transitions and hover effects using Framer Motion.
- **Mobile First**: Fully responsive design ensuring accessibility across all devices.
- **Privacy by Design**: Data encryption and secure handling in compliance with Australian privacy law.

## 5. Deployment & Build
- **Build Tool**: Integrated Next.js build system with Turbopack for development.
- **Environment Management**: Configuration via `.env.local` for Supabase credentials and other secrets.
- **Build Status**: Documented in `BUILD-STATUS.md`.
