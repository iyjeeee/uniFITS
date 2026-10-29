// sidebar/sidebarNav.ts — Nav data types and buildNav(org): the full menu structure with org labels (plurals come from org.*_label_plural, B-63)
import type { OrgConfig } from '../../types'

// ── Nav data types ────────────────────────────────────────────────────────────
export interface SubItem { label: string; href: string }
export interface NavItemDef {
  label:    string
  href:     string
  paths:    string[]
  sub?:     SubItem[]
  badge?:   number | null
  rect?:    { x: number; y: number; width: number; height: number; rx: number }
  circle?:  { cx: number; cy: number; r: number }
}
export interface NavSection { section: string; items: NavItemDef[] }

// buildNav — returns the full nav structure using org labels from OrgContext
export function buildNav(org: OrgConfig): NavSection[] {
  return [
    {
      section: 'Main',
      items: [
        { label: 'Announcements', href: '#/announcements',
          paths: ['M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9','M13.73 21a2 2 0 0 1-3.46 0'] },
        { label: 'Dashboard', href: '#/dashboard',
          paths: ['M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z'] },
      ],
    },
    {
      section: 'Organization',
      items: [
        { label: org.people_label_plural, href: '#/employees',
          sub: [{ label: `Add ${org.people_label}`, href: '#/employees/add' },{ label: `Manage ${org.people_label_plural}`, href: '#/employees' },{ label: 'Roles & Permissions', href: '#/employees/roles' },{ label: org.attendance_label, href: '#/employees/attendance' }],
          paths: ['M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2','M23 21v-2a4 4 0 0 0-3-3.87','M16 3.13a4 4 0 0 1 0 7.75'], circle: { cx: 9, cy: 7, r: 4 } },
        { label: org.project_label_plural, href: '#/projects',
          sub: [{ label: `Add ${org.project_label}`, href: '#/projects/add' },{ label: `Manage ${org.project_label_plural}`, href: '#/projects' }],
          paths: ['M2 20h20','M5 20V8l7-5 7 5v12','M9 20v-5h6v5'] },
        { label: org.event_label_plural, href: '#/events',
          sub: [{ label: `Add ${org.event_label}`, href: '#/events/add' },{ label: `Manage ${org.event_label_plural}`, href: '#/events' }],
          paths: ['M16 2v4','M8 2v4','M3 10h18'], rect: { x: 3, y: 4, width: 18, height: 18, rx: 2 } },
      ],
    },
    {
      section: 'Finance',
      items: [
        { label: org.fund_label_plural, href: '#/funds',
          sub: [{ label: `Add ${org.fund_label}`, href: '#/funds/add' },{ label: `Manage ${org.fund_label_plural}`, href: '#/funds' }],
          paths: ['M12 1v22','M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6'] },
        { label: org.transaction_label_plural, href: '#/transactions',
          sub: [{ label: `Add ${org.transaction_label}`, href: '#/transactions/add' },{ label: `All ${org.transaction_label_plural}`, href: '#/transactions' }],
          paths: ['M17 1l4 4-4 4','M3 11V9a4 4 0 0 1 4-4h14','M7 23l-4-4 4-4','M21 13v2a4 4 0 0 1-4 4H3'] },
        { label: org.utility_label_plural, href: '#/transactions/utilities',
          sub: [{ label: `Add ${org.utility_label}`, href: '#/transactions/utilities/add' },{ label: `Manage ${org.utility_label_plural}`, href: '#/transactions/utilities' }],
          paths: ['M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z','M9 12l2 2 4-4'] },
      ],
    },
    {
      section: 'Insights',
      items: [
        { label: org.report_label_plural, href: '#/reports/employees',
          sub: [{ label: `${org.people_label} Report`, href: '#/reports/employees' },{ label: `${org.fund_label} Report`, href: '#/reports/funds' },{ label: 'Club Report', href: '#/reports/club' }],
          paths: ['M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z','M14 2v6h6','M16 13H8','M16 17H8'] },
        { label: 'Audit Logs', href: '#/audit',
          paths: ['M9 11l3 3L22 4','M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11'] },
      ],
    },
  ]
}
