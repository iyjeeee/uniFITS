// parts/useAttendanceMarking.ts — Attendance records + modal marking state and handlers (mock data now; swap for API calls later)
import { useState } from 'react'
import { MOCK_ATTENDANCES, MOCK_USERS } from '../../../api/mockData'
import type { Attendance as AttendanceRecord } from '../../../types'
import type { Activity, ActivityKind, MarkStatus, MemberRow } from './attendanceShared'

export function useAttendanceMarking() {
  // Global attendance records (would come from API — using mock as seed)
  const [allRecords, setAllRecords] = useState<AttendanceRecord[]>(MOCK_ATTENDANCES)

  // Modal state — viewItem holds the full activity object (title is read via activity.title)
  const [viewItem,        setViewItem]        = useState<{ activity: Activity; kind: ActivityKind } | null>(null)
  const [localAttendance, setLocalAttendance] = useState<Record<string, MarkStatus>>({})   // { userId: 'present'|'absent' }

  // Open modal — pre-populate localAttendance from existing records for this activity
  function openModal(activity: Activity, kind: ActivityKind) {
    const init: Record<string, MarkStatus> = {}
    allRecords.filter(r => r.activity === activity.title).forEach(r => {
      // Map late to present, excused to absent for the simplified 2-option UI
      init[r.user_id] = (r.status === 'present' || r.status === 'late') ? 'present' : 'absent'
    })
    setLocalAttendance(init)
    setViewItem({ activity, kind })
  }

  // Update a single member's status
  function handleStatusChange(userId: string, newStatus: MarkStatus) {
    setLocalAttendance(prev => ({ ...prev, [userId]: newStatus }))
  }

  // Bulk-set the given members to a status
  function handleMarkAllNoRecord(members: MemberRow[], status: MarkStatus) {
    setLocalAttendance(prev => {
      const updated = { ...prev }
      members.forEach(m => { updated[m.userId] = status })
      return updated
    })
  }

  // Reset members back to "no record" — removes their status key entirely
  function handleResetAll(members: MemberRow[]) {
    setLocalAttendance(prev => {
      const updated = { ...prev }
      members.forEach(m => { delete updated[m.userId] })
      return updated
    })
  }

  // Save attendance — merge localAttendance back into allRecords
  function handleSave() {
    if (!viewItem) return
    const activityTitle = viewItem.activity.title

    // Remove existing records for this activity then add updated ones
    const base = allRecords.filter(r => r.activity !== activityTitle)
    const newRecords: AttendanceRecord[] = Object.entries(localAttendance).map(([userId, status]) => {
      const user = MOCK_USERS.find(u => u.id === userId)
      return {
        id:              `${activityTitle}-${userId}`,
        user_id:         userId,
        user_name:       user?.full_name || '',
        activity_type:   viewItem.kind,
        activity:        activityTitle,
        attendance_date: new Date().toISOString().split('T')[0],
        status,
        remarks:         null,
        recorded_by:     'Current User',
      }
    })
    setAllRecords([...base, ...newRecords])
    setViewItem(null)
  }

  return { allRecords, viewItem, setViewItem, localAttendance, openModal, handleStatusChange, handleMarkAllNoRecord, handleResetAll, handleSave }
}
