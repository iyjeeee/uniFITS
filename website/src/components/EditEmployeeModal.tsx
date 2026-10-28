// components/EditEmployeeModal.tsx — In-modal edit form for employees; no page redirect
// Same InfoModal shell with accent color matching the employee's current status
import { useState, useEffect } from 'react'
import type { ChangeEvent } from 'react'
import { InfoModal, Input, Select, SectionDivider } from './ui'
import { modalAccentColor } from '../constants/tableColors'
import { MOCK_ROLES } from '../api/mockData'
import type { User, OrgConfig } from '../types'

const GENDER_OPTIONS = [
  { value: 'Male',              label: 'Male'              },
  { value: 'Female',            label: 'Female'            },
  { value: 'Non-binary',        label: 'Non-binary'        },
  { value: 'Prefer not to say', label: 'Prefer not to say' },
]
const STATUS_OPTIONS = [
  { value: 'active',   label: 'Active'   },
  { value: 'inactive', label: 'Inactive' },
]

// EditFormState — working copy of User fields inside the edit form
type EditFormState = Partial<User> & { first_name?: string; last_name?: string }

interface EditEmployeeModalProps {
  open:      boolean
  onClose:   () => void
  employee:  User | null
  org:       OrgConfig
  onSave:    (updated: User) => void
}

export default function EditEmployeeModal({ open, onClose, employee, org, onSave }: EditEmployeeModalProps) {
  const [form, setForm] = useState<EditFormState>({})

  // Sync form state when employee prop changes — split full_name into first/last
  useEffect(() => {
    if (employee) {
      const parts = (employee.full_name || '').split(' ')
      setForm({
        ...employee,
        first_name: parts[0] ?? '',
        last_name:  parts.slice(1).join(' ') ?? '',
      })
    }
  }, [employee])

  if (!employee) return null

  // set — curried field setter for all form inputs
  const set = (k: keyof EditFormState) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  function handleSave() {
    if (!employee) return  // type guard — employee is checked by the early return above
    const updated: User = {
      ...employee,
      ...(form as User),
      full_name: [form.first_name, form.last_name].filter(Boolean).join(' ') || employee.full_name,
    }
    onSave(updated)
    onClose()
  }

  return (
    <InfoModal
      open={open}
      onClose={onClose}
      title={`Edit ${org.people_label}`}
      subtitle={`Editing: ${employee.full_name}`}
      accentColor={modalAccentColor(form.status ?? employee?.status ?? 'active')}
      footer={
        <div style={{ display: 'flex', gap: 10, justifyContent: 'space-between', width: '100%' }}>
          <button onClick={handleSave}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 22px', borderRadius: 9, border: 'none', background: 'var(--accent)', color: '#fff', fontSize: 13.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
            ✓ Save {org.people_label}
          </button>
          <button onClick={onClose}
            style={{ padding: '10px 28px', borderRadius: 9, border: '1.5px solid var(--border-card)', background: 'var(--neutral-light)', color: 'var(--text-primary)', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
            Cancel
          </button>
        </div>
      }>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

        {/* ── Personal Information ───────────────────────────────── */}
        <div>
          <SectionDivider label="Personal Information" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <Input label="First Name" value={form.first_name ?? ''} onChange={set('first_name')} />
              <Input label="Last Name"  value={form.last_name  ?? ''} onChange={set('last_name')}  />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <Select label="Gender" value={form.gender ?? ''} onChange={set('gender')} options={GENDER_OPTIONS} />
              <Select label="Status" value={form.status ?? 'active'} onChange={set('status')} options={STATUS_OPTIONS} />
            </div>
            <Select label="Role" value={form.role_id ?? ''} onChange={set('role_id')} options={MOCK_ROLES.map((r) => ({ value: r.id, label: r.name }))} />   {/* every real role (B-21), by id */}
          </div>
        </div>

        {/* ── Contact Information ────────────────────────────────── */}
        <div>
          <SectionDivider label="Contact Information" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 14 }}>
            <Input label="Email"          type="email" value={form.email          ?? ''} onChange={set('email')} />
            <Input label="Contact Number"              value={form.contact_number  ?? ''} onChange={set('contact_number')} hint="09XX XXX XXXX" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <Input label="City / Municipality" value={form.address_city     ?? ''} onChange={set('address_city')} />
              <Input label="Province"            value={form.address_province ?? ''} onChange={set('address_province')} />
            </div>
          </div>
        </div>

        {/* ── Occupation & Department ────────────────────────────── */}
        <div>
          <SectionDivider label="Occupation & Department" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 14 }}>
            <Input label="Occupation / Job Title" value={form.occupation ?? ''} onChange={set('occupation')} />
            <Input label="Department"             value={form.department ?? ''} onChange={set('department')} />
          </div>
        </div>
      </div>
    </InfoModal>
  )
}
