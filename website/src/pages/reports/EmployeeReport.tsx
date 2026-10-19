// EmployeeReport.tsx — Per-member report; header row with title + Export PDF + Print buttons
// Responsive via useBreakpoint — sidebar collapses on mobile. Composition only; state in parts/useEmployeeReport, UI in parts/.
import useBreakpoint from '../../hooks/useBreakpoint'
import useEmployeeReport from './parts/useEmployeeReport'
import EmployeeReportHeader from './parts/EmployeeReportHeader'
import EmployeeReportSidebar from './parts/EmployeeReportSidebar'
import EmployeeReportView from './parts/EmployeeReportView'
import AllEmployeesModal from './parts/AllEmployeesModal'
import EmployeeExportModals from './parts/EmployeeExportModals'
import { MOCK_USERS } from '../../api/mockData'

export default function EmployeeReport() {
  const { isMobile } = useBreakpoint()
  const reportLayout = isMobile ? '1fr' : '220px 1fr' // sidebar collapses on mobile
  const r = useEmployeeReport()

  return (
    <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 14 }}>

      {/* ── Top header Card: title (left) + buttons (right) ── */}
      <EmployeeReportHeader onPrint={() => window.print()} onExport={() => r.setShowExport(true)} />

      {/* ── Main layout: sidebar + report ─────────────────── */}
      <div style={{ display: 'grid' as const, gridTemplateColumns: reportLayout, gap: 14, alignItems: 'flex-start' }}>
        <EmployeeReportSidebar officers={r.officers} members={r.members} selected={r.selected} onSelect={r.setSelected} onViewAll={r.openAllList} />
        {r.selected && <EmployeeReportView selected={r.selected} myTx={r.myTx} />}
      </div>

      {/* All Employees List modal */}
      <AllEmployeesModal open={r.showAllList} onClose={() => r.setShowAllList(false)} total={MOCK_USERS.length}
        officers={r.officers} members={r.members} page={r.listPage} totalPages={r.listTotalPages} onPageChange={r.setListPage} />

      <EmployeeExportModals open={r.showExport} employeeName={r.selected?.full_name} onCancel={() => r.setShowExport(false)} onConfirm={r.confirmExport}
        result={r.exportResult} onCloseResult={() => r.setExportResult(null)} />
    </div>
  )
}
