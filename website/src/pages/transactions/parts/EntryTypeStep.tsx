// parts/EntryTypeStep.tsx — Step 3: contribution / income / expense
import { SectionDivider } from '../../../components/ui'
import { FieldError, ToggleCard } from '../../../components/FormWizard'
import { IcoContrib, IcoIncome, IcoExpense } from './AddTransactionIcons'

interface Props { form: Record<string, string>; errors: Record<string, string>; onPick: (key: string, value: string, reset?: Record<string, string>) => void }

export default function EntryTypeStep({ form, errors, onPick }: Props) {
  return (
    <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 16 }}>
      <SectionDivider label="Entry Type" />
      <p style={{ margin: 0, fontSize: 13.5, color: 'var(--text-muted)' }}>What type of financial entry is this?</p>
      <div style={{ display: 'flex' as const, gap: 10, flexWrap: 'wrap' }}>
        <ToggleCard icon={<IcoContrib />} label="Contribution" sublabel="Member paying into a fund"    value="contribution" current={form.entry_type} hasError={!!errors.entry_type} onClick={(v) => onPick('entry_type', v)} />
        <ToggleCard icon={<IcoIncome  />} label="Income"       sublabel="External money received"      value="income"       current={form.entry_type} hasError={!!errors.entry_type} onClick={(v) => onPick('entry_type', v)} />
        <ToggleCard icon={<IcoExpense />} label="Expense"      sublabel="Money paid out or spent"      value="expense"      current={form.entry_type} hasError={!!errors.entry_type} onClick={(v) => onPick('entry_type', v)} />
      </div>
      <FieldError msg={errors.entry_type} />
    </div>
  )
}
