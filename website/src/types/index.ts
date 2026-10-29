// types/index.ts — Central barrel: re-exports all UniFITS type definitions
// Usage: import type { User, Project, AppEvent, OrgConfig } from '../types'

export type { User, Role, Permission, UserStatus } from './user'
export type { OrgConfig } from './org'
export type { ApprovalStatus, ReviewFields } from './approval'
export type { Project, ProjectWithFunding, ProjectStatus, ProjectType } from './project'
export type { AppEvent, EventWithFunding, EventStatus } from './event'
export type { Fund, FundWithBalance, FundType, FundStatus, PaymentFrequency } from './fund'
export type {
  Transaction, Utility, UtilityWithBalance, PaymentMethodOption,
  EntryType, TransactionCategory, TransactionStatus,
  UtilityStatus,
} from './transaction'
export type { Attendance, AttendanceStatus, ActivityType } from './attendance'
export type { Announcement } from './announcement'
export type { AuditLog, BackupJob, AuditAction, BackupJobStatus, BackupTrigger } from './audit'
export type {
  BadgeVariant, ButtonVariant, ButtonSize, ModalVariant,
  Column, KpiMetric, BreakpointResult, ModalState,
  NavigateFn, RecordPageProps, NavItem, Toast, ToastVariant,
} from './ui'
