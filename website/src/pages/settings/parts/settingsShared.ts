// parts/settingsShared.ts — Constants and types shared by the Settings parts
export const BACKUP_FREQ_OPTIONS = [
  { value: 'daily',   label: 'Daily'   },
  { value: 'weekly',  label: 'Weekly'  },
  { value: 'monthly', label: 'Monthly' },
]

// Terminology label fields: [OrgConfig key, row label]
export const LABEL_FIELDS: [string, string][] = [
  ['people_label',      'People / Members'],
  ['project_label',     'Project'],
  ['event_label',       'Event'],
  ['fund_label',        'Fund'],
  ['transaction_label', 'Transaction'],
  ['utility_label',     'Utility'],
  ['attendance_label',  'Attendance'],
  ['report_label',      'Report'],
]

// Security defaults (not stored anywhere yet — see bug log)
export const DEFAULT_SECURITY: Record<string, string | number> = {
  max_login_attempts:       5,
  lockout_duration_minutes: 30,
  session_timeout_minutes:  60,
  backup_frequency:         'daily',
  backup_retention_days:    30,
}

// SettingsResponse — feedback shown in the ResponseModal after a button press
export interface SettingsResponse { variant: string; title: string; message: string }

// FieldChange — change handler factory keyed by field name (labels / security)
export type FieldChange = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void
