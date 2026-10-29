// sidebar.test.tsx — Sidebar: nav data, longest-prefix active detection, sub-menus, collapsed / mobile behavior
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { OrgProvider } from '../context/OrgContext'
import Sidebar from '../components/Sidebar'
import { buildNav } from '../components/sidebar/sidebarNav'
import type { OrgConfig } from '../types'

const org: OrgConfig = { name: 'Test', currency_symbol: '₱', currency_code: 'PHP', people_label: 'Employee', project_label: 'Project', event_label: 'Event', fund_label: 'Fund', transaction_label: 'Transaction', utility_label: 'Utility', attendance_label: 'Attendance', report_label: 'Report' }

function setup(hash: string, props: { open?: boolean; collapsed?: boolean; isMobile?: boolean } = {}) {
  window.location.hash = hash
  const onToggle = vi.fn(); const onClose = vi.fn()
  render(<OrgProvider orgData={{}}><Sidebar open={props.open ?? true} collapsed={props.collapsed ?? false} isMobile={props.isMobile ?? false} onToggle={onToggle} onClose={onClose} navigate={vi.fn()} /></OrgProvider>)
  return { onToggle, onClose }
}
const row = (label: string) => screen.getByText(label).parentElement as HTMLElement
const isActive = (label: string) => (row(label).getAttribute('style') ?? '').includes('background: var(--accent)')

describe('buildNav', () => {
  const nav = buildNav(org)
  it('has the four sections in order', () => { expect(nav.map(s => s.section)).toEqual(['Main', 'Organization', 'Finance', 'Insights']) })
  it('every item has an href and at least one icon path; sub-items have hrefs', () => {
    nav.flatMap(s => s.items).forEach(i => { expect(i.href.startsWith('#/')).toBe(true); expect(i.paths.length).toBeGreaterThan(0); i.sub?.forEach(s => expect(s.href.startsWith('#/')).toBe(true)) })
  })
  it('org labels flow into the menu', () => {
    const custom = buildNav({ ...org, people_label: 'Member', project_label: 'Program' })
    const orgSection = custom.find(s => s.section === 'Organization')!
    expect(orgSection.items[0].sub?.[0].label).toBe('Add Member'); expect(orgSection.items[1].sub?.[0].label).toBe('Add Program')
  })
})

describe('Sidebar active detection (longest prefix wins)', () => {
  it('/dashboard activates only Dashboard', () => { setup('/dashboard'); expect(isActive('Dashboard')).toBe(true); expect(isActive('Announcements')).toBe(false) })
  it('/transactions/utilities activates Utilities, not Transactions', () => {
    setup('/transactions/utilities'); expect(isActive(screen.getByText(/^Utilit/).textContent as string)).toBe(true); expect(isActive('Transactions')).toBe(false)
  })
  it('/transactions/add activates Transactions', () => { setup('/transactions/add'); expect(isActive('Transactions')).toBe(true) })
  it('an unknown route activates nothing', () => { setup('/nowhere'); expect(isActive('Dashboard')).toBe(false); expect(isActive('Employees')).toBe(false) })
  it('a query (?id=) in the address does not change the highlight (B-01/B-65)', () => {
    setup('/transactions/utilities?id=1'); expect(isActive(screen.getByText(/^Utilit/).textContent as string)).toBe(true); expect(isActive('Transactions')).toBe(false)
  })
  it('no hash falls back to the dashboard', () => { setup(''); expect(isActive('Dashboard')).toBe(true) })
})

describe('Sidebar interaction', () => {
  it('clicking an item with sub-items toggles them; one open at a time', () => {
    setup('/dashboard'); fireEvent.click(row('Employees')); expect(screen.getByText('Add Employee')).toBeTruthy()
    fireEvent.click(row('Funds')); expect(screen.queryByText('Add Employee')).toBeNull(); expect(screen.getByText('Add Fund')).toBeTruthy()
    fireEvent.click(row('Funds')); expect(screen.queryByText('Add Fund')).toBeNull()
  })
  it('a sub-item and a leaf item navigate by hash (desktop does not call onClose)', () => {
    const { onClose } = setup('/dashboard'); fireEvent.click(row('Funds')); fireEvent.click(screen.getByText('Manage Funds'))
    expect(window.location.hash).toBe('#/funds'); fireEvent.click(row('Dashboard')); expect(window.location.hash).toBe('#/dashboard'); expect(onClose).not.toHaveBeenCalled()
  })
  it('on mobile every navigation closes the drawer; no collapse button; labels always shown', () => {
    const { onClose } = setup('/projects', { isMobile: true, collapsed: true }); expect(screen.getByText('Dashboard')).toBeTruthy()
    expect(document.querySelector('button[title$="sidebar"]')).toBeNull()
    fireEvent.click(row('Projects')); fireEvent.click(screen.getByText('Add Project')); expect(onClose).toHaveBeenCalledTimes(1)
    fireEvent.click(row('Dashboard')); expect(onClose).toHaveBeenCalledTimes(2)
  })
  it('collapsed desktop hides labels (titles instead) and the collapse button calls onToggle', () => {
    const { onToggle } = setup('/dashboard', { collapsed: true })
    expect(screen.queryByText('Dashboard')).toBeNull(); expect(document.querySelector('[title="Dashboard"]')).toBeTruthy()
    fireEvent.click(document.querySelector('button[title="Expand sidebar"]') as Element); expect(onToggle).toHaveBeenCalledTimes(1)
  })
  it('collapsing from expanded closes an open sub-menu', () => {
    const { onToggle } = setup('/dashboard'); fireEvent.click(row('Employees')); expect(screen.getByText('Add Employee')).toBeTruthy()
    fireEvent.click(document.querySelector('button[title="Collapse sidebar"]') as Element)
    expect(onToggle).toHaveBeenCalledTimes(1); expect(screen.queryByText('Add Employee')).toBeNull()
  })
})
