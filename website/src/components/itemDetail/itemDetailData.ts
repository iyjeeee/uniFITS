// itemDetail/itemDetailData.ts — Pure data for the detail panel: filtered transactions/attendance, totals, info-grid rows
import { formatCurrency, formatDate, MOCK_TRANSACTIONS, MOCK_ATTENDANCES, fmt12 } from '../../api/mockData'
import { capitalize } from '../../utils/formatters'
import type { ItemKind } from './itemDetailShared'
import type { Project, AppEvent, OrgConfig, Transaction, Attendance } from '../../types'

// getItemDetailData — contributions / external income / expenses of the item's category, attendance by title, and the totals
export function getItemDetailData(item: Project | AppEvent, kind: ItemKind) {
  const isProject = kind === 'project'
  const memberContribs = MOCK_TRANSACTIONS.filter((t: Transaction) =>
    t.user_id !== null &&
    t.entry_type === 'contribution' &&
    (isProject ? t.category === 'project' : t.category === 'event')
  )
  const externalIncome = MOCK_TRANSACTIONS.filter((t: Transaction) =>
    t.user_id === null &&
    t.entry_type === 'income' &&
    (isProject ? t.category === 'project' : t.category === 'event')
  )
  const externalExpense = MOCK_TRANSACTIONS.filter((t: Transaction) =>
    t.entry_type === 'expense' &&
    (isProject ? t.category === 'project' : t.category === 'event')
  )
  const attendanceRecords = MOCK_ATTENDANCES.filter((r: Attendance) => r.activity === item.title)
  const totalContrib = memberContribs.reduce((s, t) => s + t.amount, 0)
  const totalExtInc  = externalIncome.reduce((s, t) => s + t.amount, 0)
  const totalExtExp  = externalExpense.reduce((s, t) => s + t.amount, 0)
  const totalInflow  = totalContrib + totalExtInc
  const netBalance   = totalInflow - totalExtExp
  return { memberContribs, externalIncome, externalExpense, attendanceRecords, totalContrib, totalExtInc, totalExtExp, totalInflow, netBalance }
}

export type ItemDetailData = ReturnType<typeof getItemDetailData>

// buildDetailRows — info grid rows: shared + kind-specific (the duplicate Status row is filtered out)
export function buildDetailRows(item: Project | AppEvent, kind: ItemKind, org: OrgConfig): [string, string][] {
  const isProject = kind === 'project'
  return [
    ['Status',   capitalize(item.status)],
    isProject
      ? ['Duration',    `${formatDate((item as Project).start_date)} – ${formatDate((item as Project).end_date)}`]
      : ['Date & Time', `${formatDate((item as AppEvent).event_date)}${(item as AppEvent).event_time ? ' · ' + fmt12((item as AppEvent).event_time) : ''}`],
    ['Location',        item.location || '—'],
    isProject ? ['Type', capitalize((item as Project).project_type)] : ['Status', capitalize(item.status)],
    ['Target Funding',  item.target_funding  > 0 ? formatCurrency(item.target_funding,  org.currency_symbol) : 'Not Required'],
    ['Current Funding', item.current_funding > 0 ? formatCurrency(item.current_funding, org.currency_symbol) : '—'],
  ].filter((row, idx, arr) =>
    // Remove duplicate Status row if it appears more than once
    !(row[0] === 'Status' && arr.findIndex(r => r[0] === 'Status') !== idx)
  ) as [string, string][]
}
