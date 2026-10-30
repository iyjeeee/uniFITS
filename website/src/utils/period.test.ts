// utils/period.test.ts — Report periods: Manila "today", period -> date range, options + default derived from data (B-04, B-31)
import { describe, it, expect } from 'vitest'
import { manilaToday, periodRange, inRange, dayBefore, getPeriodOptions, getDefaultPeriod } from './period'
import type { Transaction } from '../types'

const tx = (date: string, entry_type: Transaction['entry_type'] = 'contribution', status: Transaction['status'] = 'approved'): Transaction =>
  ({ id: date + entry_type, user_id: null, entry_type, category: 'fund', fund_id: '1', amount: 1, payment_method_id: null, reference_number: 'x', transaction_date: date, status, description: '' })

describe('manilaToday', () => {
  it('uses Manila time: 17:00 UTC on 31 Dec is already 1 Jan in Manila', () => { expect(manilaToday(new Date('2026-12-31T17:00:00Z'))).toBe('2027-01-01') })
  it('and 15:59 UTC is still 31 Dec', () => { expect(manilaToday(new Date('2026-12-31T15:59:00Z'))).toBe('2026-12-31') })
})

describe('periodRange', () => {
  it('annual', () => { expect(periodRange('annual', '2025')).toEqual({ from: '2025-01-01', to: '2025-12-31' }) })
  it('quarterly carries its year', () => {
    expect(periodRange('quarterly', 'Q2 2026 (Apr–Jun)')).toEqual({ from: '2026-04-01', to: '2026-06-30' })
    expect(periodRange('quarterly', 'Q4 2025 (Oct–Dec)')).toEqual({ from: '2025-10-01', to: '2025-12-31' })
  })
  it('monthly handles month lengths and leap years', () => {
    expect(periodRange('monthly', 'February 2024')).toEqual({ from: '2024-02-01', to: '2024-02-29' })
    expect(periodRange('monthly', 'February 2025')).toEqual({ from: '2025-02-01', to: '2025-02-28' })
    expect(periodRange('monthly', 'March 2025')).toEqual({ from: '2025-03-01', to: '2025-03-31' })
  })
  it('garbage gives null', () => { expect(periodRange('annual', 'abc')).toBeNull(); expect(periodRange('monthly', 'Foo 2025')).toBeNull() })
})

describe('inRange / dayBefore', () => {
  it('inclusive on both ends; null range = everything', () => {
    const r = { from: '2025-03-01', to: '2025-03-31' }
    expect(inRange('2025-03-01', r)).toBe(true); expect(inRange('2025-03-31', r)).toBe(true); expect(inRange('2025-02-28', r)).toBe(false); expect(inRange('2025-04-01', r)).toBe(false)
    expect(inRange('1999-01-01', null)).toBe(true)
  })
  it('dayBefore crosses month and year ends', () => { expect(dayBefore('2025-03-01')).toBe('2025-02-28'); expect(dayBefore('2025-01-01')).toBe('2024-12-31'); expect(dayBefore('2024-03-01')).toBe('2024-02-29') })
})

describe('options and default come from the data and the date', () => {
  const data = [tx('2024-11-05'), tx('2025-03-10')]
  it('annual: every year from the first record to today, newest first', () => { expect(getPeriodOptions('annual', data, '2026-10-29').map((o) => o.value)).toEqual(['2026', '2025', '2024']) })
  it('annual with no data: just the current year', () => { expect(getPeriodOptions('annual', [], '2026-10-29').map((o) => o.value)).toEqual(['2026']) })
  it('ignores rejected / pending rows when finding the first year', () => { expect(getPeriodOptions('annual', [tx('2020-01-01', 'contribution', 'rejected'), tx('2025-05-05')], '2026-02-01').map((o) => o.value)).toEqual(['2026', '2025']) })
  it('quarterly: only quarters that have started, newest first, each with its year', () => {
    const v = getPeriodOptions('quarterly', [tx('2026-01-15')], '2026-05-10').map((o) => o.value)
    expect(v).toEqual(['Q2 2026 (Apr–Jun)', 'Q1 2026 (Jan–Mar)'])
  })
  it('monthly: only months that have started', () => {
    const v = getPeriodOptions('monthly', [tx('2026-01-15')], '2026-03-02').map((o) => o.value)
    expect(v).toEqual(['March 2026', 'February 2026', 'January 2026'])
  })
  it('default = the period of the latest real activity (opening balances do not count)', () => {
    const d = [tx('2025-03-15', 'expense'), tx('2025-03-01', 'contribution'), tx('2026-01-01', 'opening_balance')]
    expect(getDefaultPeriod('annual', d, '2026-10-29')).toBe('2025')
    expect(getDefaultPeriod('quarterly', d, '2026-10-29')).toBe('Q1 2025 (Jan–Mar)')
    expect(getDefaultPeriod('monthly', d, '2026-10-29')).toBe('March 2025')
  })
  it('default with no activity = the current period', () => { expect(getDefaultPeriod('monthly', [], '2026-10-29')).toBe('October 2026'); expect(getDefaultPeriod('annual', [], '2026-10-29')).toBe('2026') })
  it('every default is one of the options', () => {
    for (const t of ['annual', 'quarterly', 'monthly']) expect(getPeriodOptions(t, data, '2026-10-29').map((o) => o.value)).toContain(getDefaultPeriod(t, data, '2026-10-29'))
  })
})
