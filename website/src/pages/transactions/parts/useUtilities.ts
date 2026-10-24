// parts/useUtilities.ts — Utilities page state: list data, filters, paging, detail/edit/delete flows, feedback
import { useState } from 'react'
import { getUtilitiesWithBalance, getFundName } from '../../../api/mockData'
import { utilityStatus } from '../../../utils/ledger'
import { useOrg } from '../../../context/OrgContext'
import { UTILITY_PAGE_SIZE } from './utilitiesShared'
import type { UtilityEditForm, UtilityActionResult } from './utilitiesShared'
import type { UtilityWithBalance } from '../../../types'

export default function useUtilities() {
  const org = useOrg()
  const [data,         setData]         = useState(getUtilitiesWithBalance)   // lazy: paid amount + status derived from approved payments
  const [search,       setSearch]       = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter,   setTypeFilter]   = useState('all')   // filter by expense_type/category
  const [page,         setPage]         = useState(1)
  const [viewItem,     setViewItem]     = useState<UtilityWithBalance | null>(null)    // item open in detail modal
  const [editMode,     setEditMode]     = useState(false)   // toggle edit view inside detail modal
  const [editForm,     setEditForm]     = useState<UtilityEditForm | null>(null)    // local edit form state
  const [deleteItem,   setDeleteItem]   = useState<UtilityWithBalance | null>(null)    // item pending deletion
  const [actionResult, setActionResult] = useState<UtilityActionResult | null>(null)    // feedback

  /* Filter setters reset to page 1 */
  const changeSearch = (v: string) => { setSearch(v); setPage(1) }
  const changeStatus = (v: string) => { setStatusFilter(v); setPage(1) }
  const changeType   = (v: string) => { setTypeFilter(v); setPage(1) }

  /* Open detail modal — always starts in read-only mode */
  function openDetail(item: UtilityWithBalance) {
    const { amount_paid, status, ...bill } = item   // the form edits the bill only; paid + status stay derived
    void amount_paid; void status
    setViewItem(item)
    setEditForm(bill)
    setEditMode(false)
  }

  /* Close detail modal */
  function closeDetail() { setViewItem(null); setEditMode(false) }

  /* Apply field change to local edit form */
  function handleFormChange(key: keyof UtilityEditForm, value: string) {
    setEditForm(prev => prev && { ...prev, [key]: value })   // edit form only exists while a row is open
  }

  /* Save edit — update record in list */
  function handleSaveEdit() {
    if (!editForm) return
    const total = Number(editForm.total_amount)
    const withBalance = (u: UtilityWithBalance): UtilityWithBalance => ({ ...editForm, total_amount: total, amount_paid: u.amount_paid, status: utilityStatus(total, u.amount_paid) })   // paid stays; status follows the new total
    setData(prev => prev.map((u) => u.id === editForm.id ? withBalance(u) : u))
    if (viewItem) setViewItem(withBalance(viewItem))
    setEditMode(false)
    setActionResult({ variant: 'success', title: `${org.utility_label} Updated`, message: `"${editForm?.expense_type}" has been saved successfully.` })
  }

  /* Cancel edit — revert form to current item state */
  function handleCancelEdit() {
    if (!viewItem) { setEditForm(null); setEditMode(false); return }
    const { amount_paid, status, ...bill } = viewItem
    void amount_paid; void status
    setEditForm(bill)
    setEditMode(false)
  }

  /* Handle delete */
  function handleDelete() {
    const cat = deleteItem?.expense_type
    setData(prev => prev.filter((u) => u.id !== deleteItem?.id))
    if (viewItem?.id === deleteItem?.id) setViewItem(null)
    setDeleteItem(null)
    setTimeout(() => setActionResult({ variant: 'danger', title: `${org.utility_label} Deleted`, message: `"${cat}" has been permanently removed.` }), 260)
  }

  /* Filter + paginate */
  const statusOptions = ['all', ...Array.from(new Set(data.map((u) => u.status)))]
  const typeOptions   = ['all', ...Array.from(new Set(data.map((u) => u.expense_type).filter(Boolean)))]
  const filtered = data
    .filter((u) => statusFilter === 'all' || u.status       === statusFilter)
    .filter((u) => typeFilter   === 'all' || u.expense_type === typeFilter)
    .filter((u) => Object.values({ ...u, fund_id: getFundName(u.fund_id) }).some((v) => String(v).toLowerCase().includes(search.toLowerCase())))   // search the fund NAME, not its id
  const totalPages = Math.max(1, Math.ceil(filtered.length / UTILITY_PAGE_SIZE))
  const paged      = filtered.slice((page - 1) * UTILITY_PAGE_SIZE, page * UTILITY_PAGE_SIZE)

  return {
    data, filtered, paged, page, setPage, totalPages,
    search, changeSearch, statusFilter, changeStatus, typeFilter, changeType, statusOptions, typeOptions,
    viewItem, editMode, setEditMode, editForm, openDetail, closeDetail, handleFormChange, handleSaveEdit, handleCancelEdit,
    deleteItem, setDeleteItem, handleDelete, actionResult, setActionResult,
  }
}
