// parts/types.ts — Shared types for the Announcements page pieces
import type { Announcement, ProjectWithFunding, EventWithFunding, ModalVariant } from '../../../types'

/* Merged project/event item — `kind` tells tiles, schedule rows and the detail modal which one it is */
export type TileItem      = (ProjectWithFunding & { kind: 'project' }) | (EventWithFunding & { kind: 'event' })   // discriminated on kind; funding is derived
export type ScheduleEntry = TileItem & { name: string; date: string }   // ScheduleItem reads name/date/kind
export type CalProject    = ProjectWithFunding & { isStart: boolean; isEnd: boolean; isMid: boolean }   // calendar pill position within a multi-day project
export interface DayActivities { projects: ProjectWithFunding[]; events: EventWithFunding[] }
export type SelectedDay = DayActivities & { day: number; month: number; year: number }   // calendar day opened in the detail modal
export interface AnnResponse { variant: ModalVariant; title: string; message: string }   // feedback modal payload
export interface AnnouncementForm { title: string; content: string; is_pinned: boolean }
export type { Announcement }
