// parts/RecentTransactionsCard.tsx — Table of the latest 6 transactions (sorted by date in dashboardStats); outflows (expense, refund) are red with a minus
import { Badge, Card, CardHeader, StatusBadge } from '../../../components/ui'
import { formatCurrency, formatDate, getPartyName } from '../../../api/mockData'
import { useOrg } from '../../../context/OrgContext'
import { isOutflow } from '../../../utils/ledger'
import type { DashboardStats } from './dashboardStats'

export default function RecentTransactionsCard({ recentTransactions }: { recentTransactions: DashboardStats['recentTransactions'] }) {
  const org = useOrg()
  return (
  <Card>
    <CardHeader title="Recent Transactions" subtitle={`Latest ${recentTransactions.length} financial entries`} />
    <div style={{ overflowX: 'auto' as const }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ background: 'var(--table-head-bg)' }}>
            {['Reference','Member','Amount','Type','Category','Date','Status'].map((h) => (
              <th key={h} style={{ padding: '9px 14px', textAlign: 'left' as const, fontSize: 11, fontWeight: 600, color: 'var(--table-head-fg)', textTransform: 'uppercase' as const, letterSpacing: '.06em', borderBottom: '2px solid var(--border-table)', whiteSpace: 'nowrap' as const }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {recentTransactions.map((t) => (
            <tr key={t.id} style={{ borderBottom: '1px solid var(--border-inner)' }}>
              <td style={{ padding: '10px 14px' }}><code style={{ fontSize: 11 }}>{t.reference_number}</code></td>
              <td style={{ padding: '10px 14px' }}>{getPartyName(t.user_id, '—')}</td>
              <td style={{ padding: '10px 14px', fontWeight: 700, color: isOutflow(t) ? 'var(--danger)' : 'var(--success)' }}>
                {isOutflow(t) ? '−' : '+'}{formatCurrency(t.amount, org.currency_symbol)}
              </td>
              <td style={{ padding: '10px 14px' }}>
                {/* Type badge: expense=red, contribution=blue(accent), income=green */}
                <Badge variant={isOutflow(t) ? 'danger' : t.entry_type === 'contribution' ? 'accent' : 'success'}>
                  {t.entry_type.charAt(0).toUpperCase() + t.entry_type.slice(1)}
                </Badge>
              </td>
              <td style={{ padding: '10px 14px' }}>{t.category ? t.category.charAt(0).toUpperCase() + t.category.slice(1) : '—'}</td>
              <td style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>{formatDate(t.transaction_date)}</td>
              <td style={{ padding: '10px 14px' }}><StatusBadge status={t.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </Card>
  )
}
