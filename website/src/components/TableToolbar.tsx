// components/TableToolbar.tsx — Toolbar row of list-page table cards: title block + controls, search box, primary "Add" button
import type { ReactNode } from 'react'

// TableToolbar — title/subtitle on the left, controls (filters, search, add) on the right
export function TableToolbar({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <div style={{ display: 'flex' as const, alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: '1px solid var(--border-inner)', flexWrap: 'wrap', gap: 10 }}>
      <div>
        <div style={{ fontSize: 14, fontWeight: 600 }}>{title}</div>
        <div style={{ fontSize: 12.5, color: 'var(--text-muted)', marginTop: 2 }}>{subtitle}</div>
      </div>
      <div style={{ display: 'flex' as const, gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>{children}</div>
    </div>
  )
}

// ToolbarSearch — 180px search input with leading magnifier icon
export function ToolbarSearch({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div style={{ position: 'relative' as const }}>
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" style={{ position: 'absolute' as const, left: 9, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      <input value={value} onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)} placeholder="Search…"
        style={{ padding: '7px 10px 7px 28px', borderRadius: 7, border: '1.5px solid var(--border-card)', fontSize: 13, fontFamily: 'var(--font-body)', color: 'var(--text-primary)', background: '#fff', outline: 'none', width: 180 }}
        onFocus={e => e.target.style.borderColor = 'var(--accent)'}
        onBlur={e  => e.target.style.borderColor = 'var(--border-card)'} />
    </div>
  )
}

// ToolbarAddButton — accent "Add …" button; children = icon + label
export function ToolbarAddButton({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button onClick={onClick}
      style={{ display: 'inline-flex' as const, alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 8, border: 'none', background: 'var(--accent)', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' as const, fontFamily: 'var(--font-body)', whiteSpace: 'nowrap' as const }}>
      {children}
    </button>
  )
}
