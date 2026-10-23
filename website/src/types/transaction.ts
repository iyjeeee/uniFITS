// types/transaction.ts — Transaction, Utility, and PaymentMethod type definitions

export type EntryType = 'contribution' | 'income' | 'expense' | 'refund' | 'opening_balance'   // inflow: contribution/income/opening_balance; outflow: expense/refund
export type TransactionCategory = 'fund' | 'project' | 'event' | 'utility'
export type TransactionStatus = 'pending' | 'approved' | 'rejected' | 'voided'   // only 'approved' counts in totals (rule applied from the numbers phase)
export type PaymentMethod = 'Cash' | 'GCash' | 'Bank Transfer' | 'PayMaya' | 'Cheque'
export type UtilityStatus = 'paid' | 'unpaid' | 'partial'

// Transaction — matches MOCK_TRANSACTIONS + backend transactions table
export interface Transaction {
  id: string
  user_id: string | null      // null for external/org-level transactions
  user_name: string | null    // null for external/org-level transactions
  entry_type: EntryType
  category: TransactionCategory
  fund: string                // fund name string
  project_id?: string | null  // set when category is 'project' (FK to projects.id)
  event_id?: string | null    // set when category is 'event' (FK to events.id)
  amount: number              // PHP amount
  payment_method: PaymentMethod
  reference_number: string    // 'TXN-YYYYMMDD-XXXX'
  transaction_date: string    // 'YYYY-MM-DD'
  status: TransactionStatus
  description: string
  notes?: string | null       // optional free-text note (not in mock data yet)
}

// Utility — matches MOCK_UTILITIES + backend utilities table (org expenses)
export interface Utility {
  id: string
  expense_type: string        // e.g. 'Electricity Bill', 'Office Rent'
  total_amount: number        // PHP amount billed
  amount_paid: number         // PHP amount paid so far
  payment_date: string        // 'YYYY-MM-DD'
  paid_to: string             // vendor/payee name
  fund: string                // fund name string used for this expense
  status: UtilityStatus
  notes: string | null
}

// PaymentMethod option — matches MOCK_PAYMENT_METHODS
export interface PaymentMethodOption {
  id: string
  name: PaymentMethod
  is_active: boolean
}
