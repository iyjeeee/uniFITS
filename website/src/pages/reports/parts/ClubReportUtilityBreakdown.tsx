// parts/ClubReportUtilityBreakdown.tsx — IV. Operational Expenses Breakdown by utility type
import { formatCurrency } from '../../../api/mockData'
import { useOrg } from '../../../context/OrgContext'
import ReportSection from './ReportSection'
import StatRow from './ReportStatRow'
import type { ClubReportStats } from './clubReportStats'

export default function ClubReportUtilityBreakdown({ stats }: { stats: ClubReportStats }) {
  const org = useOrg()
  const { utilByType, utilityExpense } = stats
  return (
    <ReportSection title="IV. Operational Expenses Breakdown">
      <div style={{ borderRadius: 10, overflow: 'hidden', border: '1.5px solid var(--border-card)' }}>
        {Object.entries(utilByType).map(([type, amount]) => (
          <StatRow key={type} label={type} value={formatCurrency(amount, org.currency_symbol)} indent color="var(--danger)" />
        ))}
        <StatRow label="Total Operational Expenses" value={formatCurrency(utilityExpense, org.currency_symbol)} bold color="var(--danger)" border />
      </div>
    </ReportSection>
  )
}
