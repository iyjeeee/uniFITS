// parts/types.ts — Shared types for the Announcements page pieces
import type { Announcement, Project, AppEvent, ModalVariant } from '../../../types'

/* Merged project/event item — `kind` tells tiles, schedule rows and the detail modal which one it is */
export type TileItem      = (Project & { kind: 'project' }) | (AppEvent & { kind: 'event' })   // discriminated on kind
export type ScheduleEntry = TileItem & { name: string; date: string }   // ScheduleItem reads name/date/kind
export type CalProject    = Project & { isStart: boolean; isEnd: boolean; isMid: boolean }   // calendar pill position within a multi-day project
export interface DayActivities { projects: Project[]; events: AppEvent[] }
export type SelectedDay = DayActivities & { day: number; month: number; year: number }   // calendar day opened in the detail modal
export interface AnnResponse { variant: ModalVariant; title: string; message: string }   // feedback modal payload
export interface AnnouncementForm { title: string; content: string; is_pinned: boolean }
export type { Announcement }
