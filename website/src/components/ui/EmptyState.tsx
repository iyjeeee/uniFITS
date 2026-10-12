// components/ui/EmptyState.tsx — EmptyState
import type { ReactNode } from 'react'

// ── EmptyState ────────────────────────────────────────────────────────────────
interface EmptyStateProps { icon?: string; title?: string; subtitle?: string; action?: ReactNode }
export function EmptyState({ icon = '📭', title, subtitle, action }: EmptyStateProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', color: 'var(--text-muted)', textAlign: 'center' }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>{icon}</div>
      <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>{title}</div>
      {subtitle && <div style={{ fontSize: 13.5, color: 'var(--text-muted)', marginBottom: 20 }}>{subtitle}</div>}
      {action}
    </div>
  )
}
