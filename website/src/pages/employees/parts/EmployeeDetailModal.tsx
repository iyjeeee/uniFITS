// parts/EmployeeDetailModal.tsx — Row-click detail InfoModal; accent follows status; Edit hands off to EditEmployeeModal
import { InfoModal } from '../../../components/ui'
import { TableIco } from '../../../components/Icons'
import { useOrg } from '../../../context/OrgContext'
import { modalAccentColor } from '../../../constants/tableColors'
import EmployeeDetailContent from './EmployeeDetailContent'
import type { User } from '../../../types'

interface Props { item: User | null; onClose: () => void; onEdit: () => void }

export default function EmployeeDetailModal({ item, onClose, onEdit }: Props) {
  const org = useOrg()
  if (!item) return null
  return (
    <InfoModal
      open={!!item}
      onClose={onClose}
      title={item.full_name}
      subtitle={`${item.role} · ${item.employee_number}`}
      accentColor={modalAccentColor(item.status)}
      footer={
    <div style={{ display: 'flex' as const, gap: 10, justifyContent: 'flex-end' }}>
      {/* Edit opens EditEmployeeModal — no page redirect */}
      <button onClick={onEdit}
        style={{ display: 'inline-flex' as const, alignItems: 'center', gap: 6, padding: '10px 20px', borderRadius: 9, border: 'none', background: 'var(--accent)', color: '#fff', fontSize: 13.5, fontWeight: 600, cursor: 'pointer' as const, fontFamily: 'var(--font-body)', transition: 'transform .18s ease, box-shadow .18s ease' }}
      onMouseEnter={(e: React.MouseEvent<HTMLElement>) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 0 0 1.5px rgba(0,0,0,.70), 0 4px 12px rgba(0,0,0,.14)' }}
      onMouseLeave={(e: React.MouseEvent<HTMLElement>) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}>
        <TableIco.Edit /> Edit {org.people_label}
      </button>
      <button onClick={onClose}
        style={{ padding: '10px 28px', borderRadius: 9, border: '1.5px solid var(--border-card)', background: 'var(--neutral-light)', color: 'var(--text-primary)', fontSize: 14, fontWeight: 600, cursor: 'pointer' as const, fontFamily: 'var(--font-body)' }}>
        Close
      </button>
    </div>
      }>
      <EmployeeDetailContent item={item} />
    </InfoModal>
  )
}
