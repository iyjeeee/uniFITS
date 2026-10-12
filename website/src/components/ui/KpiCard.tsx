// components/ui/KpiCard.tsx — KpiCard
import { useState } from 'react'
import type { ReactNode } from 'react'
import { Card } from './Card'

// ── KpiCard ───────────────────────────────────────────────────────────────────
interface KpiCardProps { label: string; value: ReactNode; icon?: ReactNode; color?: string; delta?: number; bg?: string; onClick?: () => void }
export function KpiCard({ label, value, icon, color = 'var(--accent)', delta, bg, onClick }: KpiCardProps) {
  const [hov, setHov] = useState(false)
  return (
    <Card
      onClick={onClick}
      style={{ padding: '20px 22px', background: '#FFFFFF', borderLeft: `3px solid ${color}`, cursor: onClick ? 'pointer' : 'default', transform: hov ? 'translateY(-3px)' : 'none', boxShadow: hov ? '0 8px 20px rgba(75,94,170,.18)' : undefined, transition: 'transform .18s ease, box-shadow .18s ease' }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--text-muted)' }}>{label}</div>
        {icon && <div style={{ width: 36, height: 36, borderRadius: 9, background: bg ? 'rgba(255,255,255,.2)' : 'var(--neutral-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{icon}</div>}
      </div>
      <div style={{ fontSize: 26, fontWeight: 800, color: bg ? '#fff' : color, lineHeight: 1 }}>{value}</div>
      {delta != null && (
        <div style={{ fontSize: 12, color: bg ? 'rgba(255,255,255,.75)' : delta >= 0 ? 'var(--success)' : 'var(--danger)', marginTop: 6, fontWeight: 500 }}>
          {delta >= 0 ? '↑' : '↓'} {Math.abs(delta)}% vs last period
        </div>
      )}
    </Card>
  )
}
