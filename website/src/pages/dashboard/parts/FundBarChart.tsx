// parts/FundBarChart.tsx — Horizontal progress bars: balance per fund (labels use org.currency_symbol)
import { useOrg } from '../../../context/OrgContext'
import type { FundPoint } from './dashboardData'
export default function FundBarChart({ data }: { data: FundPoint[] }) {
  const org    = useOrg()
  const maxVal = Math.max(...data.map((d) => d.balance), 1)
  const COLORS = ['#4B5EAA', '#2E7D52', '#2471A3', '#D4860A', '#7D3C98']

  return (
    <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 10 }}>
      {data.map((d, i) => {
        const pct = (d.balance / maxVal) * 100
        return (
          <div key={d.name}>
            <div style={{ display: 'flex' as const, justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
              <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{d.name}</span>
              <span style={{ color: COLORS[i % COLORS.length], fontWeight: 700 }}>{org.currency_symbol}{(d.balance / 1000).toFixed(0)}k</span>
            </div>
            <div style={{ height: 8, background: 'var(--border)', borderRadius: 6, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${pct}%`, background: COLORS[i % COLORS.length], borderRadius: 6, transition: 'width .4s' }} />
            </div>
          </div>
        )
      })}
    </div>
  )
}
