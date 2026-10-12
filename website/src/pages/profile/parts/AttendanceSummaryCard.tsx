// parts/AttendanceSummaryCard.tsx — Attendance stat pills and recent records
import { useOrg } from '../../../context/OrgContext'
import useBreakpoint from '../../../hooks/useBreakpoint'
import { StatusBadge, Card, CardHeader } from '../../../components/ui'
import { formatDate } from '../../../api/mockData'
import type { Attendance } from '../../../types'
import type { AttStats } from './profileShared'

export default function AttendanceSummaryCard({ userAttendance, attStats, attTotal, onViewAll }: { userAttendance: Attendance[]; attStats: AttStats; attTotal: number; onViewAll: () => void }) {
  const org = useOrg()
  const { isMobile } = useBreakpoint()
  return (
    <Card style={{ display:'flex', flexDirection:'column' }}>
      <CardHeader title={`${org.attendance_label} Summary`} subtitle={`${attTotal} total records`} />
      {/* Stat pills */}
      <div style={{ display: 'grid' as const, gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4, 1fr)', gap: 0, borderBottom: '1px solid var(--border-inner)' }}>
        {[
          { label: 'Present', value: attStats.present, color: '#2E7D52', bg: '#f0faf4' },
          { label: 'Late',    value: attStats.late,    color: '#D4860A', bg: '#fffbf0' },
          { label: 'Absent',  value: attStats.absent,  color: '#C0392B', bg: '#fdf3f2' },
          { label: 'Excused', value: attStats.excused, color: '#2471A3', bg: '#f0f7fd' },
        ].map((s) => (
          <div key={s.label} style={{ padding: '12px 0', textAlign: 'center' as const, background: s.bg, borderRight: '1px solid var(--border-inner)' }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: s.color, fontWeight: 600, marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ padding: '6px 0', flex: 1 }}>
        {userAttendance.length === 0
          ? <div style={{ padding: '20px', textAlign: 'center' as const, color: 'var(--text-muted)', fontSize: 13 }}>No attendance records found.</div>
          : userAttendance.slice(0, 3).map((a) => (
              <div key={a.id} style={{ display: 'flex' as const, alignItems: 'center', justifyContent: 'space-between', padding: '8px 18px', borderBottom: '1px solid var(--border-inner)', fontSize: 13 }}>
                <div>
                  <div style={{ fontWeight: 500 }}>{a.activity}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{formatDate(a.attendance_date)}</div>
                </div>
                <StatusBadge status={a.status} />
              </div>
            ))
        }
      </div>
      {userAttendance.length > 0 && (
        <div style={{ padding: '10px 16px', borderTop: '1px solid var(--border-inner)', textAlign: 'center' as const }}>
          <button
            onClick={() => onViewAll()}
            style={{ padding: '7px 22px', borderRadius: 8, border: '1.5px solid var(--info)', background: 'var(--info)', color: '#fff', fontSize: 12.5, fontWeight: 600, cursor: 'pointer' as const, fontFamily: 'var(--font-body)' }}>
            View All Attended ({userAttendance.length})
          </button>
        </div>
      )}
    </Card>
  )
}
