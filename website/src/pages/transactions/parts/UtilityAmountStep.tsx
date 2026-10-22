// parts/UtilityAmountStep.tsx — Step 3: total amount, amount paid (cannot exceed total), payment status, notes
import { SectionDivider, Input, Select, Textarea } from '../../../components/ui'
import { FieldError } from '../../../components/FormWizard'
import { UTILITY_STATUS_OPTIONS } from './utilitiesShared'
import type { OrgConfig } from '../../../types'

interface Props { form: Record<string, string>; errors: Record<string, string>; org: OrgConfig; onChange: (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void }

export default function UtilityAmountStep({ form, errors, org, onChange }: Props) {
  return (
    <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 16 }}>
      <SectionDivider label="Amount & Status" />
      <div>
        <Input label={`Total Amount (${org.currency_symbol})`} type="number" value={form.total_amount} onChange={onChange('total_amount')} placeholder="0.00" required error={errors.total_amount} />
        <FieldError msg={errors.total_amount} />
      </div>
      <div>
        <Input label={`Amount Paid (${org.currency_symbol})`} type="number" value={form.amount_paid} onChange={onChange('amount_paid')} placeholder="0.00" hint="Cannot exceed the total amount" error={errors.amount_paid} />
        <FieldError msg={errors.amount_paid} />
      </div>
      <Select label="Payment Status" value={form.status} onChange={onChange('status')} options={UTILITY_STATUS_OPTIONS} />
      <Textarea label="Notes" value={form.notes} onChange={onChange('notes')} placeholder="Optional notes or remarks" rows={3} />
    </div>
  )
}
