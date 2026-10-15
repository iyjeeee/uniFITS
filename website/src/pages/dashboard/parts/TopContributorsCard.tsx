// parts/TopContributorsCard.tsx — Top 5 contributors ranked by total (rank badge, avatar, count, bar relative to #1)
import { Avatar, Card, CardHeader } from '../../../components/ui'
import { formatCurrency } from '../../../api/mockData'
import { useOrg } from '../../../context/OrgContext'
import type { DashboardStats } from './dashboardStats'

export default function TopContributorsCard({ topContributors }: { topContributors: DashboardStats['topContributors'] }) {
  const org = useOrg()
  return (
    <Card>
      <CardHeader title="Top Contributors" subtitle="Members ranked by total contributions" />
      <div style={{ padding: '8px 0' }}>
        {topContributors.length === 0
          ? <div style={{ padding: '24px', textAlign: 'center' as const, color: 'var(--text-muted)', fontSize: 13 }}>No contribution data yet.</div>
          : topContributors.map((c, i) => (
              <div key={c.name} style={{ display: 'flex' as const, alignItems: 'center', gap: 12, padding: '10px 18px', borderBottom: '1px solid var(--border-inner)' }}>
                {/* Rank badge */}
                <div style={{
                  width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                  background: i === 0 ? '#D4860A' : i === 1 ? '#9CA3AF' : i === 2 ? '#C0392B' : 'var(--accent-light)',
                  display: 'flex' as const, alignItems: 'center', justifyContent: 'center',
                  fontSize: 11.5, fontWeight: 800,
                  color: i < 3 ? '#fff' : 'var(--accent)',
                }}>
                  {i + 1}
                </div>
                <Avatar name={c.name} size={32} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, whiteSpace: 'nowrap' as const, overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 1 }}>{c.count} transaction{c.count !== 1 ? 's' : ''}</div>
                </div>
                <div style={{ textAlign: 'right' as const, flexShrink: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--success)' }}>{formatCurrency(c.total, org.currency_symbol)}</div>
                  {/* Contribution bar relative to #1 */}
                  <div style={{ marginTop: 4, width: 80, height: 4, background: 'var(--border)', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: 'var(--success)', width: `${(c.total / topContributors[0].total) * 100}%`, borderRadius: 4 }} />
                  </div>
                </div>
              </div>
            ))
        }
      </div>
    </Card>
  )
}
