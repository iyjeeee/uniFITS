// parts/useProfile.ts — Derived profile data (attendance, transactions, totals) + modal/edit state (mock data now; swap for API calls later)
import { useState } from 'react'
import { MOCK_USERS, MOCK_ATTENDANCES, MOCK_TRANSACTIONS } from '../../../api/mockData'
import type { ModalVariant } from '../../../types'
import type { ProfileForm, AttStats, FieldHandler } from './profileShared'

export function useProfile(userId: string) {
  const user = MOCK_USERS.find((u) => u.id === userId) || MOCK_USERS[0]

  // Attendance records for this user
  const userAttendance = (MOCK_ATTENDANCES || []).filter((a) => a.user_name === user.full_name)

  // Personal transactions
  const userTransactions = MOCK_TRANSACTIONS.filter((t) => t.user_id === user.id).slice(0, 3)

  // Contribution total
  const totalContributed = MOCK_TRANSACTIONS
    .filter((t) => t.user_id === user.id && t.entry_type !== 'expense')
    .reduce((s, t) => s + t.amount, 0)

  // Attendance stats
  const attStats: AttStats = {
    present: userAttendance.filter((a) => a.status === 'present').length,
    late:    userAttendance.filter((a) => a.status === 'late').length,
    absent:  userAttendance.filter((a) => a.status === 'absent').length,
    excused: userAttendance.filter((a) => a.status === 'excused').length,
  }
  const attTotal = userAttendance.length

  /* Edit modal state */
  const [showEditModal,    setShowEditModal]    = useState(false)
  const [saveResponse,     setSaveResponse]     = useState<{variant:ModalVariant;title:string;message:string} | null>(null)
  const [showAllAttend,    setShowAllAttend]    = useState(false)
  const [showAllTxn,       setShowAllTxn]       = useState(false)
  const [form, setForm] = useState<ProfileForm>({
    first_name:       user.first_name,
    last_name:        user.last_name,
    gender:           user.gender,
    contact_number:   user.contact_number,
    email:            user.email,
    address_city:     user.address_city     || '',
    address_province: user.address_province || '',
    occupation:       user.occupation       || '',
    has_partner:      false,
  })
  const set: FieldHandler = k => e => setForm((f) => ({ ...f, [k]: e.target.value }))

  function handleSave() {
    setShowEditModal(false)
    setSaveResponse({ variant: 'success', title: 'Profile Updated', message: 'Your profile information has been saved successfully. Changes are now reflected across the system.' })
  }

  return {
    user, userAttendance, userTransactions, totalContributed, attStats, attTotal,
    showEditModal, setShowEditModal, saveResponse, setSaveResponse, showAllAttend, setShowAllAttend, showAllTxn, setShowAllTxn,
    form, setForm, set, handleSave,
  }
}
