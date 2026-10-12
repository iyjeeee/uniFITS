// RolesPage.tsx — Role definitions: view/edit permissions, assign members, add and delete roles
// Composition only — pieces live in ./parts (state and handlers in useRoles)
import { ResponseModal } from '../../components/ui'
import RolesHeaderCard from './parts/RolesHeaderCard'
import RolesTable from './parts/RolesTable'
import RoleDetailModal from './parts/RoleDetailModal'
import AddRoleModal from './parts/AddRoleModal'
import DeleteRoleModal from './parts/DeleteRoleModal'
import { useRoles } from './parts/useRoles'

export default function RolesPage() {
  const r = useRoles()

  return (
    <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 14 }}>
      <RolesHeaderCard onAdd={() => r.setShowAdd(true)} />
      <RolesTable roles={r.roles} onOpen={r.openDetail} onDelete={r.setDeleteItem} />

      <RoleDetailModal
        role={r.viewRole}
        editPerms={r.editPerms}
        assignedIds={r.assignedIds}
        onClose={() => r.setViewRole(null)}
        onSave={r.handleSavePerms}
        onTogglePerm={r.togglePerm}
        onToggleMember={r.toggleMember}
      />
      <AddRoleModal open={r.showAdd} form={r.addForm} setForm={r.setAddForm} onClose={r.closeAdd} onCreate={r.handleCreate} />
      <DeleteRoleModal role={r.deleteItem} onClose={() => r.setDeleteItem(null)} onConfirm={r.handleDelete} />

      {/* Feedback ResponseModal */}
      <ResponseModal
        open={!!r.actionResult}
        onClose={() => r.setActionResult(null)}
        variant={r.actionResult?.variant || 'success'}
        title={r.actionResult?.title   || ''}
        message={r.actionResult?.message || ''}
        confirmLabel="Got it"
      />
    </div>
  )
}
