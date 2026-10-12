// parts/AllAttendanceModal.tsx — Full attendance history modal
import useBreakpoint from '../../../hooks/useBreakpoint'
import { StatusBadge, InfoModal } from '../../../components/ui'
import { formatDate } from '../../../api/mockData'
import type { User, Attendance } from '../../../types'
import type { AttStats } from './profileShared'

export default function AllAttendanceModal({ user, userAttendance, attStats, open, onClose }: { user: User; userAttendance: Attendance[]; attStats: AttStats; open: boolean; onClose: () => void }) {
  const { isMobile } = useBreakpoint()
  return (
    <InfoModal
      open={open}
      onClose={() => onClose()}
      title="All Attendance Records"
      subtitle={`${userAttendance.length} total records for ${user.full_name}`}
      accentColor="var(--info)"
      footer={
        <button onClick={() => onClose()} style={{ padding: '10px 28px', borderRadius: 9, border: '1.5px solid var(--border-card)', background: 'var(--neutral-light)', color: 'var(--text-primary)', fontSize: 14, fontWeight: 600, cursor: 'pointer' as const, fontFamily: 'var(--font-body)' }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{marginRight:4}}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> Close
        </button>
      }>
      <div>
        {/* Stats summary row */}
        <div style={{ display: 'grid' as const, gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4, 1fr)', gap: 10, marginBottom: 18 }}>
          {[
            { label: 'Present', value: attStats.present, color: '#2E7D52', bg: '#f0faf4' },
            { label: 'Late',    value: attStats.late,    color: '#D4860A', bg: '#fffbf0' },
            { label: 'Absent',  value: attStats.absent,  color: '#C0392B', bg: '#fdf3f2' },
            { label: 'Excused', value: attStats.excused, color: '#2471A3', bg: '#f0f7fd' },
          ].map((s) => (
            <div key={s.label} style={{ padding: '12px', textAlign: 'center' as const, background: s.bg, borderRadius: 10, border: '1px solid ' + s.color + '30' }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 12, color: s.color, fontWeight: 600, marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
        {/* Full records list */}
        <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 2 }}>
          {userAttendance.length === 0
            ? <div style={{ textAlign: 'center' as const, padding: '32px', color: 'var(--text-muted)', fontSize: 13 }}>No attendance records found.</div>
            : userAttendance.map((a) => (
                <div key={a.id} style={{ display: 'flex' as const, alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: 10, background: 'var(--neutral-light)', border: '1px solid var(--border-card)', marginBottom: 4 }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13.5 }}>{a.activity}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                      {formatDate(a.attendance_date)} · Recorded by {a.recorded_by}
                    </div>
                    {a.remarks && <div style={{ fontSize: 11.5, color: 'var(--warning)', marginTop: 2, fontStyle: 'italic' }}>{a.remarks}</div>}
                  </div>
                  <StatusBadge status={a.status} />
                </div>
              ))
          }
        </div>
      </div>
    </InfoModal>
  )
}
