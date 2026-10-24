// utilityBills.test.tsx -- the Edit Utility form edits the BILL only; paid amount and status are derived
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { OrgProvider } from '../context/OrgContext'
import Utilities from '../pages/transactions/Utilities'

const mount = () => render(<OrgProvider orgData={{}}><Utilities /></OrgProvider>)
const clickButton = (name: RegExp) => fireEvent.click(screen.getAllByRole('button').find((b) => name.test(b.textContent ?? '')) as Element)
const openOfficeRentEditor = () => {
  mount()
  const cell = screen.getAllByText('Office Rent').find((el) => el.closest('tr'))   // skip the filter <option>
  fireEvent.click(cell as Element); clickButton(/^\s*Edit/)
}
const rentRowText = () => (screen.getAllByText('Office Rent').map((el) => el.closest('tr')).find(Boolean) as HTMLElement).textContent ?? ''

describe('Edit Utility form', () => {
  it('has no Amount Paid or Status controls; the date is the DUE date; a note explains why', () => {
    openOfficeRentEditor()
    expect(screen.queryByText(/Amount Paid/)).toBeNull()
    expect(screen.queryAllByText(/^Status$/).filter((el) => !el.closest('th'))).toHaveLength(0)   // the table column header is fine
    expect(screen.getAllByText('Due Date').some((el) => !el.closest('th'))).toBe(true)   // the form label (not just the column header)
    expect(screen.queryAllByText('Payment Date')).toHaveLength(0)
    expect(document.body.textContent).toContain('follow the approved payments')
  })

  it('lowering the total to what is already paid turns the bill Paid; raising it keeps it Partial', () => {
    openOfficeRentEditor()                                             // total 15,000, paid 7,500 -> Partial
    expect(rentRowText()).toContain('Partial')
    fireEvent.change(document.querySelector('input[type="number"]') as Element, { target: { value: '7500' } })
    clickButton(/Save Changes/)
    expect(rentRowText()).toContain('Paid')
    expect(rentRowText()).not.toContain('Partial')
    expect(rentRowText()).toContain('7,500.00')                       // paid amount never changed by the edit
  })

  it('a bigger total never changes the paid amount', () => {
    openOfficeRentEditor()
    fireEvent.change(document.querySelector('input[type="number"]') as Element, { target: { value: '20000' } })
    clickButton(/Save Changes/)
    expect(rentRowText()).toContain('Partial'); expect(rentRowText()).toContain('20,000.00'); expect(rentRowText()).toContain('7,500.00')
  })
})
