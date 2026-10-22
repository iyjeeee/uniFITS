// parts/UtilityPaymentStep.tsx — Step 2: paid to (vendor), fund, payment date (not in the future)
import { SectionDivider, Input, Select } from '../../../components/ui'
import { FieldError } from '../../../components/FormWizard'

interface Props { form: Record<string, string>; errors: Record<string, string>; fundOptions: { value: string; label: string }[]; onChange: (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void }

export default function UtilityPaymentStep({ form, errors, fundOptions, onChange }: Props) {
  return (
    <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 16 }}>
      <SectionDivider label="Payment Information" />
      <div>
        <Input label="Paid To (Vendor / Biller)" value={form.paid_to} onChange={onChange('paid_to')} placeholder="e.g. Meralco, PLDT, Manila Hotel" required error={errors.paid_to} />
        <FieldError msg={errors.paid_to} />
      </div>
      <div>
        <Select label="Fund (Paid From)" value={form.fund_id} onChange={onChange('fund_id')} options={fundOptions} placeholder="-- Select fund --" required error={errors.fund_id} />
        <FieldError msg={errors.fund_id} />
      </div>
      <div>
        <Input label="Payment Date" type="date" value={form.payment_date} onChange={onChange('payment_date')} required error={errors.payment_date} />
        <FieldError msg={errors.payment_date} />
      </div>
    </div>
  )
}
