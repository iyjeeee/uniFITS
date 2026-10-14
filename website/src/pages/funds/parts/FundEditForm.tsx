// parts/FundEditForm.tsx — Edit form shown inside the detail modal
import { Select } from '../../../components/ui'
import type { OrgConfig } from '../../../types'
import type { FundEditState } from './fundsShared'

/* ── Fund Edit form — shown inside InfoModal when editMode=true ───── */
export default function FundEditForm({ editForm, onFormChange, org }: { editForm: FundEditState | null; onFormChange: (key: keyof FundEditState, value: string) => void; org: OrgConfig }) {
  const FREQ_OPTIONS   = [{ value: 'monthly', label: 'Monthly' }, { value: 'quarterly', label: 'Quarterly' }, { value: 'annually', label: 'Annually' }]
  const STATUS_OPTIONS = [{ value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }]
  const field = (label: string, key: 'name' | 'description' | 'annual_fee', type = 'text', hint?: string) => (
    <div key={key} style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 3 }}>
      <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' as const, letterSpacing: '.04em' }}>{label}</label>
      <input type={type} value={editForm?.[key] ?? ''} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => onFormChange(key, e.target.value)}
        style={{ padding: '8px 11px', borderRadius: 8, border: '1.5px solid var(--border-card)', fontSize: 13, fontFamily: 'var(--font-body)', color: 'var(--text-primary)', background: '#fff', outline: 'none', width: '100%', boxSizing: 'border-box' as const }}
        onFocus={e => { e.target.style.borderColor = 'var(--accent)' }}
        onBlur={e  => { e.target.style.borderColor = 'var(--border-card)' }} />
      {hint && <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{hint}</div>}
    </div>
  )
  return (
    <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 14 }}>
      {field('Fund Name', 'name')}
      {field('Description', 'description')}
      {field(`Annual Fee (${org.currency_symbol})`, 'annual_fee', 'number', 'Leave blank if not applicable')}
      <Select label="Status" value={editForm?.status} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => onFormChange('status', e.target.value)} options={STATUS_OPTIONS} />
      {editForm?.is_required && (
        <Select label="Payment Frequency" value={editForm.payment_frequency || ''} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => onFormChange('payment_frequency', e.target.value)} options={FREQ_OPTIONS} />
      )}
    </div>
  )
}
