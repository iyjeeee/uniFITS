// parts/DonutChart.tsx — SVG donut: project status breakdown with legend
import type { StatusPoint } from './dashboardData'
export default function DonutChart({ data }: { data: StatusPoint[] }) {
  const total = data.reduce((s, d) => s + d.count, 0) || 1
  let cumAngle = -90
  const cx = 60, cy = 60, r = 48, inner = 28

  const slices = data.map((d) => {
    const angle  = (d.count / total) * 360
    const startA = cumAngle
    cumAngle    += angle
    const endA   = cumAngle
    const toRad = (a: number) => (a * Math.PI) / 180
    const x1 = cx + r * Math.cos(toRad(startA))
    const y1 = cy + r * Math.sin(toRad(startA))
    const x2 = cx + r * Math.cos(toRad(endA))
    const y2 = cy + r * Math.sin(toRad(endA))
    const ix1 = cx + inner * Math.cos(toRad(startA))
    const iy1 = cy + inner * Math.sin(toRad(startA))
    const ix2 = cx + inner * Math.cos(toRad(endA))
    const iy2 = cy + inner * Math.sin(toRad(endA))
    const large = angle > 180 ? 1 : 0
    return { ...d, angle, path: d.count === 0 ? null : `M${x1},${y1} A${r},${r},0,${large},1,${x2},${y2} L${ix2},${iy2} A${inner},${inner},0,${large},0,${ix1},${iy1} Z` }
  })

  return (
    <div style={{ display: 'flex' as const, alignItems: 'center', gap: 18 }}>
      <svg viewBox="0 0 120 120" width={110} height={110} style={{ flexShrink: 0 }}>
        {slices.map((s, i) => s.path ? (
          <path key={i} d={s.path} fill={s.color} />
        ) : null)}
        <text x={cx} y={cy + 4} textAnchor="middle" fontSize={14} fontWeight={700} fill="var(--text-primary)">{total}</text>
        <text x={cx} y={cy + 17} textAnchor="middle" fontSize={8} fill="var(--text-muted)">TOTAL</text>
      </svg>
      <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 8 }}>
        {data.map((d) => (
          <div key={d.label} style={{ display: 'flex' as const, alignItems: 'center', gap: 8, fontSize: 12.5 }}>
            <div style={{ width: 10, height: 10, borderRadius: 3, background: d.color, flexShrink: 0 }} />
            <span style={{ color: 'var(--text-secondary)' }}>{d.label}</span>
            <span style={{ fontWeight: 700, color: 'var(--text-primary)', marginLeft: 'auto' }}>{d.count}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
