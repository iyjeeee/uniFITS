// test/announcements.parts.test.tsx — Announcements page pieces: modal pagination + pure helpers
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import AllAnnouncementsModal from '../pages/announcements/parts/AllAnnouncementsModal'
import ScheduleModal from '../pages/announcements/parts/ScheduleModal'
import { buildTiles, buildSchedule, getActivitiesOnDay, MODAL_PER_PAGE } from '../pages/announcements/parts/helpers'
import { parseDate } from '../utils/formatters'
import type { Announcement } from '../types'

// 20 unpinned announcements, newest first — "Post 01" is the newest
const posts: Announcement[] = Array.from({ length: 20 }, (_, i) => ({
  id: String(i + 1), title: `Post ${String(i + 1).padStart(2, '0')}`, content: 'x', is_pinned: false,
  created_by: 'Tester', created_at: new Date(2026, 0, 30 - i).toISOString(),
}))

describe('AllAnnouncementsModal pagination', () => {
  const mount = (page: number) => render(
    <AllAnnouncementsModal open onClose={() => {}} announcements={posts} page={page} onPageChange={() => {}} onSelect={() => {}} />,
  )

  it('page 1 shows only the first page of posts', () => {
    mount(1)
    expect(document.body.textContent).toContain('Post 01')
    expect(document.body.textContent).toContain('Post 08')
    expect(document.body.textContent).not.toContain('Post 09')
  })

  it('page 2 shows only page 2 — not page 1 again (regression)', () => {
    mount(2)
    expect(document.body.textContent).toContain('Post 09')
    expect(document.body.textContent).toContain('Post 16')
    expect(document.body.textContent).not.toContain('Post 01')
    expect(document.body.textContent).not.toContain('Post 17')
  })
})

describe('ScheduleModal', () => {
  it('subtitle states the real page size', () => {
    render(<ScheduleModal open onClose={() => {}} items={buildSchedule(buildTiles())} page={1} onPageChange={() => {}} />)
    expect(document.body.textContent).toContain(`${MODAL_PER_PAGE} per page`)
  })
})

describe('announcement helpers', () => {
  it('buildTiles tags every item with its kind', () => {
    const tiles = buildTiles()
    expect(tiles.some(t => t.kind === 'project')).toBe(true)
    expect(tiles.some(t => t.kind === 'event')).toBe(true)
  })

  it('buildSchedule keeps only upcoming/ongoing items, sorted by date', () => {
    const sched = buildSchedule(buildTiles())
    expect(sched.length).toBeGreaterThan(0)
    expect(sched.every(s => s.status === 'upcoming' || s.status === 'ongoing')).toBe(true)
    const times = sched.map(s => parseDate(s.date).getTime())
    expect(times).toEqual([...times].sort((a, b) => a - b))
  })

  it('getActivitiesOnDay finds a project on its start and end dates (month is zero-based)', () => {
    expect(getActivitiesOnDay(2026, 2, 15).projects.map(p => p.title)).toContain('Medical Mission 2026')   // start 2026-03-15
    expect(getActivitiesOnDay(2026, 2, 16).projects.map(p => p.title)).toContain('Medical Mission 2026')   // end   2026-03-16
    expect(getActivitiesOnDay(2026, 2, 17).projects.map(p => p.title)).not.toContain('Medical Mission 2026')
  })
})
