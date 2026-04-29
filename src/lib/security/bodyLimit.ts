/**
 * Read & parse a JSON request body with an enforced byte limit.
 * Throws PayloadTooLargeError when the limit is exceeded.
 */

export class PayloadTooLargeError extends Error {
  constructor() {
    super('Payload too large')
    this.name = 'PayloadTooLargeError'
  }
}

export class InvalidJsonError extends Error {
  constructor() {
    super('Invalid JSON')
    this.name = 'InvalidJsonError'
  }
}

export async function readJsonBody<T>(request: Request, maxBytes: number): Promise<T> {
  // Cheap pre-check via Content-Length when present
  const contentLength = request.headers.get('content-length')
  if (contentLength) {
    const declared = parseInt(contentLength, 10)
    if (Number.isFinite(declared) && declared > maxBytes) {
      throw new PayloadTooLargeError()
    }
  }

  // Stream body to enforce limit even if Content-Length is missing/lying
  const reader = request.body?.getReader()
  if (!reader) {
    throw new InvalidJsonError()
  }

  const chunks: Uint8Array[] = []
  let received = 0
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    if (value) {
      received += value.byteLength
      if (received > maxBytes) {
        try {
          await reader.cancel()
        } catch {
          // ignore
        }
        throw new PayloadTooLargeError()
      }
      chunks.push(value)
    }
  }

  const buffer = new Uint8Array(received)
  let offset = 0
  for (const chunk of chunks) {
    buffer.set(chunk, offset)
    offset += chunk.byteLength
  }

  const text = new TextDecoder().decode(buffer)
  try {
    return JSON.parse(text) as T
  } catch {
    throw new InvalidJsonError()
  }
}

// Common limits
export const BODY_LIMITS = {
  small: 64 * 1024, // 64 KB — single stage save / status update
  medium: 512 * 1024, // 512 KB — full assessment patch
  large: 5 * 1024 * 1024, // 5 MB — backup import
} as const
