// AddEmployee.jsx — Step-wizard form for adding a new employee member
// Responsive: 3-panel layout collapses to 1-col on mobile via useBreakpoint
// Validation: per-step validation blocks Continue; shows inline field errors
import { useState } from 'react'
import { Avatar, Button, Card, Input, SectionDivider, Select, ResponseModal } from '../../components/ui'
import { useOrg } from '../../context/OrgContext'
import useBreakpoint from '../../hooks/useBreakpoint'
import {
  required, isEmail, isPhilippinePhone, validateStep,
} from '../../utils/validation'  // shared validators
import { StepSidebar, FieldError, StepBanner } from '../../components/FormWizard'

const STEPS = ['Personal Info', 'Contact', 'Occupation', 'Review']
const GENDER_OPTIONS = [
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
  { value: 'Non-binary', label: 'Non-binary' },
  { value: 'Prefer not to say', label: 'Prefer not to say' },
]

/* ══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════════ */
export default function AddEmployee() {
  const org = useOrg()
  const { isMobile } = useBreakpoint()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<Record<string, string>>({
    first_name: '', middle_name: '', last_name: '',
    date_of_birth: '', gender: '',
    contact_number: '', email: '',
    address_street: '', address_city: '', address_province: '',
    occupation: '', department: '',
  })
  const [errors, setErrors] = useState<Record<string,string>>({})  // current visible field errors
  const [feedback, setFeedback] = useState(false)  // success confirmation modal visibility
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => { setForm((f) => ({ ...f, [k]: e.target.value })); clearErr(k) }
  const clearErr = (k: string) => setErrors(p => { const n = { ...p }; delete n[k]; return n })
  const fullName = [form.first_name, form.middle_name, form.last_name].filter(Boolean).join(' ')

  // stepValidators — rules per step index
  const stepValidators = [
    // Step 0 — Personal Info
    () => validateStep({
      first_name:    [() => required(form.first_name, 'First Name')],
      last_name:     [() => required(form.last_name, 'Last Name')],
      date_of_birth: [() => required(form.date_of_birth, 'Date of Birth')],
      gender:        [() => required(form.gender, 'Gender')],
    }),
    // Step 1 — Contact
    () => validateStep({
      contact_number: [() => isPhilippinePhone(form.contact_number)].filter(Boolean),
      email:          [
        () => required(form.email, 'Email Address'),
        () => isEmail(form.email),
      ],
    }),
    // Step 2 — Occupation (all optional)
    () => ({}),
  ]

  // handleContinue — validates current step before advancing
  function handleContinue() {
    if (step >= STEPS.length - 1) return
    const errs = stepValidators[step] ? stepValidators[step]() : {}
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setStep(s => s + 1)
  }

  // handleSubmit — final validation then save
  function handleSubmit() {
    setFeedback(true)  // replace with real API call
  }

  return (
    <>
    <div style={{ display: 'grid' as const, gridTemplateColumns: isMobile ? '1fr' : '200px 1fr 240px', gap: 14, alignItems: 'stretch' }}>

      {/* LEFT — Step sidebar */}
      <Card style={{ padding: '18px 14px' }}>
        <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' as const, letterSpacing: '.07em', marginBottom: 12 }}>Steps</div>
        <StepSidebar steps={STEPS} current={step} />
      </Card>

      {/* MIDDLE — Form */}
      <Card style={{ padding: 24 }}>

        {/* Error summary banner — shown when user tries to advance with errors */}
        <StepBanner errors={errors} />

        {/* Step 0 — Personal Information */}
        {step === 0 && <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 16 }}>
          <SectionDivider label="Personal Information" />
          <div>
            <Input label="First Name" value={form.first_name} onChange={set('first_name')} placeholder="e.g. Juan" required error={errors.first_name} />
            <FieldError msg={errors.first_name} />
          </div>
          <Input label="Middle Name" value={form.middle_name} onChange={set('middle_name')} placeholder="e.g. Santos" />
          <div>
            <Input label="Last Name" value={form.last_name} onChange={set('last_name')} placeholder="e.g. dela Cruz" required error={errors.last_name} />
            <FieldError msg={errors.last_name} />
          </div>
          <div style={{ display: 'grid' as const, gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16 }}>
            <div>
              <Input label="Date of Birth" type="date" value={form.date_of_birth} onChange={set('date_of_birth')} required error={errors.date_of_birth} />
              <FieldError msg={errors.date_of_birth} />
            </div>
            <div>
              <Select label="Gender" value={form.gender} onChange={set('gender')} options={GENDER_OPTIONS} placeholder="Select gender" required error={errors.gender} />
              <FieldError msg={errors.gender} />
            </div>
          </div>
        </div>}

        {/* Step 1 — Contact Information */}
        {step === 1 && <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 16 }}>
          <SectionDivider label="Contact Information" />
          <div>
            <Input label="Contact Number" value={form.contact_number} onChange={set('contact_number')} placeholder="09XX XXX XXXX" hint="Must start with 09, exactly 11 digits" error={errors.contact_number} />
            <FieldError msg={errors.contact_number} />
          </div>
          <div>
            <Input label="Email Address" type="email" value={form.email} onChange={set('email')} placeholder="juan@example.com" required error={errors.email} />
            <FieldError msg={errors.email} />
          </div>
          <Input label="Street Address" value={form.address_street} onChange={set('address_street')} placeholder="House no., street name" />
          <div style={{ display: 'grid' as const, gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16 }}>
            <Input label="City / Municipality" value={form.address_city} onChange={set('address_city')} placeholder="City" />
            <Input label="Province" value={form.address_province} onChange={set('address_province')} placeholder="Province" />
          </div>
        </div>}

        {/* Step 2 — Occupation & Department */}
        {step === 2 && <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 16 }}>
          <SectionDivider label="Occupation & Department" />
          <Input label="Occupation / Job Title" value={form.occupation} onChange={set('occupation')} placeholder="e.g. Manager, Staff" />
          <Input label="Department" value={form.department} onChange={set('department')} placeholder="e.g. Finance, Operations" />
        </div>}

        {/* Step 3 — Review */}
        {step === 3 && <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 12 }}>
          <SectionDivider label="Review Information" />
          {[
            ['Full Name',  fullName || '—'],
            ['Date of Birth', form.date_of_birth || '—'],
            ['Gender',     form.gender || '—'],
            ['Contact',    form.contact_number || '—'],
            ['Email',      form.email || '—'],
            ['Address',    [form.address_street, form.address_city, form.address_province].filter(Boolean).join(', ') || '—'],
            ['Occupation', form.occupation || '—'],
            ['Department', form.department || '—'],
          ].map(([k, v]) => (
            <div key={k} style={{ display: 'flex' as const, gap: 16, padding: '8px 0', borderBottom: '1px solid var(--border-inner)' }}>
              <div style={{ width: 140, fontSize: 13, color: 'var(--text-muted)', flexShrink: 0 }}>{k}</div>
              <div style={{ fontSize: 13.5, fontWeight: 500 }}>{v}</div>
            </div>
          ))}
        </div>}

        {/* Navigation */}
        <div style={{ display: 'flex' as const, justifyContent: 'space-between', marginTop: 24 }}>
          <Button variant="secondary" onClick={() => { setErrors({}); setStep(s => Math.max(0, s - 1)) }} disabled={step === 0}>← Back</Button>
          {step < STEPS.length - 1
            ? <Button onClick={handleContinue}>Continue →</Button>
            : <Button variant="success" onClick={handleSubmit}>✓ Register {org.people_label}</Button>
          }
        </div>
      </Card>

      {/* RIGHT — Live Preview */}
      <Card style={{ padding: 18 }}>
        <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' as const, letterSpacing: '.07em', marginBottom: 14 }}>Live Preview</div>
        <div style={{ display: 'flex' as const, flexDirection: 'column' as const, alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <Avatar name={fullName || '?'} size={56} />
          <div style={{ fontSize: 14, fontWeight: 700, textAlign: 'center' as const }}>{fullName || 'Full Name'}</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>New {org.people_label}</div>
        </div>
        {[['DOB', form.date_of_birth], ['Gender', form.gender], ['Email', form.email], ['Contact', form.contact_number], ['Dept', form.department]].map(([k, v]) => (
          <div key={k} style={{ display: 'flex' as const, justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-inner)', fontSize: 12.5 }}>
            <span style={{ color: 'var(--text-muted)' }}>{k}</span>
            <span style={{ color: v ? 'var(--text-primary)' : 'var(--border-card)', fontWeight: v ? 500 : 400 }}>{v || '—'}</span>
          </div>
        ))}
      </Card>
    </div>
    <ResponseModal open={feedback} onClose={() => { setFeedback(false); window.location.hash = '/employees' }}
      variant="success" title="Employee Registered!" message="The new employee has been successfully added to the system." confirmLabel="Go to Employees" />
    </>
  )
}
