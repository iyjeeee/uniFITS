// parts/TransactionToggleCard.tsx — Card-style selection button used in all choice steps (differs from AddUtility's ToggleCard — see bug log)
import type { ReactNode } from 'react'

export default function TransactionToggleCard({ label, sublabel, icon, value, current, onClick, hasError }: { label: string; sublabel?: string; icon: ReactNode; value: string; current: string; onClick: (value: string) => void; hasError?: boolean }) {
  const active = current === value
  return (
    <button
      onClick={() => onClick(value)}
      style={{
        flex: 1, minWidth: 0, padding: '14px 12px', borderRadius: 12, cursor: 'pointer' as const,
        fontFamily: 'var(--font-body)', textAlign: 'left' as const,
        border: `2px solid ${active ? 'var(--accent)' : hasError ? 'var(--danger)' : 'var(--border-card)'}`,
        background: active ? 'var(--accent-light)' : 'var(--white)',
        transition: 'all .15s', display: 'flex' as const, flexDirection: 'column' as const, gap: 4,
      }}>
      <div style={{ fontSize: 18, lineHeight: 1, color: active ? 'var(--accent)' : 'var(--text-muted)' }}>{icon}</div>
      <div style={{ fontSize: 13.5, fontWeight: 700, color: active ? 'var(--accent)' : 'var(--text-primary)', marginTop: 2 }}>{label}</div>
      {sublabel && <div style={{ fontSize: 12, color: active ? 'var(--accent)' : 'var(--text-muted)', lineHeight: 1.4 }}>{sublabel}</div>}
    </button>
  )
}
