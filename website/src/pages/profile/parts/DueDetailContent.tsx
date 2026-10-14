// parts/DueDetailContent.tsx — Body of the due detail modal
import useBreakpoint from '../../../hooks/useBreakpoint'
import { formatCurrency } from '../../../api/mockData'
import type { OrgConfig } from '../../../types'
import type { DueFund } from './dueShared'

/* ── DueDetailContent — body of the Due InfoModal ─────────────────── */
// IMPORTANT: useBreakpoint() must be called inside this sub-component directly
// — sub-components cannot access variables from a parent component's scope.
export default function DueDetailContent({ fund, org }: { fund: DueFund; org: OrgConfig }) {
  const { isMobile } = useBreakpoint()                   // own hook call — fixes ReferenceError
  const accentC = fund.is_required ? 'var(--accent)' : 'var(--success)'
  const bgC     = fund.is_required ? 'var(--accent-light)' : 'var(--success-light)'

  return (
    <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 18 }}>
      {/* Hero */}
      <div style={{ padding: '18px 20px', borderRadius: 12, background: bgC, border: '1.5px solid ' + accentC + '30' }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: accentC, marginBottom: 6 }}>
          {formatCurrency(fund.annual_fee || fund.balance, org.currency_symbol)}
        </div>
        <div style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          {fund.description || 'No description provided.'}
        </div>
      </div>

      {/* Detail grid */}
      <div style={{ display: 'grid' as const, gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 12 }}>
        {[
          ['Fund Name',       fund.name],
          ['Type',            fund.fund_type ? (fund.fund_type.charAt(0).toUpperCase() + fund.fund_type.slice(1)) : '—'],
          ['Required',        fund.is_required ? 'Yes — all members' : 'No'],
          ['Status',          fund.status.charAt(0).toUpperCase() + fund.status.slice(1)],
          ['Pay Frequency',   fund.payment_frequency ? (fund.payment_frequency.charAt(0).toUpperCase() + fund.payment_frequency.slice(1)) : '—'],
          ['Annual Fee',      fund.annual_fee ? formatCurrency(fund.annual_fee, org.currency_symbol) : '—'],
          ['Current Balance', formatCurrency(fund.balance, org.currency_symbol)],
          ['Managed by',      fund.created_by],
        ].map(([k, v]) => (
          <div key={k} style={{ padding: '12px 14px', borderRadius: 10, background: 'var(--neutral-light)', border: '1px solid var(--border-card)' }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' as const, letterSpacing: '.07em', marginBottom: 4 }}>{k}</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{v}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
