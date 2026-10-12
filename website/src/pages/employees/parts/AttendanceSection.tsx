// parts/AttendanceSection.tsx — No Record / Present / Absent group with bulk actions
import type { MemberRow, BulkAction, StatusChangeHandler } from './attendanceShared'
import MemberCard from './AttendanceMemberCard'

/* ── Attendance Section — No Record / Present / Absent ───────────── */
interface SectionProps { title: string; members: MemberRow[]; color: string; bg: string; icon: React.ReactNode; bulkActions: BulkAction[] | null; gridCols: string; onStatusChange: StatusChangeHandler }
export default function AttendanceSection({ title, members, color, bg, icon, bulkActions, gridCols, onStatusChange }: SectionProps) {
  if (members.length === 0) return null

  return (
    <div>
      {/* Section header */}
      <div style={{
        display: 'flex' as const, alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 14px', borderRadius: 8, marginBottom: 12,
        background: bg, border: `1.5px solid ${color}40`,
        flexWrap: 'wrap', gap: 8,
      }}>
        <div style={{ display: 'flex' as const, alignItems: 'center', gap: 8 }}>
          <span style={{ color, display: 'flex' as const }}>{icon}</span>
          <span style={{ fontSize: 13, fontWeight: 700, color }}>
            {title} <span style={{ fontSize: 12, fontWeight: 600, opacity: .8 }}>({members.length})</span>
          </span>
        </div>
        {/* Bulk-action buttons shown for the "No Record" section */}
        {bulkActions && (
          <div style={{ display: 'flex' as const, gap: 6 }}>
            {bulkActions.map(btn => (
              <button key={btn.label} onClick={btn.onClick}
                style={{ display: 'inline-flex' as const, alignItems: 'center', gap: 5, padding: '5px 12px', borderRadius: 7, border: 'none', background: btn.solidBg, color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer' as const, fontFamily: 'var(--font-body)' }}>
                {btn.icon} {btn.label}
              </button>
            ))}
          </div>
        )}
      </div>
      {/* Member card grid */}
      <div style={{ display: 'grid' as const, gridTemplateColumns: gridCols, gap: 10 }}>
        {members.map(m => (
          <MemberCard key={m.userId} member={m} num={m.num} onStatusChange={onStatusChange} />
        ))}
      </div>
    </div>
  )
}
