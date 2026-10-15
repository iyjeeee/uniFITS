// Utilities.tsx — Manage utility/operational expenses (composition only; state in parts/useUtilities, UI in parts/).
// Action column: Delete only. Edit lives inside the detail modal footer.
import { Card, ResponseModal } from '../../components/ui'
import { PaginationRow } from '../../components/TableUtils'
import useUtilities from './parts/useUtilities'
import UtilitiesKpiStrip from './parts/UtilitiesKpiStrip'
import UtilitiesToolbar from './parts/UtilitiesToolbar'
import UtilitiesTable from './parts/UtilitiesTable'
import UtilityDetailModal from './parts/UtilityDetailModal'
import DeleteUtilityModal from './parts/DeleteUtilityModal'
import type { ModalVariant } from '../../types'

export default function Utilities() {
  const u = useUtilities()
  return (
    <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 14 }}>
      <UtilitiesKpiStrip data={u.data} />

      {/* Data table card */}
      <Card>
        <UtilitiesToolbar total={u.filtered.length}
          typeFilter={u.typeFilter} typeOptions={u.typeOptions} onTypeChange={u.changeType}
          statusFilter={u.statusFilter} statusOptions={u.statusOptions} onStatusChange={u.changeStatus}
          search={u.search} onSearchChange={u.changeSearch} />
        <UtilitiesTable rows={u.paged} page={u.page} onRowClick={u.openDetail} onDelete={u.setDeleteItem} />
        <PaginationRow page={u.page} totalPages={u.totalPages} onPageChange={u.setPage} total={u.filtered.length} />
      </Card>

      <UtilityDetailModal item={u.viewItem} editForm={u.editForm} editMode={u.editMode}
        onClose={u.closeDetail} onEdit={() => u.setEditMode(true)} onSave={u.handleSaveEdit} onCancel={u.handleCancelEdit} onFormChange={u.handleFormChange} />
      <DeleteUtilityModal item={u.deleteItem} onClose={() => u.setDeleteItem(null)} onConfirm={u.handleDelete} />

      {/* Action feedback */}
      <ResponseModal
        open={!!u.actionResult}
        onClose={() => u.setActionResult(null)}
        variant={(u.actionResult?.variant || 'success') as ModalVariant}
        title={u.actionResult?.title   || ''}
        message={u.actionResult?.message || ''}
        confirmLabel="Got it"
      />
    </div>
  )
}
