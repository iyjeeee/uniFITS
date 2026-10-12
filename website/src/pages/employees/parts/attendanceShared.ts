// parts/attendanceShared.ts — Types and constants shared by the Attendance page pieces
import type { ReactNode } from 'react'
import type { AttendanceStatus, Project, AppEvent } from '../../../types'

/* ── Local types ─────────────────────────────────────────────────── */
export type Activity     = Project | AppEvent
export type ActivityKind = 'project' | 'event'
export type MarkStatus   = Extract<AttendanceStatus, 'present' | 'absent'>   // simplified 2-option UI
export interface MemberRow { num: number; userId: string; name: string; role: string; status: MarkStatus | null }
export type StatusChangeHandler = (userId: string, status: MarkStatus) => void   // fired when a member's status changes
export interface BulkAction { label: string; solidBg: string; icon: ReactNode; onClick: () => void }

// Date shown on a tile — projects use start_date, events use event_date
export const activityDate = (a: Activity): string => ('start_date' in a ? a.start_date : a.event_date)

/* ── Status config ───────────────────────────────────────────────── */
export const STATUS_COLOR: Record<string, string> = { present: '#2E7D52', absent: '#C0392B', 'no-record': '#9CA3AF' }
export const STATUS_BG: Record<string, string>    = { present: '#f0faf4', absent: '#fdf3f2', 'no-record': '#F9FAFB' }
