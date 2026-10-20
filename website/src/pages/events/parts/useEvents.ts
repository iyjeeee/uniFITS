// parts/useEvents.ts — Events page state: list data, filters, paging, detail/edit/delete modals, approve/reject/delete/save, feedback
import { useState } from 'react'
import { MOCK_EVENTS } from '../../../api/mockData'
import { EVENT_PAGE_SIZE, getEventCategory } from './eventsShared'
import type { EventActionResult } from './eventsShared'
import type { AppEvent } from '../../../types'

export default function useEvents() {
  const [data,         setData]         = useState(MOCK_EVENTS)
  const [viewItem,     setViewItem]     = useState<AppEvent | null>(null)
  const [editItem,     setEditItem]     = useState<AppEvent | null>(null)
  const [deleteItem,   setDeleteItem]   = useState<AppEvent | null>(null)
  const [actionResult, setActionResult] = useState<EventActionResult | null>(null)
  const [search,       setSearch]       = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter,   setTypeFilter]   = useState('all')   // filter by category keyword
  const [page,         setPage]         = useState(1)

  /* Filter setters reset to page 1 */
  const changeSearch = (v: string) => { setSearch(v); setPage(1) }
  const changeStatus = (v: string) => { setStatusFilter(v); setPage(1) }
  const changeType   = (v: string) => { setTypeFilter(v); setPage(1) }

  /* Edit opens EditItemModal and closes the detail modal — no redirect */
  function startEdit() { setEditItem(viewItem); setViewItem(null) }

  const statusOptions = ['all', ...Array.from(new Set(data.map((r) => r.status)))]
  const filtered = data
    .filter((r) => statusFilter === 'all' || r.status === statusFilter)
    .filter((r) => typeFilter   === 'all' || getEventCategory(r) === typeFilter)
    .filter((r) => Object.values(r).some((v) => String(v).toLowerCase().includes(search.toLowerCase())))
  const totalPages = Math.max(1, Math.ceil(filtered.length / EVENT_PAGE_SIZE))
  const paged      = filtered.slice((page - 1) * EVENT_PAGE_SIZE, page * EVENT_PAGE_SIZE)

  function handleDelete() {
    const title = deleteItem?.title
    setData(prev => prev.filter((r) => r.id !== deleteItem?.id))
    setDeleteItem(null)
    setTimeout(() => setActionResult({ variant: 'danger', title: 'Event Deleted', message: `"${title}" has been permanently removed.` }), 260)
  }
  function handleApprove(r: AppEvent) {
    setData(prev => prev.map((e) => e.id === r.id ? { ...e, status: 'ongoing' } : e))
    setActionResult({ variant: 'success', title: 'Event Approved', message: `"${r.title}" approved and set to Ongoing.` })
  }
  function handleReject(r: AppEvent) {
    setData(prev => prev.map((e) => e.id === r.id ? { ...e, status: 'cancelled' } : e))
    setActionResult({ variant: 'danger', title: 'Event Rejected', message: `"${r.title}" rejected and marked Cancelled.` })
  }
  function handleSaveEdit(updated: AppEvent) {
    setData(prev => prev.map((r) => r.id === updated.id ? updated : r))
    setActionResult({ variant: 'success', title: 'Event Updated', message: `"${updated.title}" has been saved successfully.` })
  }

  return {
    data, filtered, paged, page, setPage, totalPages,
    search, changeSearch, statusFilter, changeStatus, typeFilter, changeType, statusOptions,
    viewItem, setViewItem, editItem, setEditItem, deleteItem, setDeleteItem, actionResult, setActionResult,
    startEdit, handleDelete, handleApprove, handleReject, handleSaveEdit,
  }
}
