// parts/AttendanceChart.tsx — Horizontal bars: attendance records per status (present/late/absent/excused)
import type { Attendance } from '../../../types'

export default function AttendanceChart({ data }: { data: Attendance[] }) {
  const statuses = ['present', 'late', 'absent', 'excused']
  const colors   = { present: '#2E7D52', late: '#D4860A', absent: '#C0392B', excused: '#2471A3' }
  const counts   = statuses.reduce((acc: Record<string,number>, s) => {
    acc[s] = data.filter((a) => a.status === s).length
    return acc
  }, {} as Record<string,number>)
  const total = data.length || 1

  return (
    <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 10 }}>
      {statuses.map((s) => {
        const pct = Math.round((counts[s] / total) * 100)
        return (
          <div key={s}>
            <div style={{ display: 'flex' as const, justifyContent: 'space-between', fontSize: 12, marginBottom: 3 }}>
              <span style={{ color: 'var(--text-secondary)', textTransform: 'capitalize' as const, fontWeight: 500 }}>{s}</span>
              <span style={{ color: (colors as Record<string,string>)[s], fontWeight: 700 }}>{counts[s]} ({pct}%)</span>
            </div>
            <div style={{ height: 7, background: 'var(--border)', borderRadius: 5, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${pct}%`, background: (colors as Record<string,string>)[s], borderRadius: 5 }} />
            </div>
          </div>
        )
      })}
    </div>
  )
}
