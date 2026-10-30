// test/transactionNumbers.test.tsx — Phase 3: Transactions KPIs count approved rows only (B-39); refunds read as outflows (B-80); receipt flow direction (B-42); Club Report tile (B-32)
import { describe, it, expect, afterEach } from 'vitest'
import { render, renderHook, act, cleanup } from '@testing-library/react'
import type { ReactNode } from 'react'
import { OrgProvider } from '../context/OrgContext'
import useTransactions from '../pages/transactions/parts/useTransactions'
import TransactionsTable from '../pages/transactions/parts/TransactionsTable'
import TransactionReceiptContent from '../pages/transactions/parts/TransactionReceiptContent'
import ClubReportSummary from '../pages/reports/parts/ClubReportSummary'
import { getClubReportStats } from '../pages/reports/parts/clubReportStats'
import { MOCK_TRANSACTIONS, getFundName } from '../api/mockData'
import type { Transaction } from '../types'

const wrapper = ({ children }: { children: ReactNode }) => <OrgProvider orgData={{}}>{children}</OrgProvider>
let n = 900
const tx = (o: Partial<Transaction>): Transaction => ({ id: String(++n), user_id: '1', entry_type: 'contribution', category: 'fund', fund_id: '1', amount: 100, payment_method_id: '1', reference_number: 'R' + n, transaction_date: '2025-03-10', status: 'approved', description: '', ...o })
afterEach(cleanup)

describe('Transactions KPIs (B-39)', () => {
  it('pending and rejected rows are not in Income / Expenses / Net; approving one adds it', () => {
    const before = renderHook(() => useTransactions(), { wrapper }).result.current
    const pendingIncome = tx({ entry_type: 'income', amount: 7000, status: 'pending' }), rejected = tx({ entry_type: 'expense', amount: 900, status: 'rejected' })
    MOCK_TRANSACTIONS.push(pendingIncome, rejected)
    try {
      const { result } = renderHook(() => useTransactions(), { wrapper })
      expect(result.current.totalIncome).toBe(before.totalIncome); expect(result.current.totalExpense).toBe(before.totalExpense); expect(result.current.balance).toBe(before.balance)
      act(() => result.current.handleApprove(pendingIncome))
      expect(result.current.totalIncome).toBe(before.totalIncome + 7000); expect(result.current.balance).toBe(before.balance + 7000)
    } finally { MOCK_TRANSACTIONS.splice(MOCK_TRANSACTIONS.indexOf(pendingIncome), 1); MOCK_TRANSACTIONS.splice(MOCK_TRANSACTIONS.indexOf(rejected), 1) }
  })
})

describe('refunds read as outflows (B-80)', () => {
  it('the table shows a refund with a minus and red, a contribution with a plus and green', () => {
    render(<OrgProvider orgData={{}}><TransactionsTable rows={[tx({ entry_type: 'refund', amount: 25 }), tx({ entry_type: 'contribution', amount: 40 })]} page={1} onRowClick={() => {}} onApprove={() => {}} onReject={() => {}} onDelete={() => {}} /></OrgProvider>)
    const cell = (amt: string) => Array.from(document.querySelectorAll('td')).find((c) => /^[−+]₱/.test(c.textContent ?? '') && c.textContent?.includes(amt)) as HTMLElement
    expect(cell('25').textContent?.startsWith('−')).toBe(true); expect(cell('25').style.color).toBe('var(--danger)')
    expect(cell('40').textContent?.startsWith('+')).toBe(true); expect(cell('40').style.color).toBe('var(--success)')
  })
  it('the receipt shows the refund amount as −', () => {
    render(<OrgProvider orgData={{}}><TransactionReceiptContent tx={tx({ entry_type: 'refund', amount: 25 })} /></OrgProvider>)
    expect(document.body.textContent).toContain('−₱25.00')
  })
})

describe('receipt flow direction (B-42)', () => {
  const order = (labels: string[]) => { const t = document.body.textContent ?? ''; return labels.map((l) => t.indexOf(l)) }
  it('money coming in: From <person> -> To Fund <fund>', () => {
    render(<OrgProvider orgData={{}}><TransactionReceiptContent tx={tx({ entry_type: 'contribution' })} /></OrgProvider>)
    expect(document.body.textContent).toContain('To Fund'); expect(document.body.textContent).not.toContain('From Fund')
    const [a, b] = order(['From', 'To Fund']); expect(a).toBeLessThan(b)
  })
  it('money going out: From Fund <fund> -> To <payee>', () => {
    render(<OrgProvider orgData={{}}><TransactionReceiptContent tx={tx({ entry_type: 'expense', user_id: null })} /></OrgProvider>)
    expect(document.body.textContent).toContain('From Fund' + getFundName('1')); expect(document.body.textContent).not.toContain('To Fund')
  })
})

describe('Club Report summary tile (B-32)', () => {
  it('"Active Projects" shows the ongoing projects, not every project', () => {
    const s = getClubReportStats(); expect(s.totalProjects).toBeGreaterThan(s.ongoingProjects)
    render(<OrgProvider orgData={{}}><ClubReportSummary stats={s} reportPeriod="2025" /></OrgProvider>)
    const tile = Array.from(document.querySelectorAll('div')).find((d) => d.textContent === 'Active Projects')!.parentElement!.textContent ?? ''
    expect(tile).toContain(String(s.ongoingProjects)); expect(tile).not.toContain(String(s.totalProjects))
  })
})
