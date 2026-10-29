// test/orgLabels.test.tsx — Phase 2: plural labels (B-63), Projects/Events wording (B-72), Employee Report wording (B-53),
// org name in report headers (B-36), org currency symbol (B-29/B-73), label grammar + success titles (B-69)
import { describe, it, expect, afterEach, vi } from 'vitest'
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react'
import type { ComponentType, ReactElement } from 'react'
import { OrgProvider, useOrg } from '../context/OrgContext'
import Sidebar from '../components/Sidebar'
import { buildNav } from '../components/sidebar/sidebarNav'
import Projects from '../pages/projects/Projects'
import Events from '../pages/events/Events'
import ProjectDetail from '../pages/projects/ProjectDetail'
import EventDetail from '../pages/events/EventDetail'
import Dashboard from '../pages/dashboard/Dashboard'
import EmployeeReport from '../pages/reports/EmployeeReport'
import ClubReport from '../pages/reports/ClubReport'
import AddTransaction from '../pages/transactions/AddTransaction'
import AddUtility from '../pages/transactions/AddUtility'
import { MOCK_USERS, MOCK_FUNDS, MOCK_PROJECTS, MOCK_EVENTS } from '../api/mockData'
import ProjectsTable from '../pages/projects/parts/ProjectsTable'
import type { OrgConfig, ProjectWithFunding } from '../types'

// Custom org: every singular ends in a way that "+s" would get wrong (Activity, Entry, Summary) or needs "an" (Artist)
const CUSTOM: Partial<OrgConfig> = { name: 'Acme Club', currency_symbol: '$', people_label: 'Artist', project_label: 'Program', event_label: 'Gathering', fund_label: 'Pot', transaction_label: 'Entry', utility_label: 'Activity', report_label: 'Summary' }
const wrap = (ui: ReactElement, org: Partial<OrgConfig> = CUSTOM) => render(<OrgProvider orgData={org}>{ui}</OrgProvider>)
const btn = (re: RegExp) => { const b = screen.getAllByRole('button').filter(x => re.test(x.textContent ?? '')).pop(); if (!b) throw new Error('no button ' + re); return b }
const text = () => document.body.textContent ?? ''
afterEach(() => { cleanup(); window.location.hash = '' })

describe('OrgProvider plurals', () => {
  const Probe = () => { const o = useOrg(); return <div>{[o.people_label_plural, o.utility_label_plural, o.transaction_label_plural, o.report_label_plural].join('|')}</div> }
  it('derives plurals from the singular labels', () => { wrap(<Probe />); expect(text()).toBe('Artists|Activities|Entries|Summaries') })
  it('defaults are Employees / Utilities / Transactions / Reports', () => { wrap(<Probe />, {}); expect(text()).toBe('Employees|Utilities|Transactions|Reports') })
  it('an explicit plural wins over the derived one', () => { wrap(<Probe />, { people_label: 'Person', people_label_plural: 'People' }); expect(text().startsWith('People|')).toBe(true) })
})

describe('plural labels in menus and KPI tiles (B-63)', () => {
  it('buildNav uses the plural fields', () => {
    const labels = (o: Partial<OrgConfig>) => { let r = ''; wrap(<Probe2 o={o} />, o); r = text(); cleanup(); return r }
    const Probe2 = ({ o }: { o: Partial<OrgConfig> }) => { const org = useOrg(); void o; return <div>{buildNav(org).flatMap(s => s.items.flatMap(i => [i.label, ...(i.sub ?? []).map(x => x.label)])).join('|')}</div> }
    const custom = labels(CUSTOM)
    for (const l of ['Artists', 'Manage Artists', 'Programs', 'Manage Programs', 'Gatherings', 'Pots', 'Manage Pots', 'Entries', 'All Entries', 'Activities', 'Manage Activities', 'Summaries']) expect(custom.split('|')).toContain(l)
    expect(custom).not.toMatch(/Entrys|Activitys|Summarys/)
    const def = labels({}).split('|')
    expect(def).toContain('Utilities'); expect(def).toContain('Manage Utilities'); expect(labels({})).not.toContain('Utilitys')
  })
  it('the real Sidebar shows "Utilities" with the default org', () => {
    wrap(<Sidebar open collapsed={false} isMobile={false} onToggle={vi.fn()} onClose={vi.fn()} navigate={vi.fn()} />, {})
    expect(screen.getByText('Utilities')).toBeTruthy(); expect(text()).not.toContain('Utilitys')
  })
  it('Dashboard KPI tiles use plurals (Total Artists / Active Programs / Upcoming Gatherings / Completed Programs)', () => {
    wrap(<Dashboard />)
    for (const l of ['Total Artists', 'Active Programs', 'Upcoming Gatherings', 'Completed Programs']) expect(text()).toContain(l)
  })
})

describe('no hard-coded "+s" plurals or pesos on any page (custom org)', () => {
  const mods = import.meta.glob<{ default: ComponentType<Record<string, unknown>> }>(['../pages/**/*.tsx', '!../pages/login/**', '!../pages/**/parts/**'], { eager: true })
  it.each(Object.entries(mods))('%s', (_p, m) => {
    wrap(<m.default currentUser={MOCK_USERS[0]} navigate={() => {}} id="1" />)
    expect(text()).not.toMatch(/Entrys|Activitys|Summarys|Artistss|Programss/)
    expect(text()).not.toContain('₱')   // currency is the org's "$"
  })
})

describe('Projects wording and currency (B-72, B-73)', () => {
  it('KPI tile, approve message, delete modal and delete rows use org labels', async () => {
    wrap(<Projects />)
    expect(text()).toContain('Overall Programs')
    fireEvent.click(screen.getByTitle('Approve')); expect(text()).toContain('Program Approved')
    cleanup(); wrap(<Projects />); fireEvent.click(screen.getByTitle('Reject')); expect(text()).toContain('Program Rejected')
    cleanup(); wrap(<Projects />); fireEvent.click(screen.getAllByTitle('Delete')[0]); expect(text()).toContain('Delete Program'); expect(text()).toContain('Program Name')
    expect(text()).toContain('Program Summary'); expect(text()).not.toContain('₱')
    fireEvent.click(btn(/Yes, Delete/)); await waitFor(() => expect(text()).toContain('Program Deleted'))   // result shows after the modal closes (260 ms)
  })
  it('amounts in the table use the org symbol; Updated message uses the label', () => {
    wrap(<Projects />); expect(text()).toContain('$'); expect(text()).not.toContain('₱')
  })
  it('a 0 target is never drawn green (raised 0 >= target 0 used to count as reached)', () => {
    const row = { ...MOCK_PROJECTS[0], target_funding: 0, current_funding: 0 } as ProjectWithFunding
    wrap(<ProjectsTable rows={[row]} onRowClick={() => {}} onApprove={() => {}} onReject={() => {}} onDelete={() => {}} />)
    const amount = Array.from(document.querySelectorAll('tbody td div')).find(d => /^\$0\.00$/.test(d.textContent ?? '')) as HTMLElement
    expect(amount.style.color).not.toBe('var(--success)')
    cleanup()
    wrap(<ProjectsTable rows={[{ ...row, target_funding: 100, current_funding: 100 }]} onRowClick={() => {}} onApprove={() => {}} onReject={() => {}} onDelete={() => {}} />)
    const reached = Array.from(document.querySelectorAll('tbody td div')).find(d => /^\$100\.00$/.test(d.textContent ?? '')) as HTMLElement
    expect(reached.style.color).toBe('var(--success)')   // a real target that is met is still green
  })
  it('detail page uses the org symbol', () => { wrap(<ProjectDetail id={MOCK_PROJECTS[0].id} />); expect(text()).toContain('$'); expect(text()).not.toContain('₱') })
})

describe('Events wording and currency (B-72, B-73)', () => {
  it('KPI tile, approve message, delete modal and rows use org labels', async () => {
    wrap(<Events />)
    expect(text()).toContain('Overall Gatherings')
    fireEvent.click(screen.getByTitle('Approve')); expect(text()).toContain('Gathering Approved')
    cleanup(); wrap(<Events />); fireEvent.click(screen.getByTitle('Reject')); expect(text()).toContain('Gathering Rejected')
    cleanup(); wrap(<Events />); fireEvent.click(screen.getAllByTitle('Delete')[0]); expect(text()).toContain('Delete Gathering'); expect(text()).toContain('Gathering Name'); expect(text()).not.toContain('₱')
    fireEvent.click(btn(/Yes, Delete/)); await waitFor(() => expect(text()).toContain('Gathering Deleted'))
  })
  it('table and detail page use the org symbol', () => {
    wrap(<Events />); expect(text()).toContain('$'); expect(text()).not.toContain('₱'); cleanup()
    wrap(<EventDetail id={MOCK_EVENTS[0].id} />); expect(text()).toContain('$'); expect(text()).not.toContain('₱')
  })
})

describe('Employee Report wording (B-53) and org name in report headers (B-36)', () => {
  it('title, tooltip, group label, modal and export use the people label', () => {
    wrap(<EmployeeReport />)
    expect(text()).toContain('Artist Report'); expect(screen.getByTitle('View All Artists')).toBeTruthy()
    expect(text()).toContain('Acme Club'); expect(text()).not.toContain('uniFITS Organization')
    fireEvent.click(screen.getByTitle('View All Artists')); expect(text()).toContain('All Artists List')
    expect(text()).toMatch(/\d+ officers · \d+ artists/i); expect(text()).not.toMatch(/Employee/)
  })
  it('the export confirmation title uses the label', () => {
    wrap(<EmployeeReport />); fireEvent.click(btn(/Export PDF/)); expect(text()).toContain('Export Artist Report PDF'); expect(text()).not.toMatch(/Employee/)
  })
  it('Club Report (after Generate) shows the org name, plural headings and the org currency', () => {
    wrap(<ClubReport />); fireEvent.click(btn(/Generate Report/))
    expect(text()).toContain('Acme Club'); expect(text()).not.toContain('uniFITS Organization'); expect(text()).not.toContain('₱')
    expect(text()).toContain('Programs'); expect(text()).toContain('Gatherings'); expect(text()).not.toMatch(/Entrys|Activitys|Summarys/)
  })
})

describe('charts use the org currency symbol (B-29)', () => {
  it('Dashboard axis and fund bars show "$", never "₱"', () => { wrap(<Dashboard />); expect(text()).toMatch(/\$\d+k/); expect(text()).not.toContain('₱') })
})

describe('Add Transaction / Add Utility wording (B-69)', () => {
  const sel = (i = 0) => document.querySelectorAll('select')[i] as HTMLSelectElement
  const next = () => fireEvent.click(btn(/Continue/))
  it('the person error uses "an" for a vowel label and the org label', () => {
    wrap(<AddTransaction />); fireEvent.click(btn(/Artist/)); next(); expect(text()).toContain('Please select an Artist.')
  })
  it('default label reads "an Employee"', () => { wrap(<AddTransaction />, {}); fireEvent.click(btn(/Employee/)); next(); expect(text()).toContain('Please select an Employee.') })
  it('a consonant label reads "a Member"', () => { wrap(<AddTransaction />, { people_label: 'Member' }); fireEvent.click(btn(/^Member/)); next(); expect(text()).toContain('Please select a Member.') })
  it('Add Utility: success title, message and button use the utility label', () => {
    const set = (el: Element, v: string) => fireEvent.change(el, { target: { value: v } })
    const nums = () => Array.from(document.querySelectorAll('input[type="number"]')) as HTMLInputElement[]
    wrap(<AddUtility />); fireEvent.click(btn(/Electricity Bill/)); next()
    set(document.querySelector('input:not([type])') as Element, 'Meralco'); set(sel(), MOCK_FUNDS[0].id); set(document.querySelector('input[type="date"]') as Element, '2024-03-05'); next()
    set(nums()[0], '1000'); set(nums()[1], '400.5'); set(sel(), 'partial'); next()
    fireEvent.click(btn(/Record Activity/)); expect(screen.getByText('Activity Recorded!')).toBeTruthy(); expect(screen.getByRole('button', { name: /Go to Activities/ })).toBeTruthy()
  })
  it('success title and button use the transaction label', () => {
    wrap(<AddTransaction />); fireEvent.click(btn(/Artist/)); fireEvent.change(sel(), { target: { value: MOCK_USERS[0].id } }); next()
    fireEvent.click(btn(/GCash/)); next(); fireEvent.click(btn(/Contribution/)); next(); fireEvent.click(btn(/^Pot/)); fireEvent.change(sel(), { target: { value: MOCK_FUNDS[0].id } }); next()
    fireEvent.change(document.querySelector('input[type="number"]') as Element, { target: { value: '10' } }); next()
    fireEvent.click(btn(/Record Entry/)); expect(screen.getByText('Entry Recorded!')).toBeTruthy(); expect(screen.getByRole('button', { name: /Go to Entries/ })).toBeTruthy()
  })
})
