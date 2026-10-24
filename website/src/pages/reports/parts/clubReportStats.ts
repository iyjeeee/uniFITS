// parts/clubReportStats.ts — Club report figures from the mock records (income, expenses, member/project/event stats, fund rows)
import { MOCK_USERS, MOCK_PROJECTS, MOCK_EVENTS, MOCK_FUNDS, MOCK_TRANSACTIONS, MOCK_UTILITIES } from '../../../api/mockData'

export function getClubReportStats() {
  const totalFundBalance    = MOCK_FUNDS.reduce((s, f) => s + f.balance, 0)

  // Income
  const memberDues          = MOCK_TRANSACTIONS.filter((t) => t.entry_type === 'contribution').reduce((s, t) => s + t.amount, 0)
  const projectIncome       = MOCK_TRANSACTIONS.filter((t) => t.category === 'project' && t.entry_type === 'income').reduce((s, t) => s + t.amount, 0)
  const eventIncome         = MOCK_TRANSACTIONS.filter((t) => t.category === 'event'   && t.entry_type === 'income').reduce((s, t) => s + t.amount, 0)
  const fundIncome          = MOCK_TRANSACTIONS.filter((t) => t.category === 'fund'    && t.entry_type === 'income').reduce((s, t) => s + t.amount, 0)
  const totalIncome         = memberDues + projectIncome + eventIncome + fundIncome

  // Expenses
  const projectExpense      = MOCK_TRANSACTIONS.filter((t) => t.category === 'project' && t.entry_type === 'expense').reduce((s, t) => s + t.amount, 0)
  const eventExpense        = MOCK_TRANSACTIONS.filter((t) => t.category === 'event'   && t.entry_type === 'expense').reduce((s, t) => s + t.amount, 0)
  const utilityExpense      = MOCK_UTILITIES.reduce((s, u) => s + u.amount_paid, 0)
  const totalExpense        = projectExpense + eventExpense + utilityExpense
  const netSurplus          = totalIncome - totalExpense

  // Member stats
  const activeMembers       = MOCK_USERS.filter((u) => u.status === 'active').length
  const officers            = MOCK_USERS.filter((u) => u.role !== 'Member').length
  const regularMembers      = MOCK_USERS.filter((u) => u.role === 'Member').length

  // Project stats
  const completedProjects   = MOCK_PROJECTS.filter((p) => p.status === 'completed').length
  const ongoingProjects     = MOCK_PROJECTS.filter((p) => p.status === 'ongoing').length
  const completedEvents     = MOCK_EVENTS.filter((e) => e.status === 'completed').length
  const upcomingEvents      = MOCK_EVENTS.filter((e) => e.status === 'upcoming').length

  // Utility breakdown
  const utilByType = MOCK_UTILITIES.reduce((acc: Record<string, number>, u) => {
    acc[u.expense_type] = (acc[u.expense_type] || 0) + u.amount_paid
    return acc
  }, {} as Record<string, number>)

  // Fund per-fund breakdown
  const fundRows = MOCK_FUNDS.map((f) => {
    const received = MOCK_TRANSACTIONS.filter((t) => t.fund_id === f.id && t.entry_type !== 'expense').reduce((s, t) => s + t.amount, 0)
    const spent    = MOCK_TRANSACTIONS.filter((t) => t.fund_id === f.id && t.entry_type === 'expense').reduce((s, t) => s + t.amount, 0)
    return { ...f, received, spent }
  })

  return {
    totalFundBalance, memberDues, projectIncome, eventIncome, fundIncome, totalIncome,
    projectExpense, eventExpense, utilityExpense, totalExpense, netSurplus,
    activeMembers, officers, regularMembers, completedProjects, ongoingProjects, completedEvents, upcomingEvents,
    utilByType, fundRows,
  }
}

export type ClubReportStats = ReturnType<typeof getClubReportStats>
