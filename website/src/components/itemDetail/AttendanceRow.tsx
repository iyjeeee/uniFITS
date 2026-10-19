// itemDetail/AttendanceRow.tsx — One attendance line (#, member, colored status pill)
import { ATT_COLOR } from './itemDetailShared'

export default function AttendanceRow({ member, status, idx }: { member: string; status: string; idx: number }) {
  const c = ATT_COLOR[status] ?? '#9CA3AF'
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', borderRadius: 8, background: idx % 2 === 0 ? 'var(--neutral-light)' : '#fff', border: '1px solid var(--border-inner)', gap: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', flexShrink: 0 }}>#{idx + 1}</span>
        <span style={{ fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{member}</span>
      </div>
      <span style={{ padding: '2px 9px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: c, color: '#fff', flexShrink: 0 }}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    </div>
  )
}
