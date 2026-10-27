// itemDetail/FundingProgress.tsx — Funding progress bar (kind-colored) with raised / goal captions; shown only when a target exists
import { formatCurrency } from '../../api/mockData'
import type { ProjectWithFunding, EventWithFunding, OrgConfig } from '../../types'

interface Props { item: ProjectWithFunding | EventWithFunding; pct: number; accentC: string; bgC: string; org: OrgConfig }

export default function FundingProgress({ item, pct, accentC, bgC, org }: Props) {
  return (
  <div style={{ padding: '16px 18px', borderRadius: 10, background: bgC, border: `1px solid ${accentC}25` }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
      <span style={{ fontWeight: 600, color: accentC }}>Funding Progress</span>
      <span style={{ fontWeight: 700, color: accentC }}>{pct}%</span>
    </div>
    <div style={{ height: 10, background: 'rgba(0,0,0,.08)', borderRadius: 10, overflow: 'hidden' }}>
      <div style={{ height: '100%', background: accentC, width: `${pct}%`, borderRadius: 10 }} />
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, color: 'var(--text-muted)', marginTop: 6 }}>
      <span>{formatCurrency(item.current_funding, org.currency_symbol)} raised</span>
      <span>{formatCurrency(item.target_funding, org.currency_symbol)} goal</span>
    </div>
  </div>
  )
}
