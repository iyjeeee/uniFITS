// parts/dashboardStats.ts — Computed dashboard figures from the mock records (KPIs, top contributors, recent transactions)
import { MOCK_USERS, MOCK_TRANSACTIONS, MOCK_PROJECTS, MOCK_EVENTS, getFundsWithBalance } from '../../../api/mockData'
import { isReceipt, sumMoney } from '../../../utils/ledger'
import { approvedOnly } from '../../../utils/approvals'

export function getDashboardStats() {
  const totalBalance     = sumMoney(getFundsWithBalance().map((f) => f.balance))   // derived from approved transactions
  const activeMembers    = MOCK_USERS.filter((u) => u.status === 'active').length
  const projects         = approvedOnly(MOCK_PROJECTS)   // pending / rejected items are not counted
  const events           = approvedOnly(MOCK_EVENTS)
  const ongoingProjects  = projects.filter((p) => p.status !== 'completed' && p.status !== 'cancelled').length
  const upcomingEvents   = events.filter((e) => e.status === 'upcoming').length
  const totalIncome      = sumMoney(MOCK_TRANSACTIONS.filter(isReceipt).map((t) => t.amount))
  const totalExpense     = sumMoney(MOCK_TRANSACTIONS.filter((t) => t.entry_type === 'expense').map((t) => t.amount))
  const completedProjects = projects.filter((p) => p.status === 'completed').length
  const totalTransactions = MOCK_TRANSACTIONS.filter((t) => t.entry_type !== 'opening_balance').length   // opening balances are setup entries

  const topContributors = Object.values(
    MOCK_TRANSACTIONS
      .filter((t) => t.user_name && isReceipt(t))
      .reduce((acc: Record<string,{name:string;total:number;count:number}>, t) => {
        if (!t.user_name) return acc   // already filtered above — narrows user_name to string
        if (!acc[t.user_name]) acc[t.user_name] = { name: t.user_name, total: 0, count: 0 }
        acc[t.user_name].total += t.amount
        acc[t.user_name].count += 1
        return acc
      }, {} as Record<string,{name:string;total:number;count:number}>)
  ).sort((a, b) => b.total - a.total).slice(0, 5)

  const recentTransactions = MOCK_TRANSACTIONS.slice(0, 6)

  return { totalBalance, activeMembers, ongoingProjects, upcomingEvents, totalIncome, totalExpense, completedProjects, totalTransactions, topContributors, recentTransactions }
}

export type DashboardStats = ReturnType<typeof getDashboardStats>
