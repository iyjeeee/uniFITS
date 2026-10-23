// itemDetail.test.tsx — ItemDetailContent data (pure) and rendering (project/event, empty states, funding bar)
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ItemDetailContent from '../components/ItemDetailContent'
import { getItemDetailData, buildDetailRows } from '../components/itemDetail/itemDetailData'
import { MOCK_PROJECTS, MOCK_EVENTS, MOCK_ATTENDANCES, MOCK_TRANSACTIONS } from '../api/mockData'
import type { OrgConfig } from '../types'

const org: OrgConfig = { name: 'Test', currency_symbol: '₱', currency_code: 'PHP', people_label: 'Employee', project_label: 'Project', event_label: 'Event', fund_label: 'Fund', transaction_label: 'Transaction', utility_label: 'Utility', attendance_label: 'Attendance', report_label: 'Report' }
const project = MOCK_PROJECTS[0]
const event = MOCK_EVENTS[0]

describe('getItemDetailData', () => {
  it('splits transactions by category, member vs external, and totals add up', () => {
    const d = getItemDetailData(project, 'project')
    expect(d.memberContribs.every(t => t.category === 'project' && t.entry_type === 'contribution' && t.user_id !== null)).toBe(true)
    expect(d.externalIncome.every(t => t.category === 'project' && t.entry_type === 'income' && t.user_id === null)).toBe(true)
    expect(d.externalExpense.every(t => t.category === 'project' && t.entry_type === 'expense')).toBe(true)
    expect(d.totalInflow).toBe(d.totalContrib + d.totalExtInc)
    expect(d.netBalance).toBe(d.totalInflow - d.totalExtExp)
  })
  it('kind decides the category (event rows are not project rows)', () => {
    const p = getItemDetailData(project, 'project'); const e = getItemDetailData(event, 'event')
    const ids = new Set(p.memberContribs.map(t => t.id))
    expect(e.memberContribs.some(t => ids.has(t.id))).toBe(false)
    expect(MOCK_TRANSACTIONS.length).toBeGreaterThan(0)
  })
  it('attendance is matched by the item title', () => {
    const title = MOCK_ATTENDANCES[0].activity
    const d = getItemDetailData({ ...event, title }, 'event')
    expect(d.attendanceRecords.length).toBe(MOCK_ATTENDANCES.filter(a => a.activity === title).length)
    expect(getItemDetailData({ ...event, title: 'No such activity' }, 'event').attendanceRecords).toEqual([])
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
    expect(other.netBalance).toBe(0)
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
