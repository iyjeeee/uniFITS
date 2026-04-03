// AddEmployee.jsx — Step-wizard form for adding a new employee member
// Responsive: 3-panel layout collapses to 1-col on mobile via useBreakpoint
// AddEmployee.jsx — 3-col layout: StepWizard sidebar | Form | Preview; no page title header
import { useState } from 'react'
import { Card, Button, Input, Select, Avatar, SectionDivider } from '../../components/ui'
import { useOrg } from '../../context/OrgContext'
import useBreakpoint from '../../hooks/useBreakpoint'

const STEPS = ['Personal Info', 'Contact', 'Occupation', 'Review']
const GENDER_OPTIONS = [{ value: 'Male', label: 'Male' },{ value: 'Female', label: 'Female' },{ value: 'Non-binary', label: 'Non-binary' },{ value: 'Prefer not to say', label: 'Prefer not to say' }]

function StepSidebar({ steps, current }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {steps.map((label, i) => {
        const done = i < current, active = i === current
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 9, background: active ? 'var(--accent-light)' : done ? 'var(--success-light)' : 'transparent', border: '1.5px solid ' + (active ? 'rgba(75,94,170,.3)' : done ? 'rgba(46,125,82,.2)' : 'var(--border-card)') }}>
            <div style={{ width: 26, height: 26, borderRadius: '50%', background: done ? '#2E7D52' : active ? 'var(--accent)' : 'var(--border-card)', color: done || active ? '#fff' : 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11.5, fontWeight: 700, flexShrink: 0 }}>
              {done ? '✓' : i + 1}
            </div>
            <span style={{ fontSize: 13, fontWeight: active ? 700 : done ? 600 : 400, color: active ? 'var(--accent)' : done ? 'var(--success)' : 'var(--text-muted)' }}>{label}</span>
          </div>
        )
      })}
    </div>
  )
}

export default function AddEmployee() {
  const org = useOrg()
  const { isMobile } = useBreakpoint()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({ first_name:'', middle_name:'', last_name:'', date_of_birth:'', gender:'', contact_number:'', email:'', address_street:'', address_city:'', address_province:'', occupation:'', department:'' })
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))
  const fullName = [form.first_name, form.middle_name, form.last_name].filter(Boolean).join(' ')

  return (
    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '200px 1fr 240px', gap: 14, alignItems: 'stretch' }}>

      <Card style={{ padding: '18px 14px' }}>
        <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 12 }}>Steps</div>
        <StepSidebar steps={STEPS} current={step} />
      </Card>

      <Card style={{ padding: 24 }}>
        {step === 0 && <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <SectionDivider label="Personal Information" />
          <Input label="First Name" value={form.first_name} onChange={set('first_name')} placeholder="e.g. Juan" required />
          <Input label="Middle Name" value={form.middle_name} onChange={set('middle_name')} placeholder="e.g. Santos" />
          <Input label="Last Name" value={form.last_name} onChange={set('last_name')} placeholder="e.g. dela Cruz" required />
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16 }}>
            <Input label="Date of Birth" type="date" value={form.date_of_birth} onChange={set('date_of_birth')} required />
            <Select label="Gender" value={form.gender} onChange={set('gender')} options={GENDER_OPTIONS} placeholder="Select gender" required />
          </div>
        </div>}
        {step === 1 && <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <SectionDivider label="Contact Information" />
          <Input label="Contact Number" value={form.contact_number} onChange={set('contact_number')} placeholder="09XX XXX XXXX" hint="Must start with 09, exactly 11 digits" required />
          <Input label="Email Address" type="email" value={form.email} onChange={set('email')} placeholder="juan@example.com" required />
          <Input label="Street Address" value={form.address_street} onChange={set('address_street')} placeholder="House no., street name" />
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16 }}>
            <Input label="City / Municipality" value={form.address_city} onChange={set('address_city')} placeholder="City" />
            <Input label="Province" value={form.address_province} onChange={set('address_province')} placeholder="Province" />
          </div>
        </div>}
        {step === 2 && <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <SectionDivider label="Occupation & Department" />
          <Input label="Occupation / Job Title" value={form.occupation} onChange={set('occupation')} placeholder="e.g. Manager, Staff" />
          <Input label="Department" value={form.department} onChange={set('department')} placeholder="e.g. Finance, Operations" />
        </div>}
        {step === 3 && <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <SectionDivider label="Review Information" />
          {[['Full Name',fullName||'—'],['Date of Birth',form.date_of_birth||'—'],['Gender',form.gender||'—'],['Contact',form.contact_number||'—'],['Email',form.email||'—'],['Address',[form.address_street,form.address_city,form.address_province].filter(Boolean).join(', ')||'—'],['Occupation',form.occupation||'—'],['Department',form.department||'—']].map(([k,v]) => (
            <div key={k} style={{ display: 'flex', gap: 16, padding: '8px 0', borderBottom: '1px solid var(--border-inner)' }}>
              <div style={{ width: 140, fontSize: 13, color: 'var(--text-muted)', flexShrink: 0 }}>{k}</div>
              <div style={{ fontSize: 13.5, fontWeight: 500 }}>{v}</div>
            </div>
          ))}
        </div>}

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
          <Button variant="secondary" onClick={() => setStep(s => Math.max(0, s-1))} disabled={step===0}>← Back</Button>
          {step < STEPS.length-1
            ? <Button onClick={() => setStep(s => s+1)}>Continue →</Button>
            : <Button variant="success" onClick={() => alert('Employee registered!')}>✓ Register {org.people_label}</Button>
          }
        </div>
      </Card>

      <Card style={{ padding: 18 }}>
        <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 14 }}>Live Preview</div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <Avatar name={fullName || '?'} size={56} />
          <div style={{ fontSize: 14, fontWeight: 700, textAlign: 'center' }}>{fullName || 'Full Name'}</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>New {org.people_label}</div>
        </div>
        {[['DOB',form.date_of_birth],['Gender',form.gender],['Email',form.email],['Contact',form.contact_number],['Dept',form.department]].map(([k,v]) => (
          <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-inner)', fontSize: 12.5 }}>
            <span style={{ color: 'var(--text-muted)' }}>{k}</span>
            <span style={{ color: v ? 'var(--text-primary)' : 'var(--border-card)', fontWeight: v ? 500 : 400 }}>{v||'—'}</span>
          </div>
        ))}
      </Card>
    </div>
  )
}
