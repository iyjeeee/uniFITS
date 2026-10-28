// parts/useEmployees.ts — Employees page state: list data, filters, paging, detail/edit/delete/import modals, feedback
import { useState } from 'react'
import { MOCK_USERS } from '../../../api/mockData'
import { EMPLOYEE_PAGE_SIZE } from './employeesShared'
import type { EmployeeActionResult } from './employeesShared'
import type { User } from '../../../types'

export default function useEmployees() {
  const [data,         setData]         = useState(MOCK_USERS)
  const [viewItem,     setViewItem]     = useState<User | null>(null)   // detail modal
  const [editItem,     setEditItem]     = useState<User | null>(null)   // edit modal
  const [deleteItem,   setDeleteItem]   = useState<User | null>(null)   // confirmation modal
  const [showImport,   setShowImport]   = useState(false)  // import modal
  const [actionResult, setActionResult] = useState<EmployeeActionResult | null>(null)   // feedback
  const [search,       setSearch]       = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter,   setTypeFilter]   = useState('all')   // filter by role
  const [page,         setPage]         = useState(1)

  /* Filter setters reset to page 1 */
  const changeSearch = (v: string) => { setSearch(v); setPage(1) }
  const changeStatus = (v: string) => { setStatusFilter(v); setPage(1) }
  const changeType   = (v: string) => { setTypeFilter(v); setPage(1) }

  /* Edit opens EditEmployeeModal and closes the detail modal — no page redirect */
  function startEdit() { setEditItem(viewItem); setViewItem(null) }

  function handleDelete() {
    const name = deleteItem?.full_name
    setData(prev => prev.filter((r) => r.id !== deleteItem?.id))
    setDeleteItem(null)
    setTimeout(() => setActionResult({ variant: 'danger', title: 'Employee Removed', message: `"${name}" has been permanently removed.` }), 260)
  }

  function handleSaveEdit(updated: User) {
    setData(prev => prev.map((r) => r.id === updated.id ? updated : r))
    // If the view modal is open for this item, update it too
    if (viewItem?.id === updated.id) setViewItem(updated)
    setActionResult({ variant: 'success', title: 'Employee Updated', message: `"${updated.full_name || updated.first_name}" has been updated successfully.` })
  }

  /* Filter + paginate */
  const statusOptions = ['all', ...Array.from(new Set(data.map((r) => r.status)))]
  const typeOptions   = ['all', ...Array.from(new Set(data.map((r) => r.role_id).filter(Boolean)))]   // role ids; the toolbar shows their names
  const filtered = data
    .filter((r) => statusFilter === 'all' || r.status === statusFilter)
    .filter((r) => typeFilter   === 'all' || r.role_id === typeFilter)
    .filter((r) => Object.values(r).some((v) => String(v).toLowerCase().includes(search.toLowerCase())))
  const totalPages = Math.max(1, Math.ceil(filtered.length / EMPLOYEE_PAGE_SIZE))
  const paged      = filtered.slice((page - 1) * EMPLOYEE_PAGE_SIZE, page * EMPLOYEE_PAGE_SIZE)

  return {
    data, filtered, paged, page, setPage, totalPages,
    search, changeSearch, statusFilter, changeStatus, typeFilter, changeType, statusOptions, typeOptions,
    viewItem, setViewItem, editItem, setEditItem, deleteItem, setDeleteItem, showImport, setShowImport,
    actionResult, setActionResult, startEdit, handleDelete, handleSaveEdit,
  }
}
