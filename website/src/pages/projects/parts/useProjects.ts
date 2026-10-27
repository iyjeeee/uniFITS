// parts/useProjects.ts — Projects page state: list data, filters, paging, detail/edit/delete modals, approve/reject/delete/save, feedback
import { useState } from 'react'
import { getProjectsWithFunding } from '../../../api/mockData'
import { decide } from '../../../utils/approvals'
import { PROJECT_PAGE_SIZE } from './projectsShared'
import type { ProjectActionResult } from './projectsShared'
import type { ProjectWithFunding, User } from '../../../types'

export default function useProjects(currentUser: User | null = null) {
  const [data,         setData]         = useState(getProjectsWithFunding)   // lazy: funding raised is derived from approved transactions
  const [viewItem,     setViewItem]     = useState<ProjectWithFunding | null>(null)
  const [editItem,     setEditItem]     = useState<ProjectWithFunding | null>(null)
  const [deleteItem,   setDeleteItem]   = useState<ProjectWithFunding | null>(null)
  const [actionResult, setActionResult] = useState<ProjectActionResult | null>(null)
  const [search,       setSearch]       = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [approvalFilter, setApprovalFilter] = useState('all')   // pending / approved / rejected
  const [typeFilter,   setTypeFilter]   = useState('all')   // filter by project_type
  const [page,         setPage]         = useState(1)

  /* Filter setters reset to page 1 */
  const changeSearch = (v: string) => { setSearch(v); setPage(1) }
  const changeStatus = (v: string) => { setStatusFilter(v); setPage(1) }
  const changeApproval = (v: string) => { setApprovalFilter(v); setPage(1) }
  const changeType   = (v: string) => { setTypeFilter(v); setPage(1) }

  /* Edit opens EditItemModal and closes the detail modal — no redirect */
  function startEdit() { setEditItem(viewItem); setViewItem(null) }

  const statusOptions = ['all', ...Array.from(new Set(data.map((r) => r.status)))]
  const typeOptions   = ['all', ...Array.from(new Set(data.map((r) => r.project_type).filter(Boolean)))]
  const filtered  = data
    .filter((r) => approvalFilter === 'all' || r.approval_status === approvalFilter)
    .filter((r) => statusFilter === 'all' || r.status       === statusFilter)
    .filter((r) => typeFilter   === 'all' || r.project_type === typeFilter)
    .filter((r) => Object.values(r).some((v) => String(v).toLowerCase().includes(search.toLowerCase())))
  const totalPages = Math.max(1, Math.ceil(filtered.length / PROJECT_PAGE_SIZE))
  const paged      = filtered.slice((page - 1) * PROJECT_PAGE_SIZE, page * PROJECT_PAGE_SIZE)

  function handleDelete() {
    const title = deleteItem?.title
    setData(prev => prev.filter((r) => r.id !== deleteItem?.id))
    setDeleteItem(null)
    setTimeout(() => setActionResult({ variant: 'danger', title: 'Project Deleted', message: `"${title}" has been permanently removed.` }), 260)
  }
  function handleApprove(r: ProjectWithFunding) {
    setData(prev => prev.map((p) => p.id === r.id ? { ...p, ...decide('approved', currentUser?.id ?? null) } : p))   // approval only: lifecycle status is untouched
    setActionResult({ variant: 'success', title: 'Project Approved', message: `"${r.title}" has been approved.` })
  }
  function handleReject(r: ProjectWithFunding) {
    setData(prev => prev.map((p) => p.id === r.id ? { ...p, ...decide('rejected', currentUser?.id ?? null) } : p))
    setActionResult({ variant: 'danger', title: 'Project Rejected', message: `"${r.title}" has been rejected.` })
  }
  function handleSaveEdit(updated: ProjectWithFunding) {
    setData(prev => prev.map((r) => r.id === updated.id ? updated : r))
    setActionResult({ variant: 'success', title: 'Project Updated', message: `"${updated.title}" has been saved successfully.` })
  }

  return {
    data, filtered, paged, page, setPage, totalPages,
    search, changeSearch, statusFilter, changeStatus, approvalFilter, changeApproval, typeFilter, changeType, statusOptions, typeOptions,
    viewItem, setViewItem, editItem, setEditItem, deleteItem, setDeleteItem, actionResult, setActionResult,
    startEdit, handleDelete, handleApprove, handleReject, handleSaveEdit,
  }
}
