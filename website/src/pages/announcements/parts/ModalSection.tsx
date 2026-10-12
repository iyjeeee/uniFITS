// parts/ModalSection.tsx — Section label inside a View All modal
import type { ReactNode } from 'react'

export default function ModalSection({ icon, label, count, color = 'var(--accent)' }: { icon: ReactNode; label: string; count: number; color?: string }) {
  return (
    <div style={{ display: 'flex' as const, alignItems: 'center', gap: 8, padding: '12px 0 8px', borderBottom: '2px solid var(--border-table)', marginBottom: 8 }}>
      <span style={{ color, display: 'flex' as const }}>{icon}</span>
      <span style={{ fontSize: 12, fontWeight: 700, color, textTransform: 'uppercase' as const, letterSpacing: '.08em' }}>{label}</span>
      {count !== undefined && (
        <span style={{ marginLeft: 'auto', background: color, color: '#fff', fontSize: 10.5, fontWeight: 700, padding: '2px 8px', borderRadius: 20 }}>{count}</span>
      )}
    </div>
  )
}
