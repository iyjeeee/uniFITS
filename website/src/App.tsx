// App.tsx — Root component: hash-based router + auth guard + OrgProvider wrapper
// Uses zero external routing libraries — all navigation via window.location.hash
// MIGRATION NOTE: converted from App.jsx — all 40 routes unchanged, props now typed
import { useState, useEffect } from 'react'
import type { ComponentType } from 'react'
import AppLayout from './layouts/AppLayout'
import { OrgProvider } from './context/OrgContext'
import type { User, OrgConfig, NavigateFn } from './types'

// ── Page imports — all 40 routes ─────────────────────────────────────────────
import Login               from './pages/login/Login'
import ForgotPassword      from './pages/login/ForgotPassword'
import Dashboard           from './pages/dashboard/Dashboard'
import Announcements       from './pages/announcements/Announcements'
import Calendar            from './pages/announcements/Calendar'
import Employees           from './pages/employees/Employees'
import AddEmployee         from './pages/employees/AddEmployee'
import EditEmployee        from './pages/employees/EditEmployee'
import EmployeeDetails     from './pages/employees/EmployeeDetails'
import RolesPage           from './pages/employees/RolesPage'
import Attendance          from './pages/employees/Attendance'
import Projects            from './pages/projects/Projects'
import AddProject          from './pages/projects/AddProject'
import EditProject         from './pages/projects/EditProject'
import ProjectDetail       from './pages/projects/ProjectDetail'
import Events              from './pages/events/Events'
import AddEvent            from './pages/events/AddEvent'
import EditEvent           from './pages/events/EditEvent'
import EventDetail         from './pages/events/EventDetail'
import Funds               from './pages/funds/Funds'
import AddFund             from './pages/funds/AddFund'
import EditFund            from './pages/funds/EditFund'
import Transactions        from './pages/transactions/Transactions'
import AddTransaction      from './pages/transactions/AddTransaction'
import AddUtility          from './pages/transactions/AddUtility'
import Utilities           from './pages/transactions/Utilities'
import Profile             from './pages/profile/Profile'
import EditProfile         from './pages/profile/EditProfile'
import PersonalTransactions from './pages/profile/PersonalTransactions'
import EmployeeReport      from './pages/reports/EmployeeReport'
import FundReport          from './pages/reports/FundReport'
import ClubReport          from './pages/reports/ClubReport'
import AuditLogs           from './pages/audit/AuditLogs'
import Settings            from './pages/settings/Settings'
import Backup              from './pages/settings/Backup'

// ── Page component prop shape — all authenticated pages accept these ───────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PageComponent = ComponentType<any>

// RouteConfig — shape of each entry in the ROUTES map
interface RouteConfig {
  Component: PageComponent
  page?:     string
  sub?:      string
  auth?:     boolean  // false = always accessible (login, forgot-password)
}

// ── Route map: hash path → { Component, page title, subtitle, auth } ──────────
const ROUTES: Record<string, RouteConfig> = {
  '/login':                      { Component: Login,                auth: false },
  '/forgot-password':            { Component: ForgotPassword,       auth: false },
  '/dashboard':                  { Component: Dashboard,            page: 'Dashboard',    sub: 'Overview' },
  '/announcements':              { Component: Announcements,        page: 'Announcements',sub: 'News & Updates' },
  '/announcements/calendar':     { Component: Calendar,             page: 'Announcements',sub: 'Calendar View' },
  '/employees':                  { Component: Employees,            page: 'Employees',    sub: 'Manage Employees' },
  '/employees/add':              { Component: AddEmployee,          page: 'Employees',    sub: 'Add Employee' },
  '/employees/edit':             { Component: EditEmployee,         page: 'Employees',    sub: 'Edit Employee' },
  '/employees/details':          { Component: EmployeeDetails,      page: 'Employees',    sub: 'Employee Details' },
  '/employees/roles':            { Component: RolesPage,            page: 'Employees',    sub: 'Roles & Permissions' },
  '/employees/attendance':       { Component: Attendance,           page: 'Employees',    sub: 'Attendance Records' },
  '/projects':                   { Component: Projects,             page: 'Projects',     sub: 'Manage Projects' },
  '/projects/add':               { Component: AddProject,           page: 'Projects',     sub: 'Add Project' },
  '/projects/edit':              { Component: EditProject,          page: 'Projects',     sub: 'Edit Project' },
  '/projects/detail':            { Component: ProjectDetail,        page: 'Projects',     sub: 'Project Details' },
  '/events':                     { Component: Events,               page: 'Events',       sub: 'Manage Events' },
  '/events/add':                 { Component: AddEvent,             page: 'Events',       sub: 'Add Event' },
  '/events/edit':                { Component: EditEvent,            page: 'Events',       sub: 'Edit Event' },
  '/events/detail':              { Component: EventDetail,          page: 'Events',       sub: 'Event Details' },
  '/funds':                      { Component: Funds,                page: 'Funds',        sub: 'Manage Funds' },
  '/funds/add':                  { Component: AddFund,              page: 'Funds',        sub: 'Add Fund' },
  '/funds/edit':                 { Component: EditFund,             page: 'Funds',        sub: 'Edit Fund' },
  '/transactions':               { Component: Transactions,         page: 'Transactions', sub: 'All Transactions' },
  '/transactions/add':           { Component: AddTransaction,       page: 'Transactions', sub: 'Add Transaction' },
  '/transactions/utilities':     { Component: Utilities,            page: 'Transactions', sub: 'Utilities' },
  '/transactions/utilities/add': { Component: AddUtility,           page: 'Utilities',    sub: 'Add Utility' },
  '/profile':                    { Component: Profile,              page: 'My Profile',   sub: 'Personal Information' },
  '/profile/edit':               { Component: EditProfile,          page: 'My Profile',   sub: 'Edit Profile' },
  '/profile/transactions':       { Component: PersonalTransactions, page: 'My Profile',   sub: 'Personal Transactions' },
  '/reports/employees':          { Component: EmployeeReport,       page: 'Reports',      sub: 'Employee Report' },
  '/reports/funds':              { Component: FundReport,           page: 'Reports',      sub: 'Fund Report' },
  '/reports/club':               { Component: ClubReport,           page: 'Reports',      sub: 'Club Report' },
  '/audit':                      { Component: AuditLogs,            page: 'Audit Logs',   sub: 'System Activity' },
  '/settings':                   { Component: Settings,             page: 'Settings',     sub: 'System Configuration' },
  '/settings/backup':            { Component: Backup,               page: 'Settings',     sub: 'Backup & Recovery' },
}

// Default org config — swap with real GET /api/organizations/me response
// All page labels and currency flow from here through OrgContext
const DEFAULT_ORG: OrgConfig = {
  name:               'uniFITS Demo Organization',
  currency_symbol:    '₱',
  currency_code:      'PHP',
  people_label:       'Employee',
  project_label:      'Project',
  event_label:        'Event',
  fund_label:         'Fund',
  transaction_label:  'Transaction',
  utility_label:      'Utility',
  attendance_label:   'Attendance',
  report_label:       'Report',
}

export default function App() {
  // Hash-based routing state — updated on every hashchange event
  const [hash, setHash] = useState<string>(
    window.location.hash.replace('#', '') || '/login'
  )

  // Auth state — persisted across page refresh via sessionStorage
  const [authed, setAuthed] = useState<boolean>(() => {
    // SWAP: replace with real session/cookie check when connecting backend
    try { return sessionStorage.getItem('unifits_authed') === 'true' } catch { return false }
  })

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const raw = sessionStorage.getItem('unifits_user')
      return raw ? (JSON.parse(raw) as User) : null
    } catch { return null }
  })

  // Listen for hash changes — drives all navigation
  useEffect(() => {
    function onHashChange() {
      setHash(window.location.hash.replace('#', '') || '/login')
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  // navigate — used by Layout, Sidebar, and any page that needs to redirect
  // SWAP: keep as-is — hash routing requires no change when connecting backend
  const navigate: NavigateFn = (path: string) => {
    window.location.hash = path
  }

  // handleLogin — called by LoginForm after mock auth match
  // SWAP: replace body with POST /api/auth/login fetch, keep setAuthed/setCurrentUser calls
  function handleLogin(user: User) {
    try {
      sessionStorage.setItem('unifits_authed', 'true')
      sessionStorage.setItem('unifits_user',   JSON.stringify(user))
    } catch { /* ignore storage errors in restricted environments */ }
    setCurrentUser(user)
    setAuthed(true)
    navigate('/dashboard')
  }

  // handleLogout — clears all session state and returns to login
  // SWAP: add POST /api/auth/logout before clearing state
  function handleLogout() {
    try {
      sessionStorage.removeItem('unifits_authed')
      sessionStorage.removeItem('unifits_user')
    } catch { /* ignore */ }
    setCurrentUser(null)
    setAuthed(false)
    navigate('/login')
  }

  // Resolve the current route — fall back to dashboard on unknown hash
  const route = ROUTES[hash] ?? ROUTES['/dashboard']
  const { Component, page = 'Dashboard', sub, auth = true } = route

  // Unauthenticated or explicitly public route — render without AppLayout
  if (!authed || !auth) {
    if (hash === '/forgot-password') {
      return <OrgProvider orgData={DEFAULT_ORG}><ForgotPassword /></OrgProvider>
    }
    return <OrgProvider orgData={DEFAULT_ORG}><Login onLogin={handleLogin} /></OrgProvider>
  }

  return (
    <OrgProvider orgData={DEFAULT_ORG}>
      <AppLayout page={page} sub={sub} navigate={navigate} currentUser={currentUser} onLogout={handleLogout}>
        <Component currentUser={currentUser} navigate={navigate} />
      </AppLayout>
    </OrgProvider>
  )
}
