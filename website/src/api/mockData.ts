// api/mockData.ts — All mock data for development + helper formatters
// Replace these exports with real API calls (fetch to your backend endpoints)
// Backend base URL: import.meta.env.VITE_API_URL (see .env.example)
import type {
  User, Role, Announcement, Project, AppEvent,
  Fund, Transaction, Utility, PaymentMethodOption,
  Attendance, AuditLog, BackupJob,
} from '../types'
import { parseDate } from '../utils/formatters'

// ── Helper formatters ─────────────────────────────────────────────────────────
// NOTE: prefer utils/formatters.ts for new code.
// These legacy helpers are kept here because pages import them directly from mockData.

/** formatCurrency — format number as ₱ Philippine Peso string */
export function formatCurrency(amount: number, symbol = '₱'): string {
  const num = Number(amount) || 0
  return `${symbol}${num.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

/** formatDate — format ISO date string as 'Mar 15, 2026' */
export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '—'
  try {
    return parseDate(dateStr).toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' })
  } catch { return dateStr }
}

/** relativeTime — format ISO date string as relative time e.g. '2m ago', '3h ago' */
export function relativeTime(dateStr: string | null | undefined): string {
  if (!dateStr) return '—'
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1)  return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24)  return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 7)  return `${days}d ago`
  return formatDate(dateStr)
}

/** fmt12 — convert 24-hr 'HH:MM' to '12:30 PM' — only used for event_time display */
export function fmt12(t: string | null | undefined): string {
  if (!t) return '—'
  const [h, m] = t.split(':').map(Number)
  const ampm = h >= 12 ? 'PM' : 'AM'
  const h12  = h % 12 || 12
  return `${h12}:${String(m).padStart(2, '0')} ${ampm}`
}

/** getFundName -- fund name for a fund_id ('—' when none/unknown); records link to funds by id, never by name */
export function getFundName(fundId: string | null | undefined): string {
  return MOCK_FUNDS.find((f) => f.id === fundId)?.name ?? '—'
}

// ── MOCK_USERS ────────────────────────────────────────────────────────────────
export const MOCK_USERS: User[] = [
  { id: '1', employee_number: 'EMP-0001', first_name: 'Juan',   last_name: 'Dela Cruz',  full_name: 'Juan Dela Cruz',      gender: 'Male',   email: 'juan@example.com',   contact_number: '09171234567', role: 'President',   department: 'Executive',      occupation: 'Executive Officer',   joined: '2022-01-15', status: 'active',   address_city: 'Manila',      address_province: 'Metro Manila', photo_url: null },
  { id: '2', employee_number: 'EMP-0002', first_name: 'Maria',  last_name: 'Santos',     full_name: 'Maria Santos',        gender: 'Female', email: 'maria@example.com',  contact_number: '09181234567', role: 'Secretary',   department: 'Administration', occupation: 'Secretary General',   joined: '2022-02-10', status: 'active',   address_city: 'Quezon City', address_province: 'Metro Manila', photo_url: null },
  { id: '3', employee_number: 'EMP-0003', first_name: 'Pedro',  last_name: 'Reyes',      full_name: 'Pedro Reyes',         gender: 'Male',   email: 'pedro@example.com',  contact_number: '09191234567', role: 'Treasurer',   department: 'Finance',        occupation: 'Finance Manager',     joined: '2022-03-20', status: 'active',   address_city: 'Makati',      address_province: 'Metro Manila', photo_url: null },
  { id: '4', employee_number: 'EMP-0004', first_name: 'Ana',    last_name: 'Lim',        full_name: 'Ana Lim',             gender: 'Female', email: 'ana@example.com',    contact_number: '09201234567', role: 'Member',      department: 'Operations',     occupation: 'Operations Staff',    joined: '2022-05-01', status: 'active',   address_city: 'Taguig',      address_province: 'Metro Manila', photo_url: null },
  { id: '5', employee_number: 'EMP-0005', first_name: 'Carlos', last_name: 'Villanueva', full_name: 'Carlos Villanueva',   gender: 'Male',   email: 'carlos@example.com', contact_number: '09211234567', role: 'Member',      department: 'Projects',       occupation: 'Project Coordinator', joined: '2022-06-15', status: 'active',   address_city: 'Pasig',       address_province: 'Metro Manila', photo_url: null },
  { id: '6', employee_number: 'EMP-0006', first_name: 'Luz',    last_name: 'Ramos',      full_name: 'Luz Ramos',           gender: 'Female', email: 'luz@example.com',    contact_number: '09221234567', role: 'Member',      department: 'Events',         occupation: 'Events Coordinator',  joined: '2022-07-10', status: 'inactive', address_city: 'Caloocan',    address_province: 'Metro Manila', photo_url: null },
]

// ── MOCK_ROLES ────────────────────────────────────────────────────────────────
export const MOCK_ROLES: Role[] = [
  { id: '1', name: 'President',    description: 'Highest authority in the organization', is_system: true,  permissions: ['add_user','edit_user','delete_user','manage_funds','add_transaction','view_reports','view_audit_logs','manage_settings','backup_restore'] },
  { id: '2', name: 'Secretary',    description: 'Manages records and communications',    is_system: true,  permissions: ['add_user','edit_user','add_project','edit_project','add_event','edit_event','view_reports'] },
  { id: '3', name: 'Treasurer',    description: 'Manages funds and transactions',        is_system: true,  permissions: ['manage_funds','add_transaction','view_reports'] },
  { id: '4', name: 'Member',       description: 'Standard member with basic access',     is_system: true,  permissions: [] },
  { id: '5', name: 'Project Lead', description: 'Leads specific projects',               is_system: false, permissions: ['add_project','edit_project','manage_attendance'] },
]

// ── MOCK_ANNOUNCEMENTS ────────────────────────────────────────────────────────
export const MOCK_ANNOUNCEMENTS: Announcement[] = [
  { id: '1', title: 'General Assembly Meeting',  content: 'All members are required to attend the General Assembly this Saturday, March 22, 2025 at 9:00 AM. The agenda includes budget review, project updates, and officer elections.', is_pinned: true,  created_by: 'Juan Dela Cruz',    created_at: '2025-03-15T08:00:00Z' },
  { id: '2', title: 'Membership Dues Reminder',  content: 'Kindly settle your annual membership dues before March 31, 2025. Please coordinate with our Treasurer Pedro Reyes for payment details. Payment can be made via GCash or cash.',  is_pinned: true,  created_by: 'Maria Santos',      created_at: '2025-03-12T10:30:00Z' },
  { id: '3', title: 'Medical Mission Volunteers',content: 'We are looking for volunteers for our upcoming Medical Mission on April 5, 2025. Activities include medical check-ups, medicine distribution, and dental care.',               is_pinned: false, created_by: 'Carlos Villanueva', created_at: '2025-03-10T14:00:00Z' },
  { id: '4', title: 'New Year Activity Planning', content: 'We are planning our year-end celebration. Please submit your activity suggestions to the Events Committee by March 25.',                                                     is_pinned: false, created_by: 'Luz Ramos',         created_at: '2025-03-08T09:00:00Z' },
]

// ── MOCK_PROJECTS ─────────────────────────────────────────────────────────────
export const MOCK_PROJECTS: Project[] = [
  { id: '1', title: 'Medical Mission 2026',     project_type: 'Medical Mission',   description: 'Free medical check-ups for underprivileged communities in Taal, Batangas.', start_date: '2026-03-15', end_date: '2026-03-16', location: 'Taal, Batangas',      status: 'upcoming',  target_funding: 50000,  current_funding: 32500  },
  { id: '2', title: 'School Feeding Program',   project_type: 'Community Service', description: 'Weekly feeding program for public school students in Laguna.',               start_date: '2026-01-10', end_date: '2026-12-20', location: 'San Pablo, Laguna',   status: 'ongoing',   target_funding: 120000, current_funding: 78000  },
  { id: '3', title: 'Tree Planting Initiative', project_type: 'Environmental',     description: 'Planting 1,000 native trees in watershed areas.',                            start_date: '2026-03-22', end_date: '2026-03-22', location: 'Sierra Madre, Rizal', status: 'upcoming',  target_funding: 25000,  current_funding: 10000  },
  { id: '4', title: 'Scholarship Program 2024', project_type: 'Education',         description: 'College scholarships for deserving students from our community.',            start_date: '2024-06-01', end_date: '2024-12-15', location: 'Metro Manila',        status: 'completed', target_funding: 200000, current_funding: 200000 },
  { id: '5', title: 'Livelihood Seminar',        project_type: 'Livelihood',        description: 'Practical skills training for out-of-school youth.',                         start_date: '2026-04-05', end_date: '2026-04-07', location: 'Cavite City, Cavite', status: 'upcoming',  target_funding: 30000,  current_funding: 12000  },
]

// ── MOCK_EVENTS ───────────────────────────────────────────────────────────────
// Typed as AppEvent[] — avoids collision with the DOM's built-in Event type
export const MOCK_EVENTS: AppEvent[] = [
  { id: '1', title: 'Annual Gala Night 2026',  description: 'Annual fundraising gala for organizational programs.', event_date: '2026-03-28', event_time: '18:00', location: 'Manila Hotel Ballroom',   status: 'upcoming',  target_funding: 500000, current_funding: 125000 },
  { id: '2', title: 'Summer Sportsfest',        description: 'Team building sports activities for all members.',    event_date: '2026-04-18', event_time: '08:00', location: 'San Juan Sports Complex', status: 'upcoming',  target_funding: 15000,  current_funding: 8000   },
  { id: '3', title: 'Independence Day Parade',  description: 'Annual independence day participation.',               event_date: '2026-03-08', event_time: '07:00', location: 'Luneta Park, Manila',     status: 'upcoming',  target_funding: 5000,   current_funding: 3000   },
  { id: '4', title: 'Christmas Party 2024',     description: 'Year-end celebration for all members and families.',  event_date: '2024-12-15', event_time: '17:00', location: 'Club Headquarters',       status: 'completed', target_funding: 40000,  current_funding: 40000  },
]

// ── MOCK_FUNDS ────────────────────────────────────────────────────────────────
export const MOCK_FUNDS: Fund[] = [
  { id: '1', name: 'Membership Dues Fund', description: 'Annual mandatory membership fees',      fund_type: 'internal', is_required: true,  status: 'active', balance: 85000,  currency: 'PHP', created_by: 'Pedro Reyes',    payment_frequency: 'annually', annual_fee: 1200 },
  { id: '2', name: 'Project Fund',         description: 'General fund for all club projects',    fund_type: 'internal', is_required: false, status: 'active', balance: 45500,  currency: 'PHP', created_by: 'Juan Dela Cruz', payment_frequency: null,       annual_fee: null },
  { id: '3', name: 'Event Fund',           description: 'For events and celebrations',            fund_type: 'external', is_required: false, status: 'active', balance: 125000, currency: 'PHP', created_by: 'Luz Ramos',      payment_frequency: null,       annual_fee: null },
  { id: '4', name: 'Emergency Fund',       description: 'Reserve for unforeseen expenses',       fund_type: 'internal', is_required: false, status: 'active', balance: 20000,  currency: 'PHP', created_by: 'Pedro Reyes',    payment_frequency: null,       annual_fee: null },
  { id: '5', name: 'Building Fund',        description: 'Savings for future office acquisition', fund_type: 'internal', is_required: true,  status: 'active', balance: 150000, currency: 'PHP', created_by: 'Juan Dela Cruz', payment_frequency: 'monthly',  annual_fee: 600  },
]

// ── MOCK_TRANSACTIONS ─────────────────────────────────────────────────────────
export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: '1', user_id: '1', user_name: 'Juan Dela Cruz',    entry_type: 'contribution', category: 'fund',    fund_id: '1', amount: 1200,  payment_method: 'GCash',         reference_number: 'TXN-20250301-0001', transaction_date: '2025-03-01', status: 'approved', description: 'Annual dues 2025' },
  { id: '2', user_id: '2', user_name: 'Maria Santos',      entry_type: 'contribution', category: 'fund',    fund_id: '1', amount: 1200,  payment_method: 'Cash',          reference_number: 'TXN-20250302-0002', transaction_date: '2025-03-02', status: 'approved', description: 'Annual dues 2025' },
  { id: '3', user_id: '3', user_name: 'Pedro Reyes',       entry_type: 'contribution', category: 'project', fund_id: '2',         project_id: '1', amount: 5000,  payment_method: 'Bank Transfer', reference_number: 'TXN-20250305-0003', transaction_date: '2025-03-05', status: 'approved', description: 'Medical Mission donation' },
  { id: '4', user_id: '4', user_name: 'Ana Lim',           entry_type: 'contribution', category: 'event',   fund_id: '3',           event_id: '1', amount: 2500,  payment_method: 'GCash',         reference_number: 'TXN-20250306-0004', transaction_date: '2025-03-06', status: 'approved', description: 'Gala Night contribution' },
  { id: '5', user_id: null, user_name: null,                entry_type: 'income',       category: 'fund',    fund_id: '3',           amount: 50000, payment_method: 'Bank Transfer', reference_number: 'TXN-20250310-0005', transaction_date: '2025-03-10', status: 'approved', description: 'Corporate sponsor payment' },
  { id: '6', user_id: '5', user_name: 'Carlos Villanueva', entry_type: 'expense',      category: 'project', fund_id: '2',         project_id: '1', amount: 12500, payment_method: 'Cash',          reference_number: 'TXN-20250312-0006', transaction_date: '2025-03-12', status: 'approved', description: 'Medical supplies purchase' },
]

// ── MOCK_UTILITIES ────────────────────────────────────────────────────────────
export const MOCK_UTILITIES: Utility[] = [
  { id: '1', expense_type: 'Electricity Bill', total_amount: 3500,  amount_paid: 3500,  payment_date: '2025-03-05', paid_to: 'Meralco',              fund_id: '1', status: 'paid',    notes: 'March 2025 electricity' },
  { id: '2', expense_type: 'Internet Service', total_amount: 2200,  amount_paid: 2200,  payment_date: '2025-03-08', paid_to: 'PLDT',                 fund_id: '1', status: 'paid',    notes: 'Fiber plan monthly' },
  { id: '3', expense_type: 'Office Rent',      total_amount: 15000, amount_paid: 7500,  payment_date: '2025-03-15', paid_to: 'GreenLeaf Properties', fund_id: '1', status: 'partial', notes: 'Q1 partial payment' },
  { id: '4', expense_type: 'Water Bill',       total_amount: 850,   amount_paid: 0,     payment_date: '2025-03-20', paid_to: 'Maynilad',             fund_id: '1', status: 'unpaid',  notes: null },
  { id: '5', expense_type: 'Venue Rental',     total_amount: 25000, amount_paid: 25000, payment_date: '2025-02-28', paid_to: 'Manila Hotel',         fund_id: '3',           status: 'paid',    notes: 'For Annual Gala Night venue deposit' },
]

// ── MOCK_ATTENDANCES ──────────────────────────────────────────────────────────
export const MOCK_ATTENDANCES: Attendance[] = [
  { id: '1', user_id: '1', user_name: 'Juan Dela Cruz',    activity_type: 'event',   activity: 'Christmas Party 2024',     attendance_date: '2024-12-15', status: 'present', remarks: null,                     recorded_by: 'Maria Santos'   },
  { id: '2', user_id: '2', user_name: 'Maria Santos',      activity_type: 'event',   activity: 'Christmas Party 2024',     attendance_date: '2024-12-15', status: 'present', remarks: null,                     recorded_by: 'Maria Santos'   },
  { id: '3', user_id: '3', user_name: 'Pedro Reyes',       activity_type: 'project', activity: 'Scholarship Program 2024', attendance_date: '2024-06-01', status: 'present', remarks: null,                     recorded_by: 'Juan Dela Cruz' },
  { id: '4', user_id: '4', user_name: 'Ana Lim',           activity_type: 'event',   activity: 'Christmas Party 2024',     attendance_date: '2024-12-15', status: 'late',    remarks: '1 hour late',            recorded_by: 'Maria Santos'   },
  { id: '5', user_id: '5', user_name: 'Carlos Villanueva', activity_type: 'project', activity: 'Scholarship Program 2024', attendance_date: '2024-06-01', status: 'absent',  remarks: 'Excused — work conflict', recorded_by: 'Juan Dela Cruz' },
  { id: '6', user_id: '6', user_name: 'Luz Ramos',         activity_type: 'event',   activity: 'Christmas Party 2024',     attendance_date: '2024-12-15', status: 'excused', remarks: 'Medical reason',         recorded_by: 'Maria Santos'   },
]

// ── MOCK_AUDIT_LOGS ───────────────────────────────────────────────────────────
export const MOCK_AUDIT_LOGS: AuditLog[] = [
  { id: '1', user: 'Juan Dela Cruz',  action: 'login',  table_name: 'sessions',      summary: 'User logged in',                          ip_address: '192.168.1.1', created_at: new Date(Date.now() - 2  * 60000).toISOString()     },
  { id: '2', user: 'Maria Santos',    action: 'insert', table_name: 'announcements', summary: 'Created announcement: Dues Reminder',      ip_address: '192.168.1.2', created_at: new Date(Date.now() - 15 * 60000).toISOString()     },
  { id: '3', user: 'Pedro Reyes',     action: 'insert', table_name: 'transactions',  summary: 'Recorded transaction TXN-20250305-0003',   ip_address: '192.168.1.3', created_at: new Date(Date.now() - 30 * 60000).toISOString()     },
  { id: '4', user: 'Juan Dela Cruz',  action: 'update', table_name: 'projects',      summary: 'Updated project: Medical Mission 2025',    ip_address: '192.168.1.1', created_at: new Date(Date.now() - 2  * 3600000).toISOString()   },
  { id: '5', user: 'System',          action: 'backup', table_name: 'backup_jobs',   summary: 'Automated daily backup completed',         ip_address: '127.0.0.1',   created_at: new Date(Date.now() - 6  * 3600000).toISOString()   },
  { id: '6', user: 'Maria Santos',    action: 'delete', table_name: 'users',         summary: 'Deactivated member: Luz Ramos',            ip_address: '192.168.1.2', created_at: new Date(Date.now() - 24 * 3600000).toISOString()   },
  { id: '7', user: 'Pedro Reyes',     action: 'update', table_name: 'funds',         summary: 'Updated fund: Building Fund balance',      ip_address: '192.168.1.3', created_at: new Date(Date.now() - 48 * 3600000).toISOString()   },
  { id: '8', user: 'Juan Dela Cruz',  action: 'insert', table_name: 'events',        summary: 'Created event: Annual Gala Night 2025',    ip_address: '192.168.1.1', created_at: new Date(Date.now() - 72 * 3600000).toISOString()   },
]

// ── MOCK_PAYMENT_METHODS ──────────────────────────────────────────────────────
export const MOCK_PAYMENT_METHODS: PaymentMethodOption[] = [
  { id: '1', name: 'Cash',          is_active: true },
  { id: '2', name: 'GCash',         is_active: true },
  { id: '3', name: 'Bank Transfer', is_active: true },
  { id: '4', name: 'PayMaya',       is_active: true },
  { id: '5', name: 'Cheque',        is_active: true },
]

// ── MOCK_BACKUP_JOBS ──────────────────────────────────────────────────────────
export const MOCK_BACKUP_JOBS: BackupJob[] = [
  { id: '1', filename: 'backup_2025-03-15_auto.sql.gz',   job_type: 'backup', trigger: 'scheduled', file_size_bytes: 5242880, status: 'success', started_at: '2025-03-15T02:00:00Z', completed_at: '2025-03-15T02:01:30Z', created_by: 'System'         },
  { id: '2', filename: 'backup_2025-03-14_manual.sql.gz', job_type: 'backup', trigger: 'manual',    file_size_bytes: 5200000, status: 'success', started_at: '2025-03-14T14:30:00Z', completed_at: '2025-03-14T14:31:20Z', created_by: 'Juan Dela Cruz' },
  { id: '3', filename: 'backup_2025-03-10_auto.sql.gz',   job_type: 'backup', trigger: 'scheduled', file_size_bytes: 4900000, status: 'success', started_at: '2025-03-10T02:00:00Z', completed_at: '2025-03-10T02:01:10Z', created_by: 'System'         },
  { id: '4', filename: 'backup_2025-03-07_auto.sql.gz',   job_type: 'backup', trigger: 'scheduled', file_size_bytes: 4750000, status: 'success', started_at: '2025-03-07T02:00:00Z', completed_at: '2025-03-07T02:00:55Z', created_by: 'System'         },
]
