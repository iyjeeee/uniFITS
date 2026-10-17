// transactions.parts.test.ts — status normalisation used by the Transactions page
import { describe, it, expect } from 'vitest'
import { normaliseTransaction } from '../pages/transactions/parts/transactionsShared'
import { MOCK_TRANSACTIONS } from '../api/mockData'

describe('normaliseTransaction', () => {
  const base = MOCK_TRANSACTIONS[0]
  it('maps completed -> approved and failed -> rejected', () => {
    expect(normaliseTransaction({ ...base, status: 'completed' }).status).toBe('approved')
    expect(normaliseTransaction({ ...base, status: 'failed' }).status).toBe('rejected')
  })
  it('maps pending and cancelled -> pending (cancelled is not preserved — see bug log)', () => {
    expect(normaliseTransaction({ ...base, status: 'pending' }).status).toBe('pending')
    expect(normaliseTransaction({ ...base, status: 'cancelled' }).status).toBe('pending')
  })
  it('keeps every other field', () => {
    const row = normaliseTransaction(base)
    expect(row.id).toBe(base.id)
    expect(row.amount).toBe(base.amount)
    expect(row.reference_number).toBe(base.reference_number)
  })
})
