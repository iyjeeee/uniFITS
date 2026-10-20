// parts/CategoryStep.tsx — Step 4: fund / project / event / utility cards + the dependent fund or activity select
import { SectionDivider, Select } from '../../../components/ui'
import { FieldError } from '../../../components/FormWizard'
import TransactionToggleCard from './TransactionToggleCard'
import { IcoFund, IcoProject, IcoEvent, IcoUtility } from './AddTransactionIcons'
import type { OrgConfig } from '../../../types'

interface Props { form: Record<string, string>; errors: Record<string, string>; org: OrgConfig; onPick: (key: string, value: string, reset?: Record<string, string>) => void; onChange: (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void; fundOptions: { value: string; label: string }[]; activityOptions: { value: string; label: string }[] }

export default function CategoryStep({ form, errors, org, onPick, onChange, fundOptions, activityOptions }: Props) {
  return (
    <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 16 }}>
      <SectionDivider label="Category & Activity" />
      <p style={{ margin: 0, fontSize: 13.5, color: 'var(--text-muted)' }}>What does this transaction belong to?</p>
      <div style={{ display: 'grid' as const, gridTemplateColumns: 'repeat(2,1fr)', gap: 10 }}>
        <TransactionToggleCard icon={<IcoFund />}    label={`${org.fund_label}`}                   sublabel="Fund or wallet transaction"   value="fund"    current={form.category} hasError={!!errors.category} onClick={(v) => onPick('category', v, { activity_id: '', fund_id: '' })} />
        <TransactionToggleCard icon={<IcoProject />} label={`${org.project_label}`}                sublabel="Project-related transaction"  value="project" current={form.category} hasError={!!errors.category} onClick={(v) => onPick('category', v, { activity_id: '', fund_id: '' })} />
        <TransactionToggleCard icon={<IcoEvent />}   label={`${org.event_label}`}                  sublabel="Event-related transaction"    value="event"   current={form.category} hasError={!!errors.category} onClick={(v) => onPick('category', v, { activity_id: '', fund_id: '' })} />
        <TransactionToggleCard icon={<IcoUtility />} label={`${org.utility_label || 'Utility'}`}  sublabel="Operational expense"          value="utility" current={form.category} hasError={!!errors.category} onClick={(v) => onPick('category', v, { activity_id: '', fund_id: '' })} />
      </div>
      <FieldError msg={errors.category} />
      {/* Secondary selectors with validation feedback */}
      {form.category === 'fund' && (
        <div>
          <Select label={`Select ${org.fund_label}`} value={form.fund_id} onChange={onChange('fund_id')} options={fundOptions} placeholder="-- Select fund --" required error={errors.fund_id} />
          <FieldError msg={errors.fund_id} />
        </div>
      )}
      {['project', 'event'].includes(form.category) && (
        <div>
          <Select label="Select Activity" value={form.activity_id} onChange={onChange('activity_id')} options={activityOptions} placeholder="-- Select activity --" required error={errors.activity_id} />
          <FieldError msg={errors.activity_id} />
        </div>
      )}
    </div>
  )
}
