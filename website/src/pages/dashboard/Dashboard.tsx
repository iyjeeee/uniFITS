// Dashboard.tsx — Overview: KPI rows, top contributors, fund balances, recent transactions, chart cards.
// Composition only; figures in parts/dashboardStats.ts, charts + cards in parts/. Responsive via useBreakpoint.
import useBreakpoint from '../../hooks/useBreakpoint'
import { getDashboardStats } from './parts/dashboardStats'
import DashboardKpiRows from './parts/DashboardKpiRows'
import TopContributorsCard from './parts/TopContributorsCard'
import FundBalancesCard from './parts/FundBalancesCard'
import RecentTransactionsCard from './parts/RecentTransactionsCard'
import MonthlyChartCard from './parts/MonthlyChartCard'
import ProjectStatusCard from './parts/ProjectStatusCard'
import AttendanceOverviewCard from './parts/AttendanceOverviewCard'

export default function Dashboard() {
  const { isMobile, isTablet } = useBreakpoint()

  // Responsive column counts — 4-col desktop, 2-col tablet/mobile
  const chartCols = isMobile ? '1fr' : isTablet ? 'repeat(2,1fr)' : 'repeat(3,1fr)'
  const topRowCols = isMobile || isTablet ? '1fr' : '1fr 320px'
  const stats = getDashboardStats()

  return (
    <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 14 }}>
      <DashboardKpiRows stats={stats} />

      {/* Row 2: Top Contributors (left big) + Fund Breakdown (right) */}
      <div style={{ display: 'grid' as const, gridTemplateColumns: topRowCols, gap: 12 }}>
        <TopContributorsCard topContributors={stats.topContributors} />
        <FundBalancesCard totalBalance={stats.totalBalance} />
      </div>

      {/* Row 3: Recent Transactions table */}
      <RecentTransactionsCard recentTransactions={stats.recentTransactions} />

      {/* Row 4: Analytics charts (3-col desktop → 2-col tablet → 1-col mobile) */}
      <div style={{ display: 'grid' as const, gridTemplateColumns: chartCols, gap: 12 }}>
        <MonthlyChartCard />
        <ProjectStatusCard />
        <AttendanceOverviewCard />
      </div>
    </div>
  )
}
