// parts/EmployeeListRow.tsx — One employee row (avatar, name, ID · department, role pill, status) inside the All Employees modal
import { StatusBadge, Avatar, TypePill } from '../../../components/ui'
import type { User } from '../../../types'

export default function EmployeeListRow({ u }: { u: User }) {
  return (
    <div style={{ display: 'flex' as const, alignItems: 'center', gap: 12, padding: '9px 14px', borderRadius: 10, background: 'var(--neutral-light)', border: '1px solid var(--border-card)', marginBottom: 5 }}>
      <Avatar name={u.full_name} size={32} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: 13.5 }}>{u.full_name}</div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 1 }}>{u.employee_number} · {u.department || '—'}</div>
      </div>
      <TypePill>{u.role}</TypePill>
      <StatusBadge status={u.status} />
    </div>
  )
}
