// dashboard.stats.test.ts — getDashboardStats derives KPIs/top contributors/recent rows from the mock records
import { describe, it, expect } from 'vitest'
import { isReceipt } from '../utils/ledger'
import { getDashboardStats } from '../pages/dashboard/parts/dashboardStats'
import { MOCK_TRANSACTIONS, getFundsWithBalance, getUserName } from '../api/mockData'

describe('getDashboardStats', () => {
  const s = getDashboardStats()

  it('totals match the underlying records', () => {
    expect(s.totalTransactions).toBe(MOCK_TRANSACTIONS.filter((t) => t.entry_type !== 'opening_balance').length)   // opening balances are not counted
    expect(s.totalBalance).toBe(getFundsWithBalance().reduce((sum, f) => sum + f.balance, 0))
    const all     = MOCK_TRANSACTIONS.reduce((sum, t) => sum + t.amount, 0)
    const opening = MOCK_TRANSACTIONS.filter((t) => t.entry_type === 'opening_balance').reduce((sum, t) => sum + t.amount, 0)
    expect(s.totalIncome + s.totalExpense + opening).toBe(all)   // opening balances are neither income nor expense
  })

  it('top contributors: max 5, sorted by total, no expenses', () => {
    expect(s.topContributors.length).toBeLessThanOrEqual(5)
    const totals = s.topContributors.map((c) => c.total)
    expect(totals).toEqual([...totals].sort((a, b) => b - a))
    const contributorsWithIncome = new Set(MOCK_TRANSACTIONS.filter((t) => isReceipt(t) && t.user_id).map((t) => getUserName(t.user_id)))
    s.topContributors.forEach((c) => {   // total = sum of that person's receipts (income + contributions; opening balances are not)
      expect(contributorsWithIncome.has(c.name)).toBe(true)
      const sum = MOCK_TRANSACTIONS.filter((t) => t.user_id && getUserName(t.user_id) === c.name && isReceipt(t)).reduce((a, t) => a + t.amount, 0)
      expect(c.total).toBe(sum)
    })
  })

  it('recent transactions: the 6 latest by date, no opening balances (B-28)', () => {
    const latest = MOCK_TRANSACTIONS.filter((t) => t.entry_type !== 'opening_balance').map((t) => t.transaction_date).sort().reverse().slice(0, 6)
    expect(s.recentTransactions.map((t) => t.transaction_date)).toEqual(latest)
  })
})
