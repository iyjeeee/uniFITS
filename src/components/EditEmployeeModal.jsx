// EditEmployeeModal.jsx — In-modal edit form for employees; no page redirect
// Same InfoModal shell with accent matching employee status
import { useState, useEffect } from 'react'
import { InfoModal, Input, Select, SectionDivider } from './ui'
import { modalAccentColor } from '../constants/tableColors'

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
const ROLE_OPTIONS = [
  { value: 'President',  label: 'President'  },
  { value: 'Treasurer',  label: 'Treasurer'  },
  { value: 'Secretary',  label: 'Secretary'  },
  { value: 'Member',     label: 'Member'     },
]

export default function EditEmployeeModal({ open, onClose, employee, org, onSave }) {
  const [form, setForm] = useState({})

  useEffect(() => {
    if (employee) {
      // Split full_name into first / last for editing
      const parts = (employee.full_name || '').split(' ')
      setForm({
        ...employee,
        first_name: parts[0] || '',
        last_name:  parts.slice(1).join(' ') || '',
      })
    }
  }, [employee])

  if (!employee) return null
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  function handleSave() {
    const updated = {
      ...form,
      full_name: [form.first_name, form.last_name].filter(Boolean).join(' ') || form.full_name,
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
      accentColor={modalAccentColor(form.status || employee.status)}
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

        {/* Personal info */}
        <div>
          <SectionDivider label="Personal Information" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <Input label="First Name" value={form.first_name || ''} onChange={set('first_name')} />
              <Input label="Last Name"  value={form.last_name  || ''} onChange={set('last_name')} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <Select label="Gender" value={form.gender || ''} onChange={set('gender')} options={GENDER_OPTIONS} />
              <Select label="Status" value={form.status || 'active'} onChange={set('status')} options={STATUS_OPTIONS} />
            </div>
            <Select label="Role" value={form.role || 'Member'} onChange={set('role')} options={ROLE_OPTIONS} />
          </div>
        </div>

        {/* Contact info */}
        <div>
          <SectionDivider label="Contact Information" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 14 }}>
            <Input label="Email"          type="email" value={form.email          || ''} onChange={set('email')} />
            <Input label="Contact Number"              value={form.contact_number  || ''} onChange={set('contact_number')} hint="09XX XXX XXXX" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <Input label="City / Municipality" value={form.address_city     || ''} onChange={set('address_city')} />
              <Input label="Province"            value={form.address_province || ''} onChange={set('address_province')} />
            </div>
          </div>
        </div>

        {/* Work info */}
        <div>
          <SectionDivider label="Occupation & Department" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 14 }}>
            <Input label="Occupation / Job Title" value={form.occupation  || ''} onChange={set('occupation')} />
            <Input label="Department"             value={form.department  || ''} onChange={set('department')} />
          </div>
        </div>
      </div>
    </InfoModal>
  )
}
