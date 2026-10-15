// parts/dashboardStats.ts — Computed dashboard figures from the mock records (KPIs, top contributors, recent transactions)
import { MOCK_USERS, MOCK_TRANSACTIONS, MOCK_PROJECTS, MOCK_EVENTS, MOCK_FUNDS } from '../../../api/mockData'

export function getDashboardStats() {
  const totalBalance     = MOCK_FUNDS.reduce((s, f) => s + f.balance, 0)
  const activeMembers    = MOCK_USERS.filter((u) => u.status === 'active').length
  const ongoingProjects  = MOCK_PROJECTS.filter((p) => p.status !== 'completed' && p.status !== 'cancelled').length
  const upcomingEvents   = MOCK_EVENTS.filter((e) => e.status === 'upcoming').length
  const totalIncome      = MOCK_TRANSACTIONS.filter((t) => t.entry_type !== 'expense').reduce((s, t) => s + t.amount, 0)
  const totalExpense     = MOCK_TRANSACTIONS.filter((t) => t.entry_type === 'expense').reduce((s, t) => s + t.amount, 0)
  const completedProjects = MOCK_PROJECTS.filter((p) => p.status === 'completed').length
  const totalTransactions = MOCK_TRANSACTIONS.length

  const topContributors = Object.values(
    MOCK_TRANSACTIONS
      .filter((t) => t.user_name && t.entry_type !== 'expense')
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
