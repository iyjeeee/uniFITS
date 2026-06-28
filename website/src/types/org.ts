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
}
