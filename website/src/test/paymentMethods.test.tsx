// paymentMethods.test.tsx -- transactions reference payment methods by id; names resolve for display and search
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { OrgProvider } from '../context/OrgContext'
import Transactions from '../pages/transactions/Transactions'
import PersonalTransactions from '../pages/profile/PersonalTransactions'
import { MOCK_TRANSACTIONS, MOCK_PAYMENT_METHODS, getPaymentMethodName, getFundName } from '../api/mockData'

const mount = (ui: React.ReactElement) => render(<OrgProvider orgData={{}}>{ui}</OrgProvider>)
const search = (value: string) => fireEvent.change(screen.getByPlaceholderText(/^Search/), { target: { value } })
const rowsText = () => Array.from(document.querySelectorAll('tbody tr')).map((r) => r.textContent ?? '').join('|')
const tx1 = MOCK_TRANSACTIONS.find((t) => t.id === '1')!   // Juan's contribution: GCash, Membership Dues Fund

describe('payment methods by id', () => {
  it('every payment points at a real method; only opening balances have none', () => {
    const ids = MOCK_PAYMENT_METHODS.map((m) => m.id)
    for (const t of MOCK_TRANSACTIONS) {
      if (t.entry_type === 'opening_balance') expect(t.payment_method_id).toBeNull()
      else expect(ids).toContain(t.payment_method_id)
    }
  })

  it('getPaymentMethodName resolves an id, and shows the dash for none or unknown', () => {
    expect(getPaymentMethodName(tx1.payment_method_id)).toBe('GCash')
    expect(getPaymentMethodName(null)).toBe('—')
    expect(getPaymentMethodName('nope')).toBe('—')
  })

  it('Transactions: the receipt shows the method NAME (not the id)', () => {
    mount(<Transactions />)
    expect(document.body.textContent).not.toContain('GCash')                 // not in the list itself
    fireEvent.click(screen.getAllByText(tx1.reference_number)[0])
    expect(document.body.textContent).toContain('GCash')
  })

  it('Transactions: searching by method NAME finds the rows paid that way', () => {
    mount(<Transactions />)
    const gcash = MOCK_TRANSACTIONS.filter((t) => getPaymentMethodName(t.payment_method_id) === 'GCash')
    expect(gcash.length).toBeGreaterThan(0)
    search('GCash')
    for (const t of gcash) expect(rowsText()).toContain(t.reference_number)
    for (const t of MOCK_TRANSACTIONS.filter((x) => !gcash.includes(x))) expect(rowsText()).not.toContain(t.reference_number)
  })
})

describe('My Transaction History (profile table)', () => {
  it('shows the method NAME in the Method column', () => {
    mount(<PersonalTransactions userId="1" />)
    expect(rowsText()).toContain('GCash')
  })
  it('search finds rows by method name AND by fund name (names, not ids)', () => {
    mount(<PersonalTransactions userId="1" />)
    search('GCash');                              expect(rowsText()).toContain(tx1.reference_number)
    search(getFundName(tx1.fund_id));             expect(rowsText()).toContain(tx1.reference_number)
    search('Cheque');                             expect(rowsText()).not.toContain(tx1.reference_number)
  })
})
