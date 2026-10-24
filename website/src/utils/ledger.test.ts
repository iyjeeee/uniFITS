// ledger.test.ts -- money maths and balance rules (direction, approved-only, exact sums, overdraw guard)
import { describe, it, expect } from 'vitest'
import { signedAmount, isReceipt, sumMoney, fundBalance, overdrawOnApprove } from './ledger'
import type { Transaction, EntryType, TransactionStatus } from '../types'

let n = 0
const tx = (entry_type: EntryType, amount: number, status: TransactionStatus = 'approved', fund_id: string | null = 'F1'): Transaction => ({
  id: String(++n), user_id: null, user_name: null, entry_type, category: 'fund', fund_id, amount, payment_method: null,
  reference_number: `T${n}`, transaction_date: '2025-01-01', status, description: '',
})

describe('signedAmount / isReceipt', () => {
  it('inflows add, outflows subtract', () => {
    expect(signedAmount(tx('income', 10))).toBe(10)
    expect(signedAmount(tx('contribution', 10))).toBe(10)
    expect(signedAmount(tx('opening_balance', 10))).toBe(10)
    expect(signedAmount(tx('expense', 10))).toBe(-10)
    expect(signedAmount(tx('refund', 10))).toBe(-10)
  })
  it('only income and contribution are receipts (opening balance and refund are not)', () => {
    expect(isReceipt(tx('income', 1))).toBe(true)
    expect(isReceipt(tx('contribution', 1))).toBe(true)
    expect(isReceipt(tx('opening_balance', 1))).toBe(false)
    expect(isReceipt(tx('refund', 1))).toBe(false)
    expect(isReceipt(tx('expense', 1))).toBe(false)
  })
})

describe('sumMoney', () => {
  it('adds in whole centavos (no 0.1 + 0.2 drift)', () => {
    expect(0.1 + 0.2).not.toBe(0.3)
    expect(sumMoney([0.1, 0.2])).toBe(0.3)
    expect(sumMoney(Array(10).fill(0.1))).toBe(1)
    expect(sumMoney([1200.55, 99.45, -300.1])).toBe(999.9)
    expect(sumMoney([])).toBe(0)
  })
})

describe('fundBalance', () => {
  it('counts approved entries only, per fund', () => {
    const all = [tx('opening_balance', 1000), tx('income', 500), tx('expense', 200), tx('refund', 50),
      tx('income', 9999, 'pending'), tx('income', 9999, 'rejected'), tx('income', 9999, 'voided'), tx('income', 777, 'approved', 'F2')]
    expect(fundBalance('F1', all)).toBe(1250)
    expect(fundBalance('F2', all)).toBe(777)
    expect(fundBalance('none', all)).toBe(0)
  })
})

describe('overdrawOnApprove', () => {
  const base = [tx('opening_balance', 1000)]
  it('blocks an expense bigger than the balance and reports the balance', () => {
    const big = tx('expense', 1000.01, 'pending')
    expect(overdrawOnApprove(big, [...base, big])).toEqual({ overdraws: true, balance: 1000 })
  })
  it('allows spending the balance down to exactly zero', () => {
    const all = tx('expense', 1000, 'pending')
    expect(overdrawOnApprove(all, [...base, all]).overdraws).toBe(false)
  })
  it('a pending inflow does not make room', () => {
    const pendingIn = tx('income', 5000, 'pending'); const out = tx('expense', 2000, 'pending')
    expect(overdrawOnApprove(out, [...base, pendingIn, out]).overdraws).toBe(true)
  })
  it('refunds are outflows too', () => {
    const r = tx('refund', 1500, 'pending')
    expect(overdrawOnApprove(r, [...base, r]).overdraws).toBe(true)
  })
  it('inflows and entries with no fund are never blocked', () => {
    const inflow = tx('income', 1, 'pending'); const noFund = tx('expense', 999999, 'pending', null)
    expect(overdrawOnApprove(inflow, [...base, inflow]).overdraws).toBe(false)
    expect(overdrawOnApprove(noFund, [...base, noFund]).overdraws).toBe(false)
  })
})
