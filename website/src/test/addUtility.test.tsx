// addUtility.test.tsx — Add Utility wizard: summary rows (pure), validation per step, "Other" custom type, full path to Record
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { OrgProvider } from '../context/OrgContext'
import AddUtility from '../pages/transactions/AddUtility'
import { getUtilitySummaryRows, EMPTY_UTILITY_FORM, ADD_UTILITY_STEPS } from '../pages/transactions/parts/addUtilityShared'
import { MOCK_FUNDS } from '../api/mockData'
import type { OrgConfig } from '../types'

const org: OrgConfig = { name: 'Test', currency_symbol: '₱', currency_code: 'PHP', people_label: 'Employee', project_label: 'Project', event_label: 'Event', fund_label: 'Fund', transaction_label: 'Transaction', utility_label: 'Utility', attendance_label: 'Attendance', report_label: 'Report' }
const btn = (re: RegExp) => { const b = screen.getAllByRole('button').filter(x => re.test(x.textContent ?? '')).pop(); if (!b) throw new Error('no button ' + re); return b }
const mount = () => render(<OrgProvider orgData={{}}><AddUtility /></OrgProvider>)
const next = () => fireEvent.click(btn(/Continue/))
const set = (el: Element, v: string) => fireEvent.change(el, { target: { value: v } })
const text = () => document.querySelector('input:not([type])') as HTMLInputElement
const date = () => document.querySelector('input[type="date"]') as HTMLInputElement
const nums = () => Array.from(document.querySelectorAll('input[type="number"]')) as HTMLInputElement[]
const sel = (i = 0) => document.querySelectorAll('select')[i] as HTMLSelectElement
const toStep1 = () => { fireEvent.click(btn(/Electricity Bill/)); next() }
const fillStep1 = () => { set(text(), 'Meralco'); set(sel(), MOCK_FUNDS[0].id); set(date(), '2024-03-05'); next() }

describe('getUtilitySummaryRows', () => {
  it('empty form shows dashes; Status is capitalised', () => {
    const rows = getUtilitySummaryRows(EMPTY_UTILITY_FORM, org)
    expect(rows.map(r => r[0])).toEqual(['Category', 'Paid To', 'Fund', 'Payment Date', 'Total Amount', 'Amount Paid', 'Status', 'Notes'])
    expect(rows.find(r => r[0] === 'Status')?.[1]).toBe('Unpaid'); expect(rows.find(r => r[0] === 'Category')?.[1]).toBe('—')
  })
  it('"Other" shows the custom type; amounts use the org currency', () => {
    const f = { ...EMPTY_UTILITY_FORM, expense_type: 'Other', custom_type: 'Repairs', total_amount: '250' }
    expect(getUtilitySummaryRows(f, org).find(r => r[0] === 'Category')?.[1]).toBe('Repairs')
    expect(getUtilitySummaryRows(f, org).find(r => r[0] === 'Total Amount')?.[1]).toBe('₱250')
    expect(getUtilitySummaryRows({ ...f, custom_type: '' }, org).find(r => r[0] === 'Category')?.[1]).toBe('Other')
  })
  it('the four steps', () => { expect(ADD_UTILITY_STEPS).toEqual(['Category', 'Payment Info', 'Amount', 'Review']) })
})

describe('AddUtility wizard', () => {
  it('a category is required; "Other" also needs a custom type', () => {
    mount(); next(); expect(document.body.textContent).toContain('Expense Category is required.')
    fireEvent.click(btn(/^Other/)); next(); expect(document.body.textContent).toContain('Please specify the expense type.')
    set(text(), 'Repairs'); next(); expect(screen.getByText('Payment Information')).toBeTruthy()
  })
  it('switching away from "Other" clears the custom type', () => {
    mount(); fireEvent.click(btn(/^Other/)); set(text(), 'Repairs'); fireEvent.click(btn(/Water Bill/)); fireEvent.click(btn(/^Other/)); expect(text().value).toBe('')
  })
  it('payment step requires vendor, fund and a date that is not in the future', () => {
    mount(); toStep1(); next(); expect(document.body.textContent).toContain('Vendor / Biller is required.')
    set(text(), 'Meralco'); set(sel(), MOCK_FUNDS[0].id); set(date(), '2999-01-01'); next(); expect(document.body.textContent).toMatch(/future/i)
    set(date(), '2024-03-05'); next(); expect(screen.getByText('Amount & Status')).toBeTruthy()
  })
  it('amount step: zero total, negative paid and paid > total are blocked', () => {
    mount(); toStep1(); fillStep1()
    set(nums()[0], '0'); next(); expect(screen.queryByText(/Review Utility/)).toBeNull()
    set(nums()[0], '1000'); set(nums()[1], '1500'); next(); expect(document.body.textContent).toMatch(/exceed/i)
    set(nums()[1], '-5'); next(); expect(screen.queryByText(/Review Utility/)).toBeNull()
    set(nums()[1], '400.5'); next(); expect(screen.getByText('Review Utility')).toBeTruthy()
  })
  it('Back returns one step and clears errors; disabled on the first step', () => {
    mount(); expect((btn(/Back/) as HTMLButtonElement).disabled).toBe(true)
    toStep1(); next(); expect(document.body.textContent).toContain('Vendor / Biller is required.')
    fireEvent.click(btn(/Back/)); expect(screen.getByText('Expense Category')).toBeTruthy(); expect(document.body.textContent).not.toContain('Vendor / Biller is required.')
  })
  it('full path: review shows the values, Record opens the confirmation, closing goes to /transactions/utilities', () => {
    mount(); toStep1(); fillStep1(); set(nums()[0], '1000'); set(nums()[1], '400.5'); set(sel(), 'partial'); next()
    expect(screen.getByText('Review Utility')).toBeTruthy(); expect(document.body.textContent).toContain('₱1000'); expect(document.body.textContent).toContain('Partial')
    fireEvent.click(btn(/Record Utility/)); expect(screen.getByText('Utility Recorded!')).toBeTruthy()
    window.location.hash = ''; fireEvent.click(btn(/Go to Utilities/)); expect(window.location.hash).toBe('#/transactions/utilities')
  })
})
