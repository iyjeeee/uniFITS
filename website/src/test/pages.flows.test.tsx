// test/pages.flows.test.tsx — Behavior tests for edit/save flows (beyond the click-everything smoke sweep)
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import { OrgProvider } from '../context/OrgContext'
import Funds from '../pages/funds/Funds'
import Utilities from '../pages/transactions/Utilities'
import Employees from '../pages/employees/Employees'
import Dashboard from '../pages/dashboard/Dashboard'
import Attendance from '../pages/employees/Attendance'
import Announcements from '../pages/announcements/Announcements'
import RolesPage from '../pages/employees/RolesPage'
import Profile from '../pages/profile/Profile'
import PersonalTransactions from '../pages/profile/PersonalTransactions'
import type { ReactElement } from 'react'

const mount = (ui: ReactElement) => render(<OrgProvider orgData={{}}>{ui}</OrgProvider>)
const clickText = (text: string | RegExp) => fireEvent.click(screen.getAllByText(text)[0])
const clickButton = (name: RegExp) => { const b = screen.getAllByRole('button').filter(x => name.test(x.textContent ?? '')).pop(); if (!b) throw new Error(`no button ${name}`); fireEvent.click(b) }
const setNumberInput = (value: string) => { const input = document.querySelector<HTMLInputElement>('input[type=number]'); if (!input) throw new Error('no number input'); fireEvent.change(input, { target: { value } }) }

describe('edit/save flows', () => {
  it('Funds: editing the annual fee saves it as a number and shows the success message', () => {
    mount(<Funds />)
    clickText('Membership Dues Fund'); clickButton(/^\s*Edit/)
    setNumberInput('1500'); clickButton(/Save Changes/)
    expect(screen.getByText(/has been saved successfully/)).toBeTruthy()
    expect(document.body.textContent).toContain('1,500.00')   // formatted from a real number, not a raw string
  })

  it('Funds: clearing the annual fee saves it as "not applicable"', () => {
    mount(<Funds />)
    clickText('Membership Dues Fund'); clickButton(/^\s*Edit/)
    setNumberInput(''); clickButton(/Save Changes/)
    expect(screen.getByText(/has been saved successfully/)).toBeTruthy()
  })

  it('Utilities: editing total amount converts to a number and updates the detail', () => {
    mount(<Utilities />)
    const row = screen.getAllByText('Electricity Bill').find(el => el.closest('tr'))   // skip the filter <option>
    if (!row) throw new Error('no table row')
    fireEvent.click(row); clickButton(/^\s*Edit/)
    setNumberInput('4000'); clickButton(/Save Changes/)
    expect(screen.getByText(/has been saved successfully/)).toBeTruthy()
    expect(document.body.textContent).toContain('4,000.00')
  })

  it('Utilities: Cancel in edit mode discards the typed value', () => {
    mount(<Utilities />)
    const row = screen.getAllByText('Electricity Bill').find(el => el.closest('tr'))
    if (!row) throw new Error('no table row')
    fireEvent.click(row); clickButton(/^\s*Edit/)
    setNumberInput('9999'); clickButton(/Cancel/)
    expect(document.body.textContent).not.toContain('9,999.00')
    expect(document.body.textContent).toContain('3,500.00')   // original total still shown
  })

  it('Utilities: filters narrow the table and a delete removes the row with a confirmation message', async () => {
    mount(<Utilities />)
    const selects = () => Array.from(document.querySelectorAll('select'))
    fireEvent.change(selects()[1], { target: { value: 'unpaid' } })   // status filter
    expect(document.querySelectorAll('tbody tr').length).toBe(1)
    expect(document.body.textContent).toContain('Water Bill')
    fireEvent.click(document.querySelector('button[title="Delete"]') as Element)
    clickButton(/Yes, Delete/)
    await screen.findByText(/has been permanently removed/)   // feedback modal appears after a short delay
    expect(screen.getByText('No utilities found.')).toBeTruthy()
  })

  it('Employees: role filter narrows the table and the search box finds by name', () => {
    mount(<Employees />)
    const selects = () => Array.from(document.querySelectorAll('select'))
    fireEvent.change(selects()[0], { target: { value: 'Member' } })   // role filter
    expect(document.querySelectorAll('tbody tr').length).toBe(3)
    expect(document.body.textContent).not.toContain('Juan Dela Cruz')
    fireEvent.change(selects()[0], { target: { value: 'all' } })
    fireEvent.change(document.querySelector('input[placeholder="Search…"]') as Element, { target: { value: 'maria' } })
    expect(document.querySelectorAll('tbody tr').length).toBe(1)
  })

  it('Employees: detail Edit opens the edit modal and Save updates the row', () => {
    mount(<Employees />)
    fireEvent.click(screen.getAllByText('Maria Santos').find(el => el.closest('tr')) as Element)
    clickButton(/Edit Employee/)
    const first = Array.from(document.querySelectorAll<HTMLInputElement>('input')).find(i => i.value === 'Maria')
    if (!first) throw new Error('no first-name input')
    fireEvent.change(first, { target: { value: 'Mariana' } }); clickButton(/Save Employee/)
    expect(document.body.textContent).toContain('Mariana Santos')
    expect(document.body.textContent).toContain('has been updated successfully')
  })

  it('Employees: delete removes the row and shows the confirmation message', async () => {
    mount(<Employees />)
    fireEvent.click(document.querySelector('button[title="Delete"]') as Element)
    clickButton(/Yes, Remove/)
    await screen.findByText(/has been permanently removed/)   // feedback modal appears after a short delay
    expect(document.querySelectorAll('tbody tr').length).toBe(5)
  })

  it('Dashboard: KPI cards navigate to their pages', () => {
    mount(<Dashboard />)
    const go = (label: RegExp, hash: string) => { window.location.hash = ''; fireEvent.click(screen.getByText(label)); expect(window.location.hash).toBe('#' + hash) }
    go(/Total Fund Balance/, '/funds')
    go(/Upcoming Events/, '/events')
    go(/Total Transactions/, '/transactions')
    expect(screen.getByText('Top Contributors')).toBeTruthy()
    expect(screen.getByText('Recent Transactions')).toBeTruthy()
  })

  it('Attendance: marking everyone present and saving updates the tile counts', () => {
    mount(<Attendance />)
    clickText('Medical Mission 2026')
    clickButton(/Mark All Present/); clickButton(/Save Attendance/)
    expect(within(document.body).getAllByText(/6\/6 recorded/).length).toBeGreaterThan(0)
  })

  it('Announcements: project tiles open a Project detail and page buttons change the page', () => {
    mount(<Announcements />)
    fireEvent.click(screen.getByRole('button', { name: '2' }))
    expect(document.body.textContent).toMatch(/Page 2 of 2/)
  })

  it('Roles: creating a role adds it to the table, and it can be deleted again', async () => {
    mount(<RolesPage />)
    clickButton(/Add Role/)
    const name = document.querySelector<HTMLInputElement>('input'); if (!name) throw new Error('no name input')
    fireEvent.change(name, { target: { value: 'Treasurer Aide' } })
    clickButton(/Create Role/)
    expect(screen.getByText(/has been added successfully/)).toBeTruthy()
    expect(document.querySelector('tbody')?.textContent).toContain('Treasurer Aide')
    clickButton(/Got it/)
    const row = Array.from(document.querySelectorAll('tbody tr')).find(r => r.textContent?.includes('Treasurer Aide'))
    fireEvent.click(row!.querySelector('button[title="Delete role"]')!)
    clickButton(/Yes, Delete/)
    await new Promise(r => setTimeout(r, 350))   // feedback modal appears after the close animation
    expect(document.querySelector('tbody')?.textContent).not.toContain('Treasurer Aide')
    expect(screen.getByText(/permanently removed/)).toBeTruthy()
  })

  it('Roles: toggling a permission and saving shows the success message', () => {
    mount(<RolesPage />)
    fireEvent.click(document.querySelector('tbody tr')!)
    clickButton(/Save Permissions/)
    expect(screen.getByText(/permissions have been saved successfully/)).toBeTruthy()
  })

  it('Profile: editing and saving shows the success message', () => {
    mount(<Profile userId="2" />)
    clickButton(/Edit Profile/)
    clickButton(/Save/)
    expect(screen.getByText('Profile Updated')).toBeTruthy()
  })

  it('PersonalTransactions: clicking a transaction row opens its detail (regression: rows used to do nothing)', () => {
    mount(<PersonalTransactions userId="1" />)
    expect(screen.queryAllByRole('button', { name: 'Close' })).toHaveLength(0)
    fireEvent.click(document.querySelector('tbody tr')!)
    expect(screen.getAllByRole('button', { name: 'Close' }).length).toBeGreaterThan(0)   // the detail modal's footer
  })

  it('Funds: a protected (required) fund cannot be deleted, an optional one can', () => {
    mount(<Funds />)
    clickText('Membership Dues Fund')
    expect(screen.queryAllByRole('button').some(b => /Delete/.test(b.textContent ?? ''))).toBe(false)
  })
})
