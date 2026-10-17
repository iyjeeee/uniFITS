// parts/ClubReportControls.tsx — Generator card: report type + period selects, Generate; Print / Export PDF appear after Generate
import { Card, Button } from '../../../components/ui'
import { TableIco } from '../../../components/Icons'
import ReportSelectField from './ReportSelectField'
import { REPORT_TYPE_OPTIONS } from './clubReportShared'

interface Props {
  reportType: string; onTypeChange: (value: string) => void
  reportPeriod: string; periodOptions: { value: string; label: string }[]; onPeriodChange: (value: string) => void
  generated: boolean; onGenerate: () => void; onExportPdf: () => void
}

export default function ClubReportControls({ reportType, onTypeChange, reportPeriod, periodOptions, onPeriodChange, generated, onGenerate, onExportPdf }: Props) {
  return (
    <Card style={{ padding: '16px 20px' }}>
      <div style={{ display: 'flex' as const, gap: 12, flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        {/* LEFT — selectors + Generate */}
        <div style={{ display: 'flex' as const, gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <ReportSelectField label="Report Type" value={reportType} onChange={onTypeChange} options={REPORT_TYPE_OPTIONS} />
          {/* Report Period — changes based on type */}
          <ReportSelectField label={`Report Period ${reportType === 'annual' ? '(Year)' : reportType === 'quarterly' ? '(Quarter)' : '(Month)'}`} value={reportPeriod} onChange={onPeriodChange} options={periodOptions} minWidth={180} />
          <Button onClick={onGenerate}>Generate Report</Button>
        </div>

        {/* RIGHT — Print + Export PDF (only visible after Generate) */}
        {generated && (
          <div style={{ display: 'flex' as const, gap: 8, flexShrink: 0 }}>
            <button onClick={() => window.print()}
              style={{ display: 'inline-flex' as const, alignItems: 'center', gap: 6, padding: '9px 16px', borderRadius: 8, border: '1.5px solid var(--border-card)', background: '#fff', color: 'var(--text-primary)', fontSize: 13, fontWeight: 600, cursor: 'pointer' as const, fontFamily: 'var(--font-body)' }}>
              <TableIco.Print /> Print
            </button>
            <button onClick={onExportPdf}
              style={{ display: 'inline-flex' as const, alignItems: 'center', gap: 6, padding: '9px 16px', borderRadius: 8, border: 'none', background: 'var(--accent)', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' as const, fontFamily: 'var(--font-body)' }}>
              <TableIco.PDF /> Export PDF
            </button>
          </div>
        )}
      </div>
    </Card>
  )
}
