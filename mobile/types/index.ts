// types/index.ts — All shared TypeScript interfaces for uniFITS Mobile
// Matches website MOCK_* shapes exactly for backend compatibility

// ── Status & Badge Types ──────────────────────────────────────────────────────
export type StatusType =
  | 'active' | 'inactive'
  | 'completed' | 'ongoing' | 'upcoming' | 'cancelled'
  | 'pending' | 'approved' | 'rejected'
  | 'paid' | 'unpaid' | 'partial'
  | 'present' | 'absent' | 'late' | 'excused'
  | 'failed';

export type BadgeVariant = 'accent' | 'success' | 'danger' | 'warning' | 'info' | 'neutral';

export type EntryType = 'contribution' | 'income' | 'expense';
export type ActivityType = 'event' | 'project';
export type FundType = 'internal' | 'external';
export type ProjectType =
  | 'Community Service' | 'Medical Mission' | 'Livelihood'
  | 'Education' | 'Environmental' | 'Other';

// ── User / Member ─────────────────────────────────────────────────────────────
export interface User {
  id: string;
  employee_number: string;         // e.g. 'EMP-0001'
  first_name: string;
  last_name: string;
  full_name: string;
  gender: string;
  email: string;
  contact_number: string;          // Philippine format: 09XXXXXXXXX
  role: string;                    // e.g. 'President', 'Treasurer', 'Member'
  department: string;
  occupation: string;
  joined: string;                  // 'YYYY-MM-DD'
  status: 'active' | 'inactive';
  address_city: string;
  address_province: string;
  photo_url: string | null;        // null = show initials avatar
}

// ── Announcement ──────────────────────────────────────────────────────────────
export interface Announcement {
  id: string;
  title: string;
  content: string;
  is_pinned: boolean;
  created_by: string;              // Full name string
  created_at: string;              // ISO date string
}

// ── Project ───────────────────────────────────────────────────────────────────
export interface Project {
  id: string;
  title: string;
  project_type: ProjectType;
  description: string;
  start_date: string;              // 'YYYY-MM-DD'
  end_date: string;                // 'YYYY-MM-DD'
  location: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  target_funding: number;
  current_funding: number;
}

// ── Event ─────────────────────────────────────────────────────────────────────
export interface Event {
  id: string;
  title: string;
  description: string;
  event_date: string;              // 'YYYY-MM-DD'
  event_time: string;              // 'HH:MM' 24-hr — display with fmt12()
  location: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  target_funding: number;
  current_funding: number;
}

// ── Fund ──────────────────────────────────────────────────────────────────────
export interface Fund {
  id: string;
  name: string;
  description: string;
  fund_type: FundType;
  is_required: boolean;
  status: 'active' | 'inactive';
  balance: number;
  currency: string;                // 'PHP'
  created_by: string;
  payment_frequency: string | null; // 'annually' | 'monthly' | null
  annual_fee: number | null;
}

// ── Transaction ───────────────────────────────────────────────────────────────
export interface Transaction {
  id: string;
  user_id: string | null;
  user_name: string | null;
  entry_type: EntryType;
  category: 'fund' | 'project' | 'event';
  fund: string;                    // Fund name string
  amount: number;
  payment_method: string;          // 'GCash' | 'Cash' | 'Bank Transfer'
  reference_number: string;        // e.g. 'TXN-20250301-0001'
  transaction_date: string;        // 'YYYY-MM-DD'
  status: 'completed' | 'pending' | 'approved' | 'rejected';
  description: string;
}

// ── Attendance ────────────────────────────────────────────────────────────────
export interface Attendance {
  id: string;
  user_id: string;
  user_name: string;
  activity_type: ActivityType;
  activity: string;                // Activity title string
  attendance_date: string;         // 'YYYY-MM-DD'
  status: 'present' | 'absent' | 'late' | 'excused';
  remarks: string | null;
  recorded_by: string;
}

// ── Auth ──────────────────────────────────────────────────────────────────────
export interface AuthState {
  isAuthenticated: boolean;
  currentUser: User | null;
  token: string | null;
}

// ── Report / Summary ──────────────────────────────────────────────────────────
export interface FundSummary {
  totalBalance: number;
  fundCount: number;
  activeCount: number;
}

export interface FinancialOverview {
  totalIncome: number;
  totalExpense: number;
  totalContributions: number;
  netBalance: number;
  transactionCount: number;
}

// ── Navigation Params (Expo Router typed routes supplement) ───────────────────
export interface AnnouncementParams { id: string }
export interface ProjectParams { id: string }
export interface EventParams { id: string }
export interface TransactionParams { id: string }
