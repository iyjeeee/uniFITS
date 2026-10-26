// parts/eventsShared.ts -- Constants and the action-result type shared by the Events page parts
import { EVENT_TYPES } from '../../../constants/eventTypes'

export const EVENT_PAGE_SIZE = 10
export const EVENT_TYPE_FILTER_OPTIONS = ['all', ...EVENT_TYPES]   // type filter: All + the listed types

// EventActionResult — feedback shown in the ResponseModal after edit/approve/reject/delete
export interface EventActionResult { variant: string; title: string; message: string }
