// AddUtility.jsx — 3-col layout: StepSidebar | Form | Live Preview
// Consistent with AddEmployee, AddProject, AddEvent, AddFund, AddTransaction
import { useState } from 'react'
import { Card, Button, Input, Select, Textarea, SectionDivider } from '../../components/ui'
import { MOCK_FUNDS, formatDate } from '../../api/mockData'
import { useOrg } from '../../context/OrgContext'
import useBreakpoint from '../../hooks/useBreakpoint'

const STEPS = ['Category', 'Payment Info', 'Amount', 'Review']

const EXPENSE_TYPES = [
  { value: 'Electricity Bill', label: 'Electricity Bill' },
  { value: 'Water Bill',       label: 'Water Bill'       },
  { value: 'Internet Service', label: 'Internet Service' },
  { value: 'Office Rent',      label: 'Office Rent'      },
  { value: 'Venue Rental',     label: 'Venue Rental'     },
  { value: 'Maintenance',      label: 'Maintenance'      },
  { value: 'Supplies',         label: 'Office Supplies'  },
  { value: 'Other',            label: 'Other'            },
]
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

const CATEGORY_ICONS = {
  'Electricity Bill': <IcoElec  />, 'Water Bill':     <IcoWater />,
  'Internet Service': <IcoNet   />, 'Office Rent':    <IcoRent  />,
  'Venue Rental':     <IcoVenue />, 'Other':          <IcoOther />,
}

/* ── StepSidebar ─────────────────────────────────────────────────── */
function StepSidebar({ steps, current }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {steps.map((label, i) => {
        const done = i < current, active = i === current
        return (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 14px', borderRadius: 9,
            background: active ? 'var(--accent-light)' : done ? 'var(--success-light)' : 'transparent',
            border: '1.5px solid ' + (active ? 'rgba(75,94,170,.3)' : done ? 'rgba(46,125,82,.2)' : 'var(--border-card)'),
          }}>
            <div style={{ width: 26, height: 26, borderRadius: '50%', background: done ? '#2E7D52' : active ? 'var(--accent)' : 'var(--border-card)', color: done || active ? '#fff' : 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11.5, fontWeight: 700, flexShrink: 0 }}>
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

/* ── ToggleCard — category selection card ────────────────────────── */
function ToggleCard({ icon, label, value, current, onClick }) {
  const active = current === value
  return (
    <button onClick={() => onClick(value)} style={{
      flex: 1, minWidth: '45%', padding: '14px 12px', borderRadius: 12, cursor: 'pointer',
      fontFamily: 'var(--font-body)', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 6,
      border: `2px solid ${active ? 'var(--accent)' : 'var(--border-card)'}`,
      background: active ? 'var(--accent-light)' : 'var(--white)', transition: 'all .15s',
    }}>
      <div style={{ color: active ? 'var(--accent)' : 'var(--text-muted)' }}>{icon}</div>
      <div style={{ fontSize: 13, fontWeight: 700, color: active ? 'var(--accent)' : 'var(--text-primary)' }}>{label}</div>
    </button>
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
        ['Category',     form.expense_type || '—'],
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
  const [form, setForm] = useState({
    expense_type: '', paid_to: '', fund_id: '',
    payment_date: '', total_amount: '', amount_paid: '',
    status: 'unpaid', notes: '',
  })
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))
  const fundOptions = MOCK_FUNDS.map(f => ({ value: f.id, label: f.name }))

  const categoryCards = [
    { value: 'Electricity Bill', icon: <IcoElec  />, label: 'Electricity Bill' },
    { value: 'Water Bill',       icon: <IcoWater />, label: 'Water Bill'       },
    { value: 'Internet Service', icon: <IcoNet   />, label: 'Internet'         },
    { value: 'Office Rent',      icon: <IcoRent  />, label: 'Office Rent'      },
    { value: 'Venue Rental',     icon: <IcoVenue />, label: 'Venue Rental'     },
    { value: 'Other',            icon: <IcoOther />, label: 'Other'            },
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '200px 1fr 240px', gap: 14, alignItems: 'stretch' }}>

      {/* LEFT — Step sidebar */}
      <Card style={{ padding: '18px 14px' }}>
        <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 12 }}>Steps</div>
        <StepSidebar steps={STEPS} current={step} />
      </Card>

      {/* MIDDLE — Form */}
      <Card style={{ padding: 24 }}>

        {/* Step 0 — Category */}
        {step === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <SectionDivider label="Expense Category" />
            <p style={{ margin: 0, fontSize: 13.5, color: 'var(--text-muted)' }}>What type of utility or operational expense is this?</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
              {categoryCards.map(c => (
                <ToggleCard key={c.value} icon={c.icon} label={c.label} value={c.value} current={form.expense_type} onClick={v => setForm(f => ({ ...f, expense_type: v }))} />
              ))}
            </div>
            {/* Custom type input if Other selected */}
            {form.expense_type === 'Other' && (
              <Input label="Specify Type" value={form.custom_type || ''} onChange={e => setForm(f => ({ ...f, custom_type: e.target.value }))} placeholder="e.g. Maintenance, Supplies…" />
            )}
          </div>
        )}

        {/* Step 1 — Payment Info */}
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <SectionDivider label="Payment Information" />
            <Input label="Paid To (Vendor / Biller)" value={form.paid_to} onChange={set('paid_to')} placeholder="e.g. Meralco, PLDT, Manila Hotel" required />
            <Select label={`Fund (Paid From)`} value={form.fund_id} onChange={set('fund_id')} options={fundOptions} placeholder="-- Select fund --" required />
            <Input label="Payment Date" type="date" value={form.payment_date} onChange={set('payment_date')} required />
          </div>
        )}

        {/* Step 2 — Amount */}
        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <SectionDivider label="Amount & Status" />
            <Input label={`Total Amount (${org.currency_symbol})`} type="number" value={form.total_amount} onChange={set('total_amount')} placeholder="0.00" required />
            <Input label={`Amount Paid (${org.currency_symbol})`}  type="number" value={form.amount_paid}  onChange={set('amount_paid')}  placeholder="0.00" />
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
              return [
                ['Category',     form.expense_type || '—'],
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
          <Button variant="secondary" onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}>← Back</Button>
          {step < STEPS.length - 1
            ? <Button onClick={() => setStep(s => s + 1)}>Continue →</Button>
            : <Button variant="success" onClick={() => alert(`${org.utility_label} recorded!`)}>✓ Record {org.utility_label}</Button>
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
  )
}
