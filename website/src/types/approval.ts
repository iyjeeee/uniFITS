// types/approval.ts -- Approval workflow shared by projects and events (pending -> approved | rejected)
// Separate from the lifecycle status (upcoming/ongoing/completed/cancelled); mirrors the schema's approval columns

export type ApprovalStatus = 'pending' | 'approved' | 'rejected'

// ReviewFields -- who decided and when; all null while pending (DB CHECK: pending => no reviewer)
export interface ReviewFields {
  approval_status: ApprovalStatus
  reviewed_by: string | null        // FK to users.id of the reviewer
  reviewed_at: string | null        // ISO timestamp of the decision
  rejection_reason: string | null   // optional note when rejected
}
