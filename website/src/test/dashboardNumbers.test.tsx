// test/dashboardNumbers.test.tsx — Phase 3: dashboard figures come from the data (B-03, B-24, B-25, B-26, B-27, B-28)
import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { OrgProvider } from '../context/OrgContext'
import Dashboard from '../pages/dashboard/Dashboard'
import RecentTransactionsCard from '../pages/dashboard/parts/RecentTransactionsCard'
import { getDashboardStats } from '../pages/dashboard/parts/dashboardStats'
import { getMonthlyData, getFundPoints, getStatusBreakdown } from '../pages/dashboard/parts/dashboardData'
import { MOCK_TRANSACTIONS, MOCK_USERS, MOCK_PROJECTS, getFundsWithBalance } from '../api/mockData'
import type { Transaction, Project } from '../types'

let n = 100
const tx = (o: Partial<Transaction>): Transaction => ({ id: String(++n), user_id: null, entry_type: 'income', category: 'fund', fund_id: '1', amount: 100, payment_method_id: '1', reference_number: 'R' + n, transaction_date: '2025-03-10', status: 'approved', description: '', ...o })
afterEach(cleanup)

describe('getDashboardStats counts approved entries only (B-27)', () => {
  const base = [tx({ entry_type: 'contribution', user_id: '1', amount: 100 }), tx({ entry_type: 'expense', amount: 40 })]
  const extra = [tx({ entry_type: 'contribution', user_id: '2', amount: 5000, status: 'pending' }), tx({ entry_type: 'income', amount: 7000, status: 'rejected' }), tx({ entry_type: 'expense', amount: 900, status: 'pending' }), tx({ entry_type: 'expense', amount: 800, status: 'voided' })]
  it('income, expense, transaction count and top contributors ignore pending / rejected / voided rows', () => {
    const a = getDashboardStats(base), b = getDashboardStats([...base, ...extra])
    expect(b.totalIncome).toBe(a.totalIncome); expect(b.totalExpense).toBe(a.totalExpense); expect(b.totalTransactions).toBe(a.totalTransactions)
    expect(b.topContributors).toEqual(a.topContributors); expect(a.totalIncome).toBe(100); expect(a.totalExpense).toBe(40)
  })
  it('a refund reduces income; opening balances are not counted anywhere', () => {
    const s = getDashboardStats([...base, tx({ entry_type: 'refund', amount: 30 }), tx({ entry_type: 'opening_balance', amount: 9999 })])
    expect(s.totalIncome).toBe(70); expect(s.totalTransactions).toBe(3)   // contribution, expense, refund
  })
})

describe('Total <people> counts everybody; Active <projects> counts ongoing only (B-25, B-26)', () => {
  const s = getDashboardStats()
  it('total members = all users including inactive', () => { expect(s.totalMembers).toBe(MOCK_USERS.length); expect(MOCK_USERS.some((u) => u.status !== 'active')).toBe(true) })
  it('ongoing projects = approved projects whose status is "ongoing" (not upcoming)', () => {
    expect(s.ongoingProjects).toBe(MOCK_PROJECTS.filter((p) => p.approval_status === 'approved' && p.status === 'ongoing').length)
    expect(MOCK_PROJECTS.some((p) => p.approval_status === 'approved' && p.status === 'upcoming')).toBe(true)   // so the old rule would have counted it
  })
})

describe('Recent transactions are the latest by date (B-28)', () => {
  it('sorted newest first, ties broken by newest id, opening balances left out, only 6', () => {
    const rows = [tx({ id: '1', transaction_date: '2025-03-01' }), tx({ id: '2', transaction_date: '2025-04-01' }), tx({ id: '3', transaction_date: '2025-04-01' }), tx({ id: '4', transaction_date: '2024-01-01' }),
      tx({ id: '5', transaction_date: '2025-05-01', entry_type: 'opening_balance' }), tx({ id: '6', transaction_date: '2025-03-15' }), tx({ id: '7', transaction_date: '2025-02-01' }), tx({ id: '8', transaction_date: '2025-02-02' })]
    expect(getDashboardStats(rows).recentTransactions.map((t) => t.id)).toEqual(['3', '2', '6', '1', '8', '7'])
  })
  it('the real list is in date order', () => {
    const d = getDashboardStats().recentTransactions.map((t) => t.transaction_date)
    expect([...d].sort().reverse()).toEqual(d)
  })
  it('the card shows a refund as an outflow (−, red)', () => {
    const refund = tx({ entry_type: 'refund', amount: 25 })
    render(<OrgProvider orgData={{}}><RecentTransactionsCard recentTransactions={[refund]} /></OrgProvider>)
    expect(screen.getByText(/−/).textContent).toContain('25'); expect(document.body.textContent).not.toContain('+₱')
  })
})

describe('chart data is derived (B-03, B-24)', () => {
  it('monthly: the 6 months ending at the latest activity; income/expense per month from approved rows', () => {
    const rows = [tx({ entry_type: 'contribution', amount: 1200, transaction_date: '2025-03-01' }), tx({ entry_type: 'income', amount: 50000, transaction_date: '2025-03-10' }), tx({ entry_type: 'expense', amount: 700, transaction_date: '2025-03-12' }),
      tx({ entry_type: 'expense', amount: 25000, transaction_date: '2025-02-28' }), tx({ entry_type: 'income', amount: 9999, transaction_date: '2025-03-20', status: 'pending' }), tx({ entry_type: 'opening_balance', amount: 5, transaction_date: '2025-01-01' })]
    const m = getMonthlyData(rows, '2026-10-29')
    expect(m.map((x) => x.month)).toEqual(['Oct 24', 'Nov 24', 'Dec 24', 'Jan 25', 'Feb 25', 'Mar 25'])
    expect(m[5]).toMatchObject({ income: 51200, expense: 700 }); expect(m[4]).toMatchObject({ income: 0, expense: 25000 }); expect(m[3]).toMatchObject({ income: 0, expense: 0 })
  })
  it('monthly with no data ends at the current month (Manila date)', () => { const m = getMonthlyData([], '2026-10-29'); expect(m).toHaveLength(6); expect(m[5].month).toBe('Oct 26') })
  it('the mock data lands in March 2025 and the totals match the dashboard KPIs', () => {
    const m = getMonthlyData(MOCK_TRANSACTIONS, '2026-10-29'), s = getDashboardStats()
    expect(m[5].month).toBe('Mar 25'); expect(m.reduce((a, x) => a + x.income, 0)).toBe(s.totalIncome); expect(m.reduce((a, x) => a + x.expense, 0)).toBe(s.totalExpense)
  })
  it('fund bars use the real fund names and derived balances, largest first', () => {
    const f = getFundPoints(getFundsWithBalance())
    expect(f.map((x) => x.name).sort()).toEqual(getFundsWithBalance().map((x) => x.name).sort()); expect(f.map((x) => x.balance)).toEqual([...f.map((x) => x.balance)].sort((a, b) => b - a))
    expect(f.reduce((a, x) => a + x.balance, 0)).toBe(getDashboardStats().totalBalance)
  })
  it('status donut counts the approved projects by status', () => {
    const mk = (status: Project['status'], approval_status: Project['approval_status'] = 'approved') => ({ ...MOCK_PROJECTS[0], status, approval_status })
    const d = getStatusBreakdown([mk('completed'), mk('ongoing'), mk('ongoing'), mk('upcoming'), mk('cancelled'), mk('upcoming', 'pending'), mk('completed', 'rejected')])
    expect(Object.fromEntries(d.map((x) => [x.label, x.count]))).toEqual({ Completed: 1, Ongoing: 2, Upcoming: 1, Cancelled: 1 })
  })
  it('the mock donut adds up to the approved projects (was a fixed 9)', () => {
    const d = getStatusBreakdown(MOCK_PROJECTS); expect(d.reduce((a, x) => a + x.count, 0)).toBe(MOCK_PROJECTS.filter((p) => p.approval_status === 'approved').length)
  })
})

describe('the Dashboard page shows those numbers', () => {
  it('Total <people> tile shows everybody; the donut total is the number of approved projects', () => {
    render(<OrgProvider orgData={{}}><Dashboard /></OrgProvider>)
    const tile = (label: string) => Array.from(document.querySelectorAll('div')).find((d) => d.textContent === label)?.parentElement?.textContent ?? ''
    expect(tile('Total Employees')).toContain(String(MOCK_USERS.length))
    expect(document.body.textContent).toContain('Mar 25')   // chart x-axis from the data, not Jan–Jun
    expect(document.body.textContent).not.toContain('Jun')
  })
})
