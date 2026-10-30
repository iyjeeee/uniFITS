// itemDetail.test.tsx — ItemDetailContent data (pure) and rendering (project/event, empty states, funding bar)
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ItemDetailContent from '../components/ItemDetailContent'
import { getItemDetailData, buildDetailRows } from '../components/itemDetail/itemDetailData'
import { MOCK_PROJECTS, MOCK_EVENTS, getProjectsWithFunding, getEventsWithFunding, MOCK_ATTENDANCES, MOCK_TRANSACTIONS } from '../api/mockData'
import type { OrgConfig } from '../types'

const org: OrgConfig = { name: 'Test', currency_symbol: '₱', currency_code: 'PHP', people_label: 'Employee', project_label: 'Project', event_label: 'Event', fund_label: 'Fund', transaction_label: 'Transaction', utility_label: 'Utility', attendance_label: 'Attendance', report_label: 'Report', people_label_plural: 'Employees', project_label_plural: 'Projects', event_label_plural: 'Events', fund_label_plural: 'Funds', transaction_label_plural: 'Transactions', utility_label_plural: 'Utilities', report_label_plural: 'Reports' }
const project = getProjectsWithFunding()[0]
const event = getEventsWithFunding()[0]

describe('getItemDetailData', () => {
  it('splits transactions by category, member vs external, and totals add up', () => {
    const d = getItemDetailData(project, 'project')
    expect(d.memberContribs.every(t => t.category === 'project' && t.entry_type === 'contribution' && t.user_id !== null)).toBe(true)
    expect(d.externalIncome.every(t => t.category === 'project' && t.entry_type === 'income' && t.user_id === null)).toBe(true)
    expect(d.externalExpense.every(t => t.category === 'project' && t.entry_type === 'expense')).toBe(true)
    expect(d.totalInflow).toBe(d.totalOpening + d.totalContrib + d.totalExtInc - d.totalRefunds)   // opening entry is part of the funding (B-48)
    expect(d.netBalance).toBe(d.totalInflow - d.totalExtExp)
  })
  it('kind decides the category (event rows are not project rows)', () => {
    const p = getItemDetailData(project, 'project'); const e = getItemDetailData(event, 'event')
    const ids = new Set(p.memberContribs.map(t => t.id))
    expect(e.memberContribs.some(t => ids.has(t.id))).toBe(false)
    expect(MOCK_TRANSACTIONS.length).toBeGreaterThan(0)
  })
  it('attendance is matched by the item id (not the title)', () => {
    const eventId = MOCK_ATTENDANCES[0].event_id!
    const d = getItemDetailData({ ...event, id: eventId }, 'event')
    expect(d.attendanceRecords.length).toBe(MOCK_ATTENDANCES.filter(a => a.event_id === eventId).length)
    expect(getItemDetailData({ ...event, id: 'no-such-id' }, 'event').attendanceRecords).toEqual([])
  })
})

describe('buildDetailRows', () => {
  it('project has Duration and Type; event has Date & Time and no duplicate Status', () => {
    const p = buildDetailRows(project, 'project', org).map(r => r[0]); const e = buildDetailRows(event, 'event', org).map(r => r[0])
    expect(p).toContain('Duration'); expect(p).toContain('Type')
    expect(e).toContain('Date & Time'); expect(e.filter(k => k === 'Status').length).toBe(1)
  })
  it('shows "Not Required" when there is no target funding', () => {
    const rows = buildDetailRows({ ...project, target_funding: 0 }, 'project', org)
    expect(rows.find(r => r[0] === 'Target Funding')?.[1]).toBe('Not Required')
  })
})

describe('ItemDetailContent', () => {
  it('renders nothing for a null item', () => {
    const { container } = render(<ItemDetailContent item={null} org={org} kind="project" />)
    expect(container.innerHTML).toBe('')
  })
  it('renders the four panels, the info grid and the financial summary for a project', () => {
    render(<ItemDetailContent item={project} org={org} kind="project" />)
    expect(screen.getAllByText('Employee Contributions').length).toBe(2)   // panel title + Financial Summary row
    expect(screen.getByText('Employee Attendance')).toBeTruthy()
    expect(screen.getAllByText('External Income').length).toBe(2)          // panel title + Financial Summary row
    expect(screen.getByText('External Expense')).toBeTruthy()
    expect(screen.getByText('Financial Summary')).toBeTruthy()
    expect(screen.getByText('Net Balance')).toBeTruthy()
  })
  it('shows the funding bar only when a target exists, capped at 100%', () => {
    const { rerender } = render(<ItemDetailContent item={{ ...project, target_funding: 1000, current_funding: 5000 }} org={org} kind="project" />)
    expect(screen.getByText('Funding Progress')).toBeTruthy(); expect(screen.getByText('100%')).toBeTruthy()
    rerender(<ItemDetailContent item={{ ...project, target_funding: 0 }} org={org} kind="project" />)
    expect(screen.queryByText('Funding Progress')).toBeNull()
  })
  it('shows empty hints for an activity without records', () => {
    render(<ItemDetailContent item={{ ...event, title: 'No such activity' }} org={org} kind="event" />)
    expect(screen.getByText('No attendance records found for this activity.')).toBeTruthy()
  })
})

describe('B-47 — financials are scoped to the opened item (project_id / event_id)', () => {
  it('a project only sees its own transactions; another project sees none of them', () => {
    const own = getItemDetailData(MOCK_PROJECTS[0], 'project')
    expect(own.memberContribs.map(t => t.id)).toEqual(['3'])
    expect(own.externalExpense.map(t => t.id)).toEqual(['6'])
    expect(own.totalContrib).toBe(5000); expect(own.totalExtExp).toBe(12500)
    const other = getItemDetailData(MOCK_PROJECTS[1], 'project')
    expect(other.memberContribs).toEqual([]); expect(other.externalExpense).toEqual([])
    expect(other.netBalance).toBe(other.totalOpening)   // only its own opening entry (78,000), nothing from project 1
  })
  it('an event only sees its own transactions', () => {
    expect(getItemDetailData(MOCK_EVENTS[0], 'event').memberContribs.map(t => t.id)).toEqual(['4'])
    expect(getItemDetailData(MOCK_EVENTS[1], 'event').memberContribs).toEqual([])
  })
  it('a project id never matches an event with the same id', () => {
    const tx = MOCK_TRANSACTIONS.find(t => t.project_id === '1')
    expect(tx?.event_id ?? null).toBeNull()
  })
})

// ── Phase 3 (B-48 / B-27): the detail panels add up to the funding bar and count approved rows only ──
import FinancialSummary from '../components/itemDetail/FinancialSummary'
import type { Transaction as Tx } from '../types'
describe('detail panels vs the funding bar (B-48)', () => {
  it('opening + contributions + income - refunds equals the funding bar, for every approved project and event', () => {
    for (const p of getProjectsWithFunding()) { const d = getItemDetailData(p, 'project'); expect(d.totalInflow).toBe(p.current_funding) }
    for (const e of getEventsWithFunding())   { const d = getItemDetailData(e, 'event');   expect(d.totalInflow).toBe(e.current_funding) }
  })
  it('the opening entry is its own line (not hidden inside contributions)', () => {
    const p = getProjectsWithFunding().find((x) => getItemDetailData(x, 'project').totalOpening > 0)!
    const d = getItemDetailData(p, 'project'); expect(d.openingEntries.length).toBeGreaterThan(0); expect(d.memberContribs.some((t) => t.entry_type === 'opening_balance')).toBe(false)
    expect(d.totalInflow).toBe(d.totalOpening + d.totalContrib + d.totalExtInc - d.totalRefunds)
  })
  const mk = (o: Partial<Tx>): Tx => ({ id: 'z' + Math.random(), user_id: null, entry_type: 'income', category: 'project', fund_id: '1', project_id: '1', amount: 100, payment_method_id: '1', reference_number: 'r', transaction_date: '2025-03-01', status: 'approved', description: '', ...o })
  it('pending / rejected / voided rows are left out of every panel and total (B-27)', () => {
    const rows = [mk({ entry_type: 'contribution', user_id: '1', amount: 10 }), mk({ entry_type: 'income', amount: 20 }), mk({ entry_type: 'expense', amount: 5 }), mk({ entry_type: 'refund', amount: 3 }), mk({ entry_type: 'opening_balance', fund_id: null, amount: 50 }),
      mk({ entry_type: 'contribution', user_id: '2', amount: 999, status: 'pending' }), mk({ entry_type: 'income', amount: 999, status: 'rejected' }), mk({ entry_type: 'expense', amount: 999, status: 'voided' })]
    const d = getItemDetailData({ ...project, id: '1' }, 'project', rows)
    expect([d.totalContrib, d.totalExtInc, d.totalExtExp, d.totalOpening, d.totalRefunds]).toEqual([10, 20, 5, 50, 3])
    expect(d.totalInflow).toBe(10 + 20 + 50 - 3); expect(d.netBalance).toBe(77 - 5)
  })
  it('the summary shows Opening and Refunds lines only when they exist', () => {
    const base = { memberContribs: [], externalIncome: [], externalExpense: [], openingEntries: [], attendanceRecords: [], totalContrib: 10, totalExtInc: 0, totalExtExp: 0, totalOpening: 0, totalRefunds: 0, totalInflow: 10, netBalance: 10 }
    const { rerender } = render(<FinancialSummary data={base} org={org} />); expect(document.body.textContent).not.toContain('Opening'); expect(document.body.textContent).not.toContain('Refunds')
    rerender(<FinancialSummary data={{ ...base, totalOpening: 50, totalRefunds: 3, totalInflow: 57, netBalance: 57 }} org={org} />); expect(document.body.textContent).toContain('Opening Balance'); expect(document.body.textContent).toContain('Refunds')
  })
})
