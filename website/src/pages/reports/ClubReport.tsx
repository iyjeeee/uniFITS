// ClubReport.tsx — Comprehensive org-level financial report: income statement, fund balance sheet, utility breakdown,
// project/event activity, membership summary, printable layout. Composition only; state in parts/useClubReport,
// figures in parts/clubReportStats, sections in parts/ClubReport*.
import { Card, ResponseModal } from '../../components/ui'
import useClubReport from './parts/useClubReport'
import { getClubReportStats } from './parts/clubReportStats'
import ClubReportControls from './parts/ClubReportControls'
import ClubReportHeader from './parts/ClubReportHeader'
import ClubReportSummary from './parts/ClubReportSummary'
import ClubReportIncomeStatement from './parts/ClubReportIncomeStatement'
import ClubReportFundTable from './parts/ClubReportFundTable'
import ClubReportUtilityBreakdown from './parts/ClubReportUtilityBreakdown'
import ClubReportActivity from './parts/ClubReportActivity'
import ClubReportMembership from './parts/ClubReportMembership'
import ClubReportSignatures from './parts/ClubReportSignatures'
import type { ModalVariant } from '../../types'

export default function ClubReport() {
  const r = useClubReport()
  const stats = getClubReportStats(r.range)
  return (
    <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 14 }}>
      {/* Generator controls — all on one row */}
      <ClubReportControls reportType={r.reportType} onTypeChange={r.changeType}
        reportPeriod={r.reportPeriod} periodOptions={r.periodOptions} onPeriodChange={r.changePeriod}
        generated={r.generated} onGenerate={() => r.setGenerated(true)} onExportPdf={r.exportPdf} />

      {/* Generated report */}
      {r.generated && (
        <Card>
          <div style={{ padding: '0 28px 28px' }}>
            <ClubReportHeader reportType={r.reportType} reportPeriod={r.reportPeriod} />
            <ClubReportSummary stats={stats} reportPeriod={r.reportPeriod} />
            <ClubReportIncomeStatement stats={stats} />
            <ClubReportFundTable stats={stats} />
            <ClubReportUtilityBreakdown stats={stats} />
            <ClubReportActivity stats={stats} />
            <ClubReportMembership stats={stats} />
            <ClubReportSignatures />
          </div>
        </Card>
      )}

      {/* Export result feedback */}
      <ResponseModal
        open={!!r.exportResult}
        onClose={() => r.setExportResult(null)}
        variant={(r.exportResult?.variant || 'success') as ModalVariant}
        title={r.exportResult?.title   || ''}
        message={r.exportResult?.message || ''}
        confirmLabel="Got it"
      />
    </div>
  )
}
