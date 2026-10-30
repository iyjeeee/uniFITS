// parts/FundBalancesCard.tsx — Fund balances (derived bars) + total across all funds
import { Card, CardHeader } from '../../../components/ui'
import { formatCurrency } from '../../../api/mockData'
import { useOrg } from '../../../context/OrgContext'
import FundBarChart from './FundBarChart'
import type { FundPoint } from './dashboardData'

export default function FundBalancesCard({ totalBalance, funds }: { totalBalance: number; funds: FundPoint[] }) {
  const org = useOrg()
  return (
    <Card>
      <CardHeader title="Fund Balances" subtitle="Current balance per fund" />
      <div style={{ padding: '16px 18px' }}>
        <FundBarChart data={funds} />
        <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--border-inner)' }}>
          <div style={{ display: 'flex' as const, justifyContent: 'space-between', fontSize: 12.5 }}>
            <span style={{ color: 'var(--text-muted)' }}>Total across all funds</span>
            <span style={{ fontWeight: 700, color: 'var(--success)' }}>{formatCurrency(totalBalance, org.currency_symbol)}</span>
          </div>
        </div>
      </div>
    </Card>
  )
}
