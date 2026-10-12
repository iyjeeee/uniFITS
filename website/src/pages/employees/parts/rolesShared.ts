// parts/rolesShared.ts — Permission catalog and form types shared by the Roles page pieces
import type { Permission } from '../../../types'

export interface PermissionDef { key: Permission; label: string; module: string }
export interface RoleForm { name: string; description: string; permissions: Permission[] }
export const EMPTY_ROLE_FORM: RoleForm = { name: '', description: '', permissions: [] }

/* ── All available permissions grouped by module ─────────────────── */
export const ALL_PERMISSIONS: PermissionDef[] = [
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
export const MODULES = [...new Set(ALL_PERMISSIONS.map((p) => p.module))]
