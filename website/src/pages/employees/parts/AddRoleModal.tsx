// parts/AddRoleModal.tsx — Add Role modal
import type { Dispatch, SetStateAction } from 'react'
import { InfoModal } from '../../../components/ui'
import type { RoleForm } from './rolesShared'
import AddRoleContent from './AddRoleContent'
import { BtnIco } from '../../../components/Icons'

export default function AddRoleModal({ open, form, setForm, onClose, onCreate }: { open: boolean; form: RoleForm; setForm: Dispatch<SetStateAction<RoleForm>>; onClose: () => void; onCreate: () => void }) {
  return (
    <InfoModal
      open={open}
      onClose={onClose}
      title="Add New Role"
      subtitle="Create a custom role with specific permissions"
      accentColor="var(--accent)"
      editMode={true}
      footer={
        <div style={{ display: 'flex' as const, gap: 10, justifyContent: 'flex-end' }}>
          <button onClick={onCreate} disabled={!form.name.trim()}
            style={{ display: 'inline-flex' as const, alignItems: 'center', gap: 6, padding: '10px 22px', borderRadius: 9, border: 'none', background: form.name.trim() ? 'var(--accent)' : 'var(--border)', color: '#fff', fontSize: 14, fontWeight: 600, cursor: form.name.trim() ? 'pointer' : 'not-allowed', fontFamily: 'var(--font-body)', transition: 'transform .18s ease, box-shadow .18s ease' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 0 0 1.5px rgba(0,0,0,.70), 0 4px 12px rgba(0,0,0,.14)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}>
            <BtnIco.Plus /> Create Role
          </button>
          <button onClick={onClose}
            style={{ padding: '10px 28px', borderRadius: 9, border: '1.5px solid var(--border-card)', background: 'var(--neutral-light)', color: 'var(--text-primary)', fontSize: 14, fontWeight: 600, cursor: 'pointer' as const, fontFamily: 'var(--font-body)', transition: 'transform .18s ease, box-shadow .18s ease' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 0 0 1.5px rgba(0,0,0,.70), 0 4px 12px rgba(0,0,0,.14)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{marginRight:4}}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> Cancel
          </button>
        </div>
      }>
      <AddRoleContent form={form} setForm={setForm} />
    </InfoModal>
  )
}
