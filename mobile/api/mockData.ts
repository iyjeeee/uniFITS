// api/mockData.ts — All mock data for uniFITS Mobile development
// Matches website src/api/mockData.js shapes exactly
// Services import from here during development; replace with Supabase calls when ready

import {
  User, Announcement, Project, Event, Fund,
  Transaction, Attendance,
} from '@/types';

// ── MOCK_USERS ─────────────────────────────────────────────────────────────────
export const MOCK_USERS: User[] = [
  { id: '1', employee_number: 'EMP-0001', first_name: 'Juan',   last_name: 'Dela Cruz',    full_name: 'Juan Dela Cruz',    gender: 'Male',   email: 'juan@example.com',   contact_number: '09171234567', role: 'President',    department: 'Executive',       occupation: 'Executive Officer',    joined: '2022-01-15', status: 'active',   address_city: 'Manila',      address_province: 'Metro Manila', photo_url: null },
  { id: '2', employee_number: 'EMP-0002', first_name: 'Maria',  last_name: 'Santos',       full_name: 'Maria Santos',      gender: 'Female', email: 'maria@example.com',  contact_number: '09181234567', role: 'Secretary',    department: 'Administration',  occupation: 'Secretary General',    joined: '2022-02-10', status: 'active',   address_city: 'Quezon City', address_province: 'Metro Manila', photo_url: null },
  { id: '3', employee_number: 'EMP-0003', first_name: 'Pedro',  last_name: 'Reyes',        full_name: 'Pedro Reyes',       gender: 'Male',   email: 'pedro@example.com',  contact_number: '09191234567', role: 'Treasurer',    department: 'Finance',         occupation: 'Finance Manager',      joined: '2022-03-20', status: 'active',   address_city: 'Makati',      address_province: 'Metro Manila', photo_url: null },
  { id: '4', employee_number: 'EMP-0004', first_name: 'Ana',    last_name: 'Lim',          full_name: 'Ana Lim',           gender: 'Female', email: 'ana@example.com',    contact_number: '09201234567', role: 'Member',       department: 'Operations',      occupation: 'Operations Staff',     joined: '2022-05-01', status: 'active',   address_city: 'Taguig',      address_province: 'Metro Manila', photo_url: null },
  { id: '5', employee_number: 'EMP-0005', first_name: 'Carlos', last_name: 'Villanueva',   full_name: 'Carlos Villanueva', gender: 'Male',   email: 'carlos@example.com', contact_number: '09211234567', role: 'Member',       department: 'Projects',        occupation: 'Project Coordinator',  joined: '2022-06-15', status: 'active',   address_city: 'Pasig',       address_province: 'Metro Manila', photo_url: null },
  { id: '6', employee_number: 'EMP-0006', first_name: 'Luz',    last_name: 'Ramos',        full_name: 'Luz Ramos',         gender: 'Female', email: 'luz@example.com',    contact_number: '09221234567', role: 'Member',       department: 'Events',          occupation: 'Events Coordinator',   joined: '2022-07-10', status: 'inactive', address_city: 'Caloocan',    address_province: 'Metro Manila', photo_url: null },
];

// ── MOCK_ANNOUNCEMENTS ────────────────────────────────────────────────────────
export const MOCK_ANNOUNCEMENTS: Announcement[] = [
  { id: '1', title: 'General Assembly Meeting',    content: 'All members are required to attend the General Assembly this Saturday, March 22, 2025 at 9:00 AM. The agenda includes budget review, project updates, and officer elections.',                                                            is_pinned: true,  created_by: 'Juan Dela Cruz',    created_at: '2025-03-15T08:00:00Z' },
  { id: '2', title: 'Membership Dues Reminder',    content: 'Kindly settle your annual membership dues before March 31, 2025. Please coordinate with our Treasurer Pedro Reyes for payment details. Payment can be made via GCash or cash.',                                                         is_pinned: true,  created_by: 'Maria Santos',      created_at: '2025-03-12T10:30:00Z' },
  { id: '3', title: 'Medical Mission Volunteers',  content: 'We are looking for volunteers for our upcoming Medical Mission on April 5, 2025. Activities include medical check-ups, medicine distribution, and dental care. Please sign up by March 20.',                                            is_pinned: false, created_by: 'Carlos Villanueva', created_at: '2025-03-10T14:00:00Z' },
  { id: '4', title: 'New Year Activity Planning',  content: 'We are planning our year-end celebration. Please submit your activity suggestions to the Events Committee by March 25.',                                                                                                               is_pinned: false, created_by: 'Luz Ramos',         created_at: '2025-03-08T09:00:00Z' },
];

// ── MOCK_PROJECTS ─────────────────────────────────────────────────────────────
export const MOCK_PROJECTS: Project[] = [
  { id: '1', title: 'Medical Mission 2026',     project_type: 'Medical Mission',   description: 'Free medical check-ups for underprivileged communities in Taal, Batangas.',                start_date: '2026-03-15', end_date: '2026-03-16', location: 'Taal, Batangas',        status: 'upcoming',  target_funding: 50000,  current_funding: 32500 },
  { id: '2', title: 'School Feeding Program',   project_type: 'Community Service', description: 'Weekly feeding program for public school students in Laguna.',                            start_date: '2026-01-10', end_date: '2026-12-20', location: 'San Pablo, Laguna',      status: 'ongoing',   target_funding: 120000, current_funding: 78000 },
  { id: '3', title: 'Tree Planting Initiative', project_type: 'Environmental',     description: 'Planting 1,000 native trees in watershed areas of Sierra Madre.',                       start_date: '2026-03-22', end_date: '2026-03-22', location: 'Sierra Madre, Rizal',    status: 'upcoming',  target_funding: 25000,  current_funding: 10000 },
  { id: '4', title: 'Scholarship Program 2024', project_type: 'Education',         description: 'College scholarships for deserving students from our community.',                        start_date: '2024-06-01', end_date: '2024-12-15', location: 'Metro Manila',           status: 'completed', target_funding: 200000, current_funding: 200000 },
  { id: '5', title: 'Livelihood Seminar',        project_type: 'Livelihood',        description: 'Practical skills training for out-of-school youth in Cavite.',                          start_date: '2026-04-05', end_date: '2026-04-07', location: 'Cavite City, Cavite',    status: 'upcoming',  target_funding: 30000,  current_funding: 12000 },
];

// ── MOCK_EVENTS ───────────────────────────────────────────────────────────────
export const MOCK_EVENTS: Event[] = [
  { id: '1', title: 'Annual Gala Night 2026',  description: 'Annual fundraising gala for organizational programs and activities.', event_date: '2026-03-28', event_time: '18:00', location: 'Manila Hotel Ballroom',   status: 'upcoming',  target_funding: 500000, current_funding: 125000 },
  { id: '2', title: 'Summer Sportsfest',       description: 'Team building sports activities for all members and families.',       event_date: '2026-04-18', event_time: '08:00', location: 'San Juan Sports Complex', status: 'upcoming',  target_funding: 15000,  current_funding: 8000 },
  { id: '3', title: 'Independence Day Parade', description: 'Annual independence day participation and community march.',           event_date: '2026-03-08', event_time: '07:00', location: 'Luneta Park, Manila',     status: 'upcoming',  target_funding: 5000,   current_funding: 3000 },
  { id: '4', title: 'Christmas Party 2024',    description: 'Year-end celebration for all members and their families.',            event_date: '2024-12-15', event_time: '17:00', location: 'Club Headquarters',       status: 'completed', target_funding: 40000,  current_funding: 40000 },
];

// ── MOCK_FUNDS ────────────────────────────────────────────────────────────────
export const MOCK_FUNDS: Fund[] = [
  { id: '1', name: 'Membership Dues Fund', description: 'Annual mandatory membership fees',      fund_type: 'internal', is_required: true,  status: 'active', balance: 85000,  currency: 'PHP', created_by: 'Pedro Reyes',    payment_frequency: 'annually', annual_fee: 1200 },
  { id: '2', name: 'Project Fund',         description: 'General fund for all club projects',    fund_type: 'internal', is_required: false, status: 'active', balance: 45500,  currency: 'PHP', created_by: 'Juan Dela Cruz', payment_frequency: null,       annual_fee: null },
  { id: '3', name: 'Event Fund',           description: 'For events and celebrations',            fund_type: 'external', is_required: false, status: 'active', balance: 125000, currency: 'PHP', created_by: 'Luz Ramos',      payment_frequency: null,       annual_fee: null },
  { id: '4', name: 'Emergency Fund',       description: 'Reserve for unforeseen expenses',       fund_type: 'internal', is_required: false, status: 'active', balance: 20000,  currency: 'PHP', created_by: 'Pedro Reyes',    payment_frequency: null,       annual_fee: null },
  { id: '5', name: 'Building Fund',        description: 'Savings for future office acquisition', fund_type: 'internal', is_required: true,  status: 'active', balance: 150000, currency: 'PHP', created_by: 'Juan Dela Cruz', payment_frequency: 'monthly',  annual_fee: 600 },
];

// ── MOCK_TRANSACTIONS ─────────────────────────────────────────────────────────
export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: '1', user_id: '1', user_name: 'Juan Dela Cruz',    entry_type: 'contribution', category: 'fund',    fund: 'Membership Dues Fund', amount: 1200,  payment_method: 'GCash',         reference_number: 'TXN-20250301-0001', transaction_date: '2025-03-01', status: 'completed', description: 'Annual dues 2025' },
  { id: '2', user_id: '2', user_name: 'Maria Santos',      entry_type: 'contribution', category: 'fund',    fund: 'Membership Dues Fund', amount: 1200,  payment_method: 'Cash',          reference_number: 'TXN-20250302-0002', transaction_date: '2025-03-02', status: 'completed', description: 'Annual dues 2025' },
  { id: '3', user_id: '3', user_name: 'Pedro Reyes',       entry_type: 'contribution', category: 'project', fund: 'Project Fund',         amount: 5000,  payment_method: 'Bank Transfer', reference_number: 'TXN-20250305-0003', transaction_date: '2025-03-05', status: 'completed', description: 'Medical Mission donation' },
  { id: '4', user_id: '4', user_name: 'Ana Lim',           entry_type: 'contribution', category: 'event',   fund: 'Event Fund',           amount: 2500,  payment_method: 'GCash',         reference_number: 'TXN-20250306-0004', transaction_date: '2025-03-06', status: 'completed', description: 'Gala Night contribution' },
  { id: '5', user_id: null, user_name: null,                entry_type: 'income',       category: 'fund',    fund: 'Event Fund',           amount: 50000, payment_method: 'Bank Transfer', reference_number: 'TXN-20250310-0005', transaction_date: '2025-03-10', status: 'completed', description: 'Corporate sponsor payment' },
  { id: '6', user_id: '1', user_name: 'Juan Dela Cruz',    entry_type: 'contribution', category: 'fund',    fund: 'Building Fund',        amount: 600,   payment_method: 'GCash',         reference_number: 'TXN-20250311-0006', transaction_date: '2025-03-11', status: 'completed', description: 'Monthly building fund' },
  { id: '7', user_id: '5', user_name: 'Carlos Villanueva', entry_type: 'contribution', category: 'project', fund: 'Project Fund',         amount: 2000,  payment_method: 'Cash',          reference_number: 'TXN-20250312-0007', transaction_date: '2025-03-12', status: 'pending',   description: 'Tree planting donation' },
];

// ── MOCK_ATTENDANCES ──────────────────────────────────────────────────────────
export const MOCK_ATTENDANCES: Attendance[] = [
  { id: '1', user_id: '1', user_name: 'Juan Dela Cruz',    activity_type: 'event',   activity: 'Christmas Party 2024',     attendance_date: '2024-12-15', status: 'present', remarks: null,                  recorded_by: 'Maria Santos'    },
  { id: '2', user_id: '2', user_name: 'Maria Santos',      activity_type: 'event',   activity: 'Christmas Party 2024',     attendance_date: '2024-12-15', status: 'present', remarks: null,                  recorded_by: 'Maria Santos'    },
  { id: '3', user_id: '3', user_name: 'Pedro Reyes',       activity_type: 'project', activity: 'Scholarship Program 2024', attendance_date: '2024-06-01', status: 'present', remarks: null,                  recorded_by: 'Juan Dela Cruz'  },
  { id: '4', user_id: '4', user_name: 'Ana Lim',           activity_type: 'event',   activity: 'Christmas Party 2024',     attendance_date: '2024-12-15', status: 'late',    remarks: '1 hour late',         recorded_by: 'Maria Santos'    },
  { id: '5', user_id: '5', user_name: 'Carlos Villanueva', activity_type: 'project', activity: 'Scholarship Program 2024', attendance_date: '2024-06-01', status: 'absent',  remarks: 'Excused—work conflict', recorded_by: 'Juan Dela Cruz' },
];
