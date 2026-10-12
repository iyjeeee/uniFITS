// components/ui/Card.tsx — Card + CardHeader
import type { ReactNode, CSSProperties } from 'react'

// ── Card ──────────────────────────────────────────────────────────────────────
interface CardProps { children: ReactNode; style?: CSSProperties; onClick?: () => void; onMouseEnter?: ((e: React.MouseEvent<HTMLElement>) => void) | (() => void); onMouseLeave?: ((e: React.MouseEvent<HTMLElement>) => void) | (() => void) }
export function Card({ children, style, onClick, onMouseEnter, onMouseLeave }: CardProps) {
  return (
    <div onClick={onClick} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} style={{ background: 'var(--white)', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--border-card)', boxShadow: 'var(--shadow-sm)', ...style }}>
      {children}
    </div>
  )
}

// CardHeader — standardized top of a card with title, optional subtitle, and actions slot
interface CardHeaderProps { title: string; subtitle?: string; actions?: ReactNode }
export function CardHeader({ title, subtitle, actions }: CardHeaderProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid var(--border-inner)', gap: 12, flexWrap: 'wrap' }}>
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{title}</div>
        {subtitle && <div style={{ fontSize: 12.5, color: 'var(--text-muted)', marginTop: 2 }}>{subtitle}</div>}
      </div>
      {actions && <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>{actions}</div>}
    </div>
  )
}
