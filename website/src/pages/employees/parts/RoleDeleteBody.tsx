// parts/RoleDeleteBody.tsx — Delete confirmation body
import { MOCK_USERS } from '../../../api/mockData'
import type { Role, OrgConfig } from '../../../types'

/* ── Delete confirmation body ────────────────────────────────────── */
export default function DeleteBody({ role, org: _org }: { role: Role; org: OrgConfig }) {
  const assigned = MOCK_USERS.filter((u) => u.role === role.name)
  return (
    <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 16 }}>
      <div style={{ padding: '14px 16px', borderRadius: 10, background: '#fdecea', border: '1.5px solid rgba(192,57,43,.30)', display: 'flex' as const, gap: 10, alignItems: 'flex-start' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" strokeWidth="2.5" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 1 }}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        <div>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--danger)' }}>Warning: This action cannot be undone</div>
          <div style={{ fontSize: 12.5, color: 'var(--danger)', marginTop: 3, lineHeight: 1.5 }}>
            Deleting "{role.name}" will remove this role from {assigned.length > 0 ? `${assigned.length} assigned member${assigned.length !== 1 ? 's' : ''}` : 'the system'}.
          </div>
        </div>
      </div>
      {[['Role Name', role.name], ['Type', role.is_system ? 'System' : 'Custom'], ['Assigned Members', String(assigned.length)], ['Permissions', String(role.permissions.length)]].map(([k, v], idx) => (
        <div key={k} style={{ display: 'flex' as const, gap: 16, padding: '10px 14px', borderBottom: '1px solid var(--border-inner)', background: idx % 2 === 0 ? 'var(--neutral-light)' : '#fff' }}>
          <div style={{ width: 150, fontSize: 12.5, color: 'var(--text-muted)', flexShrink: 0, fontWeight: 500 }}>{k}</div>
          <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)' }}>{v}</div>
        </div>
      ))}
    </div>
  )
}
