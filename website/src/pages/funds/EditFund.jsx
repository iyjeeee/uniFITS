// EditFund.jsx — Edit an existing fund's settings
import { useState } from 'react'
import { Card, Button, Input, Select, Textarea, PageHeader, SectionDivider } from '../../components/ui'
import { MOCK_FUNDS } from '../../api/mockData'
import { useOrg } from '../../context/OrgContext'

const STATUS_OPTIONS = [{ value: 'active', label: 'Active' },{ value: 'inactive', label: 'Inactive' }]
const FREQ_OPTIONS   = [{ value: 'monthly', label: 'Monthly' },{ value: 'quarterly', label: 'Quarterly' },{ value: 'annually', label: 'Annually' }]

export default function EditFund({ fundId = '1' }) {
  const org  = useOrg()
  const fund = MOCK_FUNDS.find(f => f.id === fundId) || MOCK_FUNDS[0]
  const [form, setForm] = useState({ name: fund.name, description: fund.description || '', status: fund.status, is_required: fund.is_required, payment_frequency: fund.payment_frequency || '', annual_fee: fund.annual_fee || '' })
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  // Computed: required amount per period based on annual fee / frequency
  const computedRequired = form.annual_fee
    ? (form.payment_frequency === 'monthly'   ? form.annual_fee / 12
       : form.payment_frequency === 'quarterly' ? form.annual_fee / 4 : form.annual_fee)
    : 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <PageHeader title={`Edit ${org.fund_label}`} subtitle={fund.name} actions={
        <><Button variant="secondary">Cancel</Button><Button onClick={() => alert('Saved!')}>Apply Changes</Button></>
      } />
      <Card style={{ padding: 28 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <SectionDivider label="Edit Wallet Category" />
          <Input label="Fund Name"    value={form.name}        onChange={set('name')}        required />
          <Textarea label="Description" value={form.description} onChange={set('description')} rows={2} />
          <Select label="Currency" value="PHP" disabled options={[{ value: 'PHP', label: 'Philippine Peso (PHP)' }]} />
          <Select label="Status"   value={form.status} onChange={set('status')} options={STATUS_OPTIONS} />
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5, cursor: 'pointer' }}>
            <input type="checkbox" checked={form.is_required} onChange={e => setForm(f => ({ ...f, is_required: e.target.checked }))} style={{ accentColor: 'var(--accent)' }} />
            Is Required to Pay
          </label>
          {form.is_required && (
            <>
              <Select label="Payment Frequency" value={form.payment_frequency} onChange={set('payment_frequency')} options={FREQ_OPTIONS} />
              <Input label="Total Annual Fee (₱)" type="number" value={form.annual_fee} onChange={set('annual_fee')} />
              <div style={{ padding: '12px 16px', background: 'var(--info-light)', borderRadius: 8, fontSize: 13.5 }}>
                <span style={{ color: 'var(--text-muted)' }}>Required Amount (Calculated):</span>
                <span style={{ fontWeight: 700, color: 'var(--info)', marginLeft: 10 }}>₱{Number(computedRequired).toLocaleString('en-PH', { minimumFractionDigits: 2 })}</span>
                <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 4 }}>Auto-calculated based on Annual Fee ÷ Payment Frequency</div>
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  )
}
