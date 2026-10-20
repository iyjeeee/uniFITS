// parts/eventsShared.ts — Constants, types and the title-keyword category rule shared by the Events page parts
import type { AppEvent } from '../../../types'

export const EVENT_PAGE_SIZE = 10
export const EVENT_CATEGORY_OPTIONS = ['all', 'Fundraising', 'Sports', 'Civic', 'Training', 'General']

// EventActionResult — feedback shown in the ResponseModal after edit/approve/reject/delete
export interface EventActionResult { variant: string; title: string; message: string }

// Derive event category from title keywords for the type filter (events have no real type field — see bug log)
export function getEventCategory(t: AppEvent): string {
  const title = (t.title || '').toLowerCase()
  if (title.includes('gala') || title.includes('fundrais') || title.includes('benefit')) return 'Fundraising'
  if (title.includes('sport') || title.includes('game') || title.includes('tournament')) return 'Sports'
  if (title.includes('parade') || title.includes('civic') || title.includes('independence') || title.includes('national')) return 'Civic'
  if (title.includes('seminar') || title.includes('training') || title.includes('workshop')) return 'Training'
  return 'General'
}
