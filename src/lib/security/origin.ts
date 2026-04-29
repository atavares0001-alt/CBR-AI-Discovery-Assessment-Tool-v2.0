/**
 * CSRF defence: validate the request Origin / Referer header against the
 * server's own host. Combined with SameSite=Lax cookies (Supabase default),
 * this blocks classic CSRF attacks against state-changing API routes.
 *
 * We deliberately compare against the request's own Host header (the same
 * origin the server is being reached on), so this works in dev, prod, and
 * behind proxies without needing an env var. If the deployment runs behind
 * a reverse proxy that rewrites Host, set ALLOWED_ORIGIN to override.
 */
export function isSameOrigin(request: Request): boolean {
  const method = request.method.toUpperCase()
  // Safe methods don't need CSRF protection
  if (method === 'GET' || method === 'HEAD' || method === 'OPTIONS') {
    return true
  }

  const originHeader = request.headers.get('origin')
  const refererHeader = request.headers.get('referer')
  const host = request.headers.get('host')

  // Allow override via env (e.g. for proxy setups)
  const allowedOrigin = process.env.ALLOWED_ORIGIN

  const candidates: string[] = []
  if (originHeader) candidates.push(originHeader)
  if (refererHeader) {
    try {
      candidates.push(new URL(refererHeader).origin)
    } catch {
      // ignore malformed referer
    }
  }

  if (candidates.length === 0) {
    // No Origin/Referer header — fail closed for state-changing requests
    return false
  }

  for (const candidate of candidates) {
    try {
      const candidateUrl = new URL(candidate)
      if (allowedOrigin && candidate === allowedOrigin) return true
      if (host && candidateUrl.host === host) return true
    } catch {
      continue
    }
  }

  return false
}
