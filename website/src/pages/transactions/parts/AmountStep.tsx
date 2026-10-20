// parts/AmountStep.tsx — Step 5: amount (required, non-zero) and optional notes
import { SectionDivider, Input, Textarea } from '../../../components/ui'
import { FieldError } from '../../../components/FormWizard'
import type { OrgConfig } from '../../../types'

interface Props { form: Record<string, string>; errors: Record<string, string>; org: OrgConfig; onChange: (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void }

export default function AmountStep({ form, errors, org, onChange }: Props) {
  return (
    <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 16 }}>
      <SectionDivider label="Amount & Notes" />
      <div>
        <Input label={`Amount (${org.currency_symbol})`} type="number" value={form.amount} onChange={onChange('amount')} placeholder="0.00" required error={errors.amount} />
        <FieldError msg={errors.amount} />
      </div>
      <Textarea label="Additional Notes" value={form.notes} onChange={onChange('notes')} placeholder="Optional notes or remarks" rows={3} />
    </div>
  )
}
