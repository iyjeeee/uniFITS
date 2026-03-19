// Utilities.jsx — Manage operational/utility expenses
import { useState } from 'react'
import { DataTable, Button, StatusBadge, Modal, Badge, PageHeader, Card, StepWizard, Input, Select, Textarea, SectionDivider } from '../../components/ui'
import { MOCK_UTILITIES, MOCK_FUNDS, formatCurrency, formatDate } from '../../api/mockData'
import { useOrg } from '../../context/OrgContext'

const STEPS = ['Details', 'Payment Info', 'Additional', 'Review']
const STATUS_OPTIONS = [{ value: 'unpaid', label: 'Unpaid' },{ value: 'partial', label: 'Partial' },{ value: 'paid', label: 'Paid' }]

export default function Utilities() {
  const org    = useOrg()
  const [data]  = useState(MOCK_UTILITIES)
  const [detail, setDetail]   = useState(null) // selected utility for detail modal
  const [showAdd, setShowAdd] = useState(false)
  const [step, setStep]       = useState(0)
  const [form, setForm]       = useState({ expense_type: '', total_amount: '', payment_date: '', paid_to: '', notes: '', fund_id: '', status: 'unpaid' })
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const fundOptions = MOCK_FUNDS.map(f => ({ value: f.id, label: f.name }))

  const columns = [
    { label: 'Category',    key: 'cat',    render: r => <span style={{ fontWeight: 600 }}>{r.expense_type}</span> },
    { label: 'Total',       key: 'total',  render: r => formatCurrency(r.total_amount, org.currency_symbol) },
    { label: 'Paid',        key: 'paid',   render: r => formatCurrency(r.amount_paid, org.currency_symbol) },
    { label: 'Remaining',   key: 'rem',    render: r => <span style={{ color: 'var(--danger)', fontWeight: 600 }}>{formatCurrency(r.total_amount - r.amount_paid, org.currency_symbol)}</span> },
    { label: 'Due Date',    key: 'due',    render: r => formatDate(r.payment_date) },
    { label: 'Paid To',     accessor: 'paid_to' },
    { label: 'Fund',        accessor: 'fund' },
    { label: 'Status',      key: 'st',     render: r => <StatusBadge status={r.status} /> },
    { label: 'Actions',     key: 'act',    render: r => (
      <div style={{ display: 'flex', gap: 6 }}>
        <Button variant="secondary" size="sm" onClick={() => setDetail(r)}>Details</Button>
        <Button variant="secondary" size="sm">Edit</Button>
        <Button variant="danger"    size="sm">Delete</Button>
      </div>
    )},
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <PageHeader
        title={`${org.utility_label}s`}
        subtitle="Track recurring operational expenses and payment status"
        actions={<Button onClick={() => setShowAdd(true)}>+ Add {org.utility_label}</Button>}
      />
      <DataTable columns={columns} data={data} title={`${org.utility_label} Data Table`} emptyMsg="No utility records found." />

      {/* Detail modal */}
      <Modal open={!!detail} onClose={() => setDetail(null)} title="Utility Details" width={460}>
        {detail && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[['Utilities ID', `#${detail.id}`],['Payment Date', formatDate(detail.payment_date)],['Status', detail.status],['Category', detail.expense_type],['Paid To', detail.paid_to || '—'],['Fund', detail.fund || '—'],['Total Required', formatCurrency(detail.total_amount, org.currency_symbol)],['Total Paid', formatCurrency(detail.amount_paid, org.currency_symbol)],['Remaining', formatCurrency(detail.total_amount - detail.amount_paid, org.currency_symbol)],['Notes', detail.notes || '—']].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', gap: 16, padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: 13.5 }}>
                <div style={{ width: 160, color: 'var(--text-muted)', flexShrink: 0 }}>{k}</div>
                <div style={{ fontWeight: 500 }}>{v}</div>
              </div>
            ))}
            <Button variant="secondary" onClick={() => setDetail(null)} style={{ marginTop: 8 }}>Close</Button>
          </div>
        )}
      </Modal>

      {/* Add Utility Modal with mini wizard */}
      <Modal open={showAdd} onClose={() => { setShowAdd(false); setStep(0) }} title={`Add ${org.utility_label}`} width={560}>
        <StepWizard steps={STEPS} current={step} />
        {step === 0 && <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <SectionDivider label="Utility Details" />
          <Input label="Expense Type" value={form.expense_type} onChange={set('expense_type')} placeholder="e.g. Electricity Bill, Office Rent" required />
          <Input label="Total Amount (₱)" type="number" value={form.total_amount} onChange={set('total_amount')} placeholder="0.00" required />
        </div>}
        {step === 1 && <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <SectionDivider label="Payment Information" />
          <Input label="Payment Date" type="date" value={form.payment_date} onChange={set('payment_date')} required />
          <Input label="Paid To (Vendor/Biller)" value={form.paid_to} onChange={set('paid_to')} placeholder="e.g. Meralco, PLDT" />
          <Select label="Payment Status" value={form.status} onChange={set('status')} options={STATUS_OPTIONS} />
        </div>}
        {step === 2 && <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <SectionDivider label="Additional Info" />
          <Select label="Fund (Paid From)" value={form.fund_id} onChange={set('fund_id')} options={fundOptions} placeholder="-- Select fund --" />
          <Textarea label="Notes" value={form.notes} onChange={set('notes')} placeholder="Additional notes or remarks" rows={3} />
        </div>}
        {step === 3 && <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <SectionDivider label="Review" />
          {[['Expense Type', form.expense_type],['Total Amount', form.total_amount ? `₱${form.total_amount}` : '—'],['Payment Date', form.payment_date],['Paid To', form.paid_to || '—'],['Status', form.status]].map(([k, v]) => (
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
            : <Button variant="success" onClick={() => { alert('Utility added!'); setShowAdd(false); setStep(0) }}>✓ Add {org.utility_label}</Button>
          }
        </div>
      </Modal>
    </div>
  )
}
