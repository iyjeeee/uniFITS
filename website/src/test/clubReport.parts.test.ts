// clubReport.parts.test.ts — club report stats (pure) and period helpers
import { describe, it, expect } from 'vitest'
import { getClubReportStats } from '../pages/reports/parts/clubReportStats'
import { getPeriodOptions, getDefaultPeriod } from '../pages/reports/parts/clubReportShared'
import { manilaToday } from '../utils/period'
import { getUtilitiesWithBalance, MOCK_FUNDS } from '../api/mockData'

describe('getClubReportStats', () => {
  const s = getClubReportStats()

  it('income, expense and net add up', () => {
    expect(s.totalIncome).toBe(s.memberDues + s.projectIncome + s.eventIncome + s.fundIncome)
    expect(s.totalExpense).toBe(s.projectExpense + s.eventExpense + s.utilityExpense)
    expect(s.netSurplus).toBe(s.totalIncome - s.totalExpense)
  })

  it('utility breakdown sums to the utility expense (amount paid)', () => {
    expect(Object.values(s.utilByType).reduce((a, b) => a + b, 0)).toBe(s.utilityExpense)
    expect(s.utilityExpense).toBe(getUtilitiesWithBalance().reduce((a, u) => a + u.amount_paid, 0))
  })

  it('has one fund row per fund and the balance total matches', () => {
    expect(s.fundRows.length).toBe(MOCK_FUNDS.length)
    expect(s.totalFundBalance).toBe(s.fundRows.reduce((a, f) => a + f.balance, 0))
  })
})

describe('period helpers (derived from the data and today; more cases in utils/period.test.ts)', () => {
  const thisYear = manilaToday().slice(0, 4)
  it('annual: from the first record (2025) to this year, newest first; default = latest activity year', () => {
    const v = getPeriodOptions('annual').map((o) => o.value)
    expect(v[0]).toBe(thisYear); expect(v).toContain('2025'); expect(v[v.length - 1]).toBe('2025'); expect(getDefaultPeriod('annual')).toBe('2025')
  })
  it('quarterly: every option carries its year; default is the quarter of the latest activity', () => {
    const v = getPeriodOptions('quarterly').map((o) => o.value)
    expect(v.every((x) => /^Q[1-4] \d{4} \(/.test(x))).toBe(true); expect(v).toContain('Q1 2025 (Jan–Mar)'); expect(getDefaultPeriod('quarterly')).toBe('Q1 2025 (Jan–Mar)')
  })
  it('monthly: default is the month of the latest activity (March 2025)', () => {
    expect(getPeriodOptions('monthly').map((o) => o.value)).toContain('March 2025'); expect(getDefaultPeriod('monthly')).toBe('March 2025')
  })
})
