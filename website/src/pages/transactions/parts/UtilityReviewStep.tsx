// parts/UtilityReviewStep.tsx — Step 4: read-only summary of everything entered
import { SectionDivider } from '../../../components/ui'
import { getUtilitySummaryRows } from './addUtilityShared'
import type { OrgConfig } from '../../../types'

export default function UtilityReviewStep({ form, org }: { form: Record<string, string>; org: OrgConfig }) {
  return (
    <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 10 }}>
      <SectionDivider label={`Review ${org.utility_label}`} />
      {getUtilitySummaryRows(form, org).map(([k, v]) => (
        <div key={k} style={{ display: 'flex' as const, gap: 16, padding: '9px 0', borderBottom: '1px solid var(--border-inner)', fontSize: 13.5 }}>
          <div style={{ width: 160, color: 'var(--text-muted)', flexShrink: 0 }}>{k}</div>
          <div style={{ fontWeight: 500 }}>{v}</div>
        </div>
      ))}
    </div>
  )
}
