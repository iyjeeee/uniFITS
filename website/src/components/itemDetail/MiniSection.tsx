// itemDetail/MiniSection.tsx — Small colored header strip above each panel (icon, title, optional count)
import type { ReactNode } from 'react'

interface MiniSectionProps { icon: ReactNode; title: string; count?: number; color: string; bg: string; border: string }
export default function MiniSection({ icon, title, count, color, bg, border }: MiniSectionProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 8, background: bg, border: `1.5px solid ${border}`, marginBottom: 12 }}>
      <span style={{ color, display: 'flex' }}>{icon}</span>
      <span style={{ fontSize: 13, fontWeight: 700, color }}>
        {title}
        {count !== undefined && <span style={{ marginLeft: 6, fontSize: 12, fontWeight: 600, opacity: .8 }}>({count})</span>}
      </span>
    </div>
  )
}
