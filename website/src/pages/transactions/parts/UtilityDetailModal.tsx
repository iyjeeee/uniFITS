// parts/UtilityDetailModal.tsx — Detail InfoModal: read-only view by default, inline edit form after pressing Edit (button lives in the footer)
import { InfoModal } from '../../../components/ui'
import { formatDate } from '../../../api/mockData'
import { useOrg } from '../../../context/OrgContext'
import { modalAccentColor } from '../../../constants/tableColors'
import UtilityDetailView from './UtilityDetailView'
import UtilityEditFields from './UtilityEditFields'
import UtilityDetailFooter from './UtilityDetailFooter'
import type { UtilityEditForm } from './utilitiesShared'
import type { UtilityWithBalance } from '../../../types'

interface Props {
  item: UtilityWithBalance | null; editForm: UtilityEditForm | null; editMode: boolean
  onClose: () => void; onEdit: () => void; onSave: () => void; onCancel: () => void
  onFormChange: (key: keyof UtilityEditForm, value: string) => void
}

export default function UtilityDetailModal({ item, editForm, editMode, onClose, onEdit, onSave, onCancel, onFormChange }: Props) {
  const org = useOrg()
  return (
    <InfoModal
      open={!!item}
      onClose={onClose}
      title={editMode ? `Edit ${org.utility_label}` : (item?.expense_type || '')}
      editMode={editMode}
      subtitle={editMode ? 'Update utility expense details' : (item ? `${org.utility_label} · ${formatDate(item.due_date)}` : '')}
      accentColor={editMode ? 'var(--accent)' : (item ? modalAccentColor(item.status) : 'var(--accent)')}
      footer={<UtilityDetailFooter editMode={editMode} onEdit={onEdit} onClose={onClose} onSave={onSave} onCancel={onCancel} />}>
      {item && editForm && (editMode ? <UtilityEditFields editForm={editForm} onFormChange={onFormChange} /> : <UtilityDetailView item={item} />)}
    </InfoModal>
  )
}
