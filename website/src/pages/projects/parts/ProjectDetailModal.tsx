// parts/ProjectDetailModal.tsx — Row-click detail InfoModal (shared ItemDetailContent); footer: Edit (opens EditItemModal) + Close
import { InfoModal } from '../../../components/ui'
import { TableIco } from '../../../components/Icons'
import ItemDetailContent from '../../../components/ItemDetailContent'
import { formatDate } from '../../../api/mockData'
import { useOrg } from '../../../context/OrgContext'
import { modalAccentColor } from '../../../constants/tableColors'
import { capitalize } from '../../../utils/formatters'
import type { ProjectWithFunding } from '../../../types'

interface Props { item: ProjectWithFunding | null; onClose: () => void; onEdit: () => void }

export default function ProjectDetailModal({ item, onClose, onEdit }: Props) {
  const org = useOrg()
  if (!item) return null
  return (
    <InfoModal
      open={!!item}
      onClose={onClose}
      title={item.title}
      subtitle={`${capitalize(item.project_type || org.project_label)} · ${formatDate(item.start_date)}`}
      accentColor={modalAccentColor(item.status)}
      footer={
  <div style={{ display: 'flex' as const, gap: 10, justifyContent: 'flex-end' }}>
    {/* Edit — opens EditItemModal, no redirect */}
    <button onClick={onEdit}
      style={{ display: 'inline-flex' as const, alignItems: 'center', gap: 6, padding: '10px 20px', borderRadius: 9, border: 'none', background: 'var(--accent)', color: '#fff', fontSize: 13.5, fontWeight: 600, cursor: 'pointer' as const, fontFamily: 'var(--font-body)', transition: 'transform .18s ease, box-shadow .18s ease' }}
    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 0 0 1.5px rgba(0,0,0,.70), 0 4px 12px rgba(0,0,0,.14)' }}
    onMouseLeave={(e: React.MouseEvent<HTMLElement>) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}>
      <TableIco.Edit /> Edit {org.project_label}
    </button>
    <button onClick={onClose}
      style={{ padding: '10px 28px', borderRadius: 9, border: '1.5px solid var(--border-card)', background: 'var(--neutral-light)', color: 'var(--text-primary)', fontSize: 14, fontWeight: 600, cursor: 'pointer' as const, fontFamily: 'var(--font-body)' }}>
      Close
    </button>
  </div>
      }>
      {/* Shared Announcements-style content */}
      <ItemDetailContent item={item} org={org} kind="project" />
    </InfoModal>
  )
}
