export function isValidUrl(value: string): boolean {
  if (!value) return true // optional fields pass
  try {
    new URL(value.startsWith('http') ? value : `https://${value}`)
    return true
  } catch {
    return false
  }
}

export function isValidEmail(value: string): boolean {
  if (!value) return true
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export function isInRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max
}

export function isWithinCharLimit(value: string, max: number): boolean {
  return value.length <= max
}

export const CHAR_LIMITS = {
  text: 200,
  textarea: 2000,
} as const

export const NUMBER_RANGES: Record<string, { min: number; max: number }> = {
  hours_per_week: { min: 0, max: 168 },
  percentage: { min: 0, max: 100 },
  count: { min: 0, max: 10000 },
  quote_hours: { min: 0, max: 720 },
  slider: { min: 1, max: 10 },
}
