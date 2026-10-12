// parts/RoleDetailModal.tsx — Role detail + permissions editor modal
import { useOrg } from '../../../context/OrgContext'
import { InfoModal } from '../../../components/ui'
import type { Role, Permission } from '../../../types'
import { BtnShield } from './RolesIcons'
import RoleModalContent from './RoleModalContent'

export default function RoleDetailModal({ role, editPerms, assignedIds, onClose, onSave, onTogglePerm, onToggleMember }: { role: Role | null; editPerms: Permission[]; assignedIds: string[]; onClose: () => void; onSave: () => void; onTogglePerm: (key: Permission) => void; onToggleMember: (uid: string) => void }) {
  const org = useOrg()
  return (
    <InfoModal
      open={!!role}
      onClose={onClose}
      title={role?.name || ''}
      subtitle={role ? `${role?.is_system ? 'System' : 'Custom'} Role · ${editPerms.length} permission${editPerms.length !== 1 ? 's' : ''}` : ''}
      accentColor="var(--accent)"
      footer={
        <div style={{ display: 'flex' as const, gap: 10, justifyContent: 'flex-end' }}>
          <button onClick={onSave}
            style={{ display: 'inline-flex' as const, alignItems: 'center', gap: 6, padding: '10px 22px', borderRadius: 9, border: 'none', background: 'var(--accent)', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' as const, fontFamily: 'var(--font-body)', transition: 'transform .18s ease, box-shadow .18s ease' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 0 0 1.5px rgba(0,0,0,.70), 0 4px 12px rgba(0,0,0,.14)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}>
            <BtnShield /> Save Permissions
          </button>
          <button onClick={onClose}
            style={{ padding: '10px 28px', borderRadius: 9, border: '1.5px solid var(--border-card)', background: 'var(--neutral-light)', color: 'var(--text-primary)', fontSize: 14, fontWeight: 600, cursor: 'pointer' as const, fontFamily: 'var(--font-body)', transition: 'transform .18s ease, box-shadow .18s ease' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 0 0 1.5px rgba(0,0,0,.70), 0 4px 12px rgba(0,0,0,.14)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{marginRight:4}}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> Close
          </button>
        </div>
      }>
      {role && <RoleModalContent role={role} editPerms={editPerms} onToggle={onTogglePerm} assignedIds={assignedIds} onToggleMember={onToggleMember} org={org} />}
    </InfoModal>
  )
}
