// parts/EmployeeExportModals.tsx — Export PDF confirmation (info) + result feedback (success) ResponseModals
import { ResponseModal } from '../../../components/ui'
import type { EmployeeReportExportResult } from './employeeReportShared'
import { useOrg } from '../../../context/OrgContext'
import type { ModalVariant } from '../../../types'

interface Props {
  open: boolean; employeeName: string | undefined; onCancel: () => void; onConfirm: () => void
  result: EmployeeReportExportResult | null; onCloseResult: () => void
}

export default function EmployeeExportModals({ open, employeeName, onCancel, onConfirm, result, onCloseResult }: Props) {
  const org = useOrg()
  return (
    <>
      {/* ── Export PDF Confirmation Modal ──────────────────────── */}
      <ResponseModal
        open={open}
        onClose={onCancel}
        variant="info"
        title={`Export ${org.people_label} Report PDF`}
        message={`This will generate a PDF report for ${employeeName || `the selected ${org.people_label.toLowerCase()}`} including all financial contributions and attendance records.`}
        confirmLabel="Export PDF"
        cancelLabel="Cancel"
        onConfirm={onConfirm}
      />

      {/* ── Export result feedback ─────────────────────────────── */}
      <ResponseModal
        open={!!result}
        onClose={onCloseResult}
        variant={(result?.variant || 'success') as ModalVariant}
        title={result?.title || ''}
        message={result?.message || ''}
        confirmLabel="Got it"
      />
    </>
  )
}
