// parts/CompactInput.tsx — Compact labelled input (optional hint; disabled style; accent border on focus)
import type { InputHTMLAttributes } from 'react'

/* Compact inline input — consistent height, no unnecessary width stretch */
export default function CompactInput({ label, hint, ...props }: { label?: string; hint?: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 3 }}>
      {label && <label style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' as const, letterSpacing: '.04em' }}>{label}</label>}
      <input
        {...props}
        style={{
          padding: '7px 10px', borderRadius: 7,
          border: '1.5px solid var(--border-card)',
          fontSize: 13, fontFamily: 'var(--font-body)',
          color: 'var(--text-primary)', background: props.disabled ? 'var(--neutral-light)' : '#fff',
          outline: 'none', boxSizing: 'border-box' as const, width: '100%',
        }}
        onFocus={e => { if (!props.disabled) e.target.style.borderColor = 'var(--accent)' }}
        onBlur={e  => { if (!props.disabled) e.target.style.borderColor = 'var(--border-card)' }}
      />
      {hint && <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{hint}</div>}
    </div>
  )
}
