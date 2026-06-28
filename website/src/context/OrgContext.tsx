// context/OrgContext.tsx — Global org config provider: terminology labels, currency, etc.
import { createContext, useContext } from 'react'
import type { ReactNode } from 'react'
import type { OrgConfig } from '../types'

// OrgContext — typed with OrgConfig, initialized to null (guarded by useOrg)
const OrgContext = createContext<OrgConfig | null>(null)

interface OrgProviderProps {
  children: ReactNode
  orgData:  Partial<OrgConfig>  // partial — all fields have fallback defaults below
}

export function OrgProvider({ children, orgData }: OrgProviderProps) {
  // Default fallbacks — swap all values via orgData from API /organizations/me
  const org: OrgConfig = {
    name:               orgData?.name               ?? 'My Organization',
    currency_symbol:    orgData?.currency_symbol    ?? '₱',
    currency_code:      orgData?.currency_code      ?? 'PHP',
    people_label:       orgData?.people_label       ?? 'Employee',
    project_label:      orgData?.project_label      ?? 'Project',
    event_label:        orgData?.event_label        ?? 'Event',
    fund_label:         orgData?.fund_label         ?? 'Fund',
    transaction_label:  orgData?.transaction_label  ?? 'Transaction',
    utility_label:      orgData?.utility_label      ?? 'Utility',
    attendance_label:   orgData?.attendance_label   ?? 'Attendance',
    report_label:       orgData?.report_label       ?? 'Report',
  }

  return <OrgContext.Provider value={org}>{children}</OrgContext.Provider>
}

// useOrg — convenience hook; import in any component: const org = useOrg()
export function useOrg(): OrgConfig {
  const ctx = useContext(OrgContext)
  if (!ctx) throw new Error('useOrg must be used inside OrgProvider')
  return ctx
}
