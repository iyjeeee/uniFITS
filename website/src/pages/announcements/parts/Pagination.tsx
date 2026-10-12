// parts/Pagination.tsx — Numbered page buttons used by the tile strip and the View All modals
import type { ReactNode } from 'react'
import { Ico } from './icons'

/* ─── Pagination component ─────────────────────────────────────── */
export function Pagination({ page, total, onChange }: { page: number; total: number; onChange: (page: number) => void }) {
  return (
    <div style={{ display: 'flex' as const, alignItems: 'center', justifyContent: 'center', gap: 4, padding: '12px 0 4px' }}>
      <PageBtn disabled={page === 1} onClick={() => onChange(page - 1)}><Ico.ChevL /></PageBtn>
      {Array.from({ length: total }, (_, i) => i + 1).map((p) => (
        <PageBtn key={p} active={p === page} onClick={() => onChange(p)}>{p}</PageBtn>
      ))}
      <PageBtn disabled={page === total} onClick={() => onChange(page + 1)}><Ico.ChevR /></PageBtn>
    </div>
  )
}

export function PageBtn({ children, active, disabled, onClick }: { children: ReactNode; active?: boolean; disabled?: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ display:'flex', alignItems:'center', justifyContent:'center', width:28, height:28, borderRadius:6, border:'1.5px solid var(--border-card)', background: active ? 'var(--accent)' : disabled ? 'var(--neutral-light)' : '#fff', color: active ? '#fff' : disabled ? 'var(--text-muted)' : 'var(--text-primary)', cursor: disabled ? 'not-allowed' : 'pointer', fontSize:12, fontWeight: active ? 700 : 400 }}>
      {children}
    </button>
  )
}
