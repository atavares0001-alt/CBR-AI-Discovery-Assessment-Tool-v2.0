import { randomBytes } from 'crypto'

const TOKEN_LENGTH = 12
const CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

/**
 * Generates a 12-character share token using cryptographically secure
 * randomness, with rejection sampling so each character has an exactly
 * uniform distribution over the 62-character alphabet (no modulo bias).
 */
export function generateShareToken(): string {
  // Largest multiple of CHARSET.length that fits in a byte (0..255)
  const max = Math.floor(256 / CHARSET.length) * CHARSET.length // 248 for 62

  let token = ''
  while (token.length < TOKEN_LENGTH) {
    // Pull bytes in batches; reject any byte >= max to remove bias
    const need = TOKEN_LENGTH - token.length
    const bytes = randomBytes(need * 2) // small over-allocation to amortise rejections
    for (let i = 0; i < bytes.length && token.length < TOKEN_LENGTH; i++) {
      const b = bytes[i]
      if (b < max) {
        token += CHARSET[b % CHARSET.length]
      }
    }
  }
  return token
}

export function getTokenExpiryDate(): string {
  const date = new Date()
  date.setDate(date.getDate() + 30)
  return date.toISOString()
}
