// parts/addTransactionShared.ts — Wizard steps, empty form and summary rows (used by the live preview and the review step)
import { MOCK_USERS, MOCK_FUNDS, MOCK_PAYMENT_METHODS } from '../../../api/mockData'
import { capitalize } from '../../../utils/formatters'
import type { OrgConfig } from '../../../types'

export const ADD_TX_STEPS = ['Source', 'Payment', 'Entry Type', 'Category', 'Amount', 'Review']

export const EMPTY_TX_FORM: Record<string, string> = {
  source: '', user_id: '', payment_method_id: '',
  entry_type: '', category: '', activity_id: '',
  fund_id: '', amount: '', notes: '',
}

// getSummaryRows — label/value rows; review = true uses "External" as the person for external sources
// (the selected activity is not shown in either view — see bug log)
export function getSummaryRows(form: Record<string, string>, org: OrgConfig, review: boolean): [string, string][] {
  const selectedUser   = MOCK_USERS.find((u) => u.id === form.user_id)
  const selectedMethod = MOCK_PAYMENT_METHODS.find((m) => m.id === form.payment_method_id)
  const selectedFund   = MOCK_FUNDS.find((f) => f.id === form.fund_id)
  return [
    ['Source',          capitalize(form.source)],
    ['Member / Person', selectedUser?.full_name || (review && form.source === 'external' ? 'External' : '—')],
    ['Payment Method',  selectedMethod?.name   || '—'],
    ['Entry Type',      capitalize(form.entry_type)],
    ['Category',        capitalize(form.category)],
    ['Fund',            selectedFund?.name     || '—'],
    ['Amount',          form.amount ? `${org.currency_symbol}${form.amount}` : '—'],
    ['Notes',           form.notes || '—'],
  ]
}
