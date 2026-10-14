// components/Pagination.tsx — Numbered page buttons with prev/next chevrons (list pages and View All modals)
import type { ReactNode } from 'react'

const ChevL = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
const ChevR = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>

interface PaginationProps { page: number; total: number; onChange: (page: number) => void; padded?: boolean }   // padded adds vertical spacing (used inside modals)

export default function Pagination({ page, total, onChange, padded = false }: PaginationProps) {
  return (
    <div style={{ display: 'flex' as const, alignItems: 'center', justifyContent: 'center', gap: 4, ...(padded ? { padding: '12px 0 4px' } : {}) }}>
      <PageBtn disabled={page === 1} onClick={() => onChange(page - 1)}><ChevL /></PageBtn>
      {Array.from({ length: total }, (_, i) => i + 1).map((p) => (
        <PageBtn key={p} active={p === page} onClick={() => onChange(p)}>{p}</PageBtn>
      ))}
      <PageBtn disabled={page === total} onClick={() => onChange(page + 1)}><ChevR /></PageBtn>
    </div>
  )
}

export function PageBtn({ children, active, disabled, onClick }: { children: ReactNode; active?: boolean; disabled?: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ display: 'flex' as const, alignItems: 'center', justifyContent: 'center', width: 28, height: 28, borderRadius: 6, border: '1.5px solid var(--border-card)', background: active ? 'var(--accent)' : disabled ? 'var(--neutral-light)' : '#fff', color: active ? '#fff' : disabled ? 'var(--text-muted)' : 'var(--text-primary)', cursor: disabled ? 'not-allowed' : 'pointer', fontSize: 12, fontWeight: active ? 700 : 400 }}>
      {children}
    </button>
  )
}
