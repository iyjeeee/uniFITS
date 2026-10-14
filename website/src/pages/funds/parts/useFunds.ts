// parts/useFunds.ts — Funds list + detail/edit/delete state and handlers (mock data now; swap for API calls later)
import { useState } from 'react'
import { useOrg } from '../../../context/OrgContext'
import { MOCK_FUNDS } from '../../../api/mockData'
import type { Fund, ModalVariant } from '../../../types'
import type { FundEditState } from './fundsShared'

export function useFunds() {
  const org = useOrg()
  const [funds,        setFunds]        = useState(MOCK_FUNDS)
  const [viewItem,     setViewItem]     = useState<Fund | null>(null)    // fund open in detail modal
  const [editMode,     setEditMode]     = useState(false)   // toggle edit inside modal
  const [editForm,     setEditForm]     = useState<FundEditState | null>(null)    // local edit form state
  const [deleteItem,   setDeleteItem]   = useState<Fund | null>(null)    // fund pending deletion
  const [actionResult, setActionResult] = useState<{variant:ModalVariant;title:string;message:string} | null>(null)    // feedback

  /* Open detail modal in read-only mode */
  function openDetail(fund: Fund) {
    setViewItem(fund)
    setEditForm({ ...fund })
    setEditMode(false)
  }

  function handleFormChange(key: keyof FundEditState, value: string) {
    setEditForm((prev) => prev ? ({ ...prev, [key]: value }) : null)
  }

  function handleSaveEdit() {
    if (!editForm) return
    const saved: Fund = { ...editForm, annual_fee: editForm.annual_fee === '' || editForm.annual_fee == null ? null : Number(editForm.annual_fee) }   // input yields a string
    setFunds(prev => prev.map((f) => f.id === saved.id ? saved : f))
    setViewItem(saved)
    setEditMode(false)
    setActionResult({ variant: 'success', title: `${org.fund_label} Updated`, message: `"${editForm?.name}" has been saved successfully.` })
  }

  function handleCancelEdit() {
    setEditForm(viewItem ? { ...viewItem } : null)
    setEditMode(false)
  }

  function handleDelete() {
    const name = deleteItem?.name
    setFunds(prev => prev.filter((f) => f.id !== deleteItem?.id))
    if (viewItem?.id === deleteItem?.id) setViewItem(null)
    setDeleteItem(null)
    setTimeout(() => setActionResult({ variant: 'danger', title: `${org.fund_label} Deleted`, message: `"${name}" has been permanently removed.` }), 260)
  }

  /* Close the detail modal (also leaves edit mode) */
  function closeDetail() { setViewItem(null); setEditMode(false) }
  /* Delete button inside the detail modal — hand the fund over to the delete confirmation */
  function requestDelete() { setDeleteItem(viewItem); setViewItem(null) }

  return { funds, viewItem, editMode, setEditMode, editForm, deleteItem, setDeleteItem, actionResult, setActionResult, openDetail, handleFormChange, handleSaveEdit, handleCancelEdit, handleDelete, closeDetail, requestDelete }
}
