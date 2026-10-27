// itemDetail/itemDetailData.ts — Pure data for the detail panel: filtered transactions/attendance, totals, info-grid rows
import { formatCurrency, formatDate, MOCK_TRANSACTIONS, MOCK_ATTENDANCES, fmt12 } from '../../api/mockData'
import { capitalize } from '../../utils/formatters'
import type { ItemKind } from './itemDetailShared'
import type { Project, AppEvent, ProjectWithFunding, EventWithFunding, OrgConfig, Transaction, Attendance } from '../../types'

// belongsToItem — true when the transaction is linked (project_id / event_id) to this exact item
export function belongsToItem(t: Transaction, item: Project | AppEvent, kind: ItemKind): boolean {
  return kind === 'project' ? t.project_id === item.id : t.event_id === item.id
}

// getItemDetailData — contributions / external income / expenses linked to the item, attendance by title, and the totals
export function getItemDetailData(item: Project | AppEvent, kind: ItemKind) {
  const scoped = MOCK_TRANSACTIONS.filter((t: Transaction) => belongsToItem(t, item, kind))
  const memberContribs  = scoped.filter((t) => t.user_id !== null && t.entry_type === 'contribution')
  const externalIncome  = scoped.filter((t) => t.user_id === null && t.entry_type === 'income')
  const externalExpense = scoped.filter((t) => t.entry_type === 'expense')
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
export function buildDetailRows(item: ProjectWithFunding | EventWithFunding, kind: ItemKind, org: OrgConfig): [string, string][] {
  const isProject = kind === 'project'
  return [
    ['Status',   capitalize(item.status)],
    isProject
      ? ['Duration',    `${formatDate((item as Project).start_date)} – ${formatDate((item as Project).end_date)}`]
      : ['Date & Time', `${formatDate((item as AppEvent).event_date)}${(item as AppEvent).event_time ? ' · ' + fmt12((item as AppEvent).event_time) : ''}`],
    ['Location',        item.location || '—'],
    ['Type', capitalize(isProject ? (item as Project).project_type : (item as AppEvent).event_type)],
    ['Target Funding',  item.target_funding  > 0 ? formatCurrency(item.target_funding,  org.currency_symbol) : 'Not Required'],
    ['Current Funding', item.current_funding > 0 ? formatCurrency(item.current_funding, org.currency_symbol) : '—'],
  ].filter((row, idx, arr) =>
    // Remove duplicate Status row if it appears more than once
    !(row[0] === 'Status' && arr.findIndex(r => r[0] === 'Status') !== idx)
  ) as [string, string][]
}
