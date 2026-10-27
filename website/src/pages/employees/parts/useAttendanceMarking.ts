// parts/useAttendanceMarking.ts — Attendance records + modal marking state and handlers (mock data now; swap for API calls later)
import { useState } from 'react'
import { MOCK_ATTENDANCES } from '../../../api/mockData'
import type { Attendance as AttendanceRecord, User } from '../../../types'
import type { Activity, ActivityKind, MarkStatus, MemberRow } from './attendanceShared'

// belongs -- does this record belong to that activity? (matched by kind + id, never by title)
export const belongsToActivity = (r: AttendanceRecord, activity: Activity, kind: ActivityKind): boolean =>
  r.activity_type === kind && (kind === 'project' ? r.project_id === activity.id : r.event_id === activity.id)

export function useAttendanceMarking(currentUser: User | null = null) {
  // Global attendance records (would come from API — using mock as seed)
  const [allRecords, setAllRecords] = useState<AttendanceRecord[]>(MOCK_ATTENDANCES)

  // Modal state — viewItem holds the full activity object (title is read via activity.title)
  const [viewItem,        setViewItem]        = useState<{ activity: Activity; kind: ActivityKind } | null>(null)
  const [localAttendance, setLocalAttendance] = useState<Record<string, MarkStatus>>({})   // { userId: 'present'|'absent' }

  // Open modal — pre-populate localAttendance from existing records for this activity
  function openModal(activity: Activity, kind: ActivityKind) {
    const init: Record<string, MarkStatus> = {}
    allRecords.filter(r => belongsToActivity(r, activity, kind)).forEach(r => {
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
    const { activity, kind } = viewItem

    // Remove existing records for this activity then add updated ones
    const base = allRecords.filter(r => !belongsToActivity(r, activity, kind))
    const newRecords: AttendanceRecord[] = Object.entries(localAttendance).map(([userId, status]) => ({
      id:              `${kind}-${activity.id}-${userId}`,
      user_id:         userId,
      activity_type:   kind,
      project_id:      kind === 'project' ? activity.id : null,
      event_id:        kind === 'event' ? activity.id : null,
      attendance_date: new Date().toISOString().split('T')[0],
      status,
      remarks:         null,
      recorded_by:     currentUser?.id ?? '',   // the logged-in person (Attendance page passes it)
    }))
    setAllRecords([...base, ...newRecords])
    setViewItem(null)
  }

  return { allRecords, viewItem, setViewItem, localAttendance, openModal, handleStatusChange, handleMarkAllNoRecord, handleResetAll, handleSave }
}
