// parts/fundsShared.ts — Types shared by the Funds page pieces
import type { FundWithBalance } from '../../../types'


// Edit form — annual_fee stays string|number|null: the number input yields strings (converted to number on save)
export type FundEditState = Omit<FundWithBalance, 'annual_fee'> & { annual_fee: number | string | null }
