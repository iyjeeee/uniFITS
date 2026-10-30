// parts/useClubReport.ts — Club report state: type, period, generated flag, export feedback; type change resets period + generated
import { useState } from 'react'
import { REPORT_TYPE_OPTIONS, getPeriodOptions, getDefaultPeriod } from './clubReportShared'
import { periodRange } from '../../../utils/period'
import type { ClubReportExportResult } from './clubReportShared'

export default function useClubReport() {
  const [reportType,   setReportType]   = useState('annual')
  const [reportPeriod, setReportPeriod] = useState(() => getDefaultPeriod('annual'))   // latest period with activity
  const [generated,    setGenerated]    = useState(false)
  const [exportResult, setExportResult] = useState<ClubReportExportResult | null>(null)

  const periodOptions   = getPeriodOptions(reportType)
  const range           = periodRange(reportType, reportPeriod)   // date range the report covers
  const reportTypeLabel = REPORT_TYPE_OPTIONS.find((o) => o.value === reportType)?.label || 'Annual Report'

  // Reset period when type changes
  function changeType(value: string) {
    setReportType(value)
    setReportPeriod(getDefaultPeriod(value))
    setGenerated(false)
  }

  function changePeriod(value: string) { setReportPeriod(value); setGenerated(false) }

  function exportPdf() {
    setExportResult({ variant: 'success', title: 'PDF Exported', message: `${reportTypeLabel} for ${reportPeriod} has been generated and is ready to download.` })
  }

  return { reportType, reportPeriod, range, generated, setGenerated, exportResult, setExportResult, periodOptions, changeType, changePeriod, exportPdf }
}
