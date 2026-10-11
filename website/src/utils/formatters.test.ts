// utils/formatters.test.ts — parseDate must keep the calendar day regardless of time zone
import { describe, it, expect } from 'vitest'
import { parseDate, formatDate, capitalize } from './formatters'

describe('parseDate / formatDate', () => {
  it('parses YYYY-MM-DD as a local date', () => {
    const d = parseDate('2026-03-15')
    expect([d.getFullYear(), d.getMonth(), d.getDate()]).toEqual([2026, 2, 15])
  })
  it('formats date-only strings without day shift', () => {
    expect(formatDate('2026-03-15')).toBe('Mar 15, 2026')
  })
  it('passes full ISO timestamps and Date objects through', () => {
    const iso = '2026-03-15T10:00:00Z'
    expect(parseDate(iso).getTime()).toBe(new Date(iso).getTime())
    const now = new Date(); expect(parseDate(now)).toBe(now)
  })
})

describe('capitalize', () => {
  it('uppercases the first letter only', () => { expect(capitalize('active')).toBe('Active'); expect(capitalize('bank Transfer')).toBe('Bank Transfer') })
  it('returns an em dash for empty values', () => { expect(capitalize('')).toBe('—'); expect(capitalize(null)).toBe('—'); expect(capitalize(undefined)).toBe('—') })
})
