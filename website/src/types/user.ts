// types/user.ts — User, Role, and Permission type definitions

// All permission strings available in the system
export type Permission =
  | 'add_user'
  | 'edit_user'
  | 'delete_user'
  | 'manage_funds'
  | 'add_transaction'
  | 'view_reports'
  | 'view_audit_logs'
  | 'manage_settings'
  | 'backup_restore'
  | 'add_project'
  | 'edit_project'
  | 'add_event'
  | 'edit_event'
  | 'manage_attendance'
  | 'view_members'
  | 'manage_roles'
  | 'view_projects'
  | 'delete_project'
  | 'approve_project'
  | 'view_events'
  | 'delete_event'
  | 'approve_event'
  | 'view_funds'
  | 'delete_fund'
  | 'view_transactions'
  | 'approve_transaction'
  | 'delete_transaction'
  | 'manage_utilities'
  | 'view_announcements'
  | 'post_announcement'
  | 'edit_announcement'
  | 'delete_announcement'
  | 'export_reports'
  | 'manage_org_profile'

// Role — organizational role with permission list
export interface Role {
  id: string
  name: string
  description: string
  is_system: boolean          // true = built-in role, cannot be deleted
  permissions: Permission[]
}

// User status options
export type UserStatus = 'active' | 'inactive'

// User — core member/employee record shape (matches MOCK_USERS + backend)
export interface User {
  id: string
  employee_number: string     // e.g. 'EMP-0001'
  first_name: string
  last_name: string
  full_name: string
  gender: string
  email: string
  contact_number: string      // Philippine format: '09XXXXXXXXX'
  role: string                // role name string, not Role id
  department: string
  occupation: string
  joined: string              // ISO date string 'YYYY-MM-DD'
  status: UserStatus
  address_city: string
  address_province: string
  photo_url: string | null    // null = show initials avatar
}
