// parts/FundSection.tsx — Titled grid of fund tiles (used for Internal and External funds)
import type { ReactNode } from 'react'
import { useOrg } from '../../../context/OrgContext'
import useBreakpoint from '../../../hooks/useBreakpoint'
import { Card } from '../../../components/ui'
import type { Fund } from '../../../types'
import FundTileCard from '../../../components/FundTileCard'

export default function FundSection({ funds, title, icon, iconBg, iconColor, onSelect }: { funds: Fund[]; title: string; icon: ReactNode; iconBg: string; iconColor: string; onSelect: (fund: Fund) => void }) {
  const org = useOrg()
  const { isMobile, isTablet } = useBreakpoint()
  const fundCols = isMobile ? '1fr' : isTablet ? 'repeat(2,1fr)' : 'repeat(4,1fr)'
  return (
    <Card style={{ padding: '18px 20px' }}>
      <div style={{ display: 'flex' as const, alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <div style={{ width: 28, height: 28, borderRadius: 7, background: iconBg, display: 'flex' as const, alignItems: 'center', justifyContent: 'center', color: iconColor, flexShrink: 0 }}>{icon}</div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{title}</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 1 }}>{funds.length} fund{funds.length !== 1 ? 's' : ''} — click any tile for full details</div>
        </div>
      </div>
      <div style={{ display: 'grid' as const, gridTemplateColumns: fundCols, gap: 14 }}>
        {funds.map((f) => <FundTileCard key={f.id} fund={f} org={org} onClick={() => onSelect(f)} />)}
      </div>
    </Card>
  )
}
