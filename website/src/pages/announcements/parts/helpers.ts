// parts/helpers.ts — Pure data builders and constants for the Announcements page (no React)
import { getProjectsWithFunding, getEventsWithFunding } from '../../../api/mockData'
import { approvedOnly } from '../../../utils/approvals'
import { parseDate } from '../../../utils/formatters'
import type { TileItem, ScheduleEntry, DayActivities } from './types'

export const TILES_PER_PAGE = 8   // activity tiles per page in the overview card
export const MODAL_PER_PAGE = 8   // rows per page in the "View All" modals

/* Fixed type colors — project = brand blue, event = success green, for easy identification */
export const KIND_COLOR: Record<TileItem['kind'], string> = { project: '#4B5EAA', event: '#2E7D52' }
export function tileColor(_id: string, kind: TileItem['kind']): string { return KIND_COLOR[kind] || '#4B5EAA' }

/** buildTiles — every project + event, tagged with its kind */
export function buildTiles(): TileItem[] {
  return [
    ...approvedOnly(getProjectsWithFunding()).map((p): TileItem => ({ ...p, kind: 'project' })),
    ...approvedOnly(getEventsWithFunding()).map((e): TileItem => ({ ...e, kind: 'event' })),
  ]
}

/** buildSchedule — upcoming/ongoing items sorted by date, shaped for ScheduleItem */
export function buildSchedule(tiles: TileItem[]): ScheduleEntry[] {
  return tiles
    .filter(a => a.status === 'upcoming' || a.status === 'ongoing')
    .map((a): ScheduleEntry => ({ ...a, name: a.title, date: 'start_date' in a ? a.start_date : a.event_date }))
    .sort((a, b) => parseDate(a.date).getTime() - parseDate(b.date).getTime())
}

/** getActivitiesOnDay — projects starting/ending and events happening on a calendar day (month is zero-based) */
export function getActivitiesOnDay(year: number, month: number, day: number): DayActivities {
  const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  return {
    projects: approvedOnly(getProjectsWithFunding()).filter(p => p.start_date === dateStr || p.end_date === dateStr),
    events:   approvedOnly(getEventsWithFunding()).filter(e => e.event_date === dateStr),
  }
}
