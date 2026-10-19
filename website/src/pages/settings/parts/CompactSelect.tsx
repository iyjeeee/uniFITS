// parts/CompactSelect.tsx — Compact labelled native select
import type { SelectHTMLAttributes } from 'react'

/* Compact select */
export default function CompactSelect({ label, options = [], ...props }: { label?: string; options?: { value: string; label: string }[] } & SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 3 }}>
      {label && <label style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' as const, letterSpacing: '.04em' }}>{label}</label>}
      <select
        {...props}
        style={{
          padding: '7px 10px', borderRadius: 7,
          border: '1.5px solid var(--border-card)',
          fontSize: 13, fontFamily: 'var(--font-body)',
          color: 'var(--text-primary)', background: '#fff',
          outline: 'none', cursor: 'pointer' as const, width: '100%', boxSizing: 'border-box' as const,
        }}>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  )
}
