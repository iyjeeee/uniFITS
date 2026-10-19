// parts/EmployeeReportHeader.tsx — Top card: report title (left), Print + Export PDF buttons (right)
import { Card } from '../../../components/ui'
import { TableIco } from '../../../components/Icons'
import ReportActionButton from './ReportActionButton'

export default function EmployeeReportHeader({ onPrint, onExport }: { onPrint: () => void; onExport: () => void }) {
  return (
    <Card style={{ padding: '12px 18px' }}>
      <div style={{ display: 'flex' as const, alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>Employee Report</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 1 }}>View and export individual member financial reports</div>
        </div>
        <div style={{ display: 'flex' as const, gap: 10 }}>
          <ReportActionButton variant="secondary" icon={<TableIco.Print />} onClick={onPrint}>
            Print
          </ReportActionButton>
          <ReportActionButton icon={<TableIco.PDF />} onClick={onExport}>
            Export PDF
          </ReportActionButton>
        </div>
      </div>
    </Card>
  )
}
