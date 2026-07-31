// AddUtility.jsx — 3-col layout: StepSidebar | Form | Live Preview
// Validation: per-step validation blocks Continue; shows inline field errors
import { useState } from 'react'
import { Card, Button, Input, Select, Textarea, SectionDivider, ResponseModal } from '../../components/ui'
import { MOCK_FUNDS } from '../../api/mockData'
import { useOrg } from '../../context/OrgContext'
import useBreakpoint from '../../hooks/useBreakpoint'
import { required, isNonZeroAmount, isPositiveNumber, isAmountPaidValid, isPastOrTodayDate, validateStep } from '../../utils/validation'

const STEPS = ['Category', 'Payment Info', 'Amount', 'Review']

const STATUS_OPTIONS = [
  { value: 'unpaid',  label: 'Unpaid'  },
  { value: 'partial', label: 'Partial' },
  { value: 'paid',    label: 'Paid'    },
]

/* ── SVG icons ───────────────────────────────────────────────────── */
function IcoElec()  { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> }
function IcoWater() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg> }
function IcoNet()   { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg> }
function IcoRent()  { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> }
function IcoVenue() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><line x1="12" y1="2" x2="12" y2="9"/></svg> }
function IcoOther() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> }

/* ── StepSidebar ─────────────────────────────────────────────────── */
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

/* ── ToggleCard — category card with error state support ─────────── */
function ToggleCard({ icon, label, value, current, onClick, hasError }) {
  const active = current === value
  return (
    <button onClick={() => onClick(value)} style={{
      flex: 1, minWidth: '45%', padding: '14px 12px', borderRadius: 12, cursor: 'pointer',
      fontFamily: 'var(--font-body)', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 6,
      border: `2px solid ${active ? 'var(--accent)' : hasError ? 'var(--danger)' : 'var(--border-card)'}`,
      background: active ? 'var(--accent-light)' : 'var(--white)', transition: 'all .15s',
    }}>
      <div style={{ color: active ? 'var(--accent)' : 'var(--text-muted)' }}>{icon}</div>
      <div style={{ fontSize: 13, fontWeight: 700, color: active ? 'var(--accent)' : 'var(--text-primary)' }}>{label}</div>
    </button>
  )
}

/* ── FieldError — inline error message ───────────────────────────── */
function FieldError({ msg }) {
  if (!msg) return null
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 3, fontSize: 12, color: 'var(--danger)', fontWeight: 500 }} role="alert">
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      {msg}
    </div>
  )
}

/* ── StepBanner — error summary banner ───────────────────────────── */
function StepBanner({ errors }) {
  const msgs = Object.values(errors).filter(Boolean)
  if (!msgs.length) return null
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 14px', borderRadius: 9, background: '#fff5f5', border: '1.5px solid rgba(192,57,43,.3)', marginBottom: 16 }} role="alert">
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
function LivePreview({ form, org }) {
  const cap = s => s ? s.charAt(0).toUpperCase() + s.slice(1) : '—'
  const selectedFund = MOCK_FUNDS.find(f => f.id === form.fund_id)
  return (
    <div>
      <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 14 }}>Live Preview</div>
      {[
        ['Category',     form.expense_type === 'Other' && form.custom_type ? form.custom_type : form.expense_type || '—'],
        ['Paid To',      form.paid_to || '—'],
        ['Fund',         selectedFund?.name || '—'],
        ['Payment Date', form.payment_date || '—'],
        ['Total Amount', form.total_amount ? `${org.currency_symbol}${form.total_amount}` : '—'],
        ['Amount Paid',  form.amount_paid  ? `${org.currency_symbol}${form.amount_paid}`  : '—'],
        ['Status',       cap(form.status)],
        ['Notes',        form.notes || '—'],
      ].map(([k, v]) => (
        <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid var(--border-inner)', fontSize: 12.5, gap: 8 }}>
          <span style={{ color: 'var(--text-muted)', flexShrink: 0 }}>{k}</span>
          <span style={{ color: v && v !== '—' ? 'var(--text-primary)' : 'var(--border-card)', fontWeight: v && v !== '—' ? 500 : 400, textAlign: 'right' }}>{v}</span>
        </div>
      ))}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════════ */
export default function AddUtility() {
  const org = useOrg()
  const { isMobile } = useBreakpoint()
  const [step, setStep] = useState(0)
  const [feedback, setFeedback] = useState(false)
  const [form, setForm] = useState({
    expense_type: '', custom_type: '', paid_to: '', fund_id: '',
    payment_date: '', total_amount: '', amount_paid: '',
    status: 'unpaid', notes: '',
  })
  const [errors, setErrors] = useState({})
  const set = k => e => { setForm(f => ({ ...f, [k]: e.target.value })); clearErr(k) }
  const clearErr = k => setErrors(p => { const n = { ...p }; delete n[k]; return n })
  const fundOptions = MOCK_FUNDS.map(f => ({ value: f.id, label: f.name }))

  const categoryCards = [
    { value: 'Electricity Bill', icon: <IcoElec  />, label: 'Electricity Bill' },
    { value: 'Water Bill',       icon: <IcoWater />, label: 'Water Bill'       },
    { value: 'Internet Service', icon: <IcoNet   />, label: 'Internet'         },
    { value: 'Office Rent',      icon: <IcoRent  />, label: 'Office Rent'      },
    { value: 'Venue Rental',     icon: <IcoVenue />, label: 'Venue Rental'     },
    { value: 'Other',            icon: <IcoOther />, label: 'Other'            },
  ]

  // stepValidators — rules per step index
  const stepValidators = [
    // Step 0 — Category
    () => {
      const errs = validateStep({ expense_type: [() => required(form.expense_type, 'Expense Category')] })
      // If Other selected, require a custom description
      if (form.expense_type === 'Other' && !form.custom_type?.trim()) errs.custom_type = 'Please specify the expense type.'
      return errs
    },
    // Step 1 — Payment Info
    () => validateStep({
      paid_to:      [() => required(form.paid_to, 'Vendor / Biller')],
      fund_id:      [() => required(form.fund_id, 'Fund')],
      payment_date: [
        () => required(form.payment_date, 'Payment Date'),
        () => isPastOrTodayDate(form.payment_date, 'Payment Date'),
      ],
    }),
    // Step 2 — Amount & Status
    () => {
      const errs = validateStep({
        total_amount: [() => isNonZeroAmount(form.total_amount, 'Total Amount')],
        amount_paid:  [() => isPositiveNumber(form.amount_paid, 'Amount Paid')],
      })
      // amount paid must not exceed total amount
      const crossErr = isAmountPaidValid(form.total_amount, form.amount_paid)
      if (crossErr) errs.amount_paid = crossErr
      return errs
    },
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
    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '200px 1fr 240px', gap: 14, alignItems: 'stretch' }}>

      {/* LEFT — Step sidebar */}
      <Card style={{ padding: '18px 14px' }}>
        <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 12 }}>Steps</div>
        <StepSidebar steps={STEPS} current={step} />
      </Card>

      {/* MIDDLE — Form */}
      <Card style={{ padding: 24 }}>
        <StepBanner errors={errors} />

        {/* Step 0 — Category */}
        {step === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <SectionDivider label="Expense Category" />
            <p style={{ margin: 0, fontSize: 13.5, color: 'var(--text-muted)' }}>What type of utility or operational expense is this?</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
              {categoryCards.map(c => (
                <ToggleCard key={c.value} icon={c.icon} label={c.label} value={c.value} current={form.expense_type} hasError={!!errors.expense_type} onClick={v => { setForm(f => ({ ...f, expense_type: v, custom_type: '' })); clearErr('expense_type') }} />
              ))}
            </div>
            <FieldError msg={errors.expense_type} />
            {/* Custom type input when Other is selected */}
            {form.expense_type === 'Other' && (
              <div>
                <Input label="Specify Type" value={form.custom_type || ''} onChange={set('custom_type')} placeholder="e.g. Maintenance, Supplies…" required error={errors.custom_type} />
                <FieldError msg={errors.custom_type} />
              </div>
            )}
          </div>
        )}

        {/* Step 1 — Payment Info */}
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <SectionDivider label="Payment Information" />
            <div>
              <Input label="Paid To (Vendor / Biller)" value={form.paid_to} onChange={set('paid_to')} placeholder="e.g. Meralco, PLDT, Manila Hotel" required error={errors.paid_to} />
              <FieldError msg={errors.paid_to} />
            </div>
            <div>
              <Select label="Fund (Paid From)" value={form.fund_id} onChange={set('fund_id')} options={fundOptions} placeholder="-- Select fund --" required error={errors.fund_id} />
              <FieldError msg={errors.fund_id} />
            </div>
            <div>
              <Input label="Payment Date" type="date" value={form.payment_date} onChange={set('payment_date')} required error={errors.payment_date} />
              <FieldError msg={errors.payment_date} />
            </div>
          </div>
        )}

        {/* Step 2 — Amount & Status */}
        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <SectionDivider label="Amount & Status" />
            <div>
              <Input label={`Total Amount (${org.currency_symbol})`} type="number" value={form.total_amount} onChange={set('total_amount')} placeholder="0.00" required error={errors.total_amount} />
              <FieldError msg={errors.total_amount} />
            </div>
            <div>
              <Input label={`Amount Paid (${org.currency_symbol})`} type="number" value={form.amount_paid} onChange={set('amount_paid')} placeholder="0.00" hint="Cannot exceed the total amount" error={errors.amount_paid} />
              <FieldError msg={errors.amount_paid} />
            </div>
            <Select label="Payment Status" value={form.status} onChange={set('status')} options={STATUS_OPTIONS} />
            <Textarea label="Notes" value={form.notes} onChange={set('notes')} placeholder="Optional notes or remarks" rows={3} />
          </div>
        )}

        {/* Step 3 — Review */}
        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <SectionDivider label={`Review ${org.utility_label}`} />
            {(() => {
              const cap = s => s ? s.charAt(0).toUpperCase() + s.slice(1) : '—'
              const selectedFund = MOCK_FUNDS.find(f => f.id === form.fund_id)
              const displayCategory = form.expense_type === 'Other' && form.custom_type
                ? form.custom_type
                : form.expense_type || '—'
              return [
                ['Category',     displayCategory],
                ['Paid To',      form.paid_to || '—'],
                ['Fund',         selectedFund?.name || '—'],
                ['Payment Date', form.payment_date || '—'],
                ['Total Amount', form.total_amount ? `${org.currency_symbol}${form.total_amount}` : '—'],
                ['Amount Paid',  form.amount_paid  ? `${org.currency_symbol}${form.amount_paid}`  : '—'],
                ['Status',       cap(form.status)],
                ['Notes',        form.notes || '—'],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', gap: 16, padding: '9px 0', borderBottom: '1px solid var(--border-inner)', fontSize: 13.5 }}>
                  <div style={{ width: 160, color: 'var(--text-muted)', flexShrink: 0 }}>{k}</div>
                  <div style={{ fontWeight: 500 }}>{v}</div>
                </div>
              ))
            })()}
          </div>
        )}

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 28 }}>
          <Button variant="secondary" onClick={() => { setErrors({}); setStep(s => Math.max(0, s - 1)) }} disabled={step === 0}>← Back</Button>
          {step < STEPS.length - 1
            ? <Button onClick={handleContinue}>Continue →</Button>
            : <Button variant="success" onClick={() => setFeedback(true)}>✓ Record {org.utility_label}</Button>
          }
        </div>
      </Card>

      {/* RIGHT — Live Preview (hidden on mobile) */}
      {!isMobile && (
        <Card style={{ padding: 20 }}>
          <LivePreview form={form} org={org} />
        </Card>
      )}
    </div>
      <ResponseModal open={feedback} onClose={() => { setFeedback(false); window.location.hash = '/transactions/utilities' }}
        variant="success" title="Utility Recorded!"
        message="The utility expense has been successfully recorded." confirmLabel="Go to Utilities" />
  </>
  )
}
