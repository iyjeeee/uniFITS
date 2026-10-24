// types/fund.ts — Fund type definitions

export type FundType = 'internal' | 'external'
export type FundStatus = 'active' | 'inactive'
export type PaymentFrequency = 'monthly' | 'quarterly' | 'annually' | null

// Fund — matches MOCK_FUNDS + backend funds table
export interface Fund {
  id: string
  name: string
  description: string
  fund_type: FundType
  is_required: boolean        // true = all members must contribute
  status: FundStatus
  created_by: string          // full name string
  payment_frequency: PaymentFrequency
  annual_fee: number | null   // PHP amount, null if not applicable
}

// FundWithBalance -- Fund + derived balance (mirrors the fund_balances view): approved transactions only, never stored
export type FundWithBalance = Fund & { balance: number }
