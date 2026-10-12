// parts/RoleModalContent.tsx — Role detail: assigned members + permission editor
import { useState } from 'react'
import { MOCK_USERS } from '../../../api/mockData'
import type { Role, Permission, OrgConfig } from '../../../types'
import { ALL_PERMISSIONS, MODULES } from './rolesShared'
import PermPill from './PermPill'

/* ── Role detail + permission editor content inside InfoModal ────── */
export default function RoleModalContent({ role: _role, editPerms, onToggle, assignedIds, onToggleMember, org: _org }: { role: Role | null; editPerms: Permission[]; onToggle: (key: Permission) => void; assignedIds: string[]; onToggleMember: (uid: string) => void; org: OrgConfig }) {
  const allUsers    = MOCK_USERS
  const assigned    = allUsers.filter((u) => assignedIds.includes(u.id))
  const unassigned  = allUsers.filter((u) => !assignedIds.includes(u.id))
  const [showAdd, setShowAdd] = useState(false)

  return (
    <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 20 }}>

      {/* Assigned members — editable */}
      <div>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' as const, letterSpacing: '.07em', marginBottom: 10, display: 'flex' as const, alignItems: 'center', justifyContent: 'space-between' }}>
          <span>Assigned Members ({assigned.length})</span>
          <button
            onClick={() => setShowAdd(v => !v)}
            style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer' as const, padding: '2px 6px', borderRadius: 6, transition: 'background .15s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-light)'}
            onMouseLeave={e => e.currentTarget.style.background = 'none'}>
            {showAdd ? '− Hide' : '+ Add Member'}
          </button>
        </div>

        {/* Current assigned members — click to remove */}
        <div style={{ display: 'flex' as const, flexWrap: 'wrap', gap: 6, marginBottom: showAdd ? 10 : 0 }}>
          {assigned.length === 0
            ? <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>No members assigned yet.</span>
            : assigned.map((u) => (
              <button key={u.id}
                onClick={() => onToggleMember(u.id)}
                title="Click to remove"
                style={{
                  padding: '4px 12px', borderRadius: 20, fontSize: 13, fontWeight: 600,
                  background: 'var(--accent)', color: '#fff',          /* white text on accent bg */
                  border: 'none', cursor: 'pointer' as const,
                  display: 'flex' as const, alignItems: 'center', gap: 5,
                  transition: 'background .15s, transform .15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--danger)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.transform = '' }}>
                {u.full_name}
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            ))
          }
        </div>

        {/* Add unassigned members dropdown list */}
        {showAdd && unassigned.length > 0 && (
          <div style={{ padding: '10px 14px', borderRadius: 10, border: '1.5px solid var(--border-card)', background: 'var(--neutral-light)', display: 'flex' as const, flexWrap: 'wrap', gap: 6 }}>
            <div style={{ width: '100%', fontSize: 11.5, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 4 }}>Click to add:</div>
            {unassigned.map((u) => (
              <button key={u.id}
                onClick={() => onToggleMember(u.id)}
                style={{
                  padding: '4px 12px', borderRadius: 20, fontSize: 13, fontWeight: 500,
                  background: '#fff', color: 'var(--text-primary)',
                  border: '1.5px solid var(--border-card)', cursor: 'pointer' as const,
                  transition: 'background .15s, border-color .15s, color .15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'var(--accent)' }}
                onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.borderColor = 'var(--border-card)' }}>
                + {u.full_name}
              </button>
            ))}
          </div>
        )}
        {showAdd && unassigned.length === 0 && (
          <div style={{ fontSize: 13, color: 'var(--text-muted)', padding: '8px 0' }}>All members are already assigned to this role.</div>
        )}
      </div>

      {/* Permissions editor grouped by module */}
      <div>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' as const, letterSpacing: '.07em', marginBottom: 14 }}>
          Permissions
        </div>
        {MODULES.map(mod => (
          <div key={mod} style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase' as const, letterSpacing: '.06em', marginBottom: 8, paddingBottom: 4, borderBottom: '1px solid var(--border-inner)' }}>
              {mod}
            </div>
            <div style={{ display: 'flex' as const, flexWrap: 'wrap', gap: 8 }}>
              {ALL_PERMISSIONS.filter((p) => p.module === mod).map((p) => (
                <PermPill
                  key={p.key}
                  perm={p}
                  active={editPerms.includes(p.key)}
                  onToggle={() => onToggle(p.key)}
                  disabled={false}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
