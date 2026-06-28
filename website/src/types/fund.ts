// types/fund.ts — Fund type definitions

export type FundType = 'internal' | 'external'
export type FundStatus = 'active' | 'inactive'
export type PaymentFrequency = 'monthly' | 'annually' | null

// Fund — matches MOCK_FUNDS + backend funds table
export interface Fund {
  id: string
  name: string
  description: string
  fund_type: FundType
  is_required: boolean        // true = all members must contribute
  status: FundStatus
  balance: number             // current PHP balance
  currency: string            // always 'PHP'
  created_by: string          // full name string
  payment_frequency: PaymentFrequency
  annual_fee: number | null   // PHP amount, null if not applicable
}
