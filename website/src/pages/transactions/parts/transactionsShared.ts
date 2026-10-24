// parts/transactionsShared.ts — Constants and action-result type for the Transactions page parts
export const TX_PAGE_SIZE = 10

// TransactionActionResult — feedback shown in the ResponseModal after approve/reject/delete
export interface TransactionActionResult { variant: string; title: string; message: string }

export const TX_TYPE_OPTIONS   = ['all', 'contribution', 'income', 'expense', 'refund', 'opening_balance']
export const TX_STATUS_OPTIONS = ['all', 'approved', 'pending', 'rejected', 'voided']
