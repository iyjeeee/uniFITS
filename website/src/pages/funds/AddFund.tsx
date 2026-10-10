// AddFund.jsx — 3-col layout: StepSidebar | Form | Live Preview
// Validation: per-step validation blocks Continue; shows inline field errors
import { useState } from 'react'
import { Button, Card, Input, SectionDivider, Select, Textarea, ResponseModal } from '../../components/ui'
import { useOrg } from '../../context/OrgContext'
import useBreakpoint from '../../hooks/useBreakpoint'
import { required, isPositiveNumber, validateStep } from '../../utils/validation'

const STEPS = ['Fund Info', 'Financial', 'Ownership', 'Review']
const FREQ_OPTIONS = [
  { value: 'monthly',   label: 'Monthly'   },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'annually',  label: 'Annually'  },
]
const TYPE_OPTIONS = [
  { value: 'internal', label: 'Internal (Member Required)' },
  { value: 'external', label: 'External (Donations/Sponsors)' },
]

/* ── StepSidebar ─────────────────────────────────────────────────── */
function StepSidebar({ steps, current }: Record<string, any>) {
  return (
    <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 4 }}>
      {steps.map((label: string, i: number) => {
        const done = i < current, active = i === current
        return (
          <div key={i} style={{ display: 'flex' as const, alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 9, background: active ? 'var(--accent-light)' : done ? 'var(--success-light)' : 'transparent', border: '1.5px solid ' + (active ? 'rgba(75,94,170,.3)' : done ? 'rgba(46,125,82,.2)' : 'var(--border-card)') }}>
            <div style={{ width: 26, height: 26, borderRadius: '50%', background: done ? '#2E7D52' : active ? 'var(--accent)' : 'var(--border-card)', color: done || active ? '#fff' : 'var(--text-muted)', display: 'flex' as const, alignItems: 'center', justifyContent: 'center', fontSize: 11.5, fontWeight: 700, flexShrink: 0 }}>
              {done ? '✓' : i + 1}
            </div>
            <span style={{ fontSize: 13, fontWeight: active ? 700 : done ? 600 : 400, color: active ? 'var(--accent)' : done ? 'var(--success)' : 'var(--text-muted)' }}>{label}</span>
          </div>
        )
      })}
    </div>
  )
}

/* ── FieldError — inline error message ───────────────────────────── */
function FieldError({ msg }: Record<string, any>) {
  if (!msg) return null
  return (
    <div style={{ display: 'flex' as const, alignItems: 'center', gap: 5, marginTop: 3, fontSize: 12, color: 'var(--danger)', fontWeight: 500 }} role="alert">
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      {msg}
    </div>
  )
}

/* ── StepBanner — error summary banner ───────────────────────────── */
function StepBanner({ errors }: Record<string, any>) {
  const msgs = Object.values(errors as Record<string,string>).filter(Boolean)
  if (!msgs.length) return null
  return (
    <div style={{ display: 'flex' as const, alignItems: 'flex-start', gap: 10, padding: '12px 14px', borderRadius: 9, background: '#fff5f5', border: '1.5px solid rgba(192,57,43,.3)', marginBottom: 16 }} role="alert">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--danger)', marginBottom: 4 }}>Please fix the following before continuing:</div>
        {msgs.map((m, i) => <div key={i} style={{ fontSize: 12.5, color: 'var(--danger)', lineHeight: 1.5 }}>• {m}</div>)}
      </div>
    </div>
  )
}

/* ── LivePreview ──────────────────────────────────────────────────── */
function LivePreview({ form, org }: Record<string, any>) {
  const cap = (s: any): string => s ? s.charAt(0).toUpperCase() + s.slice(1) : '—'
  return (
    <div>
      <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' as const, letterSpacing: '.07em', marginBottom: 14 }}>Live Preview</div>
      {[
        [`${org.fund_label} Name`, form.name],
        ['Description',            form.description],
        ['Fund Type',              cap(form.fund_type)],
        ['Required?',              form.is_required ? 'Yes — all members' : 'No'],
        ['Pay Frequency',          form.is_required ? cap((form as any).payment_frequency) : '—'],
        ['Annual Fee',             form.is_required && (form as any).annual_fee ? `₱${(form as any).annual_fee}` : '—'],
        ['Owner / Manager',        form.owner || '—'],
        ['Currency',               'PHP'],
        ['Status',                 'Active (Default)'],
      ].map(([k, v]) => (
        <div key={k} style={{ display: 'flex' as const, justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid var(--border-inner)', fontSize: 12.5 }}>
          <span style={{ color: 'var(--text-muted)' }}>{k}</span>
          <span style={{ color: v && v !== '—' ? 'var(--text-primary)' : 'var(--border-card)', fontWeight: v && v !== '—' ? 500 : 400 }}>{v || '—'}</span>
        </div>
      ))}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════════ */
export default function AddFund() {
  const org  = useOrg()
  const { isMobile } = useBreakpoint()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<Record<string,any>>({
    name: '', description: '', fund_type: 'internal',
    is_required: false, payment_frequency: '', annual_fee: '', owner: '',
  })
  const [errors, setErrors] = useState<Record<string,string>>({})
  const [feedback, setFeedback] = useState(false)  // success confirmation modal visibility
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => { setForm((f: any) => ({ ...f, [k]: e.target.value })); clearErr(k) }
  const clearErr = (k: string) => setErrors(p => { const n = { ...p }; delete n[k]; return n })

  // stepValidators — rules per step index
  const stepValidators = [
    // Step 0 — Fund Info
    () => validateStep({ name: [() => required(form.name, `${org.fund_label} Name`)] }),
    // Step 1 — Financial Settings
    () => {
      const rules: Record<string, (() => string)[]> = {}
      if (form.is_required) {
        rules.payment_frequency = [() => required((form as any).payment_frequency, 'Payment Frequency')]
        rules.annual_fee = [
          () => required((form as any).annual_fee, 'Annual Fee'),
          () => isPositiveNumber((form as any).annual_fee, 'Annual Fee'),
        ]
      }
      return validateStep(rules)
    },
    // Step 2 — Ownership (optional)
    () => ({}),
  ]

  function handleContinue() {
    if (step >= STEPS.length - 1) return
    const errs = stepValidators[step] ? stepValidators[step]() : {}
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setStep(s => s + 1)
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
        <StepBanner errors={errors} />

        {/* Step 0 — Fund Info */}
        {step === 0 && (
          <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 16 }}>
            <SectionDivider label="Fund Information" />
            <div>
              <Input label={`${org.fund_label} Name`} value={form.name} onChange={set('name')} placeholder="e.g. Membership Dues, Project Fund" required error={errors.name} />
              <FieldError msg={errors.name} />
            </div>
            <Textarea label="Description" value={form.description} onChange={set('description')} placeholder="What is this fund used for?" rows={3} />
          </div>
        )}

        {/* Step 1 — Financial Settings */}
        {step === 1 && (
          <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 16 }}>
            <SectionDivider label="Financial Settings" />
            <Select label="Fund Type" value={form.fund_type} onChange={set('fund_type')} options={TYPE_OPTIONS} />
            <label style={{ display: 'flex' as const, alignItems: 'center', gap: 10, fontSize: 13.5, cursor: 'pointer' as const, userSelect: 'none' as const }}>
              <input
                type="checkbox" checked={form.is_required}
                onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => { setForm(f => ({ ...f, is_required: (e.target as HTMLInputElement).checked })); setErrors({}) }}
                style={{ accentColor: 'var(--accent)', width: 16, height: 16 }}
              />
              Required for all members
            </label>
            {form.is_required && (
              <>
                <div>
                  <Select label="Payment Frequency" value={(form as any).payment_frequency} onChange={set('payment_frequency')} options={FREQ_OPTIONS} required error={errors.payment_frequency} />
                  <FieldError msg={errors.payment_frequency} />
                </div>
                <div>
                  <Input label={`Total Annual Fee (${org.currency_symbol})`} type="number" value={(form as any).annual_fee} onChange={set('annual_fee')} placeholder="0.00" required error={errors.annual_fee} />
                  <FieldError msg={errors.annual_fee} />
                </div>
              </>
            )}
          </div>
        )}

        {/* Step 2 — Ownership */}
        {step === 2 && (
          <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 16 }}>
            <SectionDivider label="Ownership & Management" />
            <Input label="Fund Owner / Manager" value={form.owner} onChange={set('owner')} placeholder="Assigned to (role or name)" />
          </div>
        )}

        {/* Step 3 — Review */}
        {step === 3 && (
          <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 10 }}>
            <SectionDivider label="Review Fund Details" />
            {[
              [`${org.fund_label} Name`, form.name],
              ['Type',          form.fund_type === 'internal' ? 'Internal' : 'External'],
              ['Required?',     form.is_required ? 'Yes — all members' : 'No'],
              ['Pay Frequency', (form as any).payment_frequency || '—'],
              ['Annual Fee',    (form as any).annual_fee ? `${org.currency_symbol}${(form as any).annual_fee}` : '—'],
              ['Owner',         form.owner || '—'],
              ['Status',        'Active (Default)'],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex' as const, gap: 16, padding: '9px 0', borderBottom: '1px solid var(--border-inner)', fontSize: 13.5 }}>
                <div style={{ width: 160, color: 'var(--text-muted)', flexShrink: 0 }}>{k}</div>
                <div style={{ fontWeight: 500 }}>{v || '—'}</div>
              </div>
            ))}
          </div>
        )}

        {/* Navigation */}
        <div style={{ display: 'flex' as const, justifyContent: 'space-between', marginTop: 28 }}>
          <Button variant="secondary" onClick={() => { setErrors({}); setStep(s => Math.max(0, s - 1)) }} disabled={step === 0}>← Back</Button>
          {step < STEPS.length - 1
            ? <Button onClick={handleContinue}>Continue →</Button>
            : <Button variant="success" onClick={() => setFeedback(true)}>✓ Create {org.fund_label}</Button>
          }
        </div>
      </Card>

      {/* RIGHT — Live Preview (hidden on mobile to save space) */}
      {!isMobile && (
        <Card style={{ padding: 20 }}>
          <LivePreview form={form} org={org} />
        </Card>
      )}
    </div>
    <ResponseModal open={feedback} onClose={() => { setFeedback(false); window.location.hash = '/funds' }}
      variant="success" title={`${org.fund_label} Created!`} message={`The fund has been successfully created.`} confirmLabel="Go to Funds" />
    </>
  )
}
