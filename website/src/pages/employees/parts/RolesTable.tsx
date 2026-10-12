// parts/RolesTable.tsx — Role definitions table (click a row to edit permissions)
import { Badge, Card } from '../../../components/ui'
import { IconBtn } from '../../../components/TableUtils'
import { MOCK_USERS } from '../../../api/mockData'
import type { Role } from '../../../types'
import { ALL_PERMISSIONS } from './rolesShared'
import { IcoDelete } from './RolesIcons'

export default function RolesTable({ roles, onOpen, onDelete }: { roles: Role[]; onOpen: (role: Role) => void; onDelete: (role: Role) => void }) {
  return (
    <Card>
      <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border-inner)', display: 'flex' as const, alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>Role Definitions</div>
          <div style={{ fontSize: 12.5, color: 'var(--text-muted)', marginTop: 2 }}>{roles.length} roles configured — click any row to customize permissions</div>
        </div>
      </div>
      <div style={{ overflowX: 'auto' as const }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: 'var(--table-head-bg)' }}>
              {['Role Name', 'Assigned To', 'Permissions', 'Type', 'Actions'].map((h) => (
                <th key={h} style={{ padding: '10px 16px', textAlign: 'left' as const, fontSize: 11, fontWeight: 600, color: 'var(--table-head-fg)', textTransform: 'uppercase' as const, letterSpacing: '.06em', borderBottom: '2px solid var(--border-table)', whiteSpace: 'nowrap' as const }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {roles.map(role => {
              const assigned = MOCK_USERS.filter((u) => u.role === role.name)
              return (
                <tr key={role.id}
                  style={{ borderBottom: '1px solid var(--border-inner)', cursor: 'pointer' as const, transition: 'background .12s' }}
                  onClick={() => onOpen(role)}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--neutral-light)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontWeight: 700, fontSize: 13.5 }}>{role.name}</div>
                    {role.description && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{role.description}</div>}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    {assigned.length === 0
                      ? <span style={{ color: 'var(--text-muted)', fontSize: 12.5 }}>Unassigned</span>
                      : <div style={{ display: 'flex' as const, flexWrap: 'wrap', gap: 4 }}>
                          {assigned.slice(0, 3).map((u) => <Badge key={u.id} variant="neutral">{u.full_name}</Badge>)}
                          {assigned.length > 3 && <Badge variant="neutral">+{assigned.length - 3}</Badge>}
                        </div>
                    }
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex' as const, flexWrap: 'wrap', gap: 4 }}>
                      {role.permissions.slice(0, 3).map((p) => {
                        const def = ALL_PERMISSIONS.find((d) => d.key === p)
                        return <Badge key={p} variant="accent" style={{ fontSize: 10 }}>{def?.label || p}</Badge>
                      })}
                      {role.permissions.length > 3 && <Badge variant="neutral" style={{ fontSize: 10 }}>+{role.permissions.length - 3}</Badge>}
                      {role.permissions.length === 0 && <span style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>No permissions</span>}
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <Badge variant={role.is_system ? 'info' : 'neutral'}>{role.is_system ? 'System' : 'Custom'}</Badge>
                  </td>
                  {/* Actions: Delete button for all roles including system */}
                  <td style={{ padding: '12px 16px' }} onClick={e => e.stopPropagation()}>
                    <IconBtn solidBg="var(--danger)" title="Delete role" onClick={() => onDelete(role)}><IcoDelete /></IconBtn>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
