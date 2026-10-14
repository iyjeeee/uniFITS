// parts/ContributionsCard.tsx — Total contributed + breakdown by category
import { useOrg } from '../../../context/OrgContext'
import useBreakpoint from '../../../hooks/useBreakpoint'
import { Card, CardHeader } from '../../../components/ui'
import { formatCurrency } from '../../../api/mockData'

export default function ContributionsCard({ totals }: { totals: Record<'total' | 'project' | 'event' | 'fund' | 'other', number> }) {
  const org = useOrg()
  const { isMobile } = useBreakpoint()
  return (
    <Card>
      <CardHeader title="My Contributions Summary" subtitle="Breakdown by contribution type" />
      <div style={{ padding: '14px 16px', display: 'grid' as const, gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 12 }}>
        {[
          { label: 'Total Contributions', value: totals.total,   color: 'var(--success)', bg: 'var(--success-light)', border: 'rgba(46,125,82,.2)'  },
          { label: 'Projects',            value: totals.project, color: 'var(--accent)',  bg: 'var(--accent-light)',  border: 'rgba(75,94,170,.2)'  },
          { label: 'Events',              value: totals.event,   color: 'var(--info)',    bg: 'var(--info-light)',    border: 'rgba(36,113,163,.2)' },
          { label: 'Funds',               value: totals.fund,    color: 'var(--warning)', bg: 'var(--warning-light)', border: 'rgba(212,134,10,.2)' },
          { label: 'Other',               value: totals.other,   color: 'var(--text-secondary)', bg: 'var(--neutral-light)', border: 'var(--border-card)' },
        ].map((k) => (
          <div key={k.label} style={{ padding: '12px 14px', background: '#FFFFFF', borderRadius: 10, border: '1px solid ' + k.color + '25', borderLeft: '4px solid ' + k.color, transition: 'transform .18s ease, box-shadow .18s ease' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(75,94,170,.18)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}>
            <div style={{ fontSize: 11.5, color: 'var(--text-muted)', fontWeight: 500, marginBottom: 6 }}>{k.label}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: k.color }}>{formatCurrency(k.value, org.currency_symbol)}</div>
          </div>
        ))}
      </div>
    </Card>
  )
}
