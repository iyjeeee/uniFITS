// AddEmployee.jsx — 4-step wizard to register a new employee/member
import { useState } from 'react'
import { Card, Button, Input, Select, StepWizard, PageHeader, Avatar, SectionDivider } from '../../components/ui'
import { useOrg } from '../../context/OrgContext'

const STEPS = ['Personal Info', 'Contact', 'Occupation', 'Review']

const GENDER_OPTIONS = [
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
  { value: 'Non-binary', label: 'Non-binary' },
  { value: 'Prefer not to say', label: 'Prefer not to say' },
]

export default function AddEmployee() {
  const org  = useOrg()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    first_name: '', middle_name: '', last_name: '', date_of_birth: '', gender: '',
    contact_number: '', email: '', address_street: '', address_city: '', address_province: '',
    occupation: '', department: '',
  })

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))
  const fullName = [form.first_name, form.middle_name, form.last_name].filter(Boolean).join(' ')

  function handleSubmit() {
    // Replace with real API POST /users
    alert('Employee registered! (Connect to backend)')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <PageHeader title={`Add ${org.people_label}`} subtitle="Complete all steps to register a new member" />
      <StepWizard steps={STEPS} current={step} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 20, alignItems: 'flex-start' }}>

        {/* Form panel */}
        <Card style={{ padding: 28 }}>
          {step === 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <SectionDivider label="Personal Information" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Input label="First Name" value={form.first_name} onChange={set('first_name')} placeholder="e.g. Juan" required />
                <Input label="Middle Name" value={form.middle_name} onChange={set('middle_name')} placeholder="Optional" />
              </div>
              <Input label="Last Name" value={form.last_name} onChange={set('last_name')} placeholder="e.g. dela Cruz" required />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Input label="Date of Birth" type="date" value={form.date_of_birth} onChange={set('date_of_birth')} required />
                <Select label="Gender" value={form.gender} onChange={set('gender')} options={GENDER_OPTIONS} placeholder="Select gender" required />
              </div>
            </div>
          )}

          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <SectionDivider label="Contact Information" />
              <Input label="Contact Number" value={form.contact_number} onChange={set('contact_number')} placeholder="09XX XXX XXXX" hint="Must start with 09 and be exactly 11 digits" required />
              <Input label="Email Address" type="email" value={form.email} onChange={set('email')} placeholder="juan@example.com" required />
              <Input label="Street Address" value={form.address_street} onChange={set('address_street')} placeholder="House no., street name" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Input label="City / Municipality" value={form.address_city} onChange={set('address_city')} placeholder="City" />
                <Input label="Province" value={form.address_province} onChange={set('address_province')} placeholder="Province" />
              </div>
            </div>
          )}

          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <SectionDivider label="Occupation & Department" />
              <Input label="Occupation / Job Title" value={form.occupation} onChange={set('occupation')} placeholder="e.g. Manager, Staff" />
              <Input label="Department" value={form.department} onChange={set('department')} placeholder="e.g. Finance, Operations" />
            </div>
          )}

          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <SectionDivider label="Review Information" />
              {[
                ['Full Name', fullName || '—'],
                ['Date of Birth', form.date_of_birth || '—'],
                ['Gender', form.gender || '—'],
                ['Contact', form.contact_number || '—'],
                ['Email', form.email || '—'],
                ['Address', [form.address_street, form.address_city, form.address_province].filter(Boolean).join(', ') || '—'],
                ['Occupation', form.occupation || '—'],
                ['Department', form.department || '—'],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', gap: 16, padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ width: 140, fontSize: 13, color: 'var(--text-muted)', flexShrink: 0 }}>{k}</div>
                  <div style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--text-primary)' }}>{v}</div>
                </div>
              ))}
            </div>
          )}

          {/* Navigation buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
            <Button variant="secondary" onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}>← Back</Button>
            {step < STEPS.length - 1
              ? <Button onClick={() => setStep(s => s + 1)}>Continue →</Button>
              : <Button variant="success" onClick={handleSubmit}>✓ Register {org.people_label}</Button>
            }
          </div>
        </Card>

        {/* Live preview panel */}
        <Card style={{ padding: 24 }}>
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 16 }}>Live Preview</div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <Avatar name={fullName || '?'} size={64} />
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', textAlign: 'center' }}>{fullName || 'Full Name'}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>New {org.people_label}</div>
          </div>
          {[['DOB', form.date_of_birth], ['Gender', form.gender], ['Email', form.email], ['Contact', form.contact_number], ['Dept', form.department]].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border)', fontSize: 12.5 }}>
              <span style={{ color: 'var(--text-muted)' }}>{k}</span>
              <span style={{ color: v ? 'var(--text-primary)' : 'var(--border)', fontWeight: v ? 500 : 400 }}>{v || '—'}</span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  )
}
