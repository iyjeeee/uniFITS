// parts/RolesHeaderCard.tsx — Default-permissions banner with the Add Role button
import { useOrg } from '../../../context/OrgContext'
import { Card } from '../../../components/ui'
import { BtnPlus, IcoShield } from './RolesIcons'

export default function RolesHeaderCard({ onAdd }: { onAdd: () => void }) {
  const org = useOrg()
  return (
    <Card style={{ padding: '14px 20px', background: 'var(--info-light)', border: '1.5px solid rgba(36,113,163,.2)' }}>
      <div style={{ display: 'flex' as const, alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex' as const, alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(36,113,163,.15)', display: 'flex' as const, alignItems: 'center', justifyContent: 'center', color: 'var(--info)', flexShrink: 0 }}>
            <IcoShield />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--info)' }}>
              Default {org.people_label} Permissions (No Role Assigned)
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>
              Members without a role can: view announcements, view own profile
            </div>
          </div>
        </div>
        {/* Add Role button — prominently placed here per spec */}
        <button
          onClick={onAdd}
          style={{ display: 'inline-flex' as const, alignItems: 'center', gap: 6, padding: '9px 18px', borderRadius: 8, border: 'none', background: 'var(--accent)', color: '#fff', fontSize: 13.5, fontWeight: 600, cursor: 'pointer' as const, fontFamily: 'var(--font-body)', whiteSpace: 'nowrap' as const }}>
          <BtnPlus /> Add Role
        </button>
      </div>
    </Card>
  )
}
