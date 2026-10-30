// employeeReport.test.tsx — EmployeeReport: member selection, print/export flow, All Employees modal (incl. paging)
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { OrgProvider } from '../context/OrgContext'
import EmployeeReport from '../pages/reports/EmployeeReport'
import { MOCK_USERS, isOfficer } from '../api/mockData'
import type { User } from '../types'

const mount = () => render(<OrgProvider orgData={{}}><EmployeeReport /></OrgProvider>)
const btn = (re: RegExp) => { const b = screen.getAllByRole('button').filter(x => re.test((x.textContent ?? '') + (x.getAttribute('title') ?? ''))).pop(); if (!b) throw new Error('no button ' + re); return b }

describe('EmployeeReport', () => {
  it('selecting a member shows that member in the report', () => {
    mount()
    fireEvent.click(btn(/Maria Santos$/))
    expect(screen.getByText('Member Information')).toBeTruthy()
    expect(screen.getAllByText('Maria Santos').length).toBeGreaterThan(1)   // sidebar + report grid
  })
  it('Print calls window.print', () => {
    const print = vi.fn(); window.print = print
    mount(); fireEvent.click(btn(/Print/)); expect(print).toHaveBeenCalledTimes(1)
  })
  it('Export PDF asks for confirmation, then shows the result for the selected member', () => {
    mount(); fireEvent.click(btn(/Pedro Reyes$/))
    fireEvent.click(btn(/Export PDF/)); expect(screen.getByText('Export Employee Report PDF')).toBeTruthy()
    fireEvent.click(btn(/Cancel/)); expect(screen.queryByText('Export Employee Report PDF')).toBeNull()
    fireEvent.click(btn(/Export PDF/)); fireEvent.click(screen.getAllByRole('button').filter(b => /Export PDF/.test(b.textContent ?? '')).pop() as Element)
    expect(document.body.textContent).toContain('Report for Pedro Reyes has been generated')
  })
  it('All Employees modal lists officers and members with totals', () => {
    mount(); fireEvent.click(btn(/View All Employees/))
    expect(screen.getByText('All Employees List')).toBeTruthy()
    const officers = MOCK_USERS.filter(isOfficer).length
    expect(document.body.textContent).toContain(`${MOCK_USERS.length} total · ${officers} officers`)
    fireEvent.click(btn(/^Close$/)); expect(screen.queryByText('All Employees List')).toBeNull()
  })
  it('the modal pager appears only when a group has more than 8 rows, and changes the page', () => {
    const original = MOCK_USERS.length
    try {
      for (let i = 0; i < 10; i++) MOCK_USERS.push({ ...MOCK_USERS[3], id: 'x' + i, full_name: 'Extra Member ' + i, employee_number: 'EXM-' + i, role: 'Member' } as User)
      mount(); fireEvent.click(btn(/View All Employees/))
      const count = (name: string) => (document.body.textContent ?? '').split(name).length - 1   // the page's own people list also shows every name, so compare counts
      const m0 = count('Extra Member 0'), m9 = count('Extra Member 9')
      fireEvent.click(btn(/^2$/))   // people group -> page 2 ('Page X of Y' subtitle is gone, B-52)
      expect(count('Extra Member 9')).toBe(m9 + 1); expect(count('Extra Member 0')).toBe(m0 - 1)
    } finally { MOCK_USERS.length = original }   // restore the shared mock array for other tests
  })
})
