// RolesPage.jsx — Manage roles and permissions.
// Table: role rows are clickable → opens permissions customization modal.
// Actions column: Delete only (Edit removed — editing happens inside modal).
// "Manage Defaults" button removed.
// Default Permissions section is now a title header with the Add Role button.
import { useState } from 'react'
import { Card, Badge, InfoModal, ResponseModal, Input, Textarea } from '../../components/ui'
import { MOCK_ROLES, MOCK_USERS } from '../../api/mockData'
import { useOrg } from '../../context/OrgContext'
import useBreakpoint from '../../hooks/useBreakpoint'


/* ── Shared SVG button icons ──────────────────────────────────────── */
const BtnIco = {
  Save:   () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>,
  Edit:   () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  Delete: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>,
  Cancel: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Close:  () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Plus:   () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Check:  () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  PDF:    () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  Print:  () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>,
  Export: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  Shield: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  View:   () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  Arrow:  () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
  Back:   () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>,
}


/* ── All available permissions grouped by module ─────────────────── */
const ALL_PERMISSIONS = [
  /* Members */
  { key: 'view_members',        label: 'View Members',          module: 'Members'      },
  { key: 'add_user',            label: 'Add Member',            module: 'Members'      },
  { key: 'edit_user',           label: 'Edit Member',           module: 'Members'      },
  { key: 'delete_user',         label: 'Delete Member',         module: 'Members'      },
  { key: 'manage_roles',        label: 'Manage Roles',          module: 'Members'      },
  { key: 'manage_attendance',   label: 'Manage Attendance',     module: 'Members'      },
  /* Projects */
  { key: 'view_projects',       label: 'View Projects',         module: 'Projects'     },
  { key: 'add_project',         label: 'Add Project',           module: 'Projects'     },
  { key: 'edit_project',        label: 'Edit Project',          module: 'Projects'     },
  { key: 'delete_project',      label: 'Delete Project',        module: 'Projects'     },
  { key: 'approve_project',     label: 'Approve / Close Project', module: 'Projects'   },
  /* Events */
  { key: 'view_events',         label: 'View Events',           module: 'Events'       },
  { key: 'add_event',           label: 'Add Event',             module: 'Events'       },
  { key: 'edit_event',          label: 'Edit Event',            module: 'Events'       },
  { key: 'delete_event',        label: 'Delete Event',          module: 'Events'       },
  { key: 'approve_event',       label: 'Approve / Close Event', module: 'Events'       },
  /* Finance */
  { key: 'view_funds',          label: 'View Funds',            module: 'Finance'      },
  { key: 'manage_funds',        label: 'Manage Funds',          module: 'Finance'      },
  { key: 'delete_fund',         label: 'Delete Fund',           module: 'Finance'      },
  { key: 'view_transactions',   label: 'View Transactions',     module: 'Finance'      },
  { key: 'add_transaction',     label: 'Add Transaction',       module: 'Finance'      },
  { key: 'approve_transaction', label: 'Approve Transaction',   module: 'Finance'      },
  { key: 'delete_transaction',  label: 'Delete Transaction',    module: 'Finance'      },
  { key: 'manage_utilities',    label: 'Manage Utilities',      module: 'Finance'      },
  /* Announcements */
  { key: 'view_announcements',  label: 'View Announcements',    module: 'Announcements'},
  { key: 'post_announcement',   label: 'Post Announcement',     module: 'Announcements'},
  { key: 'edit_announcement',   label: 'Edit Announcement',     module: 'Announcements'},
  { key: 'delete_announcement', label: 'Delete Announcement',   module: 'Announcements'},
  /* Reports */
  { key: 'view_reports',        label: 'View Reports',          module: 'Reports'      },
  { key: 'export_reports',      label: 'Export Reports (PDF)',  module: 'Reports'      },
  { key: 'view_audit_logs',     label: 'View Audit Logs',       module: 'Reports'      },
  /* Settings */
  { key: 'manage_settings',     label: 'Manage Settings',       module: 'Settings'     },
  { key: 'backup_restore',      label: 'Backup & Restore',      module: 'Settings'     },
  { key: 'manage_org_profile',  label: 'Edit Org Profile',      module: 'Settings'     },
]
const MODULES = [...new Set(ALL_PERMISSIONS.map(p => p.module))]

/* ── SVG Icons ───────────────────────────────────────────────────── */
function IcoDelete() { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg> }
function IcoPlus()   { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> }
function IcoShield() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> }

/* ── IconBtn — solid-color action button ─────────────────────────── */
function IconBtn({ children, solidBg, title, onClick }) {
  return (
    <button
      onClick={e => { e.stopPropagation(); onClick() }}
      title={title}
      style={{ width: 32, height: 32, borderRadius: 7, border: 'none', background: solidBg, color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform .18s ease, box-shadow .18s ease', flexShrink: 0 }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.boxShadow = '0 0 0 2px rgba(0,0,0,.80), 0 5px 14px rgba(0,0,0,.28)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = ''
        e.currentTarget.style.boxShadow = ''
      }}>
      {children}
    </button>
  )
}

/* ── Permission toggle pill ──────────────────────────────────────── */
function PermPill({ perm, active, onToggle, disabled }) {
  return (
    <label style={{
      display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, cursor: disabled ? 'not-allowed' : 'pointer',
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

/* ── Role detail + permission editor content inside InfoModal ────── */
function RoleModalContent({ role, editPerms, onToggle, org }) {
  const assigned = MOCK_USERS.filter(u => u.role === role.name)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Assigned members */}
      {assigned.length > 0 && (
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 10 }}>
            Assigned Members ({assigned.length})
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {assigned.map(u => (
              <span key={u.id} style={{ padding: '4px 12px', borderRadius: 20, background: 'var(--table-head-bg)', border: '1px solid var(--border-card)', fontSize: 13, fontWeight: 500 }}>
                {u.full_name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Permissions editor grouped by module */}
      <div>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 14 }}>
          Permissions
        </div>
        {MODULES.map(mod => (
          <div key={mod} style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8, paddingBottom: 4, borderBottom: '1px solid var(--border-inner)' }}>
              {mod}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {ALL_PERMISSIONS.filter(p => p.module === mod).map(p => (
                <PermPill
                  key={p.key}
                  perm={p}
                  active={editPerms.includes(p.key)}
                  onToggle={() => onToggle(p.key)}
                  disabled={false} /* all roles editable — system roles can be customized */
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Add Role form inside InfoModal ──────────────────────────────── */
function AddRoleContent({ form, setForm }) {
  const [newPerms, setNewPerms] = [form.permissions, (p) => setForm(f => ({ ...f, permissions: p }))]

  function toggle(key) {
    setNewPerms(newPerms.includes(key) ? newPerms.filter(p => p !== key) : [...newPerms, key])
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '.04em', fontSize: 12 }}>Role Name *</label>
        <input
          value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          placeholder="e.g. Treasurer, Project Lead"
          style={{ padding: '8px 12px', borderRadius: 8, border: '1.5px solid var(--border-card)', fontSize: 13.5, fontFamily: 'var(--font-body)', color: 'var(--text-primary)', background: '#fff', outline: 'none' }}
          onFocus={e => { e.target.style.borderColor = 'var(--accent)' }}
          onBlur={e  => { e.target.style.borderColor = 'var(--border-card)' }}
        />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '.04em' }}>Description</label>
        <textarea
          value={form.description}
          onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
          placeholder="Briefly describe what this role can do"
          rows={2}
          style={{ padding: '8px 12px', borderRadius: 8, border: '1.5px solid var(--border-card)', fontSize: 13.5, fontFamily: 'var(--font-body)', color: 'var(--text-primary)', background: '#fff', outline: 'none', resize: 'vertical' }}
          onFocus={e => { e.target.style.borderColor = 'var(--accent)' }}
          onBlur={e  => { e.target.style.borderColor = 'var(--border-card)' }}
        />
      </div>
      <div>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 14 }}>Assign Permissions</div>
        {MODULES.map(mod => (
          <div key={mod} style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8, paddingBottom: 4, borderBottom: '1px solid var(--border-inner)' }}>
              {mod}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {ALL_PERMISSIONS.filter(p => p.module === mod).map(p => (
                <PermPill key={p.key} perm={p} active={form.permissions.includes(p.key)} onToggle={() => toggle(p.key)} disabled={false} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Delete confirmation body ────────────────────────────────────── */
function DeleteBody({ role, org }) {
  const assigned = MOCK_USERS.filter(u => u.role === role.name)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ padding: '14px 16px', borderRadius: 10, background: '#fdecea', border: '1.5px solid rgba(192,57,43,.30)', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" strokeWidth="2.5" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 1 }}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        <div>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--danger)' }}>Warning: This action cannot be undone</div>
          <div style={{ fontSize: 12.5, color: 'var(--danger)', marginTop: 3, lineHeight: 1.5 }}>
            Deleting "{role.name}" will remove this role from {assigned.length > 0 ? `${assigned.length} assigned member${assigned.length !== 1 ? 's' : ''}` : 'the system'}.
          </div>
        </div>
      </div>
      {[['Role Name', role.name], ['Type', role.is_system ? 'System' : 'Custom'], ['Assigned Members', String(assigned.length)], ['Permissions', String(role.permissions.length)]].map(([k, v], idx) => (
        <div key={k} style={{ display: 'flex', gap: 16, padding: '10px 14px', borderBottom: '1px solid var(--border-inner)', background: idx % 2 === 0 ? 'var(--neutral-light)' : '#fff' }}>
          <div style={{ width: 150, fontSize: 12.5, color: 'var(--text-muted)', flexShrink: 0, fontWeight: 500 }}>{k}</div>
          <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)' }}>{v}</div>
        </div>
      ))}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════════ */
export default function RolesPage() {
  const org = useOrg()
  const { isMobile } = useBreakpoint()

  const [roles,        setRoles]        = useState(MOCK_ROLES)
  const [viewRole,     setViewRole]     = useState(null)    // role open in detail modal
  const [editPerms,    setEditPerms]    = useState([])      // permission state inside detail modal
  const [showAdd,      setShowAdd]      = useState(false)   // add role modal
  const [deleteItem,   setDeleteItem]   = useState(null)    // role pending deletion
  const [actionResult, setActionResult] = useState(null)    // feedback
  const [addForm,      setAddForm]      = useState({ name: '', description: '', permissions: [] })

  /* Open detail modal — load role's current permissions into edit state */
  function openDetail(role) {
    setViewRole(role)
    setEditPerms([...role.permissions])
  }

  /* Toggle a permission inside the detail modal */
  function togglePerm(key) {
    setEditPerms(prev => prev.includes(key) ? prev.filter(p => p !== key) : [...prev, key])
  }

  /* Save permission changes */
  function handleSavePerms() {
    setRoles(prev => prev.map(r => r.id === viewRole.id ? { ...r, permissions: editPerms } : r))
    setViewRole(null)
    setActionResult({ variant: 'success', title: 'Permissions Updated', message: `"${viewRole.name}" permissions have been saved successfully.` })
  }

  /* Create new role */
  function handleCreate() {
    if (!addForm.name.trim()) return
    setRoles(prev => [...prev, { id: String(Date.now()), ...addForm, is_system: false }])
    setAddForm({ name: '', description: '', permissions: [] })
    setShowAdd(false)
    setActionResult({ variant: 'success', title: 'Role Created', message: `"${addForm.name}" has been added successfully.` })
  }

  /* Delete role */
  function handleDelete() {
    const name = deleteItem.name
    setRoles(prev => prev.filter(r => r.id !== deleteItem.id))
    setDeleteItem(null)
    setTimeout(() => setActionResult({ variant: 'danger', title: 'Role Deleted', message: `"${name}" has been permanently removed.` }), 260)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

      {/* ── Default Permissions header — title section with Add Role button ── */}
      <Card style={{ padding: '14px 20px', background: 'var(--info-light)', border: '1.5px solid rgba(36,113,163,.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(36,113,163,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--info)', flexShrink: 0 }}>
              <IcoShield />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--info)' }}>
                Default {org.people_label} Permissions (No Role Assigned)
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>
                Members without a role can: view announcements, view own profile
              </div>
            </div>
          </div>
          {/* Add Role button — prominently placed here per spec */}
          <button
            onClick={() => setShowAdd(true)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 18px', borderRadius: 8, border: 'none', background: 'var(--accent)', color: '#fff', fontSize: 13.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)', whiteSpace: 'nowrap' }}>
            <BtnIco.Plus /> Add Role
          </button>
        </div>
      </Card>

      {/* ── Role Definitions table ──────────────────────────────── */}
      <Card>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border-inner)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>Role Definitions</div>
            <div style={{ fontSize: 12.5, color: 'var(--text-muted)', marginTop: 2 }}>{roles.length} roles configured — click any row to customize permissions</div>
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: 'var(--table-head-bg)' }}>
                {['Role Name', 'Assigned To', 'Permissions', 'Type', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--table-head-fg)', textTransform: 'uppercase', letterSpacing: '.06em', borderBottom: '2px solid var(--border-table)', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {roles.map(role => {
                const assigned = MOCK_USERS.filter(u => u.role === role.name)
                return (
                  <tr key={role.id}
                    style={{ borderBottom: '1px solid var(--border-inner)', cursor: 'pointer', transition: 'background .12s' }}
                    onClick={() => openDetail(role)}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--neutral-light)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ fontWeight: 700, fontSize: 13.5 }}>{role.name}</div>
                      {role.description && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{role.description}</div>}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      {assigned.length === 0
                        ? <span style={{ color: 'var(--text-muted)', fontSize: 12.5 }}>Unassigned</span>
                        : <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                            {assigned.slice(0, 3).map(u => <Badge key={u.id} variant="neutral">{u.full_name}</Badge>)}
                            {assigned.length > 3 && <Badge variant="neutral">+{assigned.length - 3}</Badge>}
                          </div>
                      }
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                        {role.permissions.slice(0, 3).map(p => {
                          const def = ALL_PERMISSIONS.find(d => d.key === p)
                          return <Badge key={p} variant="accent" style={{ fontSize: 10 }}>{def?.label || p}</Badge>
                        })}
                        {role.permissions.length > 3 && <Badge variant="neutral" style={{ fontSize: 10 }}>+{role.permissions.length - 3}</Badge>}
                        {role.permissions.length === 0 && <span style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>No permissions</span>}
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <Badge variant={role.is_system ? 'info' : 'neutral'}>{role.is_system ? 'System' : 'Custom'}</Badge>
                    </td>
                    {/* Actions: Delete button for all roles including system */}
                    <td style={{ padding: '12px 16px' }} onClick={e => e.stopPropagation()}>
                      <IconBtn solidBg="var(--danger)" title="Delete role" onClick={() => setDeleteItem(role)}><IcoDelete /></IconBtn>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ── Role Detail + Permissions Editor InfoModal ──────────── */}
      <InfoModal
        open={!!viewRole}
        onClose={() => setViewRole(null)}
        title={viewRole?.name || ''}
        subtitle={viewRole ? `${viewRole.is_system ? 'System' : 'Custom'} Role · ${editPerms.length} permission${editPerms.length !== 1 ? 's' : ''}` : ''}
        accentColor="var(--accent)"
        footer={
          <div style={{ display: 'flex', gap: 10, justifyContent: 'space-between', width: '100%' }}>
            <button onClick={handleSavePerms}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 22px', borderRadius: 9, border: 'none', background: 'var(--accent)', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
              <BtnIco.Shield /> Save Permissions
            </button>
            <button onClick={() => setViewRole(null)}
              style={{ padding: '10px 28px', borderRadius: 9, border: '1.5px solid var(--border-card)', background: 'var(--neutral-light)', color: 'var(--text-primary)', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{marginRight:4}}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> Close
            </button>
          </div>
        }>
        {viewRole && <RoleModalContent role={viewRole} editPerms={editPerms} onToggle={togglePerm} org={org} />}
      </InfoModal>

      {/* ── Add Role InfoModal ───────────────────────────────────── */}
      <InfoModal
        open={showAdd}
        onClose={() => { setShowAdd(false); setAddForm({ name: '', description: '', permissions: [] }) }}
        title="Add New Role"
        subtitle="Create a custom role with specific permissions"
        accentColor="var(--accent)"
        editMode={true}
        footer={
          <div style={{ display: 'flex', gap: 10, justifyContent: 'space-between', width: '100%' }}>
            <button onClick={handleCreate} disabled={!addForm.name.trim()}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 22px', borderRadius: 9, border: 'none', background: addForm.name.trim() ? 'var(--accent)' : 'var(--border)', color: '#fff', fontSize: 14, fontWeight: 600, cursor: addForm.name.trim() ? 'pointer' : 'not-allowed', fontFamily: 'var(--font-body)' }}>
              <BtnIco.Plus /> Create Role
            </button>
            <button onClick={() => { setShowAdd(false); setAddForm({ name: '', description: '', permissions: [] }) }}
              style={{ padding: '10px 28px', borderRadius: 9, border: '1.5px solid var(--border-card)', background: 'var(--neutral-light)', color: 'var(--text-primary)', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{marginRight:4}}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> Cancel
            </button>
          </div>
        }>
        <AddRoleContent form={addForm} setForm={setAddForm} />
      </InfoModal>

      {/* ── Delete Confirmation Modal ───────────────────────────── */}
      <InfoModal
        open={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        title="Delete Role"
        subtitle="This action is permanent and cannot be undone"
        accentColor="var(--danger)"
        footer={
          <div style={{ display: 'flex', gap: 10, justifyContent: 'space-between', width: '100%' }}>
            <button onClick={handleDelete}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 24px', borderRadius: 9, border: 'none', background: 'var(--danger)', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
              <BtnIco.Delete /> Yes, Delete
            </button>
            <button onClick={() => setDeleteItem(null)}
              style={{ padding: '10px 28px', borderRadius: 9, border: '1.5px solid var(--border-card)', background: 'var(--neutral-light)', color: 'var(--text-primary)', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{marginRight:4}}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> Cancel
            </button>
          </div>
        }>
        {deleteItem && <DeleteBody role={deleteItem} org={org} />}
      </InfoModal>

      {/* ── Feedback ResponseModal ───────────────────────────────── */}
      <ResponseModal
        open={!!actionResult}
        onClose={() => setActionResult(null)}
        variant={actionResult?.variant || 'success'}
        title={actionResult?.title   || ''}
        message={actionResult?.message || ''}
        confirmLabel="Got it"
      />
    </div>
  )
}
