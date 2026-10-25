// projects.test.tsx — Projects page flows (filters, approve/reject, edit via detail, delete)
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { OrgProvider } from '../context/OrgContext'
import Projects from '../pages/projects/Projects'
import { MOCK_PROJECTS } from '../api/mockData'
import { approvedOnly } from '../utils/approvals'

const mount = () => render(<OrgProvider orgData={{}}><Projects /></OrgProvider>)
const btn = (re: RegExp) => { const b = screen.getAllByRole('button').filter(x => re.test(x.textContent ?? '')).pop(); if (!b) throw new Error('no button ' + re); return b }
const rows = () => Array.from(document.querySelectorAll('tbody tr'))
const selects = () => Array.from(document.querySelectorAll('select'))
const act = (i: number, title: string) => fireEvent.click(rows()[i].querySelector(`button[title="${title}"]`) as Element)

describe('Projects', () => {
  it('KPI tiles count the projects by status (Overall = all rows; the others = approved projects only)', () => {
    mount()
    const strip = document.querySelector('div[style*="repeat"]') as HTMLElement   // the KPI grid (first grid on the page)
    const kpi = (label: string) => Array.from(strip.querySelectorAll('div')).find(d => d.textContent === label)?.nextElementSibling?.textContent
    const count = (st: string) => approvedOnly(MOCK_PROJECTS).filter(p => p.status === st).length
    expect(kpi('Overall Projects')).toBe(String(MOCK_PROJECTS.length))
    expect(kpi('Completed')).toBe(String(count('completed')))
    expect(kpi('Ongoing')).toBe(String(count('ongoing')))
    expect(kpi('Upcoming')).toBe(String(count('upcoming')))
  })
  it('type and status filters narrow the table; search finds by text', () => {
    mount()
    const total = rows().length
    fireEvent.change(selects()[1], { target: { value: 'upcoming' } }); expect(rows().length).toBe(MOCK_PROJECTS.filter(p => p.status === 'upcoming').length)
    fireEvent.change(selects()[1], { target: { value: 'all' } })
    fireEvent.change(document.querySelector('input[placeholder="Search…"]') as Element, { target: { value: 'zzz-no-match' } })
    expect(screen.getByText('No projects found.')).toBeTruthy()
    fireEvent.change(document.querySelector('input[placeholder="Search…"]') as Element, { target: { value: '' } }); expect(rows().length).toBe(total)
  })
  it('Approve and Reject (pending project only) each show feedback and leave the lifecycle status alone', () => {
    const pending = MOCK_PROJECTS.find(p => p.approval_status === 'pending')!.title
    mount(); fireEvent.click(screen.getByTitle('Approve')); expect(document.body.textContent).toContain(`"${pending}" has been approved.`)
    cleanup(); mount(); fireEvent.click(screen.getByTitle('Reject')); expect(document.body.textContent).toContain(`"${pending}" has been rejected.`)
  })
  it('detail Edit opens the edit modal; Save updates the row and shows feedback', () => {
    mount(); const t = MOCK_PROJECTS[1].title
    fireEvent.click(screen.getByText(t)); fireEvent.click(btn(/Edit Project/))
    const input = Array.from(document.querySelectorAll<HTMLInputElement>('input')).find(i => i.value === t) as HTMLInputElement
    fireEvent.change(input, { target: { value: t + ' II' } }); fireEvent.click(btn(/Save Project/))
    expect(document.body.textContent).toContain(`"${t} II" has been saved successfully.`); expect(screen.getAllByText(t + ' II').length).toBeGreaterThan(0)
  })
  it('delete asks first, then removes the row with feedback', async () => {
    mount(); const n = rows().length
    act(0, 'Delete'); expect(screen.getByText('Delete Project')).toBeTruthy(); fireEvent.click(btn(/Yes, Delete/))
    await screen.findByText(/has been permanently removed/); expect(rows().length).toBe(n - 1)
  })
})
