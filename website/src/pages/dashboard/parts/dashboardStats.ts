// parts/dashboardStats.ts — Dashboard figures derived from the records: KPIs, top contributors, recent rows, chart data (approved entries only)
import { MOCK_USERS, MOCK_TRANSACTIONS, MOCK_PROJECTS, MOCK_EVENTS, getFundsWithBalance, getUserName } from '../../../api/mockData'
import { isReceipt, sumMoney, approvedTx, ledgerTotals } from '../../../utils/ledger'
import { approvedOnly } from '../../../utils/approvals'
import { manilaToday } from '../../../utils/period'
import { getMonthlyData, getFundPoints, getStatusBreakdown } from './dashboardData'

// txs / today are parameters so tests can feed pending, rejected and future rows; the page uses the defaults
export function getDashboardStats(txs = MOCK_TRANSACTIONS, today = manilaToday()) {
  const funds             = getFundsWithBalance()   // balances derived from approved transactions
  const totalBalance      = sumMoney(funds.map((f) => f.balance))
  const totalMembers      = MOCK_USERS.length   // everybody, active or not -- matches the "Total" label
  const projects          = approvedOnly(MOCK_PROJECTS)   // pending / rejected items are not counted
  const events            = approvedOnly(MOCK_EVENTS)
  const ongoingProjects   = projects.filter((p) => p.status === 'ongoing').length   // "Active" = under way (upcoming ones have not started)
  const upcomingEvents    = events.filter((e) => e.status === 'upcoming').length
  const { income: totalIncome, expense: totalExpense } = ledgerTotals(txs)   // approved entries only; refunds reduce income
  const completedProjects = projects.filter((p) => p.status === 'completed').length
  const ok                = approvedTx(txs)
  const totalTransactions = ok.filter((t) => t.entry_type !== 'opening_balance').length   // opening balances are setup entries

  const topContributors = Object.values(
    ok
      .filter((t) => t.user_id && isReceipt(t))
      .reduce((acc: Record<string,{name:string;total:number;count:number}>, t) => {
        if (!t.user_id) return acc   // already filtered above -- narrows user_id to string
        if (!acc[t.user_id]) acc[t.user_id] = { name: getUserName(t.user_id), total: 0, count: 0 }   // grouped by id, name looked up
        acc[t.user_id].total = sumMoney([acc[t.user_id].total, t.amount])
        acc[t.user_id].count += 1
        return acc
      }, {} as Record<string,{name:string;total:number;count:number}>)
  ).sort((a, b) => b.total - a.total).slice(0, 5)

  // latest 6 entries by date (newest id first on the same day); every status is listed because the table shows it, opening balances are not
  const recentTransactions = txs.filter((t) => t.entry_type !== 'opening_balance')
    .sort((a, b) => b.transaction_date.localeCompare(a.transaction_date) || b.id.localeCompare(a.id, undefined, { numeric: true })).slice(0, 6)

  return {
    totalBalance, totalMembers, ongoingProjects, upcomingEvents, totalIncome, totalExpense, completedProjects, totalTransactions, topContributors, recentTransactions,
    monthlyData: getMonthlyData(txs, today), fundPoints: getFundPoints(funds), statusBreakdown: getStatusBreakdown(MOCK_PROJECTS),
  }
}

export type DashboardStats = ReturnType<typeof getDashboardStats>
