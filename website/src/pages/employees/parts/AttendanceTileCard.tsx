// parts/AttendanceTileCard.tsx — Clickable activity summary card (Present/Absent/No Record chips)
import { MOCK_USERS, formatDate } from '../../../api/mockData'
import type { Attendance as AttendanceRecord } from '../../../types'
import { IcoUsers, IcoClock, IcoPin } from './AttendanceIcons'
import type { Activity, ActivityKind } from './attendanceShared'
import { belongsToActivity } from './useAttendanceMarking'
import { activityDate } from './attendanceShared'

/* ── AttendanceTileCard — clickable activity summary card ────────── */
interface TileCardProps { activity: Activity; kind: ActivityKind; records: AttendanceRecord[]; onClick: () => void }
export default function AttendanceTileCard({ activity, kind, records, onClick }: TileCardProps) {
  const actRecords = records.filter(r => belongsToActivity(r, activity, kind))
  const present    = actRecords.filter(r => r.status === 'present' || r.status === 'late').length
  const absent     = actRecords.filter(r => r.status === 'absent' || r.status === 'excused').length   // excused shown as absent — matches the modal mapping
  const total      = MOCK_USERS.length
  const noRecord   = total - actRecords.length
  const accentHex  = kind === 'project' ? '#4B5EAA' : '#2E7D52'

  return (
    <div
      onClick={onClick}
      style={{ borderRadius: 12, overflow: 'hidden', border: `2px solid ${accentHex}30`, background: '#fff', cursor: 'pointer' as const, display: 'flex' as const, flexDirection: 'column' as const, transition: 'transform .15s, box-shadow .15s' }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 8px 20px ${accentHex}30` }}
      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}>
      <div style={{ height: 5, background: accentHex }} />
      <div style={{ padding: '14px 16px', flex: 1, display: 'flex' as const, flexDirection: 'column' as const, gap: 10 }}>
        {/* Title */}
        <div style={{ fontSize: 13.5, fontWeight: 700, lineHeight: 1.3, color: 'var(--text-primary)', overflow: 'hidden', display: '-webkit-box' as const, WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
          {activity.title}
        </div>
        {/* Meta */}
        <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 4 }}>
          {activityDate(activity) && (
            <div style={{ display: 'flex' as const, alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--text-muted)' }}>
              <IcoClock /> {formatDate(activityDate(activity))}
            </div>
          )}
          {activity.location && (
            <div style={{ display: 'flex' as const, alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--text-muted)' }}>
              <IcoPin /> {activity.location}
            </div>
          )}
        </div>
        {/* Summary chips */}
        <div style={{ display: 'flex' as const, gap: 6, flexWrap: 'wrap' }}>
          {present  > 0 && <span style={{ padding: '2px 9px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: '#f0faf4', color: '#2E7D52', border: '1px solid #2E7D5230' }}>Present: {present}</span>}
          {absent   > 0 && <span style={{ padding: '2px 9px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: '#fdf3f2', color: '#C0392B', border: '1px solid #C0392B30' }}>Absent: {absent}</span>}
          {noRecord > 0 && <span style={{ padding: '2px 9px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: '#F9FAFB', color: '#9CA3AF', border: '1px solid #E5E7EB' }}>No Record: {noRecord}</span>}
          {actRecords.length === 0 && <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>No records yet</span>}
        </div>
        <div style={{ display: 'flex' as const, alignItems: 'center', gap: 5, fontSize: 12, color: accentHex, fontWeight: 600, marginTop: 'auto', paddingTop: 8, borderTop: '1px solid var(--border-inner)' }}>
          <IcoUsers /> {actRecords.length}/{total} recorded — click to manage
        </div>
      </div>
    </div>
  )
}
