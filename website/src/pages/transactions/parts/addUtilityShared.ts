// parts/addUtilityShared.ts — Wizard steps, empty form and summary rows for the Add Utility wizard (status options: utilitiesShared)
import { MOCK_FUNDS } from '../../../api/mockData'
import { capitalize } from '../../../utils/formatters'
import type { OrgConfig } from '../../../types'

export const ADD_UTILITY_STEPS = ['Category', 'Payment Info', 'Amount', 'Review']

export const EMPTY_UTILITY_FORM: Record<string, string> = {
  expense_type: '', custom_type: '', paid_to: '', fund_id: '',
  payment_date: '', total_amount: '', amount_paid: '',
  status: 'unpaid', notes: '',
}

// getUtilitySummaryRows — label/value rows shared by the live preview and the review step ("Other" shows the typed custom type)
export function getUtilitySummaryRows(form: Record<string, string>, org: OrgConfig): [string, string][] {
  const selectedFund = MOCK_FUNDS.find((f) => f.id === form.fund_id)
  const displayCategory = form.expense_type === 'Other' && form.custom_type
    ? form.custom_type
    : form.expense_type || '—'
  return [
    ['Category',     displayCategory],
    ['Paid To',      form.paid_to || '—'],
    ['Fund',         selectedFund?.name || '—'],
    ['Payment Date', form.payment_date || '—'],
    ['Total Amount', form.total_amount ? `${org.currency_symbol}${form.total_amount}` : '—'],
    ['Amount Paid',  form.amount_paid  ? `${org.currency_symbol}${form.amount_paid}`  : '—'],
    ['Status',       capitalize(form.status)],
    ['Notes',        form.notes || '—'],
  ]
}
