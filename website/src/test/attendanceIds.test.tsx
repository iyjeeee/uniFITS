// attendanceIds.test.tsx -- attendance points at its project/event BY ID (not title) and at people by id (B-49)
import { describe, it, expect, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useAttendanceMarking } from '../pages/employees/parts/useAttendanceMarking'
import { getItemDetailData } from '../components/itemDetail/itemDetailData'
import { MOCK_ATTENDANCES, MOCK_PROJECTS, MOCK_EVENTS, MOCK_USERS, getUserName, getActivityTitle, getEventsWithFunding, getProjectsWithFunding } from '../api/mockData'

const admin = MOCK_USERS[0]

describe('attendance data', () => {
  it('each record has exactly one activity id that matches its type and points at an approved project/event', () => {
    expect(MOCK_ATTENDANCES.length).toBeGreaterThan(0)
    for (const r of MOCK_ATTENDANCES) {
      expect(r.activity_type === 'project' ? [r.project_id, r.event_id] : [r.event_id, r.project_id]).toEqual([expect.any(String), null])
      const owner = r.activity_type === 'project' ? MOCK_PROJECTS.find((p) => p.id === r.project_id) : MOCK_EVENTS.find((e) => e.id === r.event_id)
      expect(owner?.approval_status).toBe('approved')
      expect(MOCK_USERS.some((u) => u.id === r.user_id)).toBe(true)
      expect(MOCK_USERS.some((u) => u.id === r.recorded_by)).toBe(true)   // recorder is a person id, not a name
      expect('activity' in r).toBe(false); expect('user_name' in r).toBe(false)
    }
  })
  it('getUserName / getActivityTitle resolve ids (dash when unknown)', () => {
    expect(getUserName('1')).toBe('Juan Dela Cruz'); expect(getUserName(null)).toBe('—'); expect(getUserName('nope')).toBe('—')
    expect(getActivityTitle(MOCK_ATTENDANCES[0])).toBe('Christmas Party 2024')
    expect(getActivityTitle({ project_id: null, event_id: null })).toBe('—')
  })
})

describe('B-49: matched by id, not by title', () => {
  const original = MOCK_EVENTS.find((e) => e.id === '4')!
  afterEach(() => { original.title = 'Christmas Party 2024' })
  it('a project with the SAME title as an event does not inherit the event\'s attendance', () => {
    const twin = { ...getProjectsWithFunding()[0], id: 'twin', title: 'Christmas Party 2024' }
    expect(getItemDetailData(twin, 'project').attendanceRecords).toHaveLength(0)
    expect(getItemDetailData(getEventsWithFunding().find((e) => e.id === '4')!, 'event').attendanceRecords).toHaveLength(4)
  })
  it('renaming an activity keeps its attendance', () => {
    original.title = 'Renamed Christmas Party'
    const ev = getEventsWithFunding().find((e) => e.id === '4')!
    expect(getItemDetailData(ev, 'event').attendanceRecords).toHaveLength(4)
    expect(getActivityTitle(MOCK_ATTENDANCES[0])).toBe('Renamed Christmas Party')
  })
})

describe('marking attendance', () => {
  it('saves records with ids and the logged-in recorder; other activities (even with the same id) are untouched', () => {
    const { result } = renderHook(() => useAttendanceMarking(admin))
    const project4 = MOCK_PROJECTS.find((p) => p.id === '4')!       // project 4 and event 4 share the id '4'
    const event4Before = result.current.allRecords.filter((r) => r.event_id === '4')
    expect(event4Before).toHaveLength(4)
    act(() => result.current.openModal(project4, 'project'))
    act(() => result.current.handleStatusChange('1', 'present'))
    act(() => result.current.handleStatusChange('2', 'absent'))
    act(() => result.current.handleSave())
    const mine = result.current.allRecords.filter((r) => r.project_id === '4')
    // existing marks (users 3 and 5) are kept, the two new ones are added, nothing is duplicated
    expect(Object.fromEntries(mine.map((r) => [r.user_id, r.status]))).toEqual({ '1': 'present', '2': 'absent', '3': 'present', '5': 'absent' })
    expect(mine).toHaveLength(4)
    for (const r of mine) { expect(r.event_id).toBeNull(); expect(r.activity_type).toBe('project'); expect(r.recorded_by).toBe(admin.id) }
    expect(result.current.allRecords.filter((r) => r.event_id === '4')).toEqual(event4Before)
  })
})
