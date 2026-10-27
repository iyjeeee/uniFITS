// utils/ledger.ts -- the ONE place for money rules: direction, what counts, exact sums, overdraw guard (mirrors schema.sql)
import type { Transaction, UtilityStatus } from '../types'

type Entry = Pick<Transaction, 'entry_type'>

/* sumMoney -- add amounts in whole centavos so decimals never drift (0.1 + 0.2 = 0.3) */
export function sumMoney(values: number[]): number {
  return values.reduce((s, v) => s + Math.round(v * 100), 0) / 100
}

/* signedAmount -- inflow (+): income, contribution, opening_balance; outflow (-): expense, refund */
export function signedAmount(t: Pick<Transaction, 'entry_type' | 'amount'>): number {
  return t.entry_type === 'expense' || t.entry_type === 'refund' ? -t.amount : t.amount
}

/* isReceipt -- money received during activity (income or member contribution); opening balances and refunds are not */
export function isReceipt(t: Entry): boolean {
  return t.entry_type === 'income' || t.entry_type === 'contribution'
}

/* fundBalance -- sum of APPROVED entries of one fund (pending, rejected and voided never count) */
export function fundBalance(fundId: string, txs: Transaction[]): number {
  return sumMoney(txs.filter((t) => t.fund_id === fundId && t.status === 'approved').map(signedAmount))
}

/* overdrawOnApprove -- would approving tx push its fund below zero? (only outflows with a fund can) */
export function overdrawOnApprove(tx: Transaction, txs: Transaction[]): { overdraws: boolean; balance: number } {
  if (!tx.fund_id) return { overdraws: false, balance: 0 }
  const balance = fundBalance(tx.fund_id, txs.filter((t) => t.id !== tx.id))   // balance without tx itself
  return { overdraws: signedAmount(tx) < 0 && sumMoney([balance, signedAmount(tx)]) < 0, balance }
}

/* utilityPaid -- approved payments (expense) minus approved refunds recorded against one bill */
export function utilityPaid(utilityId: string, txs: Transaction[]): number {
  return sumMoney(txs.filter((t) => t.utility_id === utilityId && t.status === 'approved')
    .map((t) => (t.entry_type === 'expense' ? t.amount : t.entry_type === 'refund' ? -t.amount : 0)))
}

/* utilityStatus -- unpaid (nothing paid), partial (some), paid (the whole bill or more) */
export function utilityStatus(total: number, paid: number): UtilityStatus {
  return paid <= 0 ? 'unpaid' : paid >= total ? 'paid' : 'partial'
}

/* fundingRaised -- money raised for ONE project/event: approved contributions + income + opening entry - refunds (expenses never reduce it) */
export function fundingRaised(kind: 'project' | 'event', id: string, txs: Transaction[]): number {
  return sumMoney(txs.filter((t) => t.status === 'approved' && (kind === 'project' ? t.project_id === id : t.event_id === id))
    .map((t) => (t.entry_type === 'refund' ? -t.amount : t.entry_type === 'expense' ? 0 : t.amount)))
}
