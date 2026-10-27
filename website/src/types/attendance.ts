// types/attendance.ts — Attendance type definitions

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused'
export type ActivityType = 'event' | 'project'

// Attendance — matches MOCK_ATTENDANCES + backend attendances table
export interface Attendance {
  id: string
  user_id: string             // FK to users.id -- name via getUserName()
  activity_type: ActivityType
  project_id: string | null   // FK to projects.id (set when activity_type is 'project') -- title via getActivityTitle()
  event_id: string | null     // FK to events.id (set when activity_type is 'event')
  attendance_date: string     // 'YYYY-MM-DD'
  status: AttendanceStatus
  remarks: string | null      // e.g. '1 hour late', 'Excused -- work conflict'
  recorded_by: string         // FK to users.id of whoever recorded it
}
