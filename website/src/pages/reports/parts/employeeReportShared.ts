// parts/employeeReportShared.ts — Constants, types and the recent-transactions rule shared by the Employee report parts
import { MOCK_TRANSACTIONS } from '../../../api/mockData'
import { approvedTx } from '../../../utils/ledger'
import type { Transaction } from '../../../types'

export const LIST_PAGE_SIZE = 8   // rows per page in the All Employees modal

// EmployeeReportExportResult — feedback shown after Export PDF
export interface EmployeeReportExportResult { variant: string; title: string; message: string }

// getRecentTransactions -- the person's latest APPROVED rows, newest first (same-day ties: newest id first), at most 6
export function getRecentTransactions(userId: string | undefined, txs: Transaction[] = MOCK_TRANSACTIONS): Transaction[] {
  return approvedTx(txs).filter((t) => t.user_id === userId)
    .sort((a, b) => b.transaction_date.localeCompare(a.transaction_date) || b.id.localeCompare(a.id, undefined, { numeric: true })).slice(0, 6)
}
