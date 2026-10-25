// types/transaction.ts — Transaction, Utility, and PaymentMethod type definitions

export type EntryType = 'contribution' | 'income' | 'expense' | 'refund' | 'opening_balance'   // inflow: contribution/income/opening_balance; outflow: expense/refund
export type TransactionCategory = 'fund' | 'project' | 'event' | 'utility'
export type TransactionStatus = 'pending' | 'approved' | 'rejected' | 'voided'   // only 'approved' counts in balances (utils/ledger.ts); other totals follow in the numbers phase
export type UtilityStatus = 'paid' | 'unpaid' | 'partial'

// Transaction — matches MOCK_TRANSACTIONS + backend transactions table
export interface Transaction {
  id: string
  user_id: string | null      // null for external/org-level transactions
  user_name: string | null    // null for external/org-level transactions
  entry_type: EntryType
  category: TransactionCategory
  fund_id: string | null      // FK to funds.id (required when category is 'fund'); name via getFundName()
  project_id?: string | null  // set when category is 'project' (FK to projects.id)
  event_id?: string | null    // set when category is 'event' (FK to events.id)
  utility_id?: string | null  // set when category is 'utility' (FK to utilities.id) - a payment of that bill
  amount: number              // PHP amount
  payment_method_id: string | null   // FK to payment_methods.id; null for opening balances (no payment took place); name via getPaymentMethodName()
  reference_number: string    // 'TXN-YYYYMMDD-XXXX'
  transaction_date: string    // 'YYYY-MM-DD'
  status: TransactionStatus
  description: string
  notes?: string | null       // optional free-text note (not in mock data yet)
}

// Utility - the BILL; matches MOCK_UTILITIES + backend utilities table. Payments are transactions (category 'utility')
export interface Utility {
  id: string
  expense_type: string        // e.g. 'Electricity Bill', 'Office Rent'
  total_amount: number        // PHP amount billed
  due_date: string            // 'YYYY-MM-DD' - when the bill is due (payments carry their own dates)
  paid_to: string             // vendor/payee name
  fund_id: string | null      // FK to funds.id -- fund this bill is paid from; name via getFundName()
  notes: string | null
}

// UtilityWithBalance -- bill + DERIVED paid amount and status (mirrors the utility_balances view); never stored
export type UtilityWithBalance = Utility & { amount_paid: number; status: UtilityStatus }

// PaymentMethodOption - a payment method of the organisation; matches MOCK_PAYMENT_METHODS
export interface PaymentMethodOption {
  id: string
  name: string               // e.g. 'Cash', 'GCash' (organisation-defined list)
  is_active: boolean
}
