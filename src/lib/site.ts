export const SITE_URL = process.env.SITE_URL ?? 'https://litrpgacademy.com'
export const WRITINATOR_URL = 'https://writinator.com'

const compact = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 })

export function formatCount(value: number | null | undefined): string {
  return value == null ? '—' : compact.format(value)
}

export function formatRating(value: number | null | undefined): string {
  return value ? value.toFixed(2) : '—'
}
