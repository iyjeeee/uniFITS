// parts/useTransactions.ts — Transactions page state: list data, filters, paging, detail/delete modals, approve/reject/delete, feedback
import { useState } from 'react'
import { MOCK_TRANSACTIONS, getFundName } from '../../../api/mockData'
import { useOrg } from '../../../context/OrgContext'
import { TX_PAGE_SIZE } from './transactionsShared'
import type { TransactionActionResult } from './transactionsShared'
import type { Transaction } from '../../../types'

export default function useTransactions() {
  const org = useOrg()
  const [data,         setData]         = useState<Transaction[]>(MOCK_TRANSACTIONS)
  const [search,       setSearch]       = useState('')
  const [typeFilter,   setTypeFilter]   = useState('all')   // filter by entry_type
  const [statusFilter, setStatusFilter] = useState('all')   // filter by status
  const [page,         setPage]         = useState(1)
  const [viewItem,     setViewItem]     = useState<Transaction | null>(null)    // tx open in detail modal
  const [deleteItem,   setDeleteItem]   = useState<Transaction | null>(null)    // tx pending deletion
  const [actionResult, setActionResult] = useState<TransactionActionResult | null>(null)    // feedback modal

  /* Filter setters reset to page 1 */
  const changeSearch = (v: string) => { setSearch(v); setPage(1) }
  const changeType   = (v: string) => { setTypeFilter(v); setPage(1) }
  const changeStatus = (v: string) => { setStatusFilter(v); setPage(1) }

  /* Computed KPIs */
  const totalIncome  = data.filter((t) => t.entry_type !== 'expense').reduce((s, t) => s + t.amount, 0)
  const totalExpense = data.filter((t) => t.entry_type === 'expense').reduce((s, t) => s + t.amount, 0)
  const balance      = totalIncome - totalExpense

  /* Filter + paginate */
  const filtered = data
    .filter((t) => typeFilter   === 'all' || t.entry_type === typeFilter)
    .filter((t) => statusFilter === 'all' || t.status     === statusFilter)
    .filter((t) => Object.values({ ...t, fund_id: getFundName(t.fund_id) }).some((v) => String(v).toLowerCase().includes(search.toLowerCase())))   // search the fund NAME, not its id
  const totalPages = Math.max(1, Math.ceil(filtered.length / TX_PAGE_SIZE))
  const paged      = filtered.slice((page - 1) * TX_PAGE_SIZE, page * TX_PAGE_SIZE)

  /* Approve — sets status to approved */
  function handleApprove(tx: Transaction) {
    setData(prev => prev.map((t) => t.id === tx.id ? { ...t, status: 'approved' } : t))
    setActionResult({ variant: 'success', title: `${org.transaction_label} Approved`, message: `Transaction ${tx.reference_number} has been approved successfully.` })
  }

  /* Reject — sets status to rejected */
  function handleReject(tx: Transaction) {
    setData(prev => prev.map((t) => t.id === tx.id ? { ...t, status: 'rejected' } : t))
    setActionResult({ variant: 'danger', title: `${org.transaction_label} Rejected`, message: `Transaction ${tx.reference_number} has been rejected.` })
  }

  /* Delete — removes from list */
  function handleDelete() {
    const ref = deleteItem?.reference_number
    setData(prev => prev.filter((t) => t.id !== deleteItem?.id))
    if (viewItem?.id === deleteItem?.id) setViewItem(null)
    setDeleteItem(null)
    setTimeout(() => setActionResult({ variant: 'danger', title: `${org.transaction_label} Deleted`, message: `Transaction ${ref} has been permanently removed.` }), 260)
  }

  return {
    data, filtered, paged, page, setPage, totalPages, totalIncome, totalExpense, balance,
    search, changeSearch, typeFilter, changeType, statusFilter, changeStatus,
    viewItem, setViewItem, deleteItem, setDeleteItem, actionResult, setActionResult,
    handleApprove, handleReject, handleDelete,
  }
}
