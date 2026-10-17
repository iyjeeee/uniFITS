// parts/ReportStatRow.tsx — Two-column label/value row; header (white on accent), total (tinted) and indented variants
import type { ReactNode } from 'react'

export default function StatRow({ label, value, color, bold, indent, border, whiteLabel }: { label: string; value: ReactNode; color?: string; bold?: boolean; indent?: boolean; border?: boolean; whiteLabel?: boolean }) {
  // whiteLabel=true: INCOME/EXPENSES/NET SURPLUS header rows — accent bg, white text
  // bold without whiteLabel: total rows — color-tinted light bg so green/red stays visible
  const isHeader   = bold && whiteLabel
  const isTotalRow = bold && !whiteLabel
  const rowBg = isHeader
    ? 'var(--accent)'
    : isTotalRow
      ? color === 'var(--success)' ? 'rgba(46,125,82,.10)'
      : color === 'var(--danger)'  ? 'rgba(192,57,43,.10)'
      : 'rgba(75,94,170,.10)'
    : 'transparent'
  return (
    <div style={{
      display: 'flex' as const, justifyContent: 'space-between', alignItems: 'center',
      padding: '9px 14px',
      paddingLeft: indent ? 28 : 14,
      borderBottom: border ? '2px solid var(--text-primary)' : '1px solid var(--border-inner)',
      background: rowBg,
    }}>
      <span style={{ fontSize: 13.5, fontWeight: bold ? 700 : 400, color: isHeader ? '#fff' : 'var(--text-primary)' }}>{label}</span>
      <span style={{ fontSize: 14, fontWeight: bold ? 800 : 600, color: isHeader ? '#fff' : (color || 'var(--text-primary)') }}>{value}</span>
    </div>
  )
}
