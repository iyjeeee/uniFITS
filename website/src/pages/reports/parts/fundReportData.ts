// parts/fundReportData.ts — Pure data for the fund detail: per-member contributions to one fund (matched by fund_id)
import { MOCK_USERS, MOCK_TRANSACTIONS } from '../../../api/mockData'
import type { Fund } from '../../../types'

export function getFundContributions(fund: Fund) {
  // Build member contribution list for this fund
  const memberContribs = MOCK_USERS.map(user => {
    const txns = MOCK_TRANSACTIONS.filter((t) =>
      t.user_id === user.id &&
      t.fund_id === fund.id &&
      t.entry_type !== 'expense'
    )
    const total = txns.reduce((s, t) => s + t.amount, 0)
    return { user, txns, total }
  }).sort((a, b) => b.total - a.total) // sort by contribution descending

  const grandTotal = memberContribs.reduce((s, m) => s + m.total, 0)
  const contributors = memberContribs.filter((m) => m.total > 0)
  const nonContribs  = memberContribs.filter((m) => m.total === 0)
  return { memberContribs, grandTotal, contributors, nonContribs }
}
