// parts/AllEmployeesModal.tsx — "All <People> List" InfoModal: Officers + <People> groups, shared page number (see bug log)
import { InfoModal } from '../../../components/ui'
import EmployeeListSection from './EmployeeListSection'
import { useOrg } from '../../../context/OrgContext'
import type { User } from '../../../types'

interface Props { open: boolean; onClose: () => void; total: number; officers: User[]; members: User[]; page: number; totalPages: number; onPageChange: (page: number) => void }

export default function AllEmployeesModal({ open, onClose, total, officers, members, page, totalPages, onPageChange }: Props) {
  const org = useOrg()
  if (!open) return null
  return (
    <InfoModal open={open} onClose={onClose}
      title={`All ${org.people_label_plural} List`}
      subtitle={`${total} total · ${officers.length} officers · ${members.length} ${org.people_label_plural.toLowerCase()} · Page ${page} of ${totalPages}`}
      footer={<button onClick={onClose} style={{ padding: '10px 28px', borderRadius: 9, border: '1.5px solid var(--border-card)', background: 'var(--neutral-light)', color: 'var(--text-primary)', fontSize: 14, fontWeight: 600, cursor: 'pointer' as const, fontFamily: 'var(--font-body)' }}>Close</button>}>
      <div>
        {/* Officers section — paginated */}
        {officers.length > 0 && <EmployeeListSection label="Officers" color="var(--accent)" list={officers} page={page} onPageChange={onPageChange} />}
        {/* People (non-officer) section — paginated */}
        {members.length > 0 && <EmployeeListSection label={org.people_label_plural} color="#5A6474" list={members} page={page} onPageChange={onPageChange} isLast />}
      </div>
    </InfoModal>
  )
}
