// itemDetail/FinancialSummary.tsx — Balance overview: contributions + external income - external expenses = net balance
import { formatCurrency } from '../../api/mockData'
import type { ItemDetailData } from './itemDetailData'
import type { OrgConfig } from '../../types'

export default function FinancialSummary({ data, org }: { data: ItemDetailData; org: OrgConfig }) {
  const { totalContrib, totalExtInc, totalExtExp, totalInflow, netBalance } = data
  const isPositive = netBalance >= 0
  const rows: { label: string; value: number; color: string; sign: string }[] = [
    { label: `${org.people_label} Contributions`, value: totalContrib, color: 'var(--success)', sign: '+' },
    { label: 'External Income',                    value: totalExtInc,  color: 'var(--info)',    sign: '+' },
    { label: 'External Expenses',                  value: totalExtExp,  color: 'var(--danger)',  sign: '−' },
  ]
  return (
    <div style={{ borderTop: '2px solid var(--border-inner)', paddingTop: 18 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 14 }}>
        Financial Summary
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0, borderRadius: 10, overflow: 'hidden', border: '1.5px solid var(--border-card)', marginBottom: 12 }}>
        {rows.map(({ label, value, color, sign }, idx) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 16px', background: idx % 2 === 0 ? 'var(--neutral-light)' : '#fff', borderBottom: idx < rows.length - 1 ? '1px solid var(--border-inner)' : 'none', gap: 12 }}>
            <span style={{ fontSize: 13.5, color: 'var(--text-secondary)', fontWeight: 500 }}>{label}</span>
            <span style={{ fontSize: 14, fontWeight: 700, color }}>{sign}{formatCurrency(value, org.currency_symbol)}</span>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderRadius: 10, background: isPositive ? 'var(--success-light)' : 'var(--danger-light)', border: `2px solid ${isPositive ? 'rgba(46,125,82,.3)' : 'rgba(192,57,43,.3)'}` }}>
        <div>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: isPositive ? 'var(--success)' : 'var(--danger)' }}>Net Balance</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
            Total inflow {formatCurrency(totalInflow, org.currency_symbol)} − Total expenses {formatCurrency(totalExtExp, org.currency_symbol)}
          </div>
        </div>
        <div style={{ fontSize: 26, fontWeight: 900, color: isPositive ? 'var(--success)' : 'var(--danger)', lineHeight: 1 }}>
          {isPositive ? '+' : '−'}{formatCurrency(Math.abs(netBalance), org.currency_symbol)}
        </div>
      </div>
    </div>
  )
}
