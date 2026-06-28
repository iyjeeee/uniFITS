// components/KPI/index.tsx — KpiGrid component for all Manage* pages
// Matches the dashboard KpiCard design exactly:
//   white bg, 4px left color accent bar, var(--neutral-light) icon bg, hover lift
import { useState } from 'react'
import type { KpiMetric } from '../../types'

// Color token map — maps string names to the codebase's CSS variable hex values
// Ongoing → var(--info) = #2471A3 (blue), Upcoming → var(--warning) = #D4860A (amber)
const COLOR_MAP: Record<string, string> = {
  blue:   '#2471A3',   // var(--info)    — used for ongoing status
  green:  '#2E7D52',   // var(--success)
  amber:  '#D4860A',   // var(--warning) — used for upcoming status
  teal:   '#2471A3',   // var(--info)
  violet: '#4B5EAA',   // var(--accent)
  rose:   '#C0392B',   // var(--danger)
  sky:    '#2471A3',   // var(--info)
  slate:  '#4B5EAA',   // var(--accent)
}

// KpiTile — single KPI tile card; mirrors dashboard KpiCard exactly
function KpiTile({ metric }: { metric: KpiMetric }) {
  const [hov, setHov] = useState(false)
  const color = COLOR_MAP[metric.color] ?? COLOR_MAP.slate  // resolve name → hex

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: '#FFFFFF',                              // always white — distinct from #EEF2F8 page bg
        borderRadius: 10,
        border: `1px solid ${color}25`,                    // subtle same-color border tint
        borderLeft: `4px solid ${color}`,                  // dashboard-matching left accent bar
        padding: '20px 22px',
        boxShadow: hov ? '0 8px 20px rgba(75,94,170,.18)' : undefined,
        transform: hov ? 'translateY(-3px)' : 'none',
        transition: 'transform .18s ease, box-shadow .18s ease',
        position: 'relative',
      }}>

      {/* Urgency pulse dot — top-right, only for showBadge tiles */}
      {metric.showBadge && (
        <span style={{
          position: 'absolute', top: 12, right: 12,
          width: 8, height: 8, borderRadius: '50%',
          background: color, boxShadow: `0 0 6px ${color}88`,
        }} />
      )}

      {/* Label + icon row — mirrors dashboard KpiCard layout */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--text-muted)', lineHeight: 1.3, flex: 1 }}>
          {metric.label}
        </div>
        {metric.icon && (
          <div style={{
            width: 36, height: 36, borderRadius: 9, flexShrink: 0,
            background: 'var(--neutral-light)',             // same icon bg as dashboard KpiCard
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16,
          }}>
            {metric.icon}
          </div>
        )}
      </div>

      {/* Value — same size/weight as dashboard KpiCard */}
      <div style={{ fontSize: 26, fontWeight: 800, color, lineHeight: 1, marginBottom: metric.trendLabel ? 8 : 0 }}>
        {metric.value}
      </div>

      {/* Trend indicator — positive = green ↑, negative = red ↓ */}
      {metric.trend !== undefined && metric.trend !== 0 && (
        <div style={{
          fontSize: 11.5, fontWeight: 500,
          color: (metric.trend ?? 0) > 0 ? 'var(--success)' : 'var(--danger)',
          display: 'flex', alignItems: 'center', gap: 3, marginTop: 6,
        }}>
          {(metric.trend ?? 0) > 0 ? '↑' : '↓'} {metric.trendLabel}
          {metric.period && (
            <span style={{ color: 'var(--text-muted)', fontWeight: 400, marginLeft: 2 }}>
              · {metric.period}
            </span>
          )}
        </div>
      )}
      {(metric.trend === 0 || metric.trend === undefined) && metric.trendLabel && (
        <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 6 }}>{metric.trendLabel}</div>
      )}
    </div>
  )
}

// KpiGrid — responsive grid matching the dashboard 4-column layout
export function KpiGrid({ metrics = [] }: { metrics: KpiMetric[] }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))',
      gap: 12,
      marginBottom: 20,
    }}>
      {metrics.map(m => <KpiTile key={m.id} metric={m} />)}
    </div>
  )
}

export default KpiGrid
