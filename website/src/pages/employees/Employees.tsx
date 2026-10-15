// Employees.tsx — Manage employees: KPI row, status-colored rows, row-click detail modal, in-modal edit, import modal,
// solid icon buttons, always-visible pagination (composition only; state in parts/useEmployees, UI in parts/)
import { Card, ResponseModal } from '../../components/ui'
import { PaginationRow } from '../../components/TableUtils'
import EditEmployeeModal from '../../components/EditEmployeeModal'
import { useOrg } from '../../context/OrgContext'
import useEmployees from './parts/useEmployees'
import EmployeesKpiStrip from './parts/EmployeesKpiStrip'
import EmployeesToolbar from './parts/EmployeesToolbar'
import EmployeesTable from './parts/EmployeesTable'
import EmployeeDetailModal from './parts/EmployeeDetailModal'
import ImportEmployeesModal from './parts/ImportEmployeesModal'
import DeleteEmployeeModal from './parts/DeleteEmployeeModal'
import type { ModalVariant } from '../../types'

export default function Employees() {
  const org = useOrg()
  const e = useEmployees()
  return (
    <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 14 }}>
      <EmployeesKpiStrip data={e.data} />

      {/* Data table card */}
      <Card>
        <EmployeesToolbar total={e.filtered.length}
          typeFilter={e.typeFilter} typeOptions={e.typeOptions} onTypeChange={e.changeType}
          statusFilter={e.statusFilter} statusOptions={e.statusOptions} onStatusChange={e.changeStatus}
          search={e.search} onSearchChange={e.changeSearch} onImport={() => e.setShowImport(true)} />
        <EmployeesTable rows={e.paged} page={e.page} onRowClick={e.setViewItem} onDelete={e.setDeleteItem} />
        {/* Pagination — always visible */}
        <PaginationRow page={e.page} totalPages={e.totalPages} onPageChange={e.setPage} total={e.filtered.length} />
      </Card>

      <EmployeeDetailModal item={e.viewItem} onClose={() => e.setViewItem(null)} onEdit={e.startEdit} />

      {/* Edit Employee Modal — in-modal, no page redirect */}
      <EditEmployeeModal open={!!e.editItem} onClose={() => e.setEditItem(null)} employee={e.editItem} org={org} onSave={e.handleSaveEdit} />

      <ImportEmployeesModal open={e.showImport} onClose={() => e.setShowImport(false)} />
      <DeleteEmployeeModal item={e.deleteItem} onClose={() => e.setDeleteItem(null)} onConfirm={e.handleDelete} />

      {/* Feedback ResponseModal */}
      <ResponseModal
        open={!!e.actionResult}
        onClose={() => e.setActionResult(null)}
        variant={(e.actionResult?.variant || 'success') as ModalVariant}
        title={e.actionResult?.title   || ''}
        message={e.actionResult?.message || ''}
        confirmLabel="Got it"
      />
    </div>
  )
}
