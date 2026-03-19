// AddTransaction.jsx — 6-step wizard to record a new financial transaction
import { useState } from 'react'
import { Card, Button, Input, Select, Textarea, StepWizard, PageHeader, SectionDivider } from '../../components/ui'
import { MOCK_USERS, MOCK_FUNDS, MOCK_PROJECTS, MOCK_EVENTS, MOCK_PAYMENT_METHODS } from '../../api/mockData'
import { useOrg } from '../../context/OrgContext'

const STEPS = ['Source', 'Payment Method', 'Entry Type', 'Category', 'Amount', 'Review']
const ENTRY_OPTIONS    = [{ value: 'contribution', label: 'Contribution' },{ value: 'income', label: 'Income' },{ value: 'expense', label: 'Expense' }]
const CATEGORY_OPTIONS = [{ value: 'fund', label: 'Fund' },{ value: 'project', label: 'Project' },{ value: 'event', label: 'Event' },{ value: 'utility', label: 'Utility' }]

export default function AddTransaction() {
  const org  = useOrg()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({ source: '', user_id: '', payment_method_id: '', entry_type: '', category: '', activity_id: '', fund_id: '', amount: '', reference_number: '', notes: '' })
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const userOptions    = MOCK_USERS.map(u => ({ value: u.id, label: u.full_name }))
  const methodOptions  = MOCK_PAYMENT_METHODS.map(m => ({ value: m.id, label: m.name }))
  const fundOptions    = MOCK_FUNDS.map(f => ({ value: f.id, label: f.name }))
  const projectOptions = MOCK_PROJECTS.map(p => ({ value: p.id, label: p.title }))
  const eventOptions   = MOCK_EVENTS.map(e => ({ value: e.id, label: e.title }))

  // Activity options depend on selected category
  const activityOptions = form.category === 'project' ? projectOptions : form.category === 'event' ? eventOptions : []

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <PageHeader title={`Add ${org.transaction_label}`} subtitle="Record a new financial transaction" />
      <StepWizard steps={STEPS} current={step} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 20, alignItems: 'flex-start' }}>
        <Card style={{ padding: 28 }}>
          {step === 0 && <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <SectionDivider label="Transaction Source" />
            <p style={{ margin: 0, fontSize: 13.5, color: 'var(--text-muted)' }}>Who is this transaction from?</p>
            <div style={{ display: 'flex', gap: 12 }}>
              {['member','officer'].map(s => (
                <button key={s} onClick={() => setForm(f => ({ ...f, source: s }))} style={{ flex: 1, padding: '16px', borderRadius: 10, cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600, border: `2px solid ${form.source === s ? 'var(--accent)' : 'var(--border)'}`, background: form.source === s ? 'var(--accent-light)' : 'var(--white)', color: form.source === s ? 'var(--accent)' : 'var(--text-primary)', textTransform: 'capitalize' }}>
                  👤 {s === 'member' ? org.people_label : 'Officer'}
                </button>
              ))}
            </div>
            {form.source && <Select label={`Select ${org.people_label}`} value={form.user_id} onChange={set('user_id')} options={userOptions} placeholder="-- Choose --" />}
          </div>}

          {step === 1 && <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <SectionDivider label="Payment Method" />
            <Select label="Payment Method" value={form.payment_method_id} onChange={set('payment_method_id')} options={methodOptions} placeholder="-- Select payment method --" required />
          </div>}

          {step === 2 && <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <SectionDivider label="Entry Type" />
            <Select label="Entry Type" value={form.entry_type} onChange={set('entry_type')} options={ENTRY_OPTIONS} placeholder="-- Select type --" required />
          </div>}

          {step === 3 && <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <SectionDivider label="Category & Activity" />
            <Select label="Category" value={form.category} onChange={set('category')} options={CATEGORY_OPTIONS} placeholder="-- Select category --" required />
            {form.category === 'fund' && <Select label={`${org.fund_label}`} value={form.fund_id} onChange={set('fund_id')} options={fundOptions} placeholder="-- Select fund --" />}
            {['project','event'].includes(form.category) && <Select label="Activity" value={form.activity_id} onChange={set('activity_id')} options={activityOptions} placeholder="-- Select activity --" />}
          </div>}

          {step === 4 && <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <SectionDivider label="Amount & Notes" />
            <Input label={`Amount (${org.currency_symbol})`} type="number" value={form.amount} onChange={set('amount')} placeholder="0.00" required />
            <Textarea label="Additional Notes" value={form.notes} onChange={set('notes')} placeholder="Optional notes or remarks" rows={3} />
          </div>}

          {step === 5 && <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <SectionDivider label="Review Transaction" />
            {[['Source', form.source],['Payment Method ID', form.payment_method_id],['Entry Type', form.entry_type],['Category', form.category],['Amount', form.amount ? `${org.currency_symbol}${form.amount}` : '—'],['Notes', form.notes || '—']].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', gap: 16, padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: 13.5 }}>
                <div style={{ width: 160, color: 'var(--text-muted)', flexShrink: 0 }}>{k}</div>
                <div style={{ fontWeight: 500, textTransform: 'capitalize' }}>{v || '—'}</div>
              </div>
            ))}
          </div>}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
            <Button variant="secondary" onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}>← Back</Button>
            {step < STEPS.length - 1
              ? <Button onClick={() => setStep(s => s + 1)}>Continue →</Button>
              : <Button variant="success" onClick={() => alert('Transaction recorded!')}>✓ Record {org.transaction_label}</Button>
            }
          </div>
        </Card>

        {/* Live preview */}
        <Card style={{ padding: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 14 }}>Live Preview</div>
          {[['Source Name', form.source],['Payment Method', form.payment_method_id],['Entry Type', form.entry_type],['Category', form.category],['Amount', form.amount ? `${org.currency_symbol}${form.amount}` : '—'],['Notes', form.notes || '—']].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid var(--border)', fontSize: 12.5 }}>
              <span style={{ color: 'var(--text-muted)' }}>{k}</span>
              <span style={{ color: v ? 'var(--text-primary)' : 'var(--border)', fontWeight: v ? 500 : 400, textTransform: 'capitalize' }}>{v || '—'}</span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  )
}
