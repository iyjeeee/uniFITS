// parts/ClubReportIncomeStatement.tsx — II. Statement of Income & Expenses with net surplus/deficit row
import { formatCurrency } from '../../../api/mockData'
import { useOrg } from '../../../context/OrgContext'
import ReportSection from './ReportSection'
import StatRow from './ReportStatRow'
import type { ClubReportStats } from './clubReportStats'

export default function ClubReportIncomeStatement({ stats }: { stats: ClubReportStats }) {
  const org = useOrg()
  const { memberDues, projectIncome, eventIncome, fundIncome, totalIncome, projectExpense, eventExpense, utilityExpense, totalExpense, netSurplus } = stats
  return (
    <ReportSection title="II. Statement of Income & Expenses">
      <div style={{ borderRadius: 10, overflow: 'hidden', border: '1.5px solid var(--border-card)' }}>
        {/* Income */}
        <StatRow label="INCOME" value="" bold whiteLabel />
        <StatRow label="Member Dues & Contributions"     value={formatCurrency(memberDues,    org.currency_symbol)} indent color="var(--success)" />
        <StatRow label="Project-Related Income"          value={formatCurrency(projectIncome, org.currency_symbol)} indent color="var(--success)" />
        <StatRow label="Event-Related Income"            value={formatCurrency(eventIncome,   org.currency_symbol)} indent color="var(--success)" />
        <StatRow label="Other Fund Income"               value={formatCurrency(fundIncome,    org.currency_symbol)} indent color="var(--success)" />
        <StatRow label="Total Income"                    value={formatCurrency(totalIncome,   org.currency_symbol)} bold color="var(--success)" border />

        {/* Expenses */}
        <div style={{ height: 8 }} />
        <StatRow label="EXPENSES" value="" bold whiteLabel />
        <StatRow label="Project Expenses"                value={formatCurrency(projectExpense, org.currency_symbol)} indent color="var(--danger)" />
        <StatRow label="Event Expenses"                  value={formatCurrency(eventExpense,   org.currency_symbol)} indent color="var(--danger)" />
        <StatRow label="Operational / Utility Expenses"  value={formatCurrency(utilityExpense, org.currency_symbol)} indent color="var(--danger)" />
        <StatRow label="Total Expenses"                  value={formatCurrency(totalExpense,   org.currency_symbol)} bold color="var(--danger)" border />

        {/* Net */}
        <div style={{ height: 8 }} />
        <StatRow
          label={`NET ${netSurplus >= 0 ? 'SURPLUS' : 'DEFICIT'}`} whiteLabel
          value={`${netSurplus >= 0 ? '+' : '−'}${formatCurrency(Math.abs(netSurplus), org.currency_symbol)}`}
          bold color={netSurplus >= 0 ? 'var(--success)' : 'var(--danger)'} border
        />
      </div>
    </ReportSection>
  )
}
