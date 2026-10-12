// components/ui/StepWizard.tsx — StepWizard (step indicator)

// ── StepWizard ────────────────────────────────────────────────────────────────
interface StepWizardProps { steps?: string[]; current?: number }
export function StepWizard({ steps = [], current = 0 }: StepWizardProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 4, overflowX: 'auto' }}>
      {steps.map((label, i) => {
        const done = i < current; const active = i === current
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', flex: i < steps.length - 1 ? 1 : 'none', minWidth: 0 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flexShrink: 0 }}>
              <div style={{ width: 30, height: 30, borderRadius: '50%', background: done ? 'var(--success)' : active ? 'var(--accent)' : 'var(--border)', color: done || active ? '#fff' : 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, transition: 'background .25s' }}>
                {done ? '✓' : i + 1}
              </div>
              <div style={{ fontSize: 11, fontWeight: active ? 600 : 400, color: active ? 'var(--accent)' : done ? 'var(--success)' : 'var(--text-muted)', whiteSpace: 'nowrap' }}>{label}</div>
            </div>
            {i < steps.length - 1 && <div style={{ flex: 1, height: 2, background: done ? 'var(--success)' : 'var(--border)', margin: '0 6px', marginBottom: 18, transition: 'background .25s' }} />}
          </div>
        )
      })}
    </div>
  )
}
