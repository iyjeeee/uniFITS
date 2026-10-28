// parts/AttendanceDetailContent.tsx — Body of the marking modal (counts + three sections)
import { MOCK_USERS, getRoleName } from '../../../api/mockData'
import { IcoProject, IcoEvent, IcoCheck, IcoX } from './AttendanceIcons'
import type { Activity, ActivityKind, MarkStatus, MemberRow, StatusChangeHandler } from './attendanceShared'
import AttendanceSection from './AttendanceSection'

/* ── Attendance Detail Modal content ────────────────────────────── */
interface DetailProps {
  activity: Activity; kind: ActivityKind; localAttendance: Record<string, MarkStatus>
  onStatusChange: StatusChangeHandler
  onMarkAllNoRecord: (members: MemberRow[], status: MarkStatus) => void
  onResetAll: (members: MemberRow[]) => void
  isMobile: boolean; isTablet: boolean
}
export default function AttendanceDetailContent({ activity, kind, localAttendance, onStatusChange, onMarkAllNoRecord, onResetAll, isMobile, isTablet }: DetailProps) {
  const accentC   = kind === 'project' ? 'var(--accent)' : 'var(--success)'
  const bgC       = kind === 'project' ? 'var(--accent-light)' : 'var(--success-light)'
  const gridCols  = isMobile ? 'repeat(2,1fr)' : isTablet ? 'repeat(3,1fr)' : 'repeat(4,1fr)'

  // Build full member list with numbered positions
  const memberList: MemberRow[] = MOCK_USERS.map((user, idx) => ({
    num:    idx + 1,
    userId: user.id,
    name:   user.full_name,
    role:   getRoleName(user.role_id),
    status: localAttendance[user.id] || null,
  }))

  // Split into the 3 sections
  const noRecord = memberList.filter(m => !m.status)
  const present  = memberList.filter(m => m.status === 'present')
  const absent   = memberList.filter(m => m.status === 'absent')

  const presentCount = present.length
  const absentCount  = absent.length
  const noRecCount   = noRecord.length

  return (
    <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 22 }}>

      {/* Activity hero */}
      <div style={{ padding: '14px 18px', borderRadius: 12, background: bgC, border: `1.5px solid ${accentC}30` }}>
        <div style={{ display: 'flex' as const, alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <span style={{ color: accentC }}>{kind === 'project' ? <IcoProject /> : <IcoEvent />}</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: accentC, textTransform: 'uppercase' as const, letterSpacing: '.06em' }}>
            {kind === 'project' ? 'Project' : 'Event'}
          </span>
        </div>
        <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)' }}>{activity.title}</div>
      </div>

      {/* Summary stat row */}
      <div style={{ display: 'grid' as const, gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
        {([
          ['No Record', noRecCount,   '#9CA3AF', '#F9FAFB'],
          ['Present',   presentCount, '#2E7D52', '#f0faf4'],
          ['Absent',    absentCount,  '#C0392B', '#fdf3f2'],
        ] as [string, number, string, string][]).map(([label, count, color, bg]) => (
          <div key={label} style={{ padding: '10px 12px', borderRadius: 10, background: bg, border: `1.5px solid ${color}30`, textAlign: 'center' as const }}>
            <div style={{ fontSize: 22, fontWeight: 800, color, lineHeight: 1 }}>{count}</div>
            <div style={{ fontSize: 11.5, color, fontWeight: 600, marginTop: 3 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* ── Section 1: No Record — Mark All Present + Mark All Absent + Reset All ── */}
      <AttendanceSection
        title="No Record"
        members={noRecord}
        color="#9CA3AF"
        bg="#F9FAFB"
        icon={<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>}
        bulkActions={noRecord.length > 0 ? [
          { label: 'Mark All Present', solidBg: '#2E7D52', icon: <IcoCheck />, onClick: () => onMarkAllNoRecord(noRecord, 'present') },
          { label: 'Mark All Absent',  solidBg: '#C0392B', icon: <IcoX />,     onClick: () => onMarkAllNoRecord(noRecord, 'absent')  },
        ] : null}
        gridCols={gridCols}
        onStatusChange={onStatusChange}
      />

      {/* ── Section 2: Present — Mark All Absent + Mark All No Record ── */}
      <AttendanceSection
        title="Present"
        members={present}
        color="#2E7D52"
        bg="#f0faf4"
        icon={<IcoCheck />}
        bulkActions={present.length > 0 ? [
          { label: 'Mark All No Record', solidBg: '#9CA3AF', icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>, onClick: () => onResetAll(present) },
          { label: 'Mark All Absent',    solidBg: '#C0392B', icon: <IcoX />, onClick: () => onMarkAllNoRecord(present, 'absent') },
        ] : null}
        gridCols={gridCols}
        onStatusChange={onStatusChange}
      />

      {/* ── Section 3: Absent — Mark All No Record + Mark All Present ── */}
      <AttendanceSection
        title="Absent"
        members={absent}
        color="#C0392B"
        bg="#fdf3f2"
        icon={<IcoX />}
        bulkActions={absent.length > 0 ? [
          { label: 'Mark All No Record', solidBg: '#9CA3AF', icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>, onClick: () => onResetAll(absent) },
          { label: 'Mark All Present',   solidBg: '#2E7D52', icon: <IcoCheck />, onClick: () => onMarkAllNoRecord(absent, 'present') },
        ] : null}
        gridCols={gridCols}
        onStatusChange={onStatusChange}
      />
    </div>
  )
}
