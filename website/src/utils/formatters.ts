// utils/formatters.ts — Shared formatting utilities for uniFITS
// Currency, dates, numbers, percentages — centralized here for consistency

type DateStyle = 'short' | 'medium' | 'long'

/** formatCurrency — Format a number as Philippine Peso (₱) */
export const formatCurrency = (amount: number | null | undefined, compact = false): string => {
  if (amount === null || amount === undefined) return '—'
  if (compact) {
    const abs = Math.abs(amount)
    if (abs >= 1_000_000) return `₱ ${(amount / 1_000_000).toFixed(1)}M`
    if (abs >= 1_000)     return `₱ ${(amount / 1_000).toFixed(1)}K`
  }
  return new Intl.NumberFormat('en-PH', {
    style:                 'currency',
    currency:              'PHP',
    minimumFractionDigits: 2,
  }).format(amount)
}

/** formatDate — Format a date string or Date object */
export const formatDate = (date: string | Date | null | undefined, style: DateStyle = 'medium'): string => {
  if (!date) return '—'
  const options: Record<DateStyle, Intl.DateTimeFormatOptions> = {
    short:  { month: 'short', day: 'numeric', year: '2-digit' },
    medium: { month: 'short', day: 'numeric', year: 'numeric' },
    long:   { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' },
  }
  return new Intl.DateTimeFormat('en-PH', options[style] ?? options.medium).format(new Date(date))
}

/** formatNumber — Format a number with thousands separator */
export const formatNumber = (num: number | null | undefined): string => {
  if (num === null || num === undefined) return '—'
  return new Intl.NumberFormat('en-PH').format(num)
}

/** formatPercent — Format a decimal or raw value as percentage string */
export const formatPercent = (value: number | null | undefined, raw = true): string => {
  if (value === null || value === undefined) return '—'
  const pct = raw ? value : value * 100
  return `${pct.toFixed(1)}%`
}

/** truncate — Truncate long strings with ellipsis */
export const truncate = (str: string | null | undefined, max = 40): string => {
  if (!str) return ''
  return str.length > max ? `${str.slice(0, max)}…` : str
}

/** getInitials — Get uppercase initials from a full name — e.g. 'Juan Dela Cruz' → 'JD' */
export const getInitials = (name = ''): string => {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join('')
}
