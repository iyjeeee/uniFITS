// parts/transactionsShared.ts — Types, constants and status normalisation for the Transactions page parts
import type { Transaction } from '../../../types'

export const TX_PAGE_SIZE = 10

// Rows on this page use a simplified 3-state approval status (mapped from the stored status in normaliseTransaction)
export type TxRow = Omit<Transaction, 'status'> & { status: 'approved' | 'rejected' | 'pending' }

// TransactionActionResult — feedback shown in the ResponseModal after approve/reject/delete
export interface TransactionActionResult { variant: string; title: string; message: string }

export const TX_TYPE_OPTIONS   = ['all', 'contribution', 'income', 'expense']
export const TX_STATUS_OPTIONS = ['all', 'approved', 'pending', 'rejected']

/* Normalise mock data — map old status values to pending/approved/rejected (cancelled and anything else become pending — see bug log) */
export const normaliseTransaction = (t: Transaction): TxRow => ({
  ...t,
  status: t.status === 'completed' ? 'approved'
         : t.status === 'failed'   ? 'rejected'
         : 'pending',
})
