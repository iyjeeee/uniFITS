// parts/useRoles.ts — Roles list + modal state and handlers (mock data now; swap for API calls later)
import { useState } from 'react'
import { MOCK_ROLES, MOCK_USERS } from '../../../api/mockData'
import type { Role, Permission, ModalVariant } from '../../../types'
import type { RoleForm } from './rolesShared'
import { EMPTY_ROLE_FORM } from './rolesShared'

export function useRoles() {
  const [roles,        setRoles]        = useState(MOCK_ROLES)
  const [viewRole,     setViewRole]     = useState<Role | null>(null)    // role open in detail modal
  const [editPerms,    setEditPerms]    = useState<Permission[]>([])
  const [showAdd,      setShowAdd]      = useState(false)
  const [assignedIds, setAssignedIds] = useState<string[]>([])
  const [deleteItem, setDeleteItem] = useState<Role | null>(null)
  const [actionResult, setActionResult] = useState<{variant:ModalVariant;title:string;message:string} | null>(null)    // feedback
  const [addForm,      setAddForm]      = useState<RoleForm>(EMPTY_ROLE_FORM)

  /* Open detail modal — load role's current permissions + assigned members */
  function openDetail(role: Role) {
    setViewRole(role)
    setEditPerms([...role.permissions])
    // Derive assigned member ids from MOCK_USERS where role name matches
    setAssignedIds(MOCK_USERS.filter((u) => u.role_id === role.id).map((u) => u.id))
  }

  /* Toggle a permission inside the detail modal */
  function togglePerm(key: Permission) {
    setEditPerms(prev => prev.includes(key) ? prev.filter((p) => p !== key) : [...prev, key])
  }

  /* Toggle a member assignment inside the detail modal */
  function toggleMember(uid: string) {
    setAssignedIds(prev => prev.includes(uid) ? prev.filter((id) => id !== uid) : [...prev, uid])
  }

  /* Save permission changes */
  function handleSavePerms() {
    setRoles(prev => prev.map((r) => r.id === viewRole?.id ? { ...r, permissions: editPerms } : r))
    setViewRole(null)
    setActionResult({ variant: 'success', title: 'Permissions Updated', message: `"${viewRole?.name}" permissions have been saved successfully.` })
  }

  /* Create new role */
  function handleCreate() {
    if (!addForm.name.trim()) return
    setRoles(prev => [...prev, { id: String(Date.now()), ...addForm, is_system: false }])
    closeAdd()
    setActionResult({ variant: 'success', title: 'Role Created', message: `"${addForm.name}" has been added successfully.` })
  }

  /* Delete role */
  function handleDelete() {
    const name = deleteItem?.name
    setRoles(prev => prev.filter((r) => r.id !== deleteItem?.id))
    setDeleteItem(null)
    setTimeout(() => setActionResult({ variant: 'danger', title: 'Role Deleted', message: `"${name}" has been permanently removed.` }), 260)
  }

  /* Close the Add Role modal and reset its form */
  function closeAdd() { setShowAdd(false); setAddForm(EMPTY_ROLE_FORM) }

  return { roles, viewRole, setViewRole, editPerms, showAdd, setShowAdd, assignedIds, deleteItem, setDeleteItem, actionResult, setActionResult, addForm, setAddForm, openDetail, togglePerm, toggleMember, handleSavePerms, handleCreate, handleDelete, closeAdd }
}
