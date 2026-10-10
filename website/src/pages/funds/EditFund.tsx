// EditFund.jsx — Edit an existing fund's settings
import { useState } from 'react'
import { Button, Card, Input, PageHeader, SectionDivider, Select, Textarea, ResponseModal } from '../../components/ui'
import { MOCK_FUNDS } from '../../api/mockData'
import { useOrg } from '../../context/OrgContext'

const STATUS_OPTIONS = [{ value: 'active', label: 'Active' },{ value: 'inactive', label: 'Inactive' }]
const FREQ_OPTIONS   = [{ value: 'monthly', label: 'Monthly' },{ value: 'quarterly', label: 'Quarterly' },{ value: 'annually', label: 'Annually' }]

export default function EditFund({ fundId = '1' }: Record<string, any>) {
  const org  = useOrg()
  const fund = MOCK_FUNDS.find((f: any) => f.id === fundId) || MOCK_FUNDS[0]
  const [form, setForm] = useState<Record<string,any>>({ name: fund.name, description: fund.description || '', status: fund.status, is_required: fund.is_required, payment_frequency: fund.payment_frequency || '', annual_fee: fund.annual_fee || '' })
  const [feedback, setFeedback] = useState(false)  // success confirmation modal visibility
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setForm((f: any) => ({ ...f, [k]: e.target.value }))

  // Computed: required amount per period based on annual fee / frequency
  const computedRequired = form.annual_fee
    ? (form.payment_frequency === 'monthly'   ? form.annual_fee / 12
       : form.payment_frequency === 'quarterly' ? form.annual_fee / 4 : form.annual_fee)
    : 0

  return (
    <>
    <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 20 }}>
      <PageHeader title={`Edit ${org.fund_label}`} subtitle={fund.name} actions={
        <><Button variant="secondary" onClick={() => window.location.hash = '/funds'}>Cancel</Button><Button onClick={() => setFeedback(true)}>Apply Changes</Button></>
      } />
      <Card style={{ padding: 28 }}>
        <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 16 }}>
          <SectionDivider label="Edit Wallet Category" />
          <Input label="Fund Name"    value={form.name}        onChange={set('name')}        required />
          <Textarea label="Description" value={form.description} onChange={set('description')} rows={2} />
          <Select label="Currency" value="PHP" disabled options={[{ value: 'PHP', label: 'Philippine Peso (PHP)' }]} />
          <Select label="Status"   value={form.status} onChange={set('status')} options={STATUS_OPTIONS} />
          <label style={{ display: 'flex' as const, alignItems: 'center', gap: 10, fontSize: 13.5, cursor: 'pointer' as const }}>
            <input type="checkbox" checked={form.is_required} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setForm(f => ({ ...f, is_required: (e.target as HTMLInputElement).checked }))} style={{ accentColor: 'var(--accent)' }} />
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
    <ResponseModal open={feedback} onClose={() => { setFeedback(false); window.location.hash = '/funds' }}
      variant="success" title="Changes Saved!" message="The fund has been successfully updated." confirmLabel="Done" />
    </>
  )
}
