// AddFund.jsx — 4-step wizard to create a new fund/wallet
import { useState } from 'react'
import { Card, Button, Input, Select, Textarea, StepWizard, PageHeader, SectionDivider } from '../../components/ui'
import { useOrg } from '../../context/OrgContext'

const STEPS = ['Fund Info', 'Financial', 'Ownership', 'Review']
const FREQ_OPTIONS = [{ value: 'monthly', label: 'Monthly' },{ value: 'quarterly', label: 'Quarterly' },{ value: 'annually', label: 'Annually' }]
const TYPE_OPTIONS = [{ value: 'internal', label: 'Internal (Member Required)' },{ value: 'external', label: 'External (Donations/Sponsors)' }]

export default function AddFund() {
  const org  = useOrg()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({ name: '', description: '', fund_type: 'internal', is_required: false, payment_frequency: '', annual_fee: '', owner: '' })
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <PageHeader title={`Create New ${org.fund_label}`} subtitle="Set up a new financial account for your organization" />
      <StepWizard steps={STEPS} current={step} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: 20, alignItems: 'flex-start' }}>
        <Card style={{ padding: 28 }}>
          {step === 0 && <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <SectionDivider label="Fund Information" />
            <Input label={`${org.fund_label} Name`} value={form.name} onChange={set('name')} placeholder="e.g. Membership Dues, Project Fund" required />
            <Textarea label="Description" value={form.description} onChange={set('description')} placeholder="What is this fund for?" rows={3} />
          </div>}
          {step === 1 && <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <SectionDivider label="Financial Settings" />
            <Select label="Fund Type" value={form.fund_type} onChange={set('fund_type')} options={TYPE_OPTIONS} />
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5, cursor: 'pointer' }}>
              <input type="checkbox" checked={form.is_required} onChange={e => setForm(f => ({ ...f, is_required: e.target.checked }))} style={{ accentColor: 'var(--accent)' }} />
              Required for all members
            </label>
            {form.is_required && <>
              <Select label="Payment Frequency" value={form.payment_frequency} onChange={set('payment_frequency')} options={FREQ_OPTIONS} />
              <Input label="Total Annual Fee (₱)" type="number" value={form.annual_fee} onChange={set('annual_fee')} placeholder="0.00" />
            </>}
          </div>}
          {step === 2 && <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <SectionDivider label="Ownership" />
            <Input label="Fund Owner / Manager" value={form.owner} onChange={set('owner')} placeholder="Assigned to (role or name)" />
          </div>}
          {step === 3 && <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <SectionDivider label="Review" />
            {[['Fund Name', form.name],['Type', form.fund_type],['Required', form.is_required ? 'Yes' : 'No'],['Pay Frequency', form.payment_frequency || '—'],['Annual Fee', form.annual_fee ? `₱${form.annual_fee}` : '—'],['Status', 'Active (Default)']].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', gap: 16, padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: 13.5 }}>
                <div style={{ width: 160, color: 'var(--text-muted)', flexShrink: 0 }}>{k}</div>
                <div style={{ fontWeight: 500 }}>{v || '—'}</div>
              </div>
            ))}
          </div>}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
            <Button variant="secondary" onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}>← Back</Button>
            {step < STEPS.length - 1
              ? <Button onClick={() => setStep(s => s + 1)}>Continue →</Button>
              : <Button variant="success" onClick={() => alert('Fund created!')}>✓ Create {org.fund_label}</Button>
            }
          </div>
        </Card>
        <Card style={{ padding: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 14 }}>Live Preview</div>
          {[['Fund Name', form.name],['Description', form.description],['Currency', 'PHP'],['Status', 'Active'],['Payment Required?', form.is_required ? 'Yes' : 'No'],['Owner', form.owner || '—']].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid var(--border)', fontSize: 12.5 }}>
              <span style={{ color: 'var(--text-muted)' }}>{k}</span>
              <span style={{ color: v ? 'var(--text-primary)' : 'var(--border)', fontWeight: v ? 500 : 400 }}>{v || '—'}</span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  )
}
