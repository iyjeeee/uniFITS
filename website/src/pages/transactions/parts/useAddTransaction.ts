// parts/useAddTransaction.ts — Add Transaction wizard state: step, form, errors, option lists, per-step validation, navigation
import { useState } from 'react'
import { MOCK_USERS, MOCK_FUNDS, MOCK_PROJECTS, MOCK_EVENTS } from '../../../api/mockData'
import { approvedOnly } from '../../../utils/approvals'
import { useOrg } from '../../../context/OrgContext'
import { indefinite } from '../../../utils/labels'
import { required, isNonZeroAmount, validateStep } from '../../../utils/validation'
import { ADD_TX_STEPS, EMPTY_TX_FORM } from './addTransactionShared'

export default function useAddTransaction() {
  const org = useOrg()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<Record<string, string>>(EMPTY_TX_FORM)
  const [errors, setErrors] = useState<Record<string,string>>({})
  const [feedback, setFeedback] = useState(false)  // success confirmation modal visibility
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => { setForm((f) => ({ ...f, [k]: e.target.value })); clearErr(k) }
  const clearErr = (k: string) => setErrors(p => { const n = { ...p }; delete n[k]; return n })

  // pick — ToggleCard selection: sets one field (plus optional dependent resets) and clears its error
  const pick = (key: string, value: string, reset: Record<string, string> = {}) => { setForm(f => ({ ...f, [key]: value, ...reset })); clearErr(key) }

  const userOptions    = MOCK_USERS.map((u) => ({ value: u.id, label: u.full_name }))
  const fundOptions    = MOCK_FUNDS.map((f) => ({ value: f.id, label: f.name }))
  const projectOptions = approvedOnly(MOCK_PROJECTS).map((p) => ({ value: p.id, label: p.title }))   // money goes only to approved activities
  const eventOptions   = approvedOnly(MOCK_EVENTS).map((e) => ({ value: e.id, label: e.title }))
  const activityOptions = form.category === 'project' ? projectOptions
                        : form.category === 'event'   ? eventOptions : []

  // stepValidators — per-step validation rules
  const stepValidators = [
    // Step 0 — Source
    () => {
      const errs = validateStep({ source: [() => required(form.source, 'Transaction Source')] })
      // If member/officer selected, also require a user
      if ((form.source === 'member' || form.source === 'officer') && !form.user_id) {
        errs.user_id = `Please select ${indefinite(org.people_label)} ${org.people_label}.`   // "an Employee" / "a Member" (B-69)
      }
      return errs
    },
    // Step 1 — Payment Method
    () => validateStep({ payment_method_id: [() => required(form.payment_method_id, 'Payment Method')] }),
    // Step 2 — Entry Type
    () => validateStep({ entry_type: [() => required(form.entry_type, 'Entry Type')] }),
    // Step 3 — Category
    () => {
      const errs = validateStep({ category: [() => required(form.category, 'Category')] })
      // Fund selection required if category is fund
      if (form.category === 'fund' && !form.fund_id) errs.fund_id = 'Please select a fund.'
      // Activity selection required if project or event
      if (['project', 'event'].includes(form.category) && !form.activity_id)
        errs.activity_id = 'Please select an activity.'
      return errs
    },
    // Step 4 — Amount
    () => validateStep({ amount: [() => isNonZeroAmount(form.amount, 'Amount')] }),
  ]

  function handleContinue() {
    if (step >= ADD_TX_STEPS.length - 1) return
    const errs = stepValidators[step] ? stepValidators[step]() : {}
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setStep(s => s + 1)
  }

  function handleBack() { setErrors({}); setStep(s => Math.max(0, s - 1)) }

  return { org, step, form, errors, feedback, setFeedback, set, pick, userOptions, fundOptions, activityOptions, handleContinue, handleBack }
}
