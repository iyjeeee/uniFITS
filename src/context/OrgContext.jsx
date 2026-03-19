// OrgContext.jsx — Global org config provider: terminology labels, currency, etc.
import { createContext, useContext } from 'react'

const OrgContext = createContext(null)

export function OrgProvider({ children, orgData }) {
  // Default fallbacks — swap all values via orgData from API /organizations/me
  const org = {
    name:                orgData?.name               || 'My Organization',
    currency_symbol:     orgData?.currency_symbol    || '₱',
    currency_code:       orgData?.currency_code      || 'PHP',
    people_label:        orgData?.people_label       || 'Employee',
    project_label:       orgData?.project_label      || 'Project',
    event_label:         orgData?.event_label        || 'Event',
    fund_label:          orgData?.fund_label         || 'Fund',
    transaction_label:   orgData?.transaction_label  || 'Transaction',
    utility_label:       orgData?.utility_label      || 'Utility',
    attendance_label:    orgData?.attendance_label   || 'Attendance',
    report_label:        orgData?.report_label       || 'Report',
  }

  return <OrgContext.Provider value={org}>{children}</OrgContext.Provider>
}

// Convenience hook — import in any page: const org = useOrg()
export function useOrg() {
  const ctx = useContext(OrgContext)
  if (!ctx) throw new Error('useOrg must be used inside OrgProvider')
  return ctx
}
