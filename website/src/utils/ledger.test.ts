// ledger.test.ts -- money maths and balance rules (direction, approved-only, exact sums, overdraw guard)
import { describe, it, expect } from 'vitest'
import { signedAmount, isReceipt, sumMoney, fundBalance, overdrawOnApprove, utilityPaid, utilityStatus, fundingRaised, isOutflow, approvedTx, ledgerTotals } from './ledger'
import type { Transaction, EntryType, TransactionStatus } from '../types'

let n = 0
const tx = (entry_type: EntryType, amount: number, status: TransactionStatus = 'approved', fund_id: string | null = 'F1'): Transaction => ({
  id: String(++n), user_id: null, entry_type, category: 'fund', fund_id, amount, payment_method_id: null,
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

describe('utilityPaid / utilityStatus', () => {
  const pay = (utility_id: string, entry_type: EntryType, amount: number, status: TransactionStatus = 'approved'): Transaction =>
    ({ ...tx(entry_type, amount, status, 'F1'), category: 'utility', utility_id })
  it('paid = approved expense payments minus approved refunds of THAT bill only', () => {
    const all = [pay('U1', 'expense', 400), pay('U1', 'expense', 100.1), pay('U1', 'refund', 50), pay('U1', 'expense', 999, 'pending'),
      pay('U1', 'expense', 999, 'rejected'), pay('U1', 'expense', 999, 'voided'), pay('U2', 'expense', 7), tx('expense', 5000)]
    expect(utilityPaid('U1', all)).toBe(450.1)
    expect(utilityPaid('U2', all)).toBe(7)
    expect(utilityPaid('none', all)).toBe(0)
  })
  it('status follows the paid amount against the bill', () => {
    expect(utilityStatus(1000, 0)).toBe('unpaid')
    expect(utilityStatus(1000, 0.01)).toBe('partial')
    expect(utilityStatus(1000, 999.99)).toBe('partial')
    expect(utilityStatus(1000, 1000)).toBe('paid')
    expect(utilityStatus(1000, 1200)).toBe('paid')     // overpayment still reads as paid
    expect(utilityStatus(1000, -50)).toBe('unpaid')    // refunds beyond payments never go negative
  })
})

describe('fundingRaised (projects and events)', () => {
  const pt = (kind: 'project' | 'event', id: string, entry_type: EntryType, amount: number, status: TransactionStatus = 'approved'): Transaction =>
    ({ ...tx(entry_type, amount, status, null), category: kind, ...(kind === 'project' ? { project_id: id } : { event_id: id }) })
  it('= contributions + income + opening entry - refunds, approved only; expenses never reduce it', () => {
    const all = [pt('project', 'P1', 'contribution', 300), pt('project', 'P1', 'income', 100), pt('project', 'P1', 'opening_balance', 1000),
      pt('project', 'P1', 'refund', 50), pt('project', 'P1', 'expense', 200),
      pt('project', 'P1', 'income', 9999, 'pending'), pt('project', 'P1', 'income', 9999, 'rejected'), pt('project', 'P1', 'income', 9999, 'voided'),
      pt('project', 'P2', 'income', 7), pt('event', 'P1', 'income', 5)]
    expect(fundingRaised('project', 'P1', all)).toBe(1350)
    expect(fundingRaised('project', 'P2', all)).toBe(7)
    expect(fundingRaised('event', 'P1', all)).toBe(5)       // an event with the same id is a different thing
    expect(fundingRaised('project', 'none', all)).toBe(0)
  })
  it('adds exact centavos', () => {
    expect(fundingRaised('event', 'E', [pt('event', 'E', 'income', 0.1), pt('event', 'E', 'income', 0.2)])).toBe(0.3)
  })
})

// ── Phase 3: isOutflow / approvedTx / ledgerTotals (B-27, B-39, B-80) ─────────────────
describe('isOutflow', () => {
  it('expense and refund leave the fund; everything else comes in', () => {
    expect(isOutflow({ entry_type: 'expense' })).toBe(true); expect(isOutflow({ entry_type: 'refund' })).toBe(true)
    for (const e of ['income', 'contribution', 'opening_balance'] as const) expect(isOutflow({ entry_type: e })).toBe(false)
  })
})
describe('approvedTx / ledgerTotals', () => {
  const mk = (id: string, entry_type: Transaction['entry_type'], amount: number, status: Transaction['status'] = 'approved'): Transaction =>
    ({ id, user_id: null, entry_type, category: 'fund', fund_id: '1', amount, payment_method_id: null, reference_number: id, transaction_date: '2025-03-01', status, description: '' })
  const all = [mk('1', 'contribution', 100), mk('2', 'income', 50), mk('3', 'expense', 30), mk('4', 'refund', 20), mk('5', 'opening_balance', 999),
    mk('6', 'contribution', 1000, 'pending'), mk('7', 'income', 1000, 'rejected'), mk('8', 'expense', 1000, 'voided')]
  it('keeps only approved rows', () => { expect(approvedTx(all).map((t) => t.id)).toEqual(['1', '2', '3', '4', '5']) })
  it('income = receipts - refunds, expense, net; opening balances and non-approved rows never count', () => {
    expect(ledgerTotals(all)).toEqual({ income: 130, expense: 30, net: 100 })
  })
  it('exact centavos', () => { expect(ledgerTotals([mk('a', 'income', 0.1), mk('b', 'income', 0.2)]).income).toBe(0.3) })
  it('empty list is all zeros', () => { expect(ledgerTotals([])).toEqual({ income: 0, expense: 0, net: 0 }) })
})
