// types/org.ts — Organization config type (populated from API /organizations/me)

// OrgConfig — all customizable labels and settings for an organization
// Swap DEFAULT_ORG in App.tsx with real API response to customize per org
export interface OrgConfig {
  name: string
  currency_symbol: string     // '₱' for Philippine Peso
  currency_code: string       // 'PHP'
  people_label: string        // default 'Employee' — shown in nav/tables/forms
  project_label: string       // default 'Project'
  event_label: string         // default 'Event'
  fund_label: string          // default 'Fund'
  transaction_label: string   // default 'Transaction'
  utility_label: string       // default 'Utility'
  attendance_label: string    // default 'Attendance'
  report_label: string        // default 'Report'
  // Plural forms — used in menus, KPI tiles and headings. The provider fills them with pluralize(label) when an org gives none (B-63)
  people_label_plural: string       // default 'Employees'
  project_label_plural: string      // default 'Projects'
  event_label_plural: string        // default 'Events'
  fund_label_plural: string         // default 'Funds'
  transaction_label_plural: string  // default 'Transactions'
  utility_label_plural: string      // default 'Utilities'
  report_label_plural: string       // default 'Reports'
}
