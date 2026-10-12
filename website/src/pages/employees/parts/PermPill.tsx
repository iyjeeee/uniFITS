// parts/PermPill.tsx — Permission toggle pill
import type { PermissionDef } from './rolesShared'

/* ── Permission toggle pill ──────────────────────────────────────── */
export default function PermPill({ perm, active, onToggle, disabled }: { perm: PermissionDef; active: boolean; onToggle: () => void; disabled?: boolean }) {
  return (
    <label style={{
      display: 'flex' as const, alignItems: 'center', gap: 6, fontSize: 13, cursor: disabled ? 'not-allowed' : 'pointer',
      padding: '5px 12px', borderRadius: 8,
      border: `1.5px solid ${active ? 'var(--accent)' : 'var(--border-card)'}`,
      background: active ? 'var(--accent-light)' : 'var(--white)',
      color: active ? 'var(--accent)' : 'var(--text-secondary)',
      opacity: disabled ? .5 : 1, transition: 'all .15s',
    }}>
      <input
        type="checkbox"
        checked={active}
        disabled={disabled}
        onChange={onToggle}
        style={{ accentColor: 'var(--accent)', width: 13, height: 13 }}
      />
      {perm.label}
    </label>
  )
}
