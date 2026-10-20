// addTransaction.test.tsx — Add Transaction wizard: summary rows (pure), validation per step, dependent resets, full path to Record
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { OrgProvider } from '../context/OrgContext'
import AddTransaction from '../pages/transactions/AddTransaction'
import { getSummaryRows, EMPTY_TX_FORM, ADD_TX_STEPS } from '../pages/transactions/parts/addTransactionShared'
import { MOCK_FUNDS, MOCK_PROJECTS, MOCK_USERS } from '../api/mockData'
import type { OrgConfig } from '../types'

const org: OrgConfig = { name: 'Test', currency_symbol: '₱', currency_code: 'PHP', people_label: 'Employee', project_label: 'Project', event_label: 'Event', fund_label: 'Fund', transaction_label: 'Transaction', utility_label: 'Utility', attendance_label: 'Attendance', report_label: 'Report' }
const btn = (re: RegExp) => { const b = screen.getAllByRole('button').filter(x => re.test(x.textContent ?? '')).pop(); if (!b) throw new Error('no button ' + re); return b }
const mount = () => render(<OrgProvider orgData={{}}><AddTransaction /></OrgProvider>)
const sel = (i = 0) => document.querySelectorAll('select')[i] as HTMLSelectElement
const next = () => fireEvent.click(btn(/Continue/))

describe('getSummaryRows', () => {
  it('an empty form shows dashes', () => {
    const rows = getSummaryRows(EMPTY_TX_FORM, org, false)
    expect(rows.map(r => r[0])).toEqual(['Source', 'Member / Person', 'Payment Method', 'Entry Type', 'Category', 'Fund', 'Amount', 'Notes'])
    expect(rows.filter(r => r[0] !== 'Source' && r[0] !== 'Entry Type' && r[0] !== 'Category').every(r => r[1] === '—')).toBe(true)
  })
  it('amount uses the org currency symbol; external source reads "External" in the review only', () => {
    const f = { ...EMPTY_TX_FORM, source: 'external', amount: '250' }
    expect(getSummaryRows(f, org, false).find(r => r[0] === 'Amount')?.[1]).toBe('₱250')
    expect(getSummaryRows(f, org, false).find(r => r[0] === 'Member / Person')?.[1]).toBe('—')
    expect(getSummaryRows(f, org, true).find(r => r[0] === 'Member / Person')?.[1]).toBe('External')
  })
  it('the six steps are Source → Review', () => { expect(ADD_TX_STEPS).toEqual(['Source', 'Payment', 'Entry Type', 'Category', 'Amount', 'Review']) })
})

describe('AddTransaction wizard', () => {
  it('Continue is blocked with an error until a source (and a person for member/officer) is chosen', () => {
    mount(); next(); expect(document.body.textContent).toContain('Transaction Source is required.')
    fireEvent.click(btn(/Employee/)); next(); expect(document.body.textContent).toContain('Please select a Employee.')
    fireEvent.change(sel(), { target: { value: MOCK_USERS[0].id } }); next(); expect(screen.getByText('How was this payment made?')).toBeTruthy()
  })
  it('an external source needs no person', () => {
    mount(); fireEvent.click(btn(/External/)); next(); expect(screen.getByText('How was this payment made?')).toBeTruthy()
  })
  it('Back returns to the previous step, clears errors, and is disabled on step 1', () => {
    mount(); expect((btn(/Back/) as HTMLButtonElement).disabled).toBe(true)
    fireEvent.click(btn(/External/)); next(); next(); expect(document.body.textContent).toContain('Payment Method is required.')
    fireEvent.click(btn(/Back/)); expect(screen.getByText('Who is this transaction from?')).toBeTruthy(); expect(document.body.textContent).not.toContain('Payment Method is required.')
  })
  it('changing the category clears the previously chosen fund', () => {
    mount(); fireEvent.click(btn(/External/)); next(); fireEvent.click(btn(/Cash/)); next(); fireEvent.click(btn(/Income/)); next()
    fireEvent.click(btn(/^Fund/)); fireEvent.change(sel(), { target: { value: MOCK_FUNDS[0].id } }); expect(sel().value).toBe(MOCK_FUNDS[0].id)
    fireEvent.click(btn(/^Project/)); fireEvent.click(btn(/^Fund/)); expect(sel().value).toBe('')
  })
  it('fund / project categories require their selector; zero amounts are blocked', () => {
    mount(); fireEvent.click(btn(/External/)); next(); fireEvent.click(btn(/Cash/)); next(); fireEvent.click(btn(/Income/)); next()
    fireEvent.click(btn(/^Project/)); next(); expect(document.body.textContent).toContain('Please select an activity.')
    fireEvent.change(sel(), { target: { value: MOCK_PROJECTS[0].id } }); next()
    next(); expect(document.body.textContent).toMatch(/Amount/)
    fireEvent.change(document.querySelector('input[type="number"]') as Element, { target: { value: '0' } }); next(); expect(screen.queryByText('Review Transaction')).toBeNull()
  })
  it('full path: Review shows the entered values, Record opens the confirmation and closing goes to /transactions', () => {
    mount(); fireEvent.click(btn(/Employee/)); fireEvent.change(sel(), { target: { value: MOCK_USERS[0].id } }); next()
    fireEvent.click(btn(/GCash/)); next(); fireEvent.click(btn(/Contribution/)); next()
    fireEvent.click(btn(/^Fund/)); fireEvent.change(sel(), { target: { value: MOCK_FUNDS[0].id } }); next()
    fireEvent.change(document.querySelector('input[type="number"]') as Element, { target: { value: '1500.5' } }); next()
    expect(screen.getByText('Review Transaction')).toBeTruthy(); expect(document.body.textContent).toContain('₱1500.5'); expect(document.body.textContent).toContain(MOCK_USERS[0].full_name)
    fireEvent.click(btn(/Record Transaction/)); expect(screen.getByText('Transaction Recorded!')).toBeTruthy()
    window.location.hash = ''; fireEvent.click(btn(/Go to Transactions/)); expect(window.location.hash).toBe('#/transactions')
  })
})
