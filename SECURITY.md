# Security Hardening — CBR AI Discovery Tool

**Audit date:** 2026-04-09  
**Branch:** `feature/assessment-enhancements`  
**Status:** Partially remediated — see open items below

---

## Summary

A security audit was performed against the full API surface, database schema, and
client-side code. Eleven findings from an external report were assessed against the
actual codebase (four were found not to exist in the current branch and are noted as
such). A further ten findings were identified independently.

Of the applicable findings, **all have been remediated in code** except for five that
require configuration changes in Supabase or the deployment platform.

---

## New files introduced

| File | Purpose |
|---|---|
| `src/lib/security/errors.ts` | Generic error responses — hides raw DB errors from clients, logs server-side |
| `src/lib/security/origin.ts` | Same-origin CSRF check for all state-changing routes |
| `src/lib/security/rateLimit.ts` | In-process fixed-window rate limiter |
| `src/lib/security/bodyLimit.ts` | Streaming JSON parser with enforced byte limits |
| `src/lib/security/audit.ts` | Structured JSON-line audit logger (to stdout) |
| `src/lib/security/sanitize.ts` | Search term sanitiser for PostgREST `.or()` filters |
| `src/app/api/csp-report/route.ts` | CSP violation receiver |
| `src/app/api/assessments/[id]/rotate-token/route.ts` | Share-token rotation endpoint |
| `supabase/migrations/003_security_hardening.sql` | Drops permissive anon RLS policies |

---

## Remediated findings

### HIGH / CRITICAL

#### #5 — RLS anonymous policies `USING (true)`

**Risk:** Any client holding the public anon key could `SELECT` or `UPDATE` every
assessment row directly via the Supabase REST API, bypassing application-layer token
validation entirely.

**Fix:** `supabase/migrations/003_security_hardening.sql` drops all five anon policies
(`anon_select_assessments_by_token`, `anon_update_assessments`, `anon_select_responses`,
`anon_insert_responses`, `anon_update_responses`) and explicitly `REVOKE`s table grants
from the `anon` role.

The public `/api/assess/[token]/*` flow uses the service-role client (`createServiceClient`)
which bypasses RLS entirely — it is unaffected by this change.

> **Deploy action required:** Run migration `003_security_hardening.sql` against your
> Supabase project before or alongside this code deployment.

#### #8 — No rate limiting on public share-token endpoints

**Risk:** `/api/assess/[token]/*` had no throttling, enabling brute-force token
enumeration (only 62¹² ≈ 3.2 × 10²¹ combinations, but 12-char tokens from a small
charset are still enumerable at scale without limits) and response-flooding DoS.

**Fix:** `src/lib/security/rateLimit.ts` — in-process fixed-window limiter applied to:
- `GET /api/assess/[token]` — 30 requests/min/IP
- `POST /api/assess/[token]/responses` — 60 saves/min/token
- `POST /api/assess/[token]/consent` — 10 consents/min/token
- `POST /api/csp-report` — 60 reports/min/IP

Returns `429 Too Many Requests` with `Retry-After` header on breach.

**Known limitation:** Counters are per-process. Multiple replicas or restarts reset
limits. See open item #OI-3.

#### #9 — Token expiry not checked before saving responses

**Risk:** The original report stated the expiry was unchecked. After code review:
expiry **was** already checked in `responses/route.ts`. However, the **completion
status was not checked** — a sealed assessment (status `client_complete` or later)
could be re-written via the public form.

**Fix:** All three public token routes now check `COMPLETED_STATUSES` and return
`410 Gone` with `code: 'ALREADY_COMPLETE'` before writing. Attempts are audit-logged
as `token.completed_write_attempt`.

#### #10 — No CSRF protection

**Risk:** All POST/PATCH/DELETE endpoints were vulnerable to cross-site request
forgery. SameSite=Lax (Supabase default) provides partial protection but does not
cover top-level navigation POSTs.

**Fix:** `src/lib/security/origin.ts` — strict same-origin check comparing
`Origin`/`Referer` against the request's own `Host` header. Fails closed (403) when
neither header is present. Applied to every state-changing route.

Override via `ALLOWED_ORIGIN` env var for deployments behind proxies that rewrite
`Host`.

The CSP report endpoint (`/api/csp-report`) is intentionally exempt — browsers send
violation reports cross-origin.

---

### HIGH

#### #11 — Search parameter injection into PostgREST `.or()` filter

**Risk:** User-supplied `?search=` was string-interpolated into a PostgREST `.or()`
call. PostgREST parses commas as logical separators and parentheses as grouping
operators inside `.or()`, so crafted input could inject extra OR conditions.

**Fix:** `src/lib/security/sanitize.ts` — whitelist `[A-Za-z0-9 .@\-_'&]`, max 64
chars. Applied in `GET /api/assessments`.

Additionally, the `?sort=` parameter is now validated against an explicit allow-list
(`updated_at`, `created_at`, `client_name`, `company_name`, `status`) and `?page=` is
capped at 10,000.

#### #12 — Backup import accepts arbitrary JSON fields (mass-assignment)

**Risk:** The import handler spread the entire parsed JSON object into the Supabase
upsert — an attacker could set `consultant_id` to hijack rows, override `share_token`
to revive expired tokens, or inject unknown columns.

**Fix:** `src/app/api/backup/route.ts` rebuilt with:
- Explicit field whitelist `ASSESSMENT_IMPORT_FIELDS` (15 safe fields, excludes
  `consultant_id`, `share_token`, `token_expires_at`, `created_at`)
- `consultant_id` forced to the importing user
- Fresh `share_token` + `token_expires_at` generated on import (old tokens not restored)
- Row limits: max 1,000 assessments, 20 responses per assessment
- UUID format validation on `id` fields
- Stage validation for responses
- DB errors logged server-side, generic message to client

#### #13 — Raw database error messages returned to client

**Risk:** `{ error: error.message }` responses leaked column names, constraint names,
table structure, and PostgREST filter syntax to any caller who triggered a 500.

**Fix:** `src/lib/security/errors.ts` — `serverError(context, err)` logs the full
error with a context tag server-side, returns a generic `"Internal server error"` to
the client. Applied to all API routes. Specific client errors (validation failures,
not-found) still return descriptive messages because those originate from client input.

#### #14 — No request body size limits on API routes

**Risk:** `next.config.ts` limited Server Actions to 2 MB but API routes were
unlimited, enabling DoS via a large backup upload or crafted request.

**Fix:** `src/lib/security/bodyLimit.ts` — streaming parser that aborts at a
configurable byte limit (checks `Content-Length` header first, then streams to enforce
even when the header is absent/lying). Limits applied:
- Small writes (single stage save, status updates): 64 KB
- Consultant patches: 512 KB
- Backup import: 5 MB

#### #15 — Missing security headers

**Risk:** No `X-Frame-Options`, `X-Content-Type-Options`, `Strict-Transport-Security`,
or `Content-Security-Policy` headers.

**Fix:** `next.config.ts` now sets for all routes (`/:path*`):

| Header | Value |
|---|---|
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` |
| `X-Frame-Options` | `DENY` |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | camera, microphone, geolocation, payment, usb all denied |
| `Content-Security-Policy` | `default-src 'self'`; Supabase REST+WS allowed; `frame-ancestors 'none'`; `object-src 'none'`; `report-uri /api/csp-report` |
| `Report-To` | Points at `/api/csp-report` for modern Reporting API |

---

### MEDIUM

#### #Mass-assignment on `PATCH /api/assessments/[id]`

**Risk:** The original handler passed the raw request body directly to Supabase
`.update(body)`. An authenticated consultant could set `consultant_id` (escalate to
another consultant's rows), `share_token`, or `token_expires_at`.

**Fix:** `src/app/api/assessments/[id]/route.ts` — `PATCH_ALLOWED_FIELDS` allow-list
(15 fields). Status values validated against `PATCH_ALLOWED_STATUSES`. Fields outside
the list are silently dropped.

#### #Email not validated on create/update

**Risk:** A malformed or intentionally crafted email stored in the DB could cause
`mailto:` link injection or unexpected downstream behaviour.

**Fix:** `POST /api/assessments` and `PATCH /api/assessments/[id]` both call
`isValidEmail()` from the existing `src/lib/utils/validation.ts`. All free-text
fields are also length-capped (name/company: 200 chars, email: 254, phone: 32).

---

### LOW

#### #16 — Modulo bias in token generation

**Risk:** `bytes[i] % 62` produces a slight statistical skew (bytes 0–55 are ~0.39%
more likely than bytes 56–61) because 256 is not evenly divisible by 62. Not
exploitable in practice but non-ideal for a security primitive.

**Fix:** `src/lib/utils/token.ts` — **rejection sampling**: bytes ≥ 248 (the largest
multiple of 62 that fits in a byte) are discarded. Each character is now exactly
uniform over the 62-char alphabet.

#### #Seed scripts could destroy production data

**Risk:** Running `npx tsx scripts/seed-assessments.ts` against a production Supabase
URL would wipe all assessments and responses without any warning.

**Fix:** Both seed scripts now:
1. Exit immediately if `NODE_ENV=production`
2. Check if the Supabase URL looks like a local instance (matches `localhost`,
   `127.0.0.1`, or `kong`)
3. Require an explicit env-var confirmation (`SEED_CONFIRM=YES_WIPE_DATA` /
   `DELETE_CONFIRM=YES_DELETE`) for any remote URL that doesn't match the above

#### #No CSP violation reporting

**Risk:** The CSP was enforce-only with no report destination — violations were silent
and could not be used to detect XSS attempts or misconfigurations.

**Fix:** New `src/app/api/csp-report/route.ts` receives both legacy `report-uri` and
modern `Report-To` violation reports. Reports are body-capped at 16 KB, rate-limited
at 60/min/IP, always return `204 No Content`. Reports are logged as
`[csp-report]` JSON lines to stderr.

#### #No share-token rotation

**Risk:** Once a share link was distributed, there was no way to invalidate it short
of deleting the entire assessment. A leaked or forwarded link remained valid for the
full 30-day window.

**Fix:** New `POST /api/assessments/[id]/rotate-token` — generates a fresh
`share_token` (unique constraint ensures the old value instantly 404s) and resets
`token_expires_at` to a new 30-day window. CSRF-checked, auth-gated, audit-logged as
`assessment.rotate_token`.

**UI integration:** No button has been added yet — wire it up when ready:
```ts
await fetch(`/api/assessments/${id}/rotate-token`, { method: 'POST' })
// Response: { id, share_token, token_expires_at }
```

#### #No UUID validation on route params

**Risk:** A malformed `[id]` (e.g. `' OR 1=1`) reached the Supabase query layer,
where PostgREST would reject it with a DB error that was then echoed to the client.

**Fix:** All `[id]` routes validate against `/^[0-9a-f]{8}-...-[0-9a-f]{12}$/i` and
return a generic 404 immediately on mismatch.

#### #18 — No audit logging

**Risk:** Security-relevant events (auth failures, token abuse, exports, deletes) left
no trace, making post-incident investigation impossible.

**Fix:** `src/lib/security/audit.ts` — structured JSON-line logger. Events:

| Event | Trigger |
|---|---|
| `auth.unauthorized` | Any 401 on a consultant route |
| `csrf.blocked` | Origin check failure |
| `rate_limit.blocked` | Rate limit exceeded |
| `assessment.create` | New assessment created |
| `assessment.delete` | Assessment deleted |
| `assessment.export` | Backup downloaded |
| `assessment.import` | Backup imported |
| `assessment.report` | PDF report generated |
| `assessment.rotate_token` | Share token rotated |
| `token.invalid` | Malformed token in URL |
| `token.expired` | Expired token used |
| `token.completed_write_attempt` | Write attempt on sealed assessment |

---

## Findings not present in current codebase

The external report referenced four findings that were verified against the current
branch and found not to exist. They are documented here in case they appear in a
different branch or future refactor.

| # | Reported issue | Verdict |
|---|---|---|
| 6 | `httpOnly: false` at `src/lib/supabase/middleware.ts:71` | File is 52 lines. No `httpOnly` property anywhere — cookies are managed by `@supabase/ssr` which defaults to `httpOnly: true` and `Secure` in production. **Not applicable.** |
| 7 | `consultantMap` from `admin.listUsers()` leaks all user emails at `src/app/api/assessments/route.ts:88-101` | File is 89 lines with no admin calls. **Not applicable.** |
| 17 | Custom JWT verification in `src/lib/auth/server.ts` | File and directory do not exist. Auth is fully delegated to `@supabase/ssr`. **Not applicable.** |
| 19 | Hardcoded `phill`/`andrew` email-prefix badge logic at `api/assessments/route.ts:93-98` | Related to #7 — code does not exist. **Not applicable.** |

---

## Open items — require action outside this codebase

These cannot be resolved by code changes alone.

### OI-1 — Login brute-force throttling

**Risk:** The login form posts directly to the Supabase Auth client (GoTrue). There is
no application-layer throttle. An attacker can attempt unlimited password guesses
bounded only by GoTrue's default rate limits (which are generous).

**Actions:**
- Supabase Dashboard → Authentication → Rate Limits → set `Email/Password sign-in` to
  an appropriate limit (e.g. 5 per 15 min per IP).
- Optionally add CAPTCHA (hCaptcha or Cloudflare Turnstile) after N failures via
  Supabase's CAPTCHA integration.

### OI-2 — No MFA on consultant accounts

**Risk:** A single compromised password gives full access to all assessments, the
export endpoint, and the service-role key (if stored in the browser session).

**Actions:**
- Supabase Dashboard → Authentication → Multi-Factor Authentication → Enable TOTP.
- Enforce MFA in `src/lib/supabase/middleware.ts` by checking
  `session.user.factors` after `getUser()` and redirecting to an enrolment page if
  `verified` is absent.

### OI-3 — In-memory rate limiter not multi-instance safe

**Risk:** `src/lib/security/rateLimit.ts` uses a module-level `Map`. If the Next.js
deployment runs more than one process (multiple Vercel instances, PM2 cluster, etc.)
each process has independent counters, halving (or worse) the effective limit.

**Action:** Replace with a Redis/Upstash/Vercel KV limiter when scaling out. The
function signature is intentionally kept simple so the underlying store can be swapped.
The file includes a comment flagging this.

### OI-4 — CSP still allows `'unsafe-inline'` for scripts and styles

**Risk:** `'unsafe-inline'` in `script-src` and `style-src` significantly weakens the
XSS protection that CSP provides. Tailwind uses inline styles; Next.js injects an
inline runtime script.

**Action:** Migrate to a nonce-based CSP via Next.js middleware:
1. Generate a unique nonce per request in `src/middleware.ts`.
2. Set the nonce on `<script>` and `<style>` tags via `next/headers`.
3. Replace `'unsafe-inline'` with `'nonce-{nonce}'` in the CSP.

This is non-trivial and risks breaking page hydration — defer until violation reports
(now wired via `/api/csp-report`) confirm nothing legitimate is blocked first.

### OI-5 — No dependency vulnerability scanning in CI

**Risk:** Third-party packages (96 dependencies) may have published CVEs. There is no
automated check.

**Action:** Add one of:
- `npm audit --omit=dev` as a CI step (fails build on high/critical)
- GitHub Dependabot alerts (enable in repo Settings → Security → Dependabot)
- Renovate or Snyk for automated PR-based updates

---

## Environment variables introduced

Add these to `.env.local.example` and your deployment secrets manager as needed:

```bash
# Set to "true" only when the app sits behind a reverse proxy you control
# that sets X-Forwarded-For (e.g. nginx, Traefik, AWS ALB).
# Leave unset on Vercel or Cloudflare — platform headers are used automatically.
TRUST_PROXY=false

# Optional: override the same-origin CSRF check. Set to your full origin
# (e.g. https://app.cbrai.com.au) if a proxy rewrites the Host header.
# Leave unset for standard deployments.
ALLOWED_ORIGIN=
```

---

## Deploy checklist

- [ ] Apply migration `supabase/migrations/003_security_hardening.sql` to your
      Supabase project
- [ ] Deploy code changes
- [ ] Smoke-test: open browser console on your site, run
      `const sb = supabase.createClient(url, anonKey); sb.from('assessments').select('*')` —
      should return an error or empty array (not real data)
- [ ] Smoke-test: `/assess/<valid-token>` page still loads for an unexpired assessment
- [ ] Smoke-test: `curl -X POST https://yoursite/api/assessments -H "Content-Type: application/json" -d '{}'` with no Origin header → should 403
- [ ] Smoke-test: submit the assess form → should work normally
- [ ] Add `TRUST_PROXY` / `ALLOWED_ORIGIN` env vars if needed for your proxy setup
- [ ] Configure Supabase Auth rate limits (OI-1)
- [ ] Enable MFA in Supabase Auth (OI-2)
- [ ] Add `npm audit` to CI (OI-5)
