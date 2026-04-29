/**
 * Sanitize a search term destined for a PostgREST .or() / .ilike() filter.
 *
 * PostgREST .or() uses commas as logical separators, parentheses to group,
 * and SQL LIKE wildcards (% and _) to do pattern matching. A user-supplied
 * term that contains any of these can break out of the intended ilike pattern
 * and either inject extra OR conditions or pull down far more rows than
 * intended.
 *
 * We restrict the search term to a small whitelist of "safe" characters
 * (letters, numbers, spaces, hyphens, dots, @, apostrophes, ampersands) and
 * cap its length. Anything else is dropped.
 */
export function sanitizeSearchTerm(input: string, maxLength = 64): string {
  if (!input) return ''
  // Strip anything outside the whitelist
  const cleaned = input.replace(/[^A-Za-z0-9 .@\-_'&]/g, '').trim()
  return cleaned.slice(0, maxLength)
}
