// types/attendance.ts — Attendance type definitions

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused'
export type ActivityType = 'event' | 'project'

// Attendance — matches MOCK_ATTENDANCES + backend attendances table
export interface Attendance {
  id: string
  user_id: string
  user_name: string
  activity_type: ActivityType
  activity: string            // event or project title string
  attendance_date: string     // 'YYYY-MM-DD'
  status: AttendanceStatus
  remarks: string | null      // e.g. '1 hour late', 'Excused — work conflict'
  recorded_by: string         // full name of recorder
}
