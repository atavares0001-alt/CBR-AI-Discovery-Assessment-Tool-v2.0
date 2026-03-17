import { randomBytes } from 'crypto'

const TOKEN_LENGTH = 12
const CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

export function generateShareToken(): string {
  const bytes = randomBytes(TOKEN_LENGTH)
  let token = ''
  for (let i = 0; i < TOKEN_LENGTH; i++) {
    token += CHARSET[bytes[i] % CHARSET.length]
  }
  return token
}

export function getTokenExpiryDate(): string {
  const date = new Date()
  date.setDate(date.getDate() + 30)
  return date.toISOString()
}
