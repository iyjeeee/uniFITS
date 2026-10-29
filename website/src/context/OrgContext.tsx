// context/OrgContext.tsx — Global org config provider: terminology labels, currency, etc.
import { createContext, useContext } from 'react'
import type { ReactNode } from 'react'
import type { OrgConfig } from '../types'
import { pluralize } from '../utils/labels'

// OrgContext — typed with OrgConfig, initialized to null (guarded by useOrg)
const OrgContext = createContext<OrgConfig | null>(null)

interface OrgProviderProps {
  children: ReactNode
  orgData:  Partial<OrgConfig>  // partial — all fields have fallback defaults below
}

export function OrgProvider({ children, orgData }: OrgProviderProps) {
  // Default fallbacks — swap all values via orgData from API /organizations/me
  const people      = orgData?.people_label      ?? 'Employee'
  const project     = orgData?.project_label     ?? 'Project'
  const event       = orgData?.event_label       ?? 'Event'
  const fund        = orgData?.fund_label        ?? 'Fund'
  const transaction = orgData?.transaction_label ?? 'Transaction'
  const utility     = orgData?.utility_label     ?? 'Utility'
  const report      = orgData?.report_label      ?? 'Report'
  const org: OrgConfig = {
    name:               orgData?.name               ?? 'My Organization',
    currency_symbol:    orgData?.currency_symbol    ?? '₱',
    currency_code:      orgData?.currency_code      ?? 'PHP',
    people_label:       people,
    project_label:      project,
    event_label:        event,
    fund_label:         fund,
    transaction_label:  transaction,
    utility_label:      utility,
    attendance_label:   orgData?.attendance_label   ?? 'Attendance',
    report_label:       report,
    // Plurals: an explicit value wins, else derived from the (possibly customised) singular label (B-63)
    people_label_plural:      orgData?.people_label_plural      ?? pluralize(people),
    project_label_plural:     orgData?.project_label_plural     ?? pluralize(project),
    event_label_plural:       orgData?.event_label_plural       ?? pluralize(event),
    fund_label_plural:        orgData?.fund_label_plural        ?? pluralize(fund),
    transaction_label_plural: orgData?.transaction_label_plural ?? pluralize(transaction),
    utility_label_plural:     orgData?.utility_label_plural     ?? pluralize(utility),
    report_label_plural:      orgData?.report_label_plural      ?? pluralize(report),
  }

  return <OrgContext.Provider value={org}>{children}</OrgContext.Provider>
}

// useOrg — convenience hook; import in any component: const org = useOrg()
export function useOrg(): OrgConfig {
  const ctx = useContext(OrgContext)
  if (!ctx) throw new Error('useOrg must be used inside OrgProvider')
  return ctx
}
