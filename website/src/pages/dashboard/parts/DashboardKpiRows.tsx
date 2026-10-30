// parts/DashboardKpiRows.tsx — Two rows of clickable KPI cards (4-col desktop, 2-col tablet/mobile); each card navigates to its page
import { KpiCard } from '../../../components/ui'
import { formatCurrency } from '../../../api/mockData'
import { useOrg } from '../../../context/OrgContext'
import useBreakpoint from '../../../hooks/useBreakpoint'
import { Ico } from './DashboardIcons'
import type { DashboardStats } from './dashboardStats'

export default function DashboardKpiRows({ stats }: { stats: DashboardStats }) {
  const org = useOrg()
  const { isMobile, isTablet } = useBreakpoint()
  const kpiCols = isMobile || isTablet ? 'repeat(2,1fr)' : 'repeat(4,1fr)'   // responsive KPI grid
  const { totalBalance, totalMembers, ongoingProjects, upcomingEvents, totalIncome, totalExpense, completedProjects, totalTransactions } = stats
  return (
    <>
      {/* ── Row 1: KPI cards (4-col desktop → 2-col mobile) ─────── */}
      <div style={{ display: 'grid' as const, gridTemplateColumns: kpiCols, gap: 12 }}>
        <KpiCard label={`Total ${org.people_label_plural}`}      value={totalMembers}                                  color="var(--accent)"  icon={Ico.members('var(--accent)')}  onClick={() => { window.location.hash = '/employees' }} />
        <KpiCard label="Total Fund Balance"                 value={formatCurrency(totalBalance, org.currency_symbol)} color="var(--success)" icon={Ico.fund('var(--success)')}    onClick={() => { window.location.hash = '/funds' }} />
        <KpiCard label={`Active ${org.project_label_plural}`}    value={ongoingProjects}                               color="var(--warning)" icon={Ico.project('var(--warning)')} onClick={() => { window.location.hash = '/projects' }} />
        <KpiCard label={`Upcoming ${org.event_label_plural}`}    value={upcomingEvents}                                color="var(--info)"    icon={Ico.event('var(--info)')}      onClick={() => { window.location.hash = '/events' }} />
      </div>
      <div style={{ display: 'grid' as const, gridTemplateColumns: kpiCols, gap: 12 }}>
        <KpiCard label="Total Income"                       value={formatCurrency(totalIncome, org.currency_symbol)}   color="var(--success)" icon={Ico.income('var(--success)')}   onClick={() => { window.location.hash = '/transactions' }} />
        <KpiCard label="Total Expenses"                     value={formatCurrency(totalExpense, org.currency_symbol)}  color="var(--danger)"  icon={Ico.expense('var(--danger)')}  onClick={() => { window.location.hash = '/transactions' }} />
        <KpiCard label={`Completed ${org.project_label_plural}`} value={completedProjects}                               color="var(--success)" icon={Ico.complete('var(--success)')} onClick={() => { window.location.hash = '/projects' }} />
        <KpiCard label="Total Transactions"                 value={totalTransactions}                               color="var(--accent)"  icon={Ico.txn('var(--accent)')}       onClick={() => { window.location.hash = '/transactions' }} />
      </div>
    </>
  )
}
