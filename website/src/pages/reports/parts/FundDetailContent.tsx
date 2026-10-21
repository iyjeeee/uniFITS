// parts/FundDetailContent.tsx — Body of the fund detail modal: balance hero, 3-column detail grid (1 on mobile), contributions list
import { formatCurrency } from '../../../api/mockData'
import useBreakpoint from '../../../hooks/useBreakpoint'
import { capitalize } from '../../../utils/formatters'
import { getFundContributions } from './fundReportData'
import FundContributionsList from './FundContributionsList'
import type { Fund, OrgConfig } from '../../../types'

// useBreakpoint() is called here (not in the page) because sub-components cannot read a parent's variables
export default function FundDetailContent({ fund, org }: { fund: Fund; org: OrgConfig }) {
  const { isMobile } = useBreakpoint()
  const accentC = fund.is_required ? 'var(--accent)' : 'var(--info)'
  const bgC     = fund.is_required ? 'var(--accent-light)' : 'var(--info-light)'
  const data    = getFundContributions(fund)

  return (
    <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 18 }}>
      {/* Hero balance + description */}
      {/* Hero balance + description */}
      <div style={{ padding: '16px 20px', borderRadius: 12, background: bgC, border: '1.5px solid ' + accentC + '30' }}>
        <div style={{ fontSize: 26, fontWeight: 800, color: accentC, marginBottom: 6 }}>
          {formatCurrency(fund.balance, org.currency_symbol)}
        </div>
        <div style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          {fund.description || 'No description provided.'}
        </div>
      </div>

      {/* Detail grid — 3-col desktop, 1-col mobile */}
      {/* Detail grid — 3-col desktop, 1-col mobile */}
      <div style={{ display: 'grid' as const, gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 12 }}>
        {[
          ['Fund Name',     fund.name],
          ['Type',          capitalize(fund.fund_type)],
          ['Status',        capitalize(fund.status)],
          ['Required',      fund.is_required ? 'Yes — all members' : 'No'],
          ['Pay Frequency', capitalize(fund.payment_frequency)],
          ['Annual Fee',    fund.annual_fee ? formatCurrency(fund.annual_fee, org.currency_symbol) : '—'],
          ['Balance',       formatCurrency(fund.balance, org.currency_symbol)],
          ['Managed by',    fund.created_by || '—'],
          ['Currency',      fund.currency || 'PHP'],
        ].map(([k, v]) => (
          <div key={k} style={{ padding: '12px 14px', borderRadius: 10, background: 'var(--neutral-light)', border: '1px solid var(--border-card)' }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' as const, letterSpacing: '.07em', marginBottom: 4 }}>{k}</div>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)' }}>{v}</div>
          </div>
        ))}
      </div>

      {/* ── Member Contributions List ──────────────────────────── */}
      <FundContributionsList data={data} accentC={accentC} org={org} />
    </div>
  )
}
