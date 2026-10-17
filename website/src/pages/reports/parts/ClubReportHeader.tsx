// parts/ClubReportHeader.tsx — Report title block: organization, report type, period, generated date (en-PH)
import { capitalize } from '../../../utils/formatters'

export default function ClubReportHeader({ reportType, reportPeriod }: { reportType: string; reportPeriod: string }) {
  return (
    <div style={{ textAlign: 'center' as const, padding: '28px 0 24px', borderBottom: '2px solid var(--border-inner)', marginBottom: 28 }}>
      <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>
        uniFITS Organization
      </div>
      <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--accent)', marginBottom: 4 }}>
        {capitalize(reportType)} Financial Report
      </div>
      <div style={{ fontSize: 13.5, color: 'var(--text-muted)', marginBottom: 2 }}>
        Period: {reportPeriod}
      </div>
      <div style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>
        Date Generated: {new Date().toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' })}
      </div>
    </div>
  )
}
