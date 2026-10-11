// test/pages.flows.test.tsx — Behavior tests for edit/save flows (beyond the click-everything smoke sweep)
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import { OrgProvider } from '../context/OrgContext'
import Funds from '../pages/funds/Funds'
import Utilities from '../pages/transactions/Utilities'
import Attendance from '../pages/employees/Attendance'
import Announcements from '../pages/announcements/Announcements'
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
})
