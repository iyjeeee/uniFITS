// parts/addTransactionShared.ts — Wizard steps, empty form and summary rows (used by the live preview and the review step)
import { MOCK_USERS, MOCK_FUNDS, MOCK_PAYMENT_METHODS, MOCK_PROJECTS, MOCK_EVENTS } from '../../../api/mockData'
import { capitalize } from '../../../utils/formatters'
import type { OrgConfig } from '../../../types'

export const ADD_TX_STEPS = ['Source', 'Payment', 'Entry Type', 'Category', 'Amount', 'Review']

export const EMPTY_TX_FORM: Record<string, string> = {
  source: '', user_id: '', payment_method_id: '',
  entry_type: '', category: '', activity_id: '',
  fund_id: '', amount: '', notes: '',
}

// getSummaryRows — label/value rows; review = true uses "External" as the person for external sources
// project / event categories show the chosen activity (named after the org label) instead of the fund row, because no fund is asked there (B-67)
export function getSummaryRows(form: Record<string, string>, org: OrgConfig, review: boolean): [string, string][] {
  const selectedUser   = MOCK_USERS.find((u) => u.id === form.user_id)
  const selectedMethod = MOCK_PAYMENT_METHODS.find((m) => m.id === form.payment_method_id)
  const selectedFund   = MOCK_FUNDS.find((f) => f.id === form.fund_id)
  const isProject      = form.category === 'project'
  const activity       = isProject ? MOCK_PROJECTS.find((p) => p.id === form.activity_id) : form.category === 'event' ? MOCK_EVENTS.find((e) => e.id === form.activity_id) : undefined
  const whereRow: [string, string] = isProject || form.category === 'event'
    ? [isProject ? org.project_label : org.event_label, activity?.title || '—']
    : ['Fund', selectedFund?.name || '—']
  return [
    ['Source',          capitalize(form.source)],
    ['Member / Person', selectedUser?.full_name || (review && form.source === 'external' ? 'External' : '—')],
    ['Payment Method',  selectedMethod?.name   || '—'],
    ['Entry Type',      capitalize(form.entry_type)],
    ['Category',        capitalize(form.category)],
    whereRow,
    ['Amount',          form.amount ? `${org.currency_symbol}${form.amount}` : '—'],
    ['Notes',           form.notes || '—'],
  ]
}
