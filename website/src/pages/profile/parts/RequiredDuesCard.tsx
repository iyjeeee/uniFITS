// parts/RequiredDuesCard.tsx — Required dues tiles with View All
import { useOrg } from '../../../context/OrgContext'
import useBreakpoint from '../../../hooks/useBreakpoint'
import { Card, CardHeader } from '../../../components/ui'
import { MOCK_FUNDS } from '../../../api/mockData'
import type { DueFund } from './dueShared'
import DueTileCard from './DueTileCard'

export default function RequiredDuesCard({ dues, onSelect, onViewAll }: { dues: DueFund[]; onSelect: (fund: DueFund) => void; onViewAll: () => void }) {
  const org = useOrg()
  const { isMobile } = useBreakpoint()
  return (
    <Card style={{ display: 'flex' as const, flexDirection: 'column' as const }}>
      <CardHeader title="My Required Dues" subtitle="Dues expected this year — click a tile for details" />
      <div style={{ padding: '14px 16px', flex: 1 }}>
        {dues.length === 0
          ? <div style={{ textAlign: 'center' as const, padding: '24px', color: 'var(--text-muted)', fontSize: 13 }}>No required dues found.</div>
          : (
            <div style={{ display: 'grid' as const, gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(3, 1fr)', gap: 12 }}>
              {dues.map((f) => (
                <DueTileCard
                  key={f.id}
                  fund={f}
                  org={org}
                  onClick={() => onSelect(f)}
                />
              ))}
            </div>
          )
        }
      </div>

      {/* View All Dues button — standard Button style with smooth hover */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border-inner)', textAlign: 'center' as const }}>
        <button
          onClick={onViewAll}
          style={{
            padding: '8px 28px', borderRadius: 8,
            border: '2px solid transparent',
            background: 'var(--accent)', color: '#fff',
            cursor: 'pointer' as const, fontSize: 13, fontWeight: 600,
            fontFamily: 'var(--font-body)',
            transition: 'transform .18s ease, box-shadow .18s ease, border-color .18s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform   = 'translateY(-2px)'
            e.currentTarget.style.boxShadow   = '0 0 0 1.5px rgba(0,0,0,.70), 0 4px 12px rgba(0,0,0,.14)'
            e.currentTarget.style.borderColor = 'rgba(0,0,0,.28)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform   = ''
            e.currentTarget.style.boxShadow   = ''
            e.currentTarget.style.borderColor = 'transparent'
          }}>
          View All Dues ({MOCK_FUNDS.length})
        </button>
      </div>
    </Card>
  )
}
