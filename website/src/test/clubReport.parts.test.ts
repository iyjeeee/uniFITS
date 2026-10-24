// clubReport.parts.test.ts — club report stats (pure) and period helpers
import { describe, it, expect } from 'vitest'
import { getClubReportStats } from '../pages/reports/parts/clubReportStats'
import { getPeriodOptions, getDefaultPeriod, YEARS, QUARTERS } from '../pages/reports/parts/clubReportShared'
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

describe('period helpers', () => {
  it('annual options are the YEARS list, default 2025', () => {
    expect(getPeriodOptions('annual').map((o) => o.value)).toEqual(YEARS.map(String))
    expect(getDefaultPeriod('annual')).toBe('2025')
  })
  it('quarterly options are the 4 quarters, default Q1', () => {
    expect(getPeriodOptions('quarterly').map((o) => o.value)).toEqual(QUARTERS)
    expect(getDefaultPeriod('quarterly')).toBe(QUARTERS[0])
  })
  it('monthly options are 12 months of 2025, default January 2025', () => {
    const o = getPeriodOptions('monthly')
    expect(o.length).toBe(12)
    expect(o[0].value).toBe('January 2025')
    expect(getDefaultPeriod('monthly')).toBe('January 2025')
  })
})
