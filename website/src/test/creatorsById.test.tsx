// creatorsById.test.tsx -- creators/recorders are stored as user ids (null = System), names are looked up (B-06)
import { describe, it, expect } from 'vitest'
import { render, renderHook, act, screen, fireEvent } from '@testing-library/react'
import { OrgProvider } from '../context/OrgContext'
import Announcements from '../pages/announcements/Announcements'
import AuditLogs from '../pages/audit/AuditLogs'
import Funds from '../pages/funds/Funds'
import { useAnnouncements } from '../pages/announcements/parts/useAnnouncements'
import { MOCK_ANNOUNCEMENTS, MOCK_FUNDS, MOCK_AUDIT_LOGS, MOCK_BACKUP_JOBS, MOCK_USERS, getUserName, getActorName } from '../api/mockData'

const mount = (ui: React.ReactElement) => render(<OrgProvider orgData={{}}>{ui}</OrgProvider>)
const userIds = MOCK_USERS.map((u) => u.id)

describe('creator / actor data', () => {
  it('announcements and funds point at their creator by user id', () => {
    for (const a of MOCK_ANNOUNCEMENTS) expect(userIds).toContain(a.created_by)
    for (const f of MOCK_FUNDS)         expect(userIds).toContain(f.created_by)
  })
  it('audit logs and backup jobs hold a user id, or null for the System', () => {
    for (const l of MOCK_AUDIT_LOGS) { expect(l.user_id === null || userIds.includes(l.user_id)).toBe(true); expect('user' in l).toBe(false) }
    for (const j of MOCK_BACKUP_JOBS) expect(j.created_by === null || userIds.includes(j.created_by)).toBe(true)
    expect(MOCK_AUDIT_LOGS.some((l) => l.user_id === null)).toBe(true)        // there is at least one System entry
  })
  it('getActorName: a person\'s name, or System when there is no user', () => {
    expect(getActorName('1')).toBe('Juan Dela Cruz'); expect(getActorName(null)).toBe('System'); expect(getActorName('nope')).toBe('—')
  })
})

describe('names are looked up, so renaming a person updates every screen', () => {
  it('announcement author, fund manager and audit actor all follow the person\'s name', () => {
    const ann = MOCK_ANNOUNCEMENTS[0]; const person = MOCK_USERS.find((u) => u.id === ann.created_by)!; const was = person.full_name
    person.full_name = 'Renamed Person'
    try {
      mount(<Announcements />); expect(document.body.textContent).toContain('Renamed Person')
      document.body.innerHTML = ''
      const fund = MOCK_FUNDS.find((f) => f.created_by === person.id)
      if (fund) {
        mount(<Funds />); fireEvent.click(screen.getAllByText(fund.name)[0])
        expect(document.body.textContent).toContain('Renamed Person')
        document.body.innerHTML = ''
      }
      const log = MOCK_AUDIT_LOGS.find((l) => l.user_id === person.id)
      if (log) { mount(<AuditLogs />); expect(document.body.textContent).toContain('Renamed Person') }
    } finally { person.full_name = was }
  })
  it('the Audit page shows System for system entries', () => {
    mount(<AuditLogs />); expect(document.body.textContent).toContain('System')
  })
})

describe('new announcements', () => {
  it('record the logged-in user\'s id as the author (no more "Current User")', () => {
    const me = MOCK_USERS[2]
    const { result } = renderHook(() => useAnnouncements(me))
    act(() => result.current.setForm({ title: 'Meeting', content: 'Tomorrow 5pm', is_pinned: false }))
    act(() => result.current.handleAdd())
    const posted = result.current.allSorted.find((a) => a.title === 'Meeting')!
    expect(posted.created_by).toBe(me.id)
    expect(getUserName(posted.created_by)).toBe(me.full_name)
  })
})
