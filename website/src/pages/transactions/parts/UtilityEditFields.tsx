// parts/UtilityEditFields.tsx — Inline edit form shown inside the detail modal while editing
import { Input, Select } from '../../../components/ui'
import { MOCK_FUNDS } from '../../../api/mockData'
import { UTILITY_STATUS_OPTIONS } from './utilitiesShared'
import type { UtilityEditForm } from './utilitiesShared'

interface Props { editForm: UtilityEditForm; onFormChange: (key: keyof UtilityEditForm, value: string) => void }

export default function UtilityEditFields({ editForm, onFormChange }: Props) {
  const fundOptions = MOCK_FUNDS.map((f) => ({ value: f.id, label: f.name }))
  return (
    <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 14 }}>
      <Input label="Category / Expense Type" value={editForm.expense_type} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => onFormChange('expense_type', e.target.value)} />
      <div style={{ display: 'grid' as const, gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <Input label="Total Amount (₱)" type="number" value={editForm.total_amount} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => onFormChange('total_amount', e.target.value)} />
        <Input label="Amount Paid (₱)"  type="number" value={editForm.amount_paid}  onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => onFormChange('amount_paid', e.target.value)} />
      </div>
      <Input label="Payment Date" type="date" value={editForm.payment_date} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => onFormChange('payment_date', e.target.value)} />
      <Input label="Paid To (Vendor / Biller)" value={editForm.paid_to} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => onFormChange('paid_to', e.target.value)} placeholder="e.g. Meralco, PLDT" />
      <Select label="Fund (Paid From)" value={editForm.fund_id ?? ''} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => onFormChange('fund_id', e.target.value)} options={fundOptions} placeholder="-- Select fund --" />
      <Select label="Status" value={editForm.status} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => onFormChange('status', e.target.value)} options={UTILITY_STATUS_OPTIONS} />
      <Input label="Notes" value={editForm.notes || ''} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => onFormChange('notes', e.target.value)} placeholder="Optional notes" />
    </div>
  )
}
