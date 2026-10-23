// transactions.parts.test.ts -- transaction status set used by mock data and the Transactions page filters
import { describe, it, expect } from 'vitest'
import { TX_STATUS_OPTIONS } from '../pages/transactions/parts/transactionsShared'
import { MOCK_TRANSACTIONS } from '../api/mockData'
import { STATUS_BORDER, STATUS_BG, STATUS_ACCENT } from '../constants/tableColors'
import type { TransactionStatus } from '../types'

const ALL_STATUSES: TransactionStatus[] = ['pending', 'approved', 'rejected', 'voided']

describe('transaction statuses', () => {
  it('every mock transaction uses the pending/approved/rejected/voided set', () => {
    for (const t of MOCK_TRANSACTIONS) expect(ALL_STATUSES).toContain(t.status)
  })
  it('the status filter offers every status', () => {
    for (const s of ALL_STATUSES) expect(TX_STATUS_OPTIONS).toContain(s)
  })
  it('every status has a row border, hover tint and modal accent colour', () => {
    for (const s of ALL_STATUSES) {
      expect(STATUS_BORDER[s]).toBeTruthy()
      expect(STATUS_BG[s]).toBeTruthy()
      expect(STATUS_ACCENT[s]).toBeTruthy()
    }
  })
})
