import { NextResponse } from 'next/server'
import { rateLimit, getClientIp } from '@/lib/security/rateLimit'

/**
 * CSP violation receiver.
 *
 * Browsers POST a JSON document here when a Content-Security-Policy
 * directive is violated. We log it server-side so violations show up in
 * the same log stream as audit events. We deliberately:
 *
 *  - Don't validate Origin (browsers send these as `null` cross-origin).
 *  - Don't authenticate (must be reachable from any visitor).
 *  - Cap body to 16 KB.
 *  - Rate-limit per IP so a malicious page can't flood the log.
 *  - Always return 204 so the browser doesn't retry.
 */
export async function POST(request: Request) {
  const ip = getClientIp(request)
  const rl = rateLimit(`csp:report:${ip}`, 60, 60)
  if (!rl.allowed) {
    return new NextResponse(null, { status: 204 })
  }

  try {
    const contentLength = parseInt(request.headers.get('content-length') || '0', 10)
    if (contentLength > 16 * 1024) {
      return new NextResponse(null, { status: 204 })
    }
    const text = await request.text()
    if (text.length > 16 * 1024) {
      return new NextResponse(null, { status: 204 })
    }
    // Log a single line so it's grep-able. Don't try to parse — both the
    // legacy `application/csp-report` and the new `application/reports+json`
    // formats are valid here, and the raw payload is the most useful artefact.
    console.warn('[csp-report]', JSON.stringify({
      ts: new Date().toISOString(),
      ip,
      ua: request.headers.get('user-agent') || '',
      report: text.slice(0, 8 * 1024),
    }))
  } catch {
    // swallow — never error a violation report
  }

  return new NextResponse(null, { status: 204 })
}
