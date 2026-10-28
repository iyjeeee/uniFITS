// rolesById.test.tsx -- users point at their role BY ID (not by name): rename-safe, full role list in the edit form (B-21)
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { OrgProvider } from '../context/OrgContext'
import Employees from '../pages/employees/Employees'
import RolesPage from '../pages/employees/RolesPage'
import { getClubReportStats } from '../pages/reports/parts/clubReportStats'
import { MOCK_USERS, MOCK_ROLES, getRoleName } from '../api/mockData'

const mount = (ui: React.ReactElement) => render(<OrgProvider orgData={{}}>{ui}</OrgProvider>)
const clickButton = (name: RegExp) => fireEvent.click(screen.getAllByRole('button').filter((b) => name.test(b.textContent ?? '')).pop() as Element)
const roleSelect = () => screen.getByText('Role', { selector: 'label' }).parentElement?.querySelector('select') as HTMLSelectElement   // labels are not linked to controls yet (B-60)
const rows = () => Array.from(document.querySelectorAll('tbody tr')).map((r) => r.textContent ?? '')
const rowOf = (text: string) => rows().find((r) => r.includes(text)) ?? ''

describe('role data', () => {
  it('every user has a role_id that points at an existing role, and stores no role name', () => {
    for (const u of MOCK_USERS) { expect(MOCK_ROLES.some((r) => r.id === u.role_id)).toBe(true); expect('role' in u).toBe(false) }
  })
  it('getRoleName resolves an id (dash when none/unknown)', () => {
    expect(getRoleName('3')).toBe('Treasurer'); expect(getRoleName(null)).toBe('—'); expect(getRoleName('nope')).toBe('—')
  })
})

describe('renaming a role', () => {
  it('shows the new name on the Employees page and keeps the members on the Roles page', () => {
    const role = MOCK_ROLES.find((r) => r.id === '3')!; const was = role.name
    role.name = 'Finance Officer'
    try {
      mount(<Employees />)
      expect(rowOf('Pedro Reyes')).toContain('Finance Officer'); expect(rowOf('Pedro Reyes')).not.toContain('Treasurer')
      document.body.innerHTML = ''
      mount(<RolesPage />)
      expect(rowOf('Finance Officer')).toContain('Pedro Reyes')          // still assigned: members follow the role id
    } finally { role.name = was }
  })
})

describe('Employees page', () => {
  it('the role filter works on role ids and shows role NAMES', () => {
    mount(<Employees />)
    const filter = document.querySelectorAll('select')[0] as HTMLSelectElement
    expect(Array.from(filter.options).map((o) => [o.value, o.textContent])).toEqual(expect.arrayContaining([['3', 'Treasurer'], ['4', 'Member']]))
    fireEvent.change(filter, { target: { value: '3' } })
    expect(rows()).toHaveLength(1); expect(rows()[0]).toContain('Pedro Reyes')
  })

  it('B-21: the edit form offers EVERY role, and a user with a custom role keeps it when saved', () => {
    const u = MOCK_USERS.find((x) => x.id === '6')!; const was = u.role_id
    u.role_id = '5'                                                      // Project Lead: a role the old hard-coded list did not have
    try {
      mount(<Employees />)
      fireEvent.click(screen.getAllByText('Luz Ramos').find((el) => el.closest('tr')) as Element); clickButton(/Edit Employee/)
      expect(Array.from(roleSelect().options).map((o) => o.value)).toEqual(MOCK_ROLES.map((r) => r.id))
      expect(roleSelect().value).toBe('5')
      clickButton(/Save Employee/)
      expect(rowOf('Luz Ramos')).toContain('Project Lead')
    } finally { u.role_id = was }
  })

  it('changing the role in the edit form moves the user to that role', () => {
    mount(<Employees />)
    fireEvent.click(screen.getAllByText('Ana Lim').find((el) => el.closest('tr')) as Element); clickButton(/Edit Employee/)
    fireEvent.change(roleSelect(), { target: { value: '5' } }); clickButton(/Save Employee/)
    expect(rowOf('Ana Lim')).toContain('Project Lead')
  })
})

describe('officers vs members', () => {
  it('club report counts officers (any role except Member) and members', () => {
    const c = getClubReportStats()
    expect(c.officers).toBe(MOCK_USERS.filter((u) => getRoleName(u.role_id) !== 'Member').length)
    expect(c.officers).toBe(3); expect(c.regularMembers).toBe(3)
  })
})
