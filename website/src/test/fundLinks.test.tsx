// fundLinks.test.tsx -- transactions and utilities reference funds by id (not by name)
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { OrgProvider } from '../context/OrgContext'
import Transactions from '../pages/transactions/Transactions'
import Utilities from '../pages/transactions/Utilities'
import { getFundContributions } from '../pages/reports/parts/fundReportData'
import { MOCK_FUNDS, MOCK_TRANSACTIONS, MOCK_UTILITIES, getFundName } from '../api/mockData'

const mount = (ui: React.ReactElement) => render(<OrgProvider orgData={{}}>{ui}</OrgProvider>)
const rowsText = () => Array.from(document.querySelectorAll('tbody tr')).map((r) => r.textContent ?? '').join('|')   // table rows only (filters list every value too)
const search = (value: string) => fireEvent.change(screen.getByPlaceholderText(/^Search/), { target: { value } })

describe('fund links by id', () => {
  it('every transaction and utility with a fund points at an existing one', () => {
    const ids = MOCK_FUNDS.map((f) => f.id)
    for (const t of MOCK_TRANSACTIONS) {
      if (t.category === 'fund') expect(t.fund_id).not.toBeNull()          // fund category needs a fund
      if (t.fund_id !== null) expect(ids).toContain(t.fund_id)            // any fund given must exist (project/event openings have none)
    }    for (const u of MOCK_UTILITIES)    expect(ids).toContain(u.fund_id)
  })

  it('getFundName resolves an id, and shows — for none or unknown', () => {
    expect(getFundName(MOCK_FUNDS[0].id)).toBe(MOCK_FUNDS[0].name)
    expect(getFundName(null)).toBe('—')
    expect(getFundName('no-such-fund')).toBe('—')
  })

  it('fund report matches contributions by fund id: renaming a fund changes nothing', () => {
    const fund = MOCK_FUNDS[0]
    const before = getFundContributions(fund).grandTotal
    expect(before).toBeGreaterThan(0)
    expect(getFundContributions({ ...fund, name: 'Renamed Fund' }).grandTotal).toBe(before)
  })

  it('Transactions: searching by fund NAME still finds the rows of that fund', () => {
    const fund = MOCK_FUNDS.find((f) => MOCK_TRANSACTIONS.some((t) => t.fund_id === f.id))!
    const hit  = MOCK_TRANSACTIONS.filter((t) => t.fund_id === fund.id)
    const miss = MOCK_TRANSACTIONS.filter((t) => t.fund_id !== fund.id)
    mount(<Transactions />)
    search(fund.name)
    for (const t of hit)  expect(rowsText()).toContain(t.reference_number)
    for (const t of miss) expect(rowsText()).not.toContain(t.reference_number)
  })

  it('Utilities: searching by fund NAME still finds the bills paid from it', () => {
    const fund = MOCK_FUNDS.find((f) => MOCK_UTILITIES.some((u) => u.fund_id === f.id))!
    const hit  = MOCK_UTILITIES.filter((u) => u.fund_id === fund.id)
    const miss = MOCK_UTILITIES.filter((u) => u.fund_id !== fund.id)
    mount(<Utilities />)
    search(fund.name)
    for (const u of hit)  expect(rowsText()).toContain(u.expense_type)
    for (const u of miss) expect(rowsText()).not.toContain(u.expense_type)
  })

  it('Transactions list shows the fund NAME, not its id', () => {
    mount(<Transactions />)
    expect(document.body.textContent).toContain(getFundName(MOCK_TRANSACTIONS[0].fund_id))
  })
})
