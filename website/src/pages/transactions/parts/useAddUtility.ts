// parts/useAddUtility.ts — Add Utility wizard state: step, form, errors, fund options, per-step validation, navigation
import { useState } from 'react'
import { MOCK_FUNDS } from '../../../api/mockData'
import { useOrg } from '../../../context/OrgContext'
import { required, isNonZeroAmount, isPositiveNumber, isAmountPaidValid, isPastOrTodayDate, validateStep } from '../../../utils/validation'
import { ADD_UTILITY_STEPS, EMPTY_UTILITY_FORM } from './addUtilityShared'

export default function useAddUtility() {
  const org = useOrg()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<Record<string, string>>(EMPTY_UTILITY_FORM)
  const [errors, setErrors] = useState<Record<string,string>>({})
  const [feedback, setFeedback] = useState(false)  // success confirmation modal visibility
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => { setForm((f) => ({ ...f, [k]: e.target.value })); clearErr(k) }
  const clearErr = (k: string) => setErrors(p => { const n = { ...p }; delete n[k]; return n })
  const fundOptions = MOCK_FUNDS.map((f) => ({ value: f.id, label: f.name }))

  // pick — category card selection: sets the category, clears the custom type and its error
  const pickCategory = (v: string) => { setForm(f => ({ ...f, expense_type: v, custom_type: '' })); clearErr('expense_type') }

  // stepValidators — rules per step index
  const stepValidators = [
    // Step 0 — Category
    () => {
      const errs = validateStep({ expense_type: [() => required(form.expense_type, 'Expense Category')] })
      // If Other selected, require a custom description
      if (form.expense_type === 'Other' && !form.custom_type?.trim()) errs.custom_type = 'Please specify the expense type.'
      return errs
    },
    // Step 1 — Payment Info
    () => validateStep({
      paid_to:      [() => required(form.paid_to, 'Vendor / Biller')],
      fund_id:      [() => required(form.fund_id, 'Fund')],
      payment_date: [
        () => required(form.payment_date, 'Payment Date'),
        () => isPastOrTodayDate(form.payment_date, 'Payment Date'),
      ],
    }),
    // Step 2 — Amount & Status
    () => {
      const errs = validateStep({
        total_amount: [() => isNonZeroAmount(form.total_amount, 'Total Amount')],
        amount_paid:  [() => isPositiveNumber(form.amount_paid, 'Amount Paid')],
      })
      // amount paid must not exceed total amount
      const crossErr = isAmountPaidValid(form.total_amount, form.amount_paid)
      if (crossErr) errs.amount_paid = crossErr
      return errs
    },
  ]

  function handleContinue() {
    if (step >= ADD_UTILITY_STEPS.length - 1) return
    const errs = stepValidators[step] ? stepValidators[step]() : {}
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setStep(s => s + 1)
  }

  function handleBack() { setErrors({}); setStep(s => Math.max(0, s - 1)) }

  return { org, step, form, errors, feedback, setFeedback, set, pickCategory, fundOptions, handleContinue, handleBack }
}
