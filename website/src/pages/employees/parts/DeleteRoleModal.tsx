// parts/DeleteRoleModal.tsx — Delete role confirmation modal
import { useOrg } from '../../../context/OrgContext'
import { InfoModal } from '../../../components/ui'
import type { Role } from '../../../types'
import { BtnDelete } from './RolesIcons'
import DeleteBody from './RoleDeleteBody'

export default function DeleteRoleModal({ role, onClose, onConfirm }: { role: Role | null; onClose: () => void; onConfirm: () => void }) {
  const org = useOrg()
  return (
    <InfoModal
      open={!!role}
      onClose={onClose}
      title="Delete Role"
      subtitle="This action is permanent and cannot be undone"
      accentColor="var(--danger)"
      footer={
        <div style={{ display: 'flex' as const, gap: 10, justifyContent: 'flex-end' }}>
          <button onClick={onConfirm}
            style={{ display: 'inline-flex' as const, alignItems: 'center', gap: 6, padding: '10px 24px', borderRadius: 9, border: 'none', background: 'var(--danger)', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer' as const, fontFamily: 'var(--font-body)', transition: 'transform .18s ease, box-shadow .18s ease' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 0 0 1.5px rgba(0,0,0,.70), 0 4px 12px rgba(0,0,0,.14)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}>
            <BtnDelete /> Yes, Delete
          </button>
          <button onClick={onClose}
            style={{ padding: '10px 28px', borderRadius: 9, border: '1.5px solid var(--border-card)', background: 'var(--neutral-light)', color: 'var(--text-primary)', fontSize: 14, fontWeight: 600, cursor: 'pointer' as const, fontFamily: 'var(--font-body)', transition: 'transform .18s ease, box-shadow .18s ease' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 0 0 1.5px rgba(0,0,0,.70), 0 4px 12px rgba(0,0,0,.14)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{marginRight:4}}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> Cancel
          </button>
        </div>
      }>
      {role && <DeleteBody role={role} org={org} />}
    </InfoModal>
  )
}
