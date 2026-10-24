// parts/UtilityEditFields.tsx — Inline edit form shown inside the detail modal while editing
import { Input, Select } from '../../../components/ui'
import { MOCK_FUNDS } from '../../../api/mockData'
import type { UtilityEditForm } from './utilitiesShared'

interface Props { editForm: UtilityEditForm; onFormChange: (key: keyof UtilityEditForm, value: string) => void }

export default function UtilityEditFields({ editForm, onFormChange }: Props) {
  const fundOptions = MOCK_FUNDS.map((f) => ({ value: f.id, label: f.name }))
  return (
    <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 14 }}>
      <Input label="Category / Expense Type" value={editForm.expense_type} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => onFormChange('expense_type', e.target.value)} />
      <Input label="Total Amount (₱)" type="number" value={editForm.total_amount} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => onFormChange('total_amount', e.target.value)} />
      <Input label="Due Date" type="date" value={editForm.due_date} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => onFormChange('due_date', e.target.value)} />
      <Input label="Paid To (Vendor / Biller)" value={editForm.paid_to} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => onFormChange('paid_to', e.target.value)} placeholder="e.g. Meralco, PLDT" />
      <Select label="Fund (Paid From)" value={editForm.fund_id ?? ''} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => onFormChange('fund_id', e.target.value)} options={fundOptions} placeholder="-- Select fund --" />
      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Amount paid and status follow the approved payments recorded for this bill, so they cannot be edited here.</div>
      <Input label="Notes" value={editForm.notes || ''} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => onFormChange('notes', e.target.value)} placeholder="Optional notes" />
    </div>
  )
}
