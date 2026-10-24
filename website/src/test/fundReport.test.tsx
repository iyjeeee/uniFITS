// fundReport.test.tsx — FundReport: contributions data (pure), KPI strip, sections, detail modal, export flow
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { OrgProvider } from '../context/OrgContext'
import FundReport from '../pages/reports/FundReport'
import { getFundContributions } from '../pages/reports/parts/fundReportData'
import { MOCK_FUNDS, MOCK_USERS, MOCK_TRANSACTIONS } from '../api/mockData'

const mount = () => render(<OrgProvider orgData={{}}><FundReport /></OrgProvider>)
const btn = (re: RegExp) => { const b = screen.getAllByRole('button').filter(x => re.test(x.textContent ?? '')).pop(); if (!b) throw new Error('no button ' + re); return b }
const open = (name: string) => fireEvent.click(screen.getAllByText(name)[0])

describe('getFundContributions', () => {
  it('every fund: one entry per user, sorted by total, and the totals add up', () => {
    MOCK_FUNDS.forEach(f => {
      const d = getFundContributions(f)
      expect(d.memberContribs.length).toBe(MOCK_USERS.length)
      const totals = d.memberContribs.map(m => m.total); expect(totals).toEqual([...totals].sort((a, b) => b - a))
      expect(d.grandTotal).toBe(totals.reduce((a, b) => a + b, 0))
      expect(d.contributors.length + d.nonContribs.length).toBe(MOCK_USERS.length)
      expect(d.contributors.every(m => m.total > 0) && d.nonContribs.every(m => m.total === 0)).toBe(true)
    })
  })
  it('only counts non-expense transactions of that fund (by name)', () => {
    const f = MOCK_FUNDS[0]; const d = getFundContributions(f)
    const expected = MOCK_TRANSACTIONS.filter(t => t.fund_id === f.id && t.entry_type !== 'expense' && t.user_id).reduce((s, t) => s + t.amount, 0)
    expect(d.grandTotal).toBe(expected)
  })
})

describe('FundReport', () => {
  it('KPI tiles: total, active, inactive, overall balance', () => {
    mount()
    const strip = document.querySelector('div[style*="repeat"]') as HTMLElement
    const kpi = (label: string) => Array.from(strip.querySelectorAll('div')).find(d => d.textContent === label)?.nextElementSibling?.textContent
    expect(kpi('Total Funds')).toBe(String(MOCK_FUNDS.length))
    expect(kpi('Active')).toBe(String(MOCK_FUNDS.filter(f => f.status === 'active').length))
    expect(kpi('Inactive')).toBe(String(MOCK_FUNDS.filter(f => f.status !== 'active').length))
    expect(kpi('Overall Balance')).toContain('₱')
  })
  it('shows a required and an optional section with their fund counts', () => {
    mount()
    const req = MOCK_FUNDS.filter(f => f.is_required).length; const opt = MOCK_FUNDS.length - req
    expect(screen.getByText('Funds Required for All Employees')).toBeTruthy(); expect(screen.getByText('Funds NOT Required for All Employees')).toBeTruthy()
    expect(document.body.textContent).toContain(`${req} fund${req !== 1 ? 's' : ''} — click any tile`); expect(document.body.textContent).toContain(`${opt} fund${opt !== 1 ? 's' : ''} — click any tile`)
  })
  it('clicking a tile opens its detail with the contribution header; Close hides it', () => {
    mount(); const f = MOCK_FUNDS[0]; open(f.name)
    expect(document.body.textContent).toContain('Employee Contributions'); expect(document.body.textContent).toMatch(/have contributed/)
    fireEvent.click(btn(/^\s*Close/)); expect(document.body.textContent).not.toContain('have contributed')
  })
  it('Export PDF from the detail closes it, asks to confirm, and ends with feedback; Cancel aborts', () => {
    mount(); open(MOCK_FUNDS[1].name); fireEvent.click(btn(/Export PDF/))
    expect(screen.getByText('Export Fund Report PDF')).toBeTruthy(); expect(document.body.textContent).not.toContain('have contributed')
    fireEvent.click(btn(/Cancel/)); expect(screen.queryByText('Export Fund Report PDF')).toBeNull()
    open(MOCK_FUNDS[1].name); fireEvent.click(btn(/Export PDF/)); fireEvent.click(screen.getAllByRole('button').filter(b => /Export PDF/.test(b.textContent ?? '')).pop() as Element)
    expect(screen.getByText('PDF Exported')).toBeTruthy()
  })
})
