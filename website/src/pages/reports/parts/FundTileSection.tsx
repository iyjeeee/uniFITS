// parts/FundTileSection.tsx — Card section: colored icon + title + count caption, then a grid of FundTileCards (required / optional funds)
import type { ReactNode } from 'react'
import { Card } from '../../../components/ui'
import FundTileCard from '../../../components/FundTileCard'
import type { Fund, OrgConfig } from '../../../types'

interface Props {
  title: string; icon: ReactNode; iconBg: string; iconColor: string
  funds: Fund[]; columns: string; org: OrgConfig; onSelect: (fund: Fund) => void
}

export default function FundTileSection({ title, icon, iconBg, iconColor, funds, columns, org, onSelect }: Props) {
  return (
    <Card style={{ padding: '18px 20px' }}>
      <div style={{ display: 'flex' as const, alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <div style={{ width: 28, height: 28, borderRadius: 7, background: iconBg, display: 'flex' as const, alignItems: 'center', justifyContent: 'center', color: iconColor, flexShrink: 0 }}>
          {icon}
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{title}</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 1 }}>{funds.length} fund{funds.length !== 1 ? 's' : ''} — click any tile for full details</div>
        </div>
      </div>
      <div style={{ display: 'grid' as const, gridTemplateColumns: columns, gap: 14 }}>
        {funds.map((f) => <FundTileCard key={f.id} fund={f} org={org} onClick={() => onSelect(f)} />)}
      </div>
    </Card>
  )
}
