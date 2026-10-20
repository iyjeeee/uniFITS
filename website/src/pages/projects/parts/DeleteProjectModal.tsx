// parts/DeleteProjectModal.tsx — Delete confirmation InfoModal (Yes, Delete / Close)
import { InfoModal } from '../../../components/ui'
import { BtnIco } from '../../../components/Icons'
import { useOrg } from '../../../context/OrgContext'
import ProjectDeleteBody from './ProjectDeleteBody'
import type { Project } from '../../../types'

interface Props { item: Project | null; onClose: () => void; onConfirm: () => void }

export default function DeleteProjectModal({ item, onClose, onConfirm }: Props) {
  const org = useOrg()
  if (!item) return null
  return (
    <InfoModal
      open={!!item}
      onClose={onClose}
      title="Delete Project"
      subtitle="This action is permanent and cannot be undone"
      accentColor="var(--danger)"
      footer={
  <div style={{ display: 'flex' as const, gap: 10, justifyContent: 'flex-end' }}>
    <button onClick={onConfirm}
      style={{ display: 'inline-flex' as const, alignItems: 'center', gap: 6, padding: '10px 24px', borderRadius: 9, border: 'none', background: 'var(--danger)', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer' as const, fontFamily: 'var(--font-body)', transition: 'transform .18s ease, box-shadow .18s ease' }}
    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 0 0 1.5px rgba(0,0,0,.70), 0 4px 12px rgba(0,0,0,.14)' }}
    onMouseLeave={(e: React.MouseEvent<HTMLElement>) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}>
      <BtnIco.Delete /> Yes, Delete
    </button>
    <button onClick={onClose}
      style={{ padding: '10px 28px', borderRadius: 9, border: '1.5px solid var(--border-card)', background: 'var(--neutral-light)', color: 'var(--text-primary)', fontSize: 14, fontWeight: 600, cursor: 'pointer' as const, fontFamily: 'var(--font-body)' }}>
      Close
    </button>
  </div>
      }>
      <ProjectDeleteBody item={item} type={org.project_label} />
    </InfoModal>
  )
}
