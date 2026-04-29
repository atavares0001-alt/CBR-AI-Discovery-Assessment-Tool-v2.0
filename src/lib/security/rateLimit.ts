/**
 * Lightweight in-memory sliding-window rate limiter.
 *
 * NOTE: this is a single-process limiter — fine for the current single-instance
 * Next.js deployment, but if the app is ever scaled to multiple replicas the
 * counters will diverge. Replace with a Redis/Upstash limiter in that case.
 */

type Bucket = {
  count: number
  resetAt: number
}

const buckets = new Map<string, Bucket>()
const MAX_BUCKETS = 5000

function sweep(now: number) {
  if (buckets.size < MAX_BUCKETS) return
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt < now) buckets.delete(key)
  }
}

/**
 * Resolve the client IP for rate-limiting purposes.
 *
 * Header trust order:
 *  1. Platform-specific headers that the platform itself sets and a client
 *     CANNOT spoof (Cloudflare's `cf-connecting-ip`, Vercel's
 *     `x-vercel-forwarded-for`). These are always preferred.
 *  2. Generic `x-forwarded-for` / `x-real-ip` — only honoured when the
 *     `TRUST_PROXY=true` environment variable is set, because in any
 *     deployment that's directly internet-reachable an attacker can spoof
 *     these and bypass per-IP limits.
 *
 * Falls back to a stable `'unknown'` bucket so unauthenticated traffic from
 * unrecognised sources still gets rate-limited collectively rather than not
 * at all.
 */
export function getClientIp(request: Request): string {
  // Always-trusted platform headers
  const cfIp = request.headers.get('cf-connecting-ip')
  if (cfIp) return cfIp.trim()

  const vercelIp = request.headers.get('x-vercel-forwarded-for')
  if (vercelIp) return vercelIp.split(',')[0]?.trim() || 'unknown'

  // Generic forwarded headers — only when explicitly opted in
  if (process.env.TRUST_PROXY === 'true') {
    const forwarded = request.headers.get('x-forwarded-for')
    if (forwarded) {
      return forwarded.split(',')[0]?.trim() || 'unknown'
    }
    const real = request.headers.get('x-real-ip')
    if (real) return real.trim()
  }

  return 'unknown'
}

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  retryAfterSec: number
}

/**
 * Simple fixed-window rate limit.
 *  key       — unique identifier (IP, user id, IP+route, etc.)
 *  limit     — max requests per window
 *  windowSec — window length in seconds
 */
export function rateLimit(key: string, limit: number, windowSec: number): RateLimitResult {
  const now = Date.now()
  sweep(now)

  const bucket = buckets.get(key)
  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowSec * 1000 })
    return { allowed: true, remaining: limit - 1, retryAfterSec: 0 }
  }

  if (bucket.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterSec: Math.ceil((bucket.resetAt - now) / 1000),
    }
  }

  bucket.count += 1
  return { allowed: true, remaining: limit - bucket.count, retryAfterSec: 0 }
}
