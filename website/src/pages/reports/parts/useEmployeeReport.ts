// parts/useEmployeeReport.ts — Employee report state: selected member, export modals, All Employees modal + page, derived lists
import { useState } from 'react'
import { MOCK_USERS, MOCK_TRANSACTIONS, isOfficer } from '../../../api/mockData'
import { LIST_PAGE_SIZE } from './employeeReportShared'
import type { EmployeeReportExportResult } from './employeeReportShared'

export default function useEmployeeReport() {
  const [selected,     setSelected]    = useState(MOCK_USERS[0])
  const [showExport,   setShowExport]   = useState(false)   /* Export PDF confirmation modal */
  const [exportResult, setExportResult] = useState<EmployeeReportExportResult | null>(null)    /* Export PDF result feedback */
  const [showAllList,  setShowAllList] = useState(false)
  const [listPage,     setListPage]   = useState(1)
  const officers = MOCK_USERS.filter(isOfficer)
  const members  = MOCK_USERS.filter((u) => !isOfficer(u))
  const listTotalPages = Math.max(1, Math.ceil(MOCK_USERS.length / LIST_PAGE_SIZE))
  const myTx     = MOCK_TRANSACTIONS.filter((t) => t.user_id === selected?.id).slice(0, 6)

  function openAllList() { setListPage(1); setShowAllList(true) }

  // Confirm export — closes the confirmation and shows the result
  function confirmExport() {
    setShowExport(false)
    setExportResult({ variant: 'success', title: 'PDF Exported', message: `Report for ${selected?.full_name} has been generated and is ready to download.` })
  }

  return {
    selected, setSelected, showExport, setShowExport, exportResult, setExportResult, showAllList, setShowAllList, listPage, setListPage,
    officers, members, listTotalPages, myTx, openAllList, confirmExport,
  }
}
