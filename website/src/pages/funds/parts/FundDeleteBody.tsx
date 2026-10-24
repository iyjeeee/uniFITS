// parts/FundDeleteBody.tsx — Delete confirmation body
import { formatCurrency } from '../../../api/mockData'
import type { FundWithBalance, OrgConfig } from '../../../types'

/* ── Delete body ─────────────────────────────────────────────────── */
export default function DeleteBody({ fund, org }: { fund: FundWithBalance; org: OrgConfig }) {
  return (
    <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 16 }}>
      <div style={{ padding: '14px 16px', borderRadius: 10, background: '#fdecea', border: '1.5px solid rgba(192,57,43,.30)', display: 'flex' as const, gap: 10, alignItems: 'flex-start' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" strokeWidth="2.5" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 1 }}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        <div>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--danger)' }}>Warning: This action cannot be undone</div>
          <div style={{ fontSize: 12.5, color: 'var(--danger)', marginTop: 3, lineHeight: 1.5 }}>Deleting "{fund.name}" will permanently remove this fund and all related records.</div>
        </div>
      </div>
      {[['Fund Name', fund.name], ['Balance', formatCurrency(fund.balance, org.currency_symbol)], ['Type', fund.fund_type], ['Status', fund.status]].map(([k, v], idx) => (
        <div key={k} style={{ display: 'flex' as const, gap: 16, padding: '10px 14px', borderBottom: '1px solid var(--border-inner)', background: idx % 2 === 0 ? 'var(--neutral-light)' : '#fff' }}>
          <div style={{ width: 130, fontSize: 12.5, color: 'var(--text-muted)', flexShrink: 0, fontWeight: 500 }}>{k}</div>
          <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)', textTransform: 'capitalize' as const }}>{v}</div>
        </div>
      ))}
    </div>
  )
}
