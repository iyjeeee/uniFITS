// parts/UtilityCategoryStep.tsx — Step 1: six expense category cards (3-column grid); "Other" reveals a custom type input
import { SectionDivider, Input } from '../../../components/ui'
import { FieldError, ToggleCard } from '../../../components/FormWizard'
import { IcoElec, IcoWater, IcoNet, IcoRent, IcoVenue, IcoOther } from './AddUtilityIcons'

interface Props { form: Record<string, string>; errors: Record<string, string>; onPick: (value: string) => void; onChange: (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void }

export default function UtilityCategoryStep({ form, errors, onPick, onChange }: Props) {
  const categoryCards = [
    { value: 'Electricity Bill', icon: <IcoElec  />, label: 'Electricity Bill' },
    { value: 'Water Bill',       icon: <IcoWater />, label: 'Water Bill'       },
    { value: 'Internet Service', icon: <IcoNet   />, label: 'Internet'         },
    { value: 'Office Rent',      icon: <IcoRent  />, label: 'Office Rent'      },
    { value: 'Venue Rental',     icon: <IcoVenue />, label: 'Venue Rental'     },
    { value: 'Other',            icon: <IcoOther />, label: 'Other'            },
  ]

  return (
    <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 16 }}>
      <SectionDivider label="Expense Category" />
      <p style={{ margin: 0, fontSize: 13.5, color: 'var(--text-muted)' }}>What type of utility or operational expense is this?</p>
      <div style={{ display: 'grid' as const, gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
        {categoryCards.map((c) => (
          <ToggleCard key={c.value} variant="category" icon={c.icon} label={c.label} value={c.value} current={form.expense_type} hasError={!!errors.expense_type} onClick={onPick} />
        ))}
      </div>
      <FieldError msg={errors.expense_type} />
      {/* Custom type input when Other is selected */}
      {form.expense_type === 'Other' && (
        <div>
          <Input label="Specify Type" value={form.custom_type || ''} onChange={onChange('custom_type')} placeholder="e.g. Maintenance, Supplies…" required error={errors.custom_type} />
          <FieldError msg={errors.custom_type} />
        </div>
      )}
    </div>
  )
}
