// parts/AddRoleContent.tsx — Add Role form body
import type { Dispatch, SetStateAction } from 'react'
import type { Permission } from '../../../types'
import type { RoleForm } from './rolesShared'
import { ALL_PERMISSIONS, MODULES } from './rolesShared'
import PermPill from './PermPill'

/* ── Add Role form inside InfoModal ──────────────────────────────── */
export default function AddRoleContent({ form, setForm }: { form: RoleForm; setForm: Dispatch<SetStateAction<RoleForm>> }) {
  const newPerms = form.permissions
  const setNewPerms = (p: Permission[]) => setForm(f => ({ ...f, permissions: p }))

  function toggle(key: Permission) {
    setNewPerms(newPerms.includes(key) ? newPerms.filter((p) => p !== key) : [...newPerms, key])
  }

  return (
    <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 16 }}>
      <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 4 }}>
        <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' as const, letterSpacing: '.04em' }}>Role Name *</label>
        <input
          value={form.name}
          onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setForm((f) => ({ ...f, name: e.target.value }))}
          placeholder="e.g. Treasurer, Project Lead"
          style={{ padding: '8px 12px', borderRadius: 8, border: '1.5px solid var(--border-card)', fontSize: 13.5, fontFamily: 'var(--font-body)', color: 'var(--text-primary)', background: '#fff', outline: 'none' }}
          onFocus={e => { e.target.style.borderColor = 'var(--accent)' }}
          onBlur={e  => { e.target.style.borderColor = 'var(--border-card)' }}
        />
      </div>
      <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 4 }}>
        <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' as const, letterSpacing: '.04em' }}>Description</label>
        <textarea
          value={form.description}
          onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setForm((f) => ({ ...f, description: e.target.value }))}
          placeholder="Briefly describe what this role can do"
          rows={2}
          style={{ padding: '8px 12px', borderRadius: 8, border: '1.5px solid var(--border-card)', fontSize: 13.5, fontFamily: 'var(--font-body)', color: 'var(--text-primary)', background: '#fff', outline: 'none', resize: 'vertical' }}
          onFocus={e => { e.target.style.borderColor = 'var(--accent)' }}
          onBlur={e  => { e.target.style.borderColor = 'var(--border-card)' }}
        />
      </div>
      <div>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' as const, letterSpacing: '.07em', marginBottom: 14 }}>Assign Permissions</div>
        {MODULES.map(mod => (
          <div key={mod} style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase' as const, letterSpacing: '.06em', marginBottom: 8, paddingBottom: 4, borderBottom: '1px solid var(--border-inner)' }}>
              {mod}
            </div>
            <div style={{ display: 'flex' as const, flexWrap: 'wrap', gap: 8 }}>
              {ALL_PERMISSIONS.filter((p) => p.module === mod).map((p) => (
                <PermPill key={p.key} perm={p} active={form.permissions.includes(p.key)} onToggle={() => toggle(p.key)} disabled={false} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
