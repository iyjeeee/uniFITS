// RolesPage.jsx — Manage roles and permission assignments
import { useState } from 'react'
import { Card, CardHeader, Button, Badge, Modal, Input, Textarea, PageHeader } from '../../components/ui'
import { MOCK_ROLES, MOCK_USERS } from '../../api/mockData'
import { useOrg } from '../../context/OrgContext'

// All available permissions grouped by module
const ALL_PERMISSIONS = [
  { key: 'add_user',           label: 'Add User',            module: 'users'    },
  { key: 'edit_user',          label: 'Edit User',           module: 'users'    },
  { key: 'delete_user',        label: 'Delete User',         module: 'users'    },
  { key: 'manage_attendance',  label: 'Manage Attendance',   module: 'users'    },
  { key: 'add_project',        label: 'Add Project',         module: 'projects' },
  { key: 'edit_project',       label: 'Edit Project',        module: 'projects' },
  { key: 'delete_project',     label: 'Delete Project',      module: 'projects' },
  { key: 'add_event',          label: 'Add Event',           module: 'events'   },
  { key: 'edit_event',         label: 'Edit Event',          module: 'events'   },
  { key: 'manage_funds',       label: 'Manage Funds',        module: 'finance'  },
  { key: 'add_transaction',    label: 'Add Transaction',     module: 'finance'  },
  { key: 'view_reports',       label: 'View Reports',        module: 'reports'  },
  { key: 'view_audit_logs',    label: 'View Audit Logs',     module: 'reports'  },
  { key: 'manage_settings',    label: 'Manage Settings',     module: 'settings' },
  { key: 'backup_restore',     label: 'Backup & Restore',    module: 'settings' },
]

export default function RolesPage() {
  const org  = useOrg()
  const [roles, setRoles]       = useState(MOCK_ROLES)
  const [showModal, setShowModal] = useState(false)        // new-role modal
  const [editRole, setEditRole]   = useState(null)          // role being edited
  const [newRole, setNewRole]     = useState({ name: '', description: '', permissions: [] })

  // Toggle a permission on the new-role form
  function togglePerm(key) {
    setNewRole(r => ({
      ...r,
      permissions: r.permissions.includes(key) ? r.permissions.filter(p => p !== key) : [...r.permissions, key],
    }))
  }

  function handleCreate() {
    if (!newRole.name) return
    setRoles(prev => [...prev, { id: String(Date.now()), ...newRole, is_system: false }])
    setNewRole({ name: '', description: '', permissions: [] })
    setShowModal(false)
  }

  // Group permissions by module for organized display
  const modules = [...new Set(ALL_PERMISSIONS.map(p => p.module))]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <PageHeader
        actions={<Button onClick={() => setShowModal(true)}>+ New Role</Button>}
      />

      {/* Default member permissions notice */}
      <Card style={{ padding: '16px 20px', background: 'var(--info-light)', border: '1px solid rgba(36,113,163,.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--info)' }}>Default {org.people_label} Permissions (No Role Assigned)</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>Members without a role can: view announcements, view own profile</div>
          </div>
          <Button variant="secondary" size="sm">Manage Defaults</Button>
        </div>
      </Card>

      {/* Roles table */}
      <Card>
        <CardHeader title="Role Definitions" subtitle={`${roles.length} roles configured`} />
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5 }}>
            <thead>
              <tr style={{ background: 'var(--neutral-light)' }}>
                {['Role Name', 'Assigned To', 'Permissions', 'Type', 'Actions'].map(h => (
                  <th key={h} style={th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {roles.map(role => {
                const assigned = MOCK_USERS.filter(u => u.role === role.name)
                return (
                  <tr key={role.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={td}>
                      <div style={{ fontWeight: 600 }}>{role.name}</div>
                      {role.description && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{role.description}</div>}
                    </td>
                    <td style={td}>
                      {assigned.length === 0
                        ? <span style={{ color: 'var(--text-muted)', fontSize: 12.5 }}>Unassigned</span>
                        : <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                            {assigned.slice(0, 3).map(u => <Badge key={u.id} variant="neutral">{u.full_name}</Badge>)}
                            {assigned.length > 3 && <Badge variant="neutral">+{assigned.length - 3}</Badge>}
                          </div>
                      }
                    </td>
                    <td style={td}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                        {role.permissions.slice(0, 4).map(p => <Badge key={p} variant="accent" style={{ fontSize: 10 }}>{p}</Badge>)}
                        {role.permissions.length > 4 && <Badge variant="neutral" style={{ fontSize: 10 }}>+{role.permissions.length - 4}</Badge>}
                      </div>
                    </td>
                    <td style={td}><Badge variant={role.is_system ? 'info' : 'neutral'}>{role.is_system ? 'System' : 'Custom'}</Badge></td>
                    <td style={td}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <Button variant="secondary" size="sm" onClick={() => setEditRole(role)}>Edit</Button>
                        {!role.is_system && <Button variant="danger" size="sm">Delete</Button>}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* New Role Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title="Create New Role" width={580}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Input label="Role Name" value={newRole.name} onChange={e => setNewRole(r => ({ ...r, name: e.target.value }))} placeholder="e.g. Treasurer, Project Lead" required />
          <Textarea label="Description" value={newRole.description} onChange={e => setNewRole(r => ({ ...r, description: e.target.value }))} placeholder="Briefly describe what this role can do" rows={2} />

          <div>
            <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 10 }}>Permissions</div>
            {modules.map(mod => (
              <div key={mod} style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 11.5, fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 6 }}>{mod}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {ALL_PERMISSIONS.filter(p => p.module === mod).map(p => (
                    <label key={p.key} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13.5, cursor: 'pointer', padding: '4px 10px', borderRadius: 6, border: `1px solid ${newRole.permissions.includes(p.key) ? 'var(--accent)' : 'var(--border)'}`, background: newRole.permissions.includes(p.key) ? 'var(--accent-light)' : 'var(--white)' }}>
                      <input type="checkbox" checked={newRole.permissions.includes(p.key)} onChange={() => togglePerm(p.key)} style={{ accentColor: 'var(--accent)' }} />
                      {p.label}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={handleCreate}>Create Role</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

const th = { padding: '10px 16px', textAlign: 'left', fontSize: 11.5, fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--text-muted)', borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap' }
const td = { padding: '12px 16px', verticalAlign: 'middle' }
