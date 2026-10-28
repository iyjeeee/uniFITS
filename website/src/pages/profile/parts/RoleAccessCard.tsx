// parts/RoleAccessCard.tsx — Current role and permission list
import { Card, CardHeader } from '../../../components/ui'
import { formatDate, getRoleName } from '../../../api/mockData'
import { IcoUser } from './ProfileIcons'
import type { User } from '../../../types'

export default function RoleAccessCard({ user }: { user: User }) {
  const roleName = getRoleName(user.role_id)   // the access summary below is chosen by role NAME until it is read from the role's permissions (RBAC phase)
  return (
    <Card>
      <CardHeader title="Role & Access" />
      <div style={{ padding: '14px 18px' }}>
        {/* Current role highlight */}
        <div style={{ padding: '14px 16px', background: 'var(--accent-light)', borderRadius: 10, marginBottom: 14, display: 'flex' as const, alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--accent)', display: 'flex' as const, alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
            <IcoUser />
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--accent)' }}>{roleName}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Since {formatDate(user.joined)}</div>
          </div>
        </div>

        {/* Permissions list based on role */}
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' as const, letterSpacing: '.06em', marginBottom: 8 }}>Access Level</div>
        <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 6 }}>
          {(roleName === 'President'
            ? ['View Dashboard', 'Manage Members', 'Manage Funds', 'Add Transactions', 'View Reports', 'View Audit Logs', 'Manage Settings', 'Backup & Restore']
            : roleName === 'Treasurer'
            ? ['View Dashboard', 'Manage Funds', 'Add Transactions', 'View Reports']
            : roleName === 'Secretary'
            ? ['View Dashboard', 'Manage Members', 'Add Projects', 'Add Events', 'View Reports']
            : ['View Dashboard', 'View Announcements']
          ).map(perm => (
            <div key={perm} style={{ display: 'flex' as const, alignItems: 'center', gap: 8, fontSize: 13 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
              <span style={{ color: 'var(--text-secondary)' }}>{perm}</span>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--border-inner)', fontSize: 12.5, color: 'var(--text-muted)' }}>
          No previous roles on record.
        </div>
      </div>
    </Card>
  )
}
