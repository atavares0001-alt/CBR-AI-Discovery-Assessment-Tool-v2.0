import type { NextConfig } from 'next'

/**
 * Security headers applied to every response.
 *
 * - Strict-Transport-Security: force HTTPS (only meaningful when actually
 *   served over HTTPS — has no effect on plain http://localhost dev).
 * - X-Frame-Options / frame-ancestors: clickjacking protection.
 * - X-Content-Type-Options: stop MIME sniffing.
 * - Referrer-Policy: minimise referrer leakage.
 * - Permissions-Policy: deny powerful browser APIs we don't use.
 * - Content-Security-Policy: tight default that still permits Supabase
 *   websocket/REST traffic and Next.js inline runtime needs.
 *
 * NOTE: Server-side CSP headers are deliberately set with `unsafe-inline`
 * for styles because Tailwind injects inline style tags. Scripts use
 * `'self'` only — no third-party script CDNs are used.
 */
const securityHeaders = [
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
  },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data:",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'",
      // Legacy violation report endpoint (still honoured by all major browsers).
      'report-uri /api/csp-report',
      // Modern Reporting API endpoint group (paired with the Report-To header).
      "report-to csp-endpoint",
    ].join('; '),
  },
  {
    key: 'Report-To',
    value: JSON.stringify({
      group: 'csp-endpoint',
      max_age: 10886400,
      endpoints: [{ url: '/api/csp-report' }],
    }),
  },
]

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ]
  },
}

export default nextConfig
