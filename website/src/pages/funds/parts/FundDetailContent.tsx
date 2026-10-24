// parts/FundDetailContent.tsx — Read-only fund view: balance hero + detail grid
import useBreakpoint from '../../../hooks/useBreakpoint'
import { MOCK_TRANSACTIONS, formatCurrency } from '../../../api/mockData'
import { capitalize } from '../../../utils/formatters'
import { isReceipt } from '../../../utils/ledger'
import type { FundWithBalance, OrgConfig } from '../../../types'

/* ── Fund Detail content — read-only view (same as FundReport) ───── */
export default function FundDetailContent({ fund, org }: { fund: FundWithBalance; org: OrgConfig }) {
  const { isMobile } = useBreakpoint()                   // own hook call — must be inside component
  const accentC = fund.is_required ? 'var(--accent)' : 'var(--info)'
  const bgC     = fund.is_required ? 'var(--accent-light)' : 'var(--info-light)'
  const received = MOCK_TRANSACTIONS.filter((t) => t.fund_id === fund.id && isReceipt(t)).reduce((s, t) => s + t.amount, 0)

  return (
    <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 18 }}>
      {/* Hero balance */}
      <div style={{ padding: '16px 20px', borderRadius: 12, background: bgC, border: '1.5px solid ' + accentC + '30' }}>
        <div style={{ fontSize: 26, fontWeight: 800, color: accentC, marginBottom: 6 }}>{formatCurrency(fund.balance, org.currency_symbol)}</div>
        <div style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{fund.description || 'No description provided.'}</div>
      </div>
      {/* Detail grid — 3-col desktop, 1-col mobile */}
      <div style={{ display: 'grid' as const, gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 12 }}>
        {[
          ['Fund Name',      fund.name],
          ['Type',           capitalize(fund.fund_type)],
          ['Status',         capitalize(fund.status)],
          ['Required',       fund.is_required ? 'Yes — all members' : 'No'],
          ['Pay Frequency',  capitalize(fund.payment_frequency)],
          ['Annual Fee',     fund.annual_fee ? formatCurrency(fund.annual_fee, org.currency_symbol) : '—'],
          ['Balance',        formatCurrency(fund.balance, org.currency_symbol)],
          ['Total Received', formatCurrency(received, org.currency_symbol)],
          ['Managed by',     fund.created_by || '—'],
        ].map(([k, v]) => (
          <div key={k} style={{ padding: '12px 14px', borderRadius: 10, background: 'var(--neutral-light)', border: '1px solid var(--border-card)' }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' as const, letterSpacing: '.07em', marginBottom: 4 }}>{k}</div>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)' }}>{v}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
