// parts/TransactionLivePreview.tsx — Right panel: live summary of the form values (hidden on mobile)
import { getSummaryRows } from './addTransactionShared'
import type { OrgConfig } from '../../../types'

export default function TransactionLivePreview({ form, org }: { form: Record<string, string>; org: OrgConfig }) {
  return (
    <div>
      <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' as const, letterSpacing: '.07em', marginBottom: 14 }}>Live Preview</div>
      {getSummaryRows(form, org, false).map(([k, v]) => (
        <div key={k} style={{ display: 'flex' as const, justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid var(--border-inner)', fontSize: 12.5, gap: 8 }}>
          <span style={{ color: 'var(--text-muted)', flexShrink: 0 }}>{k}</span>
          <span style={{ color: v && v !== '—' ? 'var(--text-primary)' : 'var(--border-card)', fontWeight: v && v !== '—' ? 500 : 400, textAlign: 'right' as const }}>{v}</span>
        </div>
      ))}
    </div>
  )
}
