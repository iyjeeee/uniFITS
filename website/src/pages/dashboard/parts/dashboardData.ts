// parts/dashboardData.ts — Chart data DERIVED from the records: monthly income/expense, fund balances, project status counts (B-03, B-24)
import { MONTH_NAMES } from '../../../constants/calendar'
import { ledgerTotals, approvedTx } from '../../../utils/ledger'
import { approvedOnly } from '../../../utils/approvals'
import type { Transaction, FundWithBalance, Project } from '../../../types'

export interface MonthlyPoint { month: string; income: number; expense: number }
export interface FundPoint    { name: string; balance: number }
export interface StatusPoint  { label: string; count: number; color: string }

const MONTHS_SHOWN = 6
const FUND_BARS    = 8   // largest funds only, so the card stays readable

// getMonthlyData -- the 6 months ending at the latest approved activity (or the current month when there is none); opening balances are not activity
export function getMonthlyData(txs: Transaction[], today: string): MonthlyPoint[] {
  const ok = approvedTx(txs)
  const dates = ok.filter((t) => t.entry_type !== 'opening_balance' && t.transaction_date <= today).map((t) => t.transaction_date).sort()
  const last = dates.length ? dates[dates.length - 1] : today
  let y = Number(last.slice(0, 4)), m = Number(last.slice(5, 7))   // m = 1..12
  const points: MonthlyPoint[] = []
  for (let i = 0; i < MONTHS_SHOWN; i++) {
    const key = `${y}-${String(m).padStart(2, '0')}`
    const { income, expense } = ledgerTotals(ok.filter((t) => t.transaction_date.startsWith(key)))
    points.unshift({ month: `${MONTH_NAMES[m - 1].slice(0, 3)} ${String(y).slice(2)}`, income, expense })
    if (--m === 0) { m = 12; y-- }
  }
  return points
}

// getFundPoints -- real fund names with their derived balances, largest first
export function getFundPoints(funds: FundWithBalance[]): FundPoint[] {
  return funds.map((f) => ({ name: f.name, balance: f.balance })).sort((a, b) => b.balance - a.balance).slice(0, FUND_BARS)
}

// getStatusBreakdown -- approved projects counted by lifecycle status (pending / rejected projects are not counted)
export function getStatusBreakdown(projects: Project[]): StatusPoint[] {
  const live = approvedOnly(projects)
  const count = (s: Project['status']) => live.filter((p) => p.status === s).length
  return [
    { label: 'Completed', count: count('completed'), color: '#2E7D52' },
    { label: 'Ongoing',   count: count('ongoing'),   color: '#4B5EAA' },
    { label: 'Upcoming',  count: count('upcoming'),  color: '#D4860A' },
    { label: 'Cancelled', count: count('cancelled'), color: '#C0392B' },
  ]
}
