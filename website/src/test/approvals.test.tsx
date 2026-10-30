// approvals.test.tsx -- projects and events: approval status is separate from lifecycle status; only approved items count
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import { OrgProvider } from '../context/OrgContext'
import Projects from '../pages/projects/Projects'
import Events from '../pages/events/Events'
import Attendance from '../pages/employees/Attendance'
import { getDashboardStats } from '../pages/dashboard/parts/dashboardStats'
import { getClubReportStats } from '../pages/reports/parts/clubReportStats'
import { MOCK_PROJECTS, MOCK_EVENTS, MOCK_USERS } from '../api/mockData'

const admin = MOCK_USERS[0]
const mount = (ui: React.ReactElement) => render(<OrgProvider orgData={{}}>{ui}</OrgProvider>)
const rowOf = (title: string) => screen.getAllByText(title).map((e) => e.closest('tr')).find(Boolean) as HTMLElement
const kpi = (label: string) => screen.getByText(label, { selector: 'div' }).nextElementSibling?.textContent
const comboWith = (value: string) => screen.getAllByRole('combobox').find((s) => Array.from((s as HTMLSelectElement).options).some((o) => o.value === value)) as HTMLSelectElement

describe('approval data', () => {
  it('every project and event has a consistent review record (mirrors the DB constraint)', () => {
    for (const x of [...MOCK_PROJECTS, ...MOCK_EVENTS]) {
      expect(['pending', 'approved', 'rejected']).toContain(x.approval_status)
      expect(['upcoming', 'ongoing', 'completed', 'cancelled']).toContain(x.status)   // lifecycle only: no 'rejected' here
      if (x.approval_status === 'pending') { expect(x.reviewed_by).toBeNull(); expect(x.reviewed_at).toBeNull() }
      else { expect(x.reviewed_by).toBeTruthy(); expect(x.reviewed_at).toBeTruthy() }
    }
  })
  it('exactly one project and one event are waiting for approval', () => {
    expect(MOCK_PROJECTS.filter((p) => p.approval_status === 'pending').map((p) => p.id)).toEqual(['5'])
    expect(MOCK_EVENTS.filter((e) => e.approval_status === 'pending').map((e) => e.id)).toEqual(['2'])
  })
})

describe('Projects page', () => {
  it('Approve / Reject appear only on rows waiting for approval; the row shows a Pending badge', () => {
    mount(<Projects currentUser={admin} />)
    expect(screen.getAllByTitle('Approve')).toHaveLength(1)
    expect(screen.getAllByTitle('Reject')).toHaveLength(1)
    expect(within(rowOf('Livelihood Seminar')).getByTitle('Approve')).toBeTruthy()
    expect(rowOf('Livelihood Seminar').textContent).toContain('Pending')
    expect(rowOf('Medical Mission 2026').textContent).not.toContain('Pending')
  })
  it('Approve sets the approval only: the lifecycle status is untouched (no more auto-Ongoing)', () => {
    mount(<Projects currentUser={admin} />)
    fireEvent.click(screen.getByTitle('Approve'))
    expect(screen.queryAllByTitle('Approve')).toHaveLength(0)
    const row = rowOf('Livelihood Seminar').textContent ?? ''
    expect(row).toContain('Upcoming'); expect(row).not.toContain('Ongoing'); expect(row).not.toContain('Pending')
    expect(document.body.textContent).toContain('Project Approved')
    expect(document.body.textContent).not.toContain('set to Ongoing')
  })
  it('Reject marks it Rejected and keeps the lifecycle status (not Cancelled)', () => {
    mount(<Projects currentUser={admin} />)
    fireEvent.click(screen.getByTitle('Reject'))
    expect(screen.queryAllByTitle('Approve')).toHaveLength(0)
    const row = rowOf('Livelihood Seminar').textContent ?? ''
    expect(row).toContain('Rejected'); expect(row).toContain('Upcoming'); expect(row).not.toContain('Cancelled')
  })
  it('the Approval filter narrows the list to the pending item', () => {
    mount(<Projects currentUser={admin} />)
    fireEvent.change(comboWith('pending'), { target: { value: 'pending' } })
    expect(screen.getAllByText('Livelihood Seminar').some((e) => e.closest('tr'))).toBe(true)
    expect(screen.queryAllByText('Medical Mission 2026').some((e) => e.closest('tr'))).toBe(false)
  })
  it('KPI tiles count APPROVED projects only (Overall still shows every row)', () => {
    mount(<Projects currentUser={admin} />)
    expect(kpi('Overall Projects')).toBe('5')
    expect(kpi('Upcoming')).toBe('2')        // Medical Mission + Tree Planting; Livelihood Seminar is pending
    expect(kpi('Ongoing')).toBe('1'); expect(kpi('Completed')).toBe('1')
  })
})

describe('Events page', () => {
  it('Approve / Reject appear only on the pending event; approving keeps it Upcoming', () => {
    mount(<Events currentUser={admin} />)
    expect(screen.getAllByTitle('Approve')).toHaveLength(1)
    expect(rowOf('Summer Sportsfest').textContent).toContain('Pending')
    fireEvent.click(screen.getByTitle('Approve'))
    expect(screen.queryAllByTitle('Approve')).toHaveLength(0)
    const row = rowOf('Summer Sportsfest').textContent ?? ''
    expect(row).toContain('Upcoming'); expect(row).not.toContain('Ongoing'); expect(row).not.toContain('Pending')
  })
  it('KPI tiles count approved events only', () => {
    mount(<Events currentUser={admin} />)
    expect(kpi('Upcoming')).toBe('2')        // Gala + Independence Day; Sportsfest is pending
  })
})

describe('only approved items count elsewhere', () => {
  it('dashboard and club report counts', () => {
    const d = getDashboardStats()
    expect(d.ongoingProjects).toBe(1)        // only Medical Mission is 'ongoing' (B-26); School Feeding / Tree Planting are upcoming, Livelihood is pending
    expect(d.ongoingProjects).toBe(getClubReportStats().ongoingProjects)   // Dashboard and Club Report agree
    expect(d.upcomingEvents).toBe(2)
    const c = getClubReportStats()
    expect(c.ongoingProjects).toBe(1); expect(c.completedProjects).toBe(1); expect(c.upcomingEvents).toBe(2); expect(c.completedEvents).toBe(1)
  })
  it('Attendance offers approved projects and events only', () => {
    mount(<Attendance />)
    expect(document.body.textContent).toContain('Medical Mission 2026')
    expect(document.body.textContent).not.toContain('Livelihood Seminar')
    expect(document.body.textContent).not.toContain('Summer Sportsfest')
  })
})
