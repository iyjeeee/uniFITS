// components/FormWizard.tsx — Shared multi-step form pieces used by all Add* pages
export interface StepSidebarProps { steps: string[]; current: number }   // current = zero-based active step
export interface FieldErrorProps { msg?: string }                        // renders nothing when empty
export interface StepBannerProps { errors: Record<string, string> }      // field name → message

/* ── StepSidebar — vertical step list with done/active states ───── */
export function StepSidebar({ steps, current }: StepSidebarProps) {
  return (
    <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 4 }}>
      {steps.map((label: string, i: number) => {
        const done = i < current, active = i === current
        return (
          <div key={i} style={{ display: 'flex' as const, alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 9, background: active ? 'var(--accent-light)' : done ? 'var(--success-light)' : 'transparent', border: '1.5px solid ' + (active ? 'rgba(75,94,170,.3)' : done ? 'rgba(46,125,82,.2)' : 'var(--border-card)') }}>
            <div style={{ width: 26, height: 26, borderRadius: '50%', background: done ? '#2E7D52' : active ? 'var(--accent)' : 'var(--border-card)', color: done || active ? '#fff' : 'var(--text-muted)', display: 'flex' as const, alignItems: 'center', justifyContent: 'center', fontSize: 11.5, fontWeight: 700, flexShrink: 0 }}>
              {done ? '✓' : i + 1}
            </div>
            <span style={{ fontSize: 13, fontWeight: active ? 700 : done ? 600 : 400, color: active ? 'var(--accent)' : done ? 'var(--success)' : 'var(--text-muted)' }}>{label}</span>
          </div>
        )
      })}
    </div>
  )
}
/* ── FieldError — inline error message below a field ────────────── */
export function FieldError({ msg }: FieldErrorProps) {
  if (!msg) return null
  return (
    <div style={{ display: 'flex' as const, alignItems: 'center', gap: 5, marginTop: 3, fontSize: 12, color: 'var(--danger)', fontWeight: 500 }} role="alert">
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      {msg}
    </div>
  )
}
/* ── StepBanner — summary of all current-step errors ────────────── */
export function StepBanner({ errors }: StepBannerProps) {
  const msgs = Object.values(errors).filter(Boolean)
  if (!msgs.length) return null
  return (
    <div style={{ display: 'flex' as const, alignItems: 'flex-start', gap: 10, padding: '12px 14px', borderRadius: 9, background: '#fff5f5', border: '1.5px solid rgba(192,57,43,.3)', marginBottom: 16 }} role="alert">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--danger)', marginBottom: 4 }}>Please fix the following before continuing:</div>
        {msgs.map((m, i) => <div key={i} style={{ fontSize: 12.5, color: 'var(--danger)', lineHeight: 1.5 }}>• {m}</div>)}
      </div>
    </div>
  )
}