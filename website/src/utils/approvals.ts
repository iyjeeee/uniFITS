// utils/approvals.ts -- approval workflow helpers shared by projects and events (mirrors schema.sql)
import type { ApprovalStatus, ReviewFields } from '../types'

/* isApproved -- only approved items count in KPIs, reports, attendance and transaction targets */
export const isApproved = (x: { approval_status: ApprovalStatus }): boolean => x.approval_status === 'approved'

/* approvedOnly -- keep approved items; pending and rejected never count */
export function approvedOnly<T extends { approval_status: ApprovalStatus }>(items: T[]): T[] {
  return items.filter(isApproved)
}

/* decide -- the review record for an approve/reject decision (who, when, optional reason) */
export function decide(decision: 'approved' | 'rejected', reviewerId: string | null, at: Date = new Date(), reason: string | null = null): ReviewFields {
  return { approval_status: decision, reviewed_by: reviewerId, reviewed_at: at.toISOString(), rejection_reason: decision === 'rejected' ? reason : null }
}
