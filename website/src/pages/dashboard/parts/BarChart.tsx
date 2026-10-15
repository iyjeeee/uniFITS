// parts/BarChart.tsx — SVG bar chart: monthly income vs expense (labels hard-code ₱ — see bug log)
import type { MonthlyPoint } from './dashboardData'
export default function BarChart({ data }: { data: MonthlyPoint[] }) {
  const maxVal = Math.max(...data.flatMap((d) => [d.income, d.expense]), 1)
  const barW   = 20
  const gap    = 5
  const groupW = barW * 2 + gap + 20
  const svgW   = groupW * data.length + 50
  const svgH   = 150
  const padB   = 26
  const padL   = 46

  return (
    <svg viewBox={`0 0 ${svgW} ${svgH}`} style={{ width: '100%', height: svgH, overflow: 'visible' }}>
      {[0, .25, .5, .75, 1].map((frac, i) => {
        const y = (svgH - padB) * (1 - frac)
        return (
          <g key={i}>
            <line x1={padL} x2={svgW - 6} y1={y} y2={y} stroke="var(--border)" strokeWidth={1} strokeDasharray={i === 0 ? 'none' : '3,3'} />
            <text x={padL - 4} y={y + 4} fontSize={8} fill="var(--text-muted)" textAnchor="end">
              {frac === 0 ? '0' : `₱${Math.round(maxVal * frac / 1000)}k`}
            </text>
          </g>
        )
      })}
      {data.map((d, i) => {
        const x    = padL + 4 + i * groupW
        const incH = ((d.income  / maxVal) * (svgH - padB - 10)) || 0
        const expH = ((d.expense / maxVal) * (svgH - padB - 10)) || 0
        return (
          <g key={d.month}>
            <rect x={x}               y={svgH - padB - incH} width={barW} height={incH} rx={3} fill="#2E7D52" />
            <rect x={x + barW + gap}  y={svgH - padB - expH} width={barW} height={expH} rx={3} fill="#C0392B" />
            <text x={x + barW + gap/2} y={svgH - 6} fontSize={9} fill="var(--text-muted)" textAnchor="middle">{d.month}</text>
          </g>
        )
      })}
      {/* Legend */}
      <rect x={svgW - 80} y={6}  width={9} height={9} rx={2} fill="#2E7D52" />
      <text x={svgW - 67} y={14} fontSize={9} fill="var(--text-muted)">Income</text>
      <rect x={svgW - 80} y={21} width={9} height={9} rx={2} fill="#C0392B" />
      <text x={svgW - 67} y={29} fontSize={9} fill="var(--text-muted)">Expense</text>
    </svg>
  )
}
