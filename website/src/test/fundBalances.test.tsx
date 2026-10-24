// fundBalances.test.tsx -- fund balances are DERIVED from approved transactions (opening balance + movements)
import { describe, it, expect, afterEach } from 'vitest'
import { render, renderHook, act } from '@testing-library/react'
import type { ReactNode } from 'react'
import { OrgProvider } from '../context/OrgContext'
import Funds from '../pages/funds/Funds'
import useTransactions from '../pages/transactions/parts/useTransactions'
import { getDashboardStats } from '../pages/dashboard/parts/dashboardStats'
import { getClubReportStats } from '../pages/reports/parts/clubReportStats'
import { MOCK_FUNDS, MOCK_TRANSACTIONS, getFundsWithBalance, formatCurrency } from '../api/mockData'
import type { Transaction } from '../types'

// Balances shown BEFORE they became derived (stored values) -- derived numbers must reproduce them exactly
const OLD_BALANCES: Record<string, number> = { '1': 85000, '2': 45500, '3': 125000, '4': 20000, '5': 150000 }
const wrapper = ({ children }: { children: ReactNode }) => <OrgProvider orgData={{}}>{children}</OrgProvider>

describe('derived fund balances', () => {
  it('reproduce the previous balances exactly (opening balance + approved movements)', () => {
    const funds = getFundsWithBalance()
    expect(funds).toHaveLength(MOCK_FUNDS.length)
    for (const f of funds) expect(f.balance).toBe(OLD_BALANCES[f.id])
    expect(funds.reduce((s, f) => s + f.balance, 0)).toBe(425500)
  })

  it('each fund has exactly one approved opening balance with no member, dated before its other entries', () => {
    for (const f of MOCK_FUNDS) {
      const mine = MOCK_TRANSACTIONS.filter((t) => t.fund_id === f.id)
      const opening = mine.filter((t) => t.entry_type === 'opening_balance')
      expect(opening).toHaveLength(1)
      expect(opening[0].status).toBe('approved')
      expect(opening[0].user_id).toBeNull()
      expect(opening[0].category).toBe('fund')
      for (const t of mine.filter((x) => x.entry_type !== 'opening_balance')) expect(opening[0].transaction_date <= t.transaction_date).toBe(true)
    }
  })

  it('the Funds page shows the derived balances', () => {
    render(<Funds />, { wrapper })
    for (const v of Object.values(OLD_BALANCES)) expect(document.body.textContent).toContain(formatCurrency(v))
  })

  it('opening balances are NOT income, expense or member contributions in the totals', () => {
    const received = MOCK_TRANSACTIONS.filter((t) => t.entry_type === 'income' || t.entry_type === 'contribution').reduce((s, t) => s + t.amount, 0)
    const spent    = MOCK_TRANSACTIONS.filter((t) => t.entry_type === 'expense').reduce((s, t) => s + t.amount, 0)
    expect(received).toBe(59900)
    const d = getDashboardStats()
    expect(d.totalBalance).toBe(425500)
    expect(d.totalIncome).toBe(received)
    expect(d.totalExpense).toBe(spent)
    expect(d.totalTransactions).toBe(6)   // the 5 opening balances are setup entries, not transactions people made
    const { result } = renderHook(() => useTransactions(), { wrapper })
    expect(result.current.totalIncome).toBe(received)
    expect(result.current.totalExpense).toBe(spent)
    const club = getClubReportStats()
    expect(club.totalFundBalance).toBe(425500)
    const rows = Object.fromEntries(club.fundRows.map((r) => [r.id, [r.received, r.spent]]))
    expect(rows['1']).toEqual([2400, 0]); expect(rows['2']).toEqual([5000, 12500]); expect(rows['3']).toEqual([52500, 0])
    expect(rows['4']).toEqual([0, 0]);    expect(rows['5']).toEqual([0, 0])
    for (const r of club.fundRows) expect(r.balance).toBe(OLD_BALANCES[r.id])
  })
})

describe('approving an expense is blocked when the fund cannot cover it', () => {
  const added: Transaction[] = []
  afterEach(() => { for (const t of added) MOCK_TRANSACTIONS.splice(MOCK_TRANSACTIONS.indexOf(t), 1); added.length = 0 })
  const pending = (id: string, amount: number): Transaction => {
    const t: Transaction = { id, user_id: null, user_name: null, entry_type: 'expense', category: 'fund', fund_id: '4', amount, payment_method: null,
      reference_number: `TXN-TEST-${id}`, transaction_date: '2025-04-01', status: 'pending', description: 'test spend' }
    MOCK_TRANSACTIONS.push(t); added.push(t); return t
  }

  it('over the balance: stays pending and a danger message explains why', () => {
    const t = pending('t-big', 20000.01)                          // Emergency Fund holds exactly 20,000
    const { result } = renderHook(() => useTransactions(), { wrapper })
    act(() => result.current.handleApprove(t))
    expect(result.current.data.find((x) => x.id === 't-big')?.status).toBe('pending')
    expect(result.current.actionResult?.variant).toBe('danger')
    expect(result.current.actionResult?.message).toContain('Emergency Fund')
  })

  it('within the balance: approved', () => {
    const t = pending('t-ok', 20000)                              // spends the fund down to exactly 0
    const { result } = renderHook(() => useTransactions(), { wrapper })
    act(() => result.current.handleApprove(t))
    expect(result.current.data.find((x) => x.id === 't-ok')?.status).toBe('approved')
    expect(result.current.actionResult?.variant).toBe('success')
  })

  it('two spends that each fit but not together: the second approval is blocked', () => {
    const a = pending('t-a', 12000); const b = pending('t-b', 12000)
    const { result } = renderHook(() => useTransactions(), { wrapper })
    act(() => result.current.handleApprove(a))
    act(() => result.current.handleApprove(b))
    expect(result.current.data.find((x) => x.id === 't-a')?.status).toBe('approved')
    expect(result.current.data.find((x) => x.id === 't-b')?.status).toBe('pending')
  })
})
