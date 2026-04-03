// EditEmployee.jsx — Edit an existing employee's profile information
import { useState } from 'react'
import { Card, Button, Input, Select, SectionDivider, Avatar } from '../../components/ui'
import { MOCK_USERS } from '../../api/mockData'
import { useOrg } from '../../context/OrgContext'
import useBreakpoint from '../../hooks/useBreakpoint'

const GENDER_OPTIONS = [
  { value: 'Male', label: 'Male' },{ value: 'Female', label: 'Female' },
  { value: 'Non-binary', label: 'Non-binary' },{ value: 'Prefer not to say', label: 'Prefer not to say' },
]

export default function EditEmployee({ userId = '1' }) {
  const org  = useOrg()
  const { isMobile } = useBreakpoint()
  const user = MOCK_USERS.find(u => u.id === userId) || MOCK_USERS[0]
  const [form, setForm] = useState({
    first_name: user.first_name, last_name: user.last_name,
    gender: user.gender, email: user.email,
    contact_number: user.contact_number, occupation: user.occupation || '',
    department: user.department || '', address_city: user.address_city || '',
    address_province: user.address_province || '',
  })

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))
  const fullName = `${form.first_name} ${form.last_name}`

  function handleSave() { alert('Profile updated! (Connect to backend)') }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      } />

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 260px', gap: 20, alignItems: 'flex-start' }}>
        <Card style={{ padding: 28 }}>
          <SectionDivider label="Personal Information" />
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <Input label="First Name" value={form.first_name} onChange={set('first_name')} required />
            <Input label="Last Name"  value={form.last_name}  onChange={set('last_name')}  required />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <Select label="Gender" value={form.gender} onChange={set('gender')} options={GENDER_OPTIONS} />
            <Input label="Contact Number" value={form.contact_number} onChange={set('contact_number')} />
          </div>
          <Input label="Email Address" type="email" value={form.email} onChange={set('email')} style={{ marginBottom: 16 }} />

          <SectionDivider label="Location & Work" />
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <Input label="City" value={form.address_city} onChange={set('address_city')} />
            <Input label="Province" value={form.address_province} onChange={set('address_province')} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16 }}>
            <Input label="Occupation" value={form.occupation} onChange={set('occupation')} />
            <Input label="Department" value={form.department} onChange={set('department')} />
          </div>
        </Card>

        <Card style={{ padding: 24 }}>
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <Avatar name={fullName} size={64} />
            <div style={{ marginTop: 10, fontSize: 15, fontWeight: 700 }}>{fullName}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{user.employee_number}</div>
          </div>
          <Button variant="secondary" size="sm" style={{ width: '100%', justifyContent: 'center' }}>Change Photo</Button>
        </Card>
      </div>
    </div>
  )
}
