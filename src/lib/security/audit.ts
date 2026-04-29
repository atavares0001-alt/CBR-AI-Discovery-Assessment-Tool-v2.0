/**
 * Lightweight audit logger for security-relevant events.
 *
 * Writes structured JSON lines to stdout/stderr so they can be picked up by
 * any log shipper (Vercel, Cloudwatch, Datadog, etc.) without requiring an
 * extra DB table. Treat these logs as append-only.
 *
 * Use for:
 *  - auth failures / 401s on protected routes
 *  - assessment create / delete / export
 *  - backup import (with row counts)
 *  - rate-limit blocks
 *  - CSRF / origin rejections
 */

export type AuditEvent =
  | 'auth.unauthorized'
  | 'csrf.blocked'
  | 'rate_limit.blocked'
  | 'assessment.create'
  | 'assessment.delete'
  | 'assessment.export'
  | 'assessment.import'
  | 'assessment.report'
  | 'assessment.rotate_token'
  | 'token.invalid'
  | 'token.expired'
  | 'token.completed_write_attempt'

export interface AuditFields {
  userId?: string | null
  ip?: string
  route?: string
  method?: string
  resourceId?: string | null
  detail?: Record<string, unknown>
}

export function audit(event: AuditEvent, fields: AuditFields = {}): void {
  const entry = {
    ts: new Date().toISOString(),
    event,
    ...fields,
  }
  // stderr keeps audit lines distinct from regular logs in many platforms
  console.warn('[audit]', JSON.stringify(entry))
}
