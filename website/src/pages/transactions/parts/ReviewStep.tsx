// parts/ReviewStep.tsx — Step 6: read-only summary of everything entered
import { SectionDivider } from '../../../components/ui'
import { getSummaryRows } from './addTransactionShared'
import type { OrgConfig } from '../../../types'

export default function ReviewStep({ form, org }: { form: Record<string, string>; org: OrgConfig }) {
  return (
    <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 10 }}>
      <SectionDivider label="Review Transaction" />
      {getSummaryRows(form, org, true).map(([k, v]) => (
        <div key={k} style={{ display: 'flex' as const, gap: 16, padding: '9px 0', borderBottom: '1px solid var(--border-inner)', fontSize: 13.5 }}>
          <div style={{ width: 160, color: 'var(--text-muted)', flexShrink: 0 }}>{k}</div>
          <div style={{ fontWeight: 500, textTransform: 'capitalize' as const }}>{v}</div>
        </div>
      ))}
    </div>
  )
}
