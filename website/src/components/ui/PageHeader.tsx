// components/ui/PageHeader.tsx — PageHeader
import type { ReactNode } from 'react'

// ── PageHeader ────────────────────────────────────────────────────────────────
interface PageHeaderProps { title: string; subtitle?: string; actions?: ReactNode }
export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 4 }}>
      <div>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', lineHeight: 1.2 }}>{title}</h1>
        {subtitle && <p style={{ margin: '4px 0 0', fontSize: 13.5, color: 'var(--text-muted)' }}>{subtitle}</p>}
      </div>
      {actions && <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0, flexWrap: 'wrap' }}>{actions}</div>}
    </div>
  )
}
