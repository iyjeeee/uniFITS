// components/KpiStrip.tsx — Responsive 2/4-column strip of colored KPI tiles used by list pages (Utilities, Transactions, …)
import type { ReactNode } from 'react'
import { Card } from './ui'
import useBreakpoint from '../hooks/useBreakpoint'

export interface KpiTile { label: string; value: ReactNode; color: string }

// valueSize differs per page (22 / 24 / 28) so existing layouts stay pixel-identical
export default function KpiStrip({ kpis, valueSize = 28 }: { kpis: KpiTile[]; valueSize?: number }) {
  const { isMobile, isTablet } = useBreakpoint()
  const kpiCols = isMobile || isTablet ? 'repeat(2,1fr)' : 'repeat(4,1fr)'
  return (
    <div style={{ display: 'grid' as const, gridTemplateColumns: kpiCols, gap: 12 }}>
      {kpis.map((k) => (
        <Card key={k.label} style={{ padding: '14px 18px', background: '#FFFFFF', borderLeft: '4px solid ' + k.color, border: '1px solid ' + k.color + '25', transition: 'transform .18s ease, box-shadow .18s ease' }}
          onMouseEnter={(e: React.MouseEvent<HTMLElement>) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(75,94,170,.18)' }}
          onMouseLeave={(e: React.MouseEvent<HTMLElement>) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500, marginBottom: 6 }}>{k.label}</div>
          <div style={{ fontSize: valueSize, fontWeight: 800, color: k.color, lineHeight: 1 }}>{k.value}</div>
        </Card>
      ))}
    </div>
  )
}
