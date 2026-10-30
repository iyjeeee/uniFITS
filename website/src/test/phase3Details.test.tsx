// test/phase3Details.test.tsx — Phase 3: Calendar upcoming list (B-05), Employee Report recent transactions (B-54) + paging (B-52), Add wizard activity (B-67)
import { describe, it, expect, afterEach } from 'vitest'
import { render, fireEvent, cleanup } from '@testing-library/react'
import { OrgProvider } from '../context/OrgContext'
import Calendar from '../pages/announcements/Calendar'
import AllEmployeesModal from '../pages/reports/parts/AllEmployeesModal'
import EmployeeTransactionsSection from '../pages/reports/parts/EmployeeTransactionsSection'
import { getRecentTransactions } from '../pages/reports/parts/employeeReportShared'
import { MOCK_USERS, MOCK_PROJECTS, MOCK_EVENTS } from '../api/mockData'
import type { Transaction, User } from '../types'

const wrap = (ui: React.ReactElement) => render(<OrgProvider orgData={{}}>{ui}</OrgProvider>)
const text = () => document.body.textContent ?? ''
afterEach(cleanup)

describe('Calendar upcoming list (B-05)', () => {
  it('a cancelled (or completed) approved item is not listed as upcoming', () => {
    const cancelled = { ...MOCK_PROJECTS[0], id: 'cx', title: 'Cancelled Camp', status: 'cancelled' as const, approval_status: 'approved' as const, start_date: '2030-01-01', end_date: '2030-01-02' }
    MOCK_PROJECTS.push(cancelled)
    try { wrap(<Calendar />); expect(text()).not.toContain('Cancelled Camp') } finally { MOCK_PROJECTS.splice(MOCK_PROJECTS.indexOf(cancelled), 1) }
  })
  it('lists upcoming and ongoing approved items only (no completed, cancelled, pending or rejected)', () => {
    const live = (items: { status: string; approval_status: string; title: string }[]) => items.filter((i) => i.approval_status === 'approved')
    const hidden = [...live(MOCK_PROJECTS), ...live(MOCK_EVENTS)].filter((i) => i.status !== 'upcoming' && i.status !== 'ongoing').map((i) => i.title)
    const shown  = [...live(MOCK_PROJECTS), ...live(MOCK_EVENTS)].filter((i) => i.status === 'upcoming' || i.status === 'ongoing').map((i) => i.title)
    expect(hidden.length).toBeGreaterThan(0)   // the sample data has a completed item to hide
    wrap(<Calendar />)
    const side = Array.from(document.querySelectorAll('div')).find((d) => d.textContent?.startsWith('Upcoming ScheduleNext activities'))!.textContent ?? ''
    for (const t of shown.slice(0, 8)) expect(side).toContain(t)
    for (const t of hidden) expect(side).not.toContain(t)
  })
})

describe('getRecentTransactions (B-54)', () => {
  let n = 0
  const tx = (o: Partial<Transaction>): Transaction => ({ id: String(++n), user_id: '1', entry_type: 'contribution', category: 'fund', fund_id: '1', amount: 10, payment_method_id: '1', reference_number: 'r', transaction_date: '2025-03-01', status: 'approved', description: '', ...o })
  it("the member's latest approved rows, newest first, max 6", () => {
    const rows = [tx({ id: 'a', transaction_date: '2025-01-01' }), tx({ id: 'b', transaction_date: '2025-05-01' }), tx({ id: 'c', transaction_date: '2025-03-01' }), tx({ id: 'd', transaction_date: '2025-06-01', status: 'pending' }),
      tx({ id: 'e', user_id: '2', transaction_date: '2025-07-01' }), tx({ id: 'f', transaction_date: '2025-04-01' }), tx({ id: 'g', transaction_date: '2025-02-01' }), tx({ id: 'h', transaction_date: '2024-12-01' }), tx({ id: 'i', transaction_date: '2024-11-01' })]
    expect(getRecentTransactions('1', rows).map((t) => t.id)).toEqual(['b', 'f', 'c', 'g', 'a', 'h'])
  })
  it('an outflow (refund / expense) is drawn red with a minus; a contribution stays green with a plus', () => {
    wrap(<EmployeeTransactionsSection myTx={[tx({ id: 'x1', entry_type: 'refund', amount: 25 }), tx({ id: 'x2', entry_type: 'contribution', amount: 40 })]} />)
    const cells = Array.from(document.querySelectorAll('td')).filter((c) => /[−+]₱/.test(c.textContent ?? ''))
    const refund = cells.find((c) => c.textContent?.includes('25'))!, contrib = cells.find((c) => c.textContent?.includes('40'))!
    expect(refund.textContent?.startsWith('−')).toBe(true); expect((refund as HTMLElement).style.color).toBe('var(--danger)')
    expect(contrib.textContent?.startsWith('+')).toBe(true); expect((contrib as HTMLElement).style.color).toBe('var(--success)')
  })
})

describe('All Employees modal paging (B-52)', () => {
  const mkUsers = (n: number, prefix: string): User[] => Array.from({ length: n }, (_, i) => ({ ...MOCK_USERS[0], id: `${prefix}${i}`, full_name: `${prefix} Person ${i + 1}` }))
  it('each group pages on its own and the subtitle has no misleading "Page X of Y"', () => {
    wrap(<AllEmployeesModal open onClose={() => {}} total={20 + 9} officers={mkUsers(20, 'Off')} members={mkUsers(9, 'Mem')} />)
    expect(text()).not.toMatch(/Page \d+ of \d+/); expect(text()).toContain('Off Person 1'); expect(text()).toContain('Mem Person 1')
    const pagers = Array.from(document.querySelectorAll('button')).filter((b) => b.textContent === '2')
    expect(pagers).toHaveLength(2)   // officers: 3 pages (20/8), members: 2 pages (9/8)
    fireEvent.click(pagers[1])   // members -> page 2
    expect(text()).toContain('Mem Person 9'); expect(text()).not.toContain('Mem Person 1 '); expect(text()).toContain('Off Person 1')   // officers stay on page 1
    expect(Array.from(document.querySelectorAll('button')).filter((b) => b.textContent === '3')).toHaveLength(1)   // only the officers have a 3rd page
  })
  it('a group never shows an empty page', () => {
    wrap(<AllEmployeesModal open onClose={() => {}} total={12} officers={mkUsers(12, 'Off')} members={mkUsers(2, 'Mem')} />)
    fireEvent.click(Array.from(document.querySelectorAll('button')).find((b) => b.textContent === '2')!)
    expect(text()).toContain('Off Person 12'); expect(text()).toContain('Mem Person 1'); expect(text()).toContain('Mem Person 2')
  })
})

// ── B-67: the chosen project / event is shown in the live preview and the review ──
import { getSummaryRows } from '../pages/transactions/parts/addTransactionShared'
import type { OrgConfig } from '../types'
describe('Add Transaction summary shows the chosen activity (B-67)', () => {
  const org = { currency_symbol: '₱', project_label: 'Project', event_label: 'Gathering' } as OrgConfig
  const row = (rows: [string, string][], k: string) => rows.find(([x]) => x === k)
  it('project category: a row named after the project label with its title; no blank Fund row', () => {
    const p = MOCK_PROJECTS[0]; const rows = getSummaryRows({ category: 'project', activity_id: p.id }, org, true)
    expect(row(rows, 'Project')).toEqual(['Project', p.title]); expect(row(rows, 'Fund')).toBeUndefined()
  })
  it('event category uses the event label (org wording)', () => {
    const e = MOCK_EVENTS[0]; expect(row(getSummaryRows({ category: 'event', activity_id: e.id }, org, false), 'Gathering')).toEqual(['Gathering', e.title])
  })
  it('nothing chosen yet shows a dash', () => { expect(row(getSummaryRows({ category: 'project', activity_id: '' }, org, false), 'Project')).toEqual(['Project', '—']) })
  it('fund and utility categories keep the Fund row', () => {
    expect(row(getSummaryRows({ category: 'fund', fund_id: '1' }, org, true), 'Fund')?.[1]).not.toBe('—'); expect(row(getSummaryRows({ category: 'fund', fund_id: '1' }, org, true), 'Project')).toBeUndefined()
  })
})
