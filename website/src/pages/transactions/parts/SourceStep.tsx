// parts/SourceStep.tsx — Step 1: who the transaction is from (member / officer / external) + member select
import { SectionDivider, Select } from '../../../components/ui'
import { FieldError, ToggleCard } from '../../../components/FormWizard'
import { IcoMember, IcoOfficer, IcoGlobe } from './AddTransactionIcons'
import type { OrgConfig } from '../../../types'

interface Props { form: Record<string, string>; errors: Record<string, string>; org: OrgConfig; onPick: (key: string, value: string, reset?: Record<string, string>) => void; onChange: (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void; userOptions: { value: string; label: string }[] }

export default function SourceStep({ form, errors, org, onPick, onChange, userOptions }: Props) {
  return (
    <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 16 }}>
      <SectionDivider label="Transaction Source" />
      <p style={{ margin: 0, fontSize: 13.5, color: 'var(--text-muted)' }}>Who is this transaction from?</p>
      <div style={{ display: 'flex' as const, gap: 10, flexWrap: 'wrap' }}>
        <ToggleCard icon={<IcoMember />}  label={org.people_label}  sublabel="Regular member contribution"  value="member"   current={form.source} hasError={!!errors.source} onClick={(v) => onPick('source', v, { user_id: '' })} />
        <ToggleCard icon={<IcoOfficer />} label="Officer"            sublabel="Officer or admin transaction" value="officer"  current={form.source} hasError={!!errors.source} onClick={(v) => onPick('source', v, { user_id: '' })} />
        <ToggleCard icon={<IcoGlobe />}   label="External / Sponsor" sublabel="Outside donor or sponsor"    value="external" current={form.source} hasError={!!errors.source} onClick={(v) => onPick('source', v, { user_id: '' })} />
      </div>
      <FieldError msg={errors.source} />
      {(form.source === 'member' || form.source === 'officer') && (
        <div>
          <Select label={`Select ${org.people_label}`} value={form.user_id} onChange={onChange('user_id')} options={userOptions} placeholder="-- Choose member --" required error={errors.user_id} />
          <FieldError msg={errors.user_id} />
        </div>
      )}
    </div>
  )
}
