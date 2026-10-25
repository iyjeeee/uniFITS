// approvals.test.ts -- approval workflow helpers shared by projects and events (pending -> approved | rejected)
import { describe, it, expect } from 'vitest'
import { isApproved, approvedOnly, decide } from './approvals'

const item = (approval_status: 'pending' | 'approved' | 'rejected') => ({ id: approval_status, approval_status, reviewed_by: null, reviewed_at: null, rejection_reason: null })

describe('approvedOnly / isApproved', () => {
  it('keeps approved items; pending and rejected never count', () => {
    const all = [item('approved'), item('pending'), item('rejected')]
    expect(approvedOnly(all).map((i) => i.id)).toEqual(['approved'])
    expect(isApproved(item('approved'))).toBe(true)
    expect(isApproved(item('pending'))).toBe(false)
    expect(isApproved(item('rejected'))).toBe(false)
  })
})

describe('decide', () => {
  it('approving records who and when, and leaves no rejection reason', () => {
    const d = decide('approved', 'u1', new Date('2026-03-01T08:00:00Z'))
    expect(d).toEqual({ approval_status: 'approved', reviewed_by: 'u1', reviewed_at: '2026-03-01T08:00:00.000Z', rejection_reason: null })
  })
  it('rejecting records who and when (reason optional)', () => {
    expect(decide('rejected', 'u2', new Date('2026-03-01T08:00:00Z'), 'over budget'))
      .toEqual({ approval_status: 'rejected', reviewed_by: 'u2', reviewed_at: '2026-03-01T08:00:00.000Z', rejection_reason: 'over budget' })
    expect(decide('rejected', 'u2', new Date('2026-03-01T08:00:00Z')).rejection_reason).toBeNull()
  })
})
