// test/clubReportNumbers.test.tsx — Phase 3: Club Report figures follow the chosen period and only count approved rows (B-04, B-31, B-34, B-35)
import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { OrgProvider } from '../context/OrgContext'
import ClubReport from '../pages/reports/ClubReport'
import { getClubReportStats } from '../pages/reports/parts/clubReportStats'
import { ledgerTotals } from '../utils/ledger'
import { MOCK_TRANSACTIONS, getFundsWithBalance } from '../api/mockData'
import type { Transaction } from '../types'

let n = 500
const tx = (o: Partial<Transaction>): Transaction => ({ id: String(++n), user_id: null, entry_type: 'income', category: 'fund', fund_id: '1', amount: 100, payment_method_id: '1', reference_number: 'R' + n, transaction_date: '2025-03-10', status: 'approved', description: '', ...o })
const MARCH = { from: '2025-03-01', to: '2025-03-31' }
afterEach(cleanup)

describe('income and expense classification (B-35)', () => {
  const rows = [
    tx({ entry_type: 'contribution', category: 'fund', amount: 1000 }),                  // member dues
    tx({ entry_type: 'contribution', category: 'project', amount: 200, user_id: '1' }),  // project income, NOT member dues
    tx({ entry_type: 'contribution', category: 'event', amount: 30 }),                   // event income
    tx({ entry_type: 'income', category: 'project', amount: 4 }), tx({ entry_type: 'income', category: 'event', amount: 5 }),
    tx({ entry_type: 'income', category: 'fund', amount: 600 }),                         // other fund income
    tx({ entry_type: 'refund', category: 'project', amount: 50 }),                       // reduces project income
    tx({ entry_type: 'expense', category: 'project', amount: 70 }), tx({ entry_type: 'expense', category: 'event', amount: 8 }),
    tx({ entry_type: 'expense', category: 'fund', amount: 9 }),                          // not project/event -> operational, no longer dropped
  ]
  const s = getClubReportStats(null, rows)
  it('contributions go to the project / event / member-dues line by their category', () => { expect(s.memberDues).toBe(1000); expect(s.projectIncome).toBe(200 + 4 - 50); expect(s.eventIncome).toBe(35); expect(s.fundIncome).toBe(600) })
  it('every expense is in exactly one line', () => { expect(s.projectExpense).toBe(70); expect(s.eventExpense).toBe(8); expect(s.utilityExpense).toBe(9) })
  it('the lines add up to the ledger totals', () => {
    const t = ledgerTotals(rows); expect(s.totalIncome).toBe(t.income); expect(s.totalExpense).toBe(t.expense); expect(s.netSurplus).toBe(t.net)
    expect(s.totalIncome).toBe(s.memberDues + s.projectIncome + s.eventIncome + s.fundIncome)
  })
  it('the operational breakdown always sums to the operational expense', () => { expect(Object.values(s.utilByType).reduce((a, b) => a + b, 0)).toBe(s.utilityExpense) })
})

describe('only approved rows count (B-27 for the report)', () => {
  it('pending, rejected and voided rows change nothing', () => {
    const ok = [tx({ entry_type: 'income', amount: 100 }), tx({ entry_type: 'expense', amount: 40 })]
    const noisy = [...ok, tx({ entry_type: 'income', amount: 7000, status: 'pending' }), tx({ entry_type: 'expense', amount: 900, status: 'rejected' }), tx({ entry_type: 'contribution', amount: 5, status: 'voided' })]
    expect(getClubReportStats(null, noisy)).toEqual(getClubReportStats(null, ok))
  })
})

describe('the period decides the figures (B-31)', () => {
  const rows = [tx({ entry_type: 'income', amount: 100, transaction_date: '2025-03-01' }), tx({ entry_type: 'income', amount: 10, transaction_date: '2025-03-31' }),
    tx({ entry_type: 'income', amount: 1000, transaction_date: '2025-04-01' }), tx({ entry_type: 'expense', amount: 7, transaction_date: '2025-02-28' }), tx({ entry_type: 'expense', amount: 3, transaction_date: '2025-03-15' })]
  it('March only: both ends inclusive, April and February left out', () => { const s = getClubReportStats(MARCH, rows); expect(s.totalIncome).toBe(110); expect(s.totalExpense).toBe(3) })
  it('no period = everything', () => { const s = getClubReportStats(null, rows); expect(s.totalIncome).toBe(1110); expect(s.totalExpense).toBe(10) })
  it('a period with no activity is all zeros', () => { const s = getClubReportStats({ from: '2030-01-01', to: '2030-12-31' }, rows); expect([s.totalIncome, s.totalExpense, s.netSurplus]).toEqual([0, 0, 0]) })
  it('events held counts the completed events dated inside the period', () => {
    const all = getClubReportStats(null, []).completedEvents
    expect(getClubReportStats({ from: '1999-01-01', to: '1999-12-31' }, []).completedEvents).toBe(0)
    expect(all).toBeGreaterThan(0)
  })
})

describe('fund sheet: opening + received - spent = balance (B-34)', () => {
  const rows = [tx({ entry_type: 'opening_balance', amount: 1000, transaction_date: '2025-01-01' }), tx({ entry_type: 'income', amount: 500, transaction_date: '2025-02-10' }), tx({ entry_type: 'expense', amount: 200, transaction_date: '2025-02-20' }),
    tx({ entry_type: 'income', amount: 300, transaction_date: '2025-03-05' }), tx({ entry_type: 'refund', amount: 50, transaction_date: '2025-03-06' }), tx({ entry_type: 'expense', amount: 100, transaction_date: '2025-03-07' }),
    tx({ entry_type: 'income', amount: 9999, transaction_date: '2025-03-08', status: 'pending' }), tx({ entry_type: 'income', amount: 777, transaction_date: '2025-04-02' })]
  const row = (range: { from: string; to: string } | null) => getClubReportStats(range, rows).fundRows.find((r) => r.id === '1')!
  it('March: opening is the balance before March (1000 + 500 - 200)', () => {
    const r = row(MARCH); expect(r.opening).toBe(1300); expect(r.received).toBe(300); expect(r.spent).toBe(150); expect(r.balance).toBe(1450)   // spent = expense 100 + refund 50
  })
  it('opening balance entries inside the period count as opening, not as received', () => { const r = row({ from: '2025-01-01', to: '2025-01-31' }); expect(r.opening).toBe(1000); expect(r.received).toBe(0); expect(r.balance).toBe(1000) })
  it('each period opens where the previous one closed', () => { expect(row({ from: '2025-04-01', to: '2025-04-30' }).opening).toBe(row({ from: '2025-03-01', to: '2025-03-31' }).balance) })
  it('the identity holds for any period; the total is the sum of the closing balances', () => {
    for (const range of [MARCH, { from: '2025-01-01', to: '2025-12-31' }, null]) { const s = getClubReportStats(range, rows); for (const r of s.fundRows) expect(r.opening + r.received - r.spent).toBe(r.balance); expect(s.totalFundBalance).toBe(s.fundRows.reduce((a, r) => a + r.balance, 0)) }
  })
  it('all-time balance equals the derived fund balance', () => {
    const real = getClubReportStats(null, MOCK_TRANSACTIONS); for (const f of getFundsWithBalance()) expect(real.fundRows.find((r) => r.id === f.id)!.balance).toBe(f.balance)
  })
})

describe('the Club Report page (B-04, B-31)', () => {
  const sel = (i: number) => document.querySelectorAll('select')[i] as HTMLSelectElement
  const mount = () => render(<OrgProvider orgData={{}}><ClubReport /></OrgProvider>)
  const text = () => document.body.textContent ?? ''
  it('the year list comes from the data and the date, newest first, and defaults to the latest activity', () => {
    mount(); const years = Array.from(sel(1).options).map((o) => o.value)
    expect(years[0]).toBe(String(new Date().getFullYear())); expect(years).toContain('2025'); expect(sel(1).value).toBe('2025')   // mock data is dated 2025
  })
  it('quarters carry their year', () => { mount(); fireEvent.change(sel(0), { target: { value: 'quarterly' } }); expect(sel(1).value).toBe('Q1 2025 (Jan–Mar)'); expect(Array.from(sel(1).options).every((o) => /^Q[1-4] \d{4}/.test(o.value))).toBe(true) })
  it('changing the month changes the money on the report', () => {
    mount(); fireEvent.change(sel(0), { target: { value: 'monthly' } })
    expect(sel(1).value).toBe('March 2025'); fireEvent.click(screen.getByRole('button', { name: /Generate Report/ }))
    expect(text()).toContain('Net Financial Position (March 2025)'); expect(text()).toContain('59,900.00')
    fireEvent.change(sel(1), { target: { value: 'February 2025' } }); fireEvent.click(screen.getByRole('button', { name: /Generate Report/ }))
    expect(text()).toContain('Net Financial Position (February 2025)'); expect(text()).not.toContain('59,900.00')
  })
  it('the fund sheet shows an Opening Balance column', () => { mount(); fireEvent.click(screen.getByRole('button', { name: /Generate Report/ })); expect(text()).toContain('Opening Balance') })
})
