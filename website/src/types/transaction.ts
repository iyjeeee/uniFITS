// types/transaction.ts — Transaction, Utility, and PaymentMethod type definitions

export type EntryType = 'contribution' | 'income' | 'expense'
export type TransactionCategory = 'fund' | 'project' | 'event'
export type TransactionStatus = 'completed' | 'pending' | 'failed' | 'cancelled'
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
  amount: number              // PHP amount
  payment_method: PaymentMethod
  reference_number: string    // 'TXN-YYYYMMDD-XXXX'
  transaction_date: string    // 'YYYY-MM-DD'
  status: TransactionStatus
  description: string
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
