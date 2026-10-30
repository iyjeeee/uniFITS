// parts/clubReportStats.ts — Club report figures for ONE period from the approved records: income/expense lines, fund sheet (opening + received - spent = balance), member/project/event stats
import { MOCK_USERS, MOCK_PROJECTS, MOCK_EVENTS, MOCK_TRANSACTIONS, getFundsWithBalance, getUtilitiesWithBalance, isOfficer } from '../../../api/mockData'
import { isReceipt, isOutflow, signedAmount, sumMoney, approvedTx } from '../../../utils/ledger'
import { approvedOnly } from '../../../utils/approvals'
import { inRange } from '../../../utils/period'
import type { PeriodRange } from '../../../utils/period'
import type { Transaction } from '../../../types'

// range = the report period (null = all time); txs is a parameter so tests can feed pending / rejected rows
export function getClubReportStats(range: PeriodRange | null = null, txs: Transaction[] = MOCK_TRANSACTIONS) {
  const ok       = approvedTx(txs)   // only approved entries count
  const inPeriod = ok.filter((t) => inRange(t.transaction_date, range))
  const funds    = getFundsWithBalance()   // fund list (names, types); balances are recomputed below for the chosen period

  // Income lines -- receipts minus refunds, by what the money was for (a project's contribution is project income, not member dues)
  const net = (rows: Transaction[]) => sumMoney(rows.map((t) => (t.entry_type === 'refund' ? -t.amount : t.amount)))
  const money      = inPeriod.filter((t) => isReceipt(t) || t.entry_type === 'refund')
  const memberDues    = net(money.filter((t) => t.category === 'fund' && t.entry_type === 'contribution'))
  const projectIncome = net(money.filter((t) => t.category === 'project'))
  const eventIncome   = net(money.filter((t) => t.category === 'event'))
  const fundIncome    = net(money.filter((t) => t.category !== 'project' && t.category !== 'event' && !(t.category === 'fund' && t.entry_type === 'contribution')))
  const totalIncome   = sumMoney([memberDues, projectIncome, eventIncome, fundIncome])

  // Expense lines -- every expense lands in exactly one line (utility bills and other fund expenses are "operational")
  const expenses       = inPeriod.filter((t) => t.entry_type === 'expense')
  const sumOf          = (rows: Transaction[]) => sumMoney(rows.map((t) => t.amount))
  const projectExpense = sumOf(expenses.filter((t) => t.category === 'project'))
  const eventExpense   = sumOf(expenses.filter((t) => t.category === 'event'))
  const operational    = expenses.filter((t) => t.category !== 'project' && t.category !== 'event')
  const utilityExpense = sumOf(operational)
  const totalExpense   = sumMoney([projectExpense, eventExpense, utilityExpense])
  const netSurplus     = sumMoney([totalIncome, -totalExpense])

  // Operational breakdown by the bill's expense type; payments not tied to a known bill are grouped as "Other"
  const typeOf = new Map(getUtilitiesWithBalance().map((u) => [u.id, u.expense_type]))
  const utilByType = operational.reduce((acc: Record<string, number>, t) => {
    const type = (t.utility_id && typeOf.get(t.utility_id)) || 'Other'
    acc[type] = sumMoney([acc[type] || 0, t.amount]); return acc
  }, {} as Record<string, number>)

  // Fund sheet -- opening (balance before the period + opening entries inside it) + received - spent = balance at the END of the period
  const fundRows = funds.map((f) => {
    const mine     = ok.filter((t) => t.fund_id === f.id)
    const before   = range ? sumMoney(mine.filter((t) => t.transaction_date < range.from).map(signedAmount)) : 0
    const inside   = mine.filter((t) => inRange(t.transaction_date, range))
    const opening  = sumMoney([before, ...inside.filter((t) => t.entry_type === 'opening_balance').map((t) => t.amount)])
    const received = sumMoney(inside.filter(isReceipt).map((t) => t.amount))
    const spent    = sumMoney(inside.filter(isOutflow).map((t) => t.amount))   // expenses and refunds both leave the fund
    return { ...f, opening, received, spent, balance: sumMoney([opening, received, -spent]) }
  })
  const totalFundBalance = sumMoney(fundRows.map((f) => f.balance))

  // Member stats (current people, not period-bound)
  const activeMembers  = MOCK_USERS.filter((u) => u.status === 'active').length
  const officers       = MOCK_USERS.filter(isOfficer).length
  const regularMembers = MOCK_USERS.filter((u) => !isOfficer(u)).length

  // Project / event stats: status snapshot of approved items; "events held" is limited to the period
  const projects          = approvedOnly(MOCK_PROJECTS)   // pending / rejected items are not counted
  const events            = approvedOnly(MOCK_EVENTS)
  const completedProjects = projects.filter((p) => p.status === 'completed').length
  const ongoingProjects   = projects.filter((p) => p.status === 'ongoing').length
  const completedEvents   = events.filter((e) => e.status === 'completed' && inRange(e.event_date, range)).length
  const upcomingEvents    = events.filter((e) => e.status === 'upcoming').length

  return {
    totalFundBalance, memberDues, projectIncome, eventIncome, fundIncome, totalIncome,
    projectExpense, eventExpense, utilityExpense, totalExpense, netSurplus,
    activeMembers, officers, regularMembers, completedProjects, ongoingProjects, completedEvents, upcomingEvents,
    totalProjects: projects.length, totalEvents: events.length,   // approved only
    utilByType, fundRows,
  }
}

export type ClubReportStats = ReturnType<typeof getClubReportStats>
