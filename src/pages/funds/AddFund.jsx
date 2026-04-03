// AddFund.jsx — 3-col layout: StepSidebar | Form | Live Preview
// Consistent with AddEmployee, AddProject, AddEvent — no PageHeader title block
import { useState } from 'react'
import { Card, Button, Input, Select, Textarea, SectionDivider } from '../../components/ui'
import { useOrg } from '../../context/OrgContext'
import useBreakpoint from '../../hooks/useBreakpoint'

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

/* ── StepSidebar — vertical step indicator matching AddProject/AddEvent ── */
function StepSidebar({ steps, current }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {steps.map((label, i) => {
        const done   = i < current
        const active = i === current
        return (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 14px', borderRadius: 9,
            background: active ? 'var(--accent-light)' : done ? 'var(--success-light)' : 'transparent',
            border: '1.5px solid ' + (active ? 'rgba(75,94,170,.3)' : done ? 'rgba(46,125,82,.2)' : 'var(--border-card)'),
          }}>
            <div style={{
              width: 26, height: 26, borderRadius: '50%',
              background: done ? '#2E7D52' : active ? 'var(--accent)' : 'var(--border-card)',
              color: done || active ? '#fff' : 'var(--text-muted)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11.5, fontWeight: 700, flexShrink: 0,
            }}>
              {done ? '✓' : i + 1}
            </div>
            <span style={{ fontSize: 13, fontWeight: active ? 700 : done ? 600 : 400, color: active ? 'var(--accent)' : done ? 'var(--success)' : 'var(--text-muted)' }}>
              {label}
            </span>
          </div>
        )
      })}
    </div>
  )
}

/* ── LivePreview — right panel showing form values as they are typed ── */
function LivePreview({ form, org }) {
  const cap = s => s ? s.charAt(0).toUpperCase() + s.slice(1) : '—'
  return (
    <div>
      <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 14 }}>
        Live Preview
      </div>
      {[
        [`${org.fund_label} Name`, form.name],
        ['Description',            form.description],
        ['Fund Type',              cap(form.fund_type)],
        ['Required?',              form.is_required ? 'Yes — all members' : 'No'],
        ['Pay Frequency',          form.is_required ? cap(form.payment_frequency) : '—'],
        ['Annual Fee',             form.is_required && form.annual_fee ? `₱${form.annual_fee}` : '—'],
        ['Owner / Manager',        form.owner || '—'],
        ['Currency',               'PHP'],
        ['Status',                 'Active (Default)'],
      ].map(([k, v]) => (
        <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid var(--border-inner)', fontSize: 12.5 }}>
          <span style={{ color: 'var(--text-muted)' }}>{k}</span>
          <span style={{ color: v && v !== '—' ? 'var(--text-primary)' : 'var(--border-card)', fontWeight: v && v !== '—' ? 500 : 400 }}>
            {v || '—'}
          </span>
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
  const [form, setForm] = useState({
    name: '', description: '', fund_type: 'internal',
    is_required: false, payment_frequency: '', annual_fee: '', owner: '',
  })
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  return (
    /* 3-col layout: sidebar | form | preview — collapses to 1-col on mobile */
    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '200px 1fr 240px', gap: 14, alignItems: 'stretch' }}>

      {/* LEFT — Step sidebar */}
      <Card style={{ padding: '18px 14px' }}>
        <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 12 }}>Steps</div>
        <StepSidebar steps={STEPS} current={step} />
      </Card>

      {/* MIDDLE — Form */}
      <Card style={{ padding: 24 }}>

        {/* Step 0 — Fund Info */}
        {step === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <SectionDivider label="Fund Information" />
            <Input label={`${org.fund_label} Name`} value={form.name} onChange={set('name')} placeholder="e.g. Membership Dues, Project Fund" required />
            <Textarea label="Description" value={form.description} onChange={set('description')} placeholder="What is this fund used for?" rows={3} />
          </div>
        )}

        {/* Step 1 — Financial Settings */}
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <SectionDivider label="Financial Settings" />
            <Select label="Fund Type" value={form.fund_type} onChange={set('fund_type')} options={TYPE_OPTIONS} />
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5, cursor: 'pointer', userSelect: 'none' }}>
              <input
                type="checkbox"
                checked={form.is_required}
                onChange={e => setForm(f => ({ ...f, is_required: e.target.checked }))}
                style={{ accentColor: 'var(--accent)', width: 16, height: 16 }}
              />
              Required for all members
            </label>
            {form.is_required && (
              <>
                <Select label="Payment Frequency" value={form.payment_frequency} onChange={set('payment_frequency')} options={FREQ_OPTIONS} />
                <Input label={`Total Annual Fee (${org.currency_symbol})`} type="number" value={form.annual_fee} onChange={set('annual_fee')} placeholder="0.00" />
              </>
            )}
          </div>
        )}

        {/* Step 2 — Ownership */}
        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <SectionDivider label="Ownership & Management" />
            <Input label="Fund Owner / Manager" value={form.owner} onChange={set('owner')} placeholder="Assigned to (role or name)" />
          </div>
        )}

        {/* Step 3 — Review */}
        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <SectionDivider label="Review Fund Details" />
            {[
              [`${org.fund_label} Name`, form.name],
              ['Type',          form.fund_type === 'internal' ? 'Internal' : 'External'],
              ['Required?',     form.is_required ? 'Yes — all members' : 'No'],
              ['Pay Frequency', form.payment_frequency || '—'],
              ['Annual Fee',    form.annual_fee ? `${org.currency_symbol}${form.annual_fee}` : '—'],
              ['Owner',         form.owner || '—'],
              ['Status',        'Active (Default)'],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', gap: 16, padding: '9px 0', borderBottom: '1px solid var(--border-inner)', fontSize: 13.5 }}>
                <div style={{ width: 160, color: 'var(--text-muted)', flexShrink: 0 }}>{k}</div>
                <div style={{ fontWeight: 500 }}>{v || '—'}</div>
              </div>
            ))}
          </div>
        )}

        {/* Navigation buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 28 }}>
          <Button variant="secondary" onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}>
            ← Back
          </Button>
          {step < STEPS.length - 1
            ? <Button onClick={() => setStep(s => s + 1)}>Continue →</Button>
            : <Button variant="success" onClick={() => alert('Fund created!')}>✓ Create {org.fund_label}</Button>
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
  )
}
