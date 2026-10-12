// parts/useAnnouncements.ts — Announcement list state + CRUD (mock data now; swap for API calls later)
import { useState } from 'react'
import { MOCK_ANNOUNCEMENTS } from '../../../api/mockData'
import type { Announcement } from '../../../types'
import type { AnnResponse, AnnouncementForm } from './types'

const EMPTY_FORM: AnnouncementForm = { title: '', content: '', is_pinned: false }

export function useAnnouncements() {
  const [announcements, setAnnouncements] = useState(MOCK_ANNOUNCEMENTS)
  const [showNewModal,  setShowNewModal]  = useState(false)
  const [viewAnn,       setViewAnn]       = useState<Announcement | null>(null)
  const [form,          setForm]          = useState<AnnouncementForm>(EMPTY_FORM)
  const [annResponse,   setAnnResponse]   = useState<AnnResponse | null>(null)
  const [pendingDelete, setPendingDelete] = useState<string | null>(null)

  // Newest first — used by the panel and the View All modal
  const allSorted = [...announcements].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  function handleAdd() {
    if (!form.title || !form.content) return
    setAnnouncements(prev => [{ id: String(Date.now()), ...form, created_by: 'Current User', created_at: new Date().toISOString() } as Announcement, ...prev])
    setForm(EMPTY_FORM)
    setShowNewModal(false)
    setAnnResponse({ variant:'success', title:'Announcement Posted', message:'Your announcement has been published and is now visible to all members.' })
  }
  function togglePin(id: string) {
    const ann = announcements.find((a) => a.id === id)
    setAnnouncements(prev => prev.map((a) => a.id === id ? { ...a, is_pinned: !a.is_pinned } : a))
    setViewAnn(null)
    setAnnResponse({ variant:'info', title: ann?.is_pinned ? 'Announcement Unpinned' : 'Announcement Pinned', message: ann?.is_pinned ? 'The announcement has been removed from the pinned section.' : 'The announcement is now pinned at the top of the list.' })
  }
  function confirmDelete(id: string) { setViewAnn(null); setPendingDelete(id) }
  function handleDelete() {
    setAnnouncements(prev => prev.filter((a) => a.id !== pendingDelete))
    setPendingDelete(null)
    setAnnResponse({ variant:'danger', title:'Announcement Deleted', message:'The announcement has been permanently removed and is no longer visible to members.' })
  }

  return {
    allSorted, showNewModal, setShowNewModal, viewAnn, setViewAnn, form, setForm,
    annResponse, setAnnResponse, pendingDelete, setPendingDelete,
    handleAdd, togglePin, confirmDelete, handleDelete,
  }
}
