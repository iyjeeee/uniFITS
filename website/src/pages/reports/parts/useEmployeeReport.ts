// parts/useEmployeeReport.ts — Employee report state: selected member, export modals, All Employees modal, derived lists
import { useState } from 'react'
import { MOCK_USERS, isOfficer } from '../../../api/mockData'
import { getRecentTransactions } from './employeeReportShared'
import type { EmployeeReportExportResult } from './employeeReportShared'

export default function useEmployeeReport() {
  const [selected,     setSelected]    = useState(MOCK_USERS[0])
  const [showExport,   setShowExport]   = useState(false)   /* Export PDF confirmation modal */
  const [exportResult, setExportResult] = useState<EmployeeReportExportResult | null>(null)    /* Export PDF result feedback */
  const [showAllList,  setShowAllList] = useState(false)
  const officers = MOCK_USERS.filter(isOfficer)
  const members  = MOCK_USERS.filter((u) => !isOfficer(u))
  const myTx     = getRecentTransactions(selected?.id)   // latest approved rows, newest first (B-54)

  function openAllList() { setShowAllList(true) }

  // Confirm export — closes the confirmation and shows the result
  function confirmExport() {
    setShowExport(false)
    setExportResult({ variant: 'success', title: 'PDF Exported', message: `Report for ${selected?.full_name} has been generated and is ready to download.` })
  }

  return {
    selected, setSelected, showExport, setShowExport, exportResult, setExportResult, showAllList, setShowAllList,
    officers, members, myTx, openAllList, confirmExport,
  }
}
