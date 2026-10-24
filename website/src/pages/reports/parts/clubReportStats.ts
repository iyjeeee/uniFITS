// parts/clubReportStats.ts — Club report figures from the mock records (income, expenses, member/project/event stats, fund rows)
import { MOCK_USERS, MOCK_PROJECTS, MOCK_EVENTS, MOCK_TRANSACTIONS, getFundsWithBalance, getUtilitiesWithBalance } from '../../../api/mockData'
import { isReceipt, sumMoney } from '../../../utils/ledger'

export function getClubReportStats() {
  const fundsWithBalance    = getFundsWithBalance()   // balances derived from approved transactions
  const totalFundBalance    = sumMoney(fundsWithBalance.map((f) => f.balance))

  // Income
  const memberDues          = MOCK_TRANSACTIONS.filter((t) => t.entry_type === 'contribution').reduce((s, t) => s + t.amount, 0)
  const projectIncome       = MOCK_TRANSACTIONS.filter((t) => t.category === 'project' && t.entry_type === 'income').reduce((s, t) => s + t.amount, 0)
  const eventIncome         = MOCK_TRANSACTIONS.filter((t) => t.category === 'event'   && t.entry_type === 'income').reduce((s, t) => s + t.amount, 0)
  const fundIncome          = MOCK_TRANSACTIONS.filter((t) => t.category === 'fund'    && t.entry_type === 'income').reduce((s, t) => s + t.amount, 0)
  const totalIncome         = memberDues + projectIncome + eventIncome + fundIncome

  // Expenses
  const projectExpense      = MOCK_TRANSACTIONS.filter((t) => t.category === 'project' && t.entry_type === 'expense').reduce((s, t) => s + t.amount, 0)
  const eventExpense        = MOCK_TRANSACTIONS.filter((t) => t.category === 'event'   && t.entry_type === 'expense').reduce((s, t) => s + t.amount, 0)
  const utilities           = getUtilitiesWithBalance()   // paid amount derived from approved payments
  const utilityExpense      = sumMoney(utilities.map((u) => u.amount_paid))
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
  const utilByType = utilities.reduce((acc: Record<string, number>, u) => {
    acc[u.expense_type] = (acc[u.expense_type] || 0) + u.amount_paid
    return acc
  }, {} as Record<string, number>)

  // Fund per-fund breakdown
  const fundRows = fundsWithBalance.map((f) => {
    const received = sumMoney(MOCK_TRANSACTIONS.filter((t) => t.fund_id === f.id && isReceipt(t)).map((t) => t.amount))   // opening balances are not 'received'
    const spent    = sumMoney(MOCK_TRANSACTIONS.filter((t) => t.fund_id === f.id && t.entry_type === 'expense').map((t) => t.amount))
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
