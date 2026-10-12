// parts/ProfileStatsRow.tsx — Quick stats row (contributions, attendance, member since...)
import { useOrg } from '../../../context/OrgContext'
import useBreakpoint from '../../../hooks/useBreakpoint'
import { Card } from '../../../components/ui'
import { formatCurrency } from '../../../api/mockData'
import { IcoCal, IcoMoney, IcoUser } from './ProfileIcons'
import type { Transaction } from '../../../types'
import type { AttStats } from './profileShared'

export default function ProfileStatsRow({ userTransactions, totalContributed, attStats, attTotal }: { userTransactions: Transaction[]; totalContributed: number; attStats: AttStats; attTotal: number }) {
  const org = useOrg()
  const { isMobile } = useBreakpoint()
  const statCols = isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)' // responsive stat grid
  return (
  <div style={{ display: 'grid' as const, gridTemplateColumns: statCols, gap: 12 }}>
    {[
      { label: 'Total Contributions', value: formatCurrency(totalContributed, org.currency_symbol), color: 'var(--success)', icon: <IcoMoney /> },
      { label: 'Transactions',        value: userTransactions.length,                               color: 'var(--accent)',  icon: <IcoMoney /> },
      { label: 'Attendance Records',  value: attTotal,                                              color: 'var(--info)',    icon: <IcoCal /> },
      { label: 'Attendance Rate',     value: attTotal ? `${Math.round((attStats.present / attTotal) * 100)}%` : '—', color: 'var(--warning)', icon: <IcoUser /> },
    ].map((k) => (
      <Card key={k.label} style={{ padding: '14px 18px', background: '#FFFFFF', borderLeft: '4px solid ' + k.color, border: '1px solid ' + k.color + '25', transition: 'transform .18s ease, box-shadow .18s ease' }}
        onMouseEnter={(e: React.MouseEvent<HTMLElement>) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(75,94,170,.18)' }}
        onMouseLeave={(e: React.MouseEvent<HTMLElement>) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}>
        <div style={{ display: 'flex' as const, alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>{k.label}</div>
          <div style={{ width: 36, height: 36, borderRadius: 9, background: 'var(--neutral-light)', display: 'flex' as const, alignItems: 'center', justifyContent: 'center', color: k.color }}>
            {k.icon}
          </div>
        </div>
        <div style={{ fontSize: 22, fontWeight: 800, color: k.color, lineHeight: 1 }}>{k.value}</div>
      </Card>
    ))}
  </div>
  )
}
