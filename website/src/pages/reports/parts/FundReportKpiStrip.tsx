// parts/FundReportKpiStrip.tsx — Four KPI tiles: total funds, active, inactive, overall balance
// Not components/KpiStrip on purpose: this strip keeps 4 columns on tablet and no line-height (differs from the list pages — see bug log)
import { Card } from '../../../components/ui'
import { formatCurrency } from '../../../api/mockData'
import { useOrg } from '../../../context/OrgContext'
import useBreakpoint from '../../../hooks/useBreakpoint'
import type { FundWithBalance } from '../../../types'

export default function FundReportKpiStrip({ funds }: { funds: FundWithBalance[] }) {
  const org = useOrg()
  const { isMobile } = useBreakpoint()
  const kpiCols = isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)'
  const totalBalance = funds.reduce((s, f) => s + f.balance, 0)
  const active       = funds.filter((f) => f.status === 'active').length
  const inactive     = funds.filter((f) => f.status !== 'active').length
  const kpis = [
    { label: `Total ${org.fund_label_plural}`, value: funds.length, color: 'var(--text-primary)' },
    { label: 'Active',                   value: active,        color: 'var(--success)'      },
    { label: 'Inactive',                 value: inactive,      color: 'var(--danger)'       },
    { label: 'Overall Balance',          value: formatCurrency(totalBalance, org.currency_symbol), color: 'var(--warning)' },
  ]
  return (
    <div style={{ display: 'grid' as const, gridTemplateColumns: kpiCols, gap: 12 }}>
      {kpis.map((k) => (
        <Card key={k.label} style={{ padding: '14px 18px', background: '#FFFFFF', borderLeft: '4px solid ' + k.color, border: '1px solid ' + k.color + '25', transition: 'transform .18s ease, box-shadow .18s ease' }}
          onMouseEnter={(e: React.MouseEvent<HTMLElement>) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(75,94,170,.18)' }}
          onMouseLeave={(e: React.MouseEvent<HTMLElement>) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500, marginBottom: 6 }}>{k.label}</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: k.color }}>{k.value}</div>
        </Card>
      ))}
    </div>
  )
}
