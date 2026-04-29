import { NextResponse } from 'next/server'

/**
 * Returns a generic error response without leaking internal details
 * to the client. Full error context is logged server-side so developers
 * can still debug issues from logs.
 */
export function serverError(
  context: string,
  err: unknown,
  status = 500,
  publicMessage = 'Internal server error'
): NextResponse {
  // Log the full error server-side with a stable context tag
  // (column names, constraint info, stack traces) — never sent to client
  console.error(`[${context}]`, err)
  return NextResponse.json({ error: publicMessage }, { status })
}

/**
 * Generic 400 — used for client-supplied input that fails validation.
 * Safe to send a specific message because the cause is the client's input.
 */
export function badRequest(message: string): NextResponse {
  return NextResponse.json({ error: message }, { status: 400 })
}

export function unauthorized(): NextResponse {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

export function forbidden(): NextResponse {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}

export function notFound(message = 'Not found'): NextResponse {
  return NextResponse.json({ error: message }, { status: 404 })
}

export function gone(message: string, code?: string): NextResponse {
  return NextResponse.json({ error: message, ...(code ? { code } : {}) }, { status: 410 })
}

export function tooManyRequests(retryAfterSec: number): NextResponse {
  return NextResponse.json(
    { error: 'Too many requests' },
    { status: 429, headers: { 'Retry-After': String(retryAfterSec) } }
  )
}

export function payloadTooLarge(): NextResponse {
  return NextResponse.json({ error: 'Request body too large' }, { status: 413 })
}
