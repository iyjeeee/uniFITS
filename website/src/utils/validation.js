// validation.js — Shared form validation rules and helpers for all Add/Edit pages
// Keeps all rules centralized: easy to adjust, extend, or fix without touching components

/* ── Primitive validators — return error string or '' if valid ─────────────── */

// required — trims and checks for a non-empty value
export const required = (value, label = 'This field') =>
  !String(value ?? '').trim() ? `${label} is required.` : ''

// minLength — ensures string meets minimum character count
export const minLength = (value, min, label = 'This field') =>
  String(value ?? '').trim().length < min
    ? `${label} must be at least ${min} characters.`
    : ''

// maxLength — ensures string does not exceed maximum character count
export const maxLength = (value, max, label = 'This field') =>
  String(value ?? '').trim().length > max
    ? `${label} must not exceed ${max} characters.`
    : ''

// isEmail — validates standard email format
export const isEmail = (value) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return !re.test(String(value ?? '').trim()) ? 'Please enter a valid email address.' : ''
}

// isPhilippinePhone — validates PH mobile: 09XXXXXXXXX (11 digits)
export const isPhilippinePhone = (value) => {
  const cleaned = String(value ?? '').replace(/\s+/g, '')
  if (!cleaned) return ''  // optional field; call required() separately if needed
  if (!/^09\d{9}$/.test(cleaned)) return 'Contact number must start with 09 and be exactly 11 digits.'
  return ''
}

// isPositiveNumber — validates numeric input greater than zero
export const isPositiveNumber = (value, label = 'Amount') => {
  if (!String(value ?? '').trim()) return ''  // optional; combine with required() if needed
  const num = parseFloat(value)
  if (isNaN(num)) return `${label} must be a valid number.`
  if (num < 0)    return `${label} cannot be negative.`
  return ''
}

// isNonZeroAmount — amount field that must be > 0 when provided
export const isNonZeroAmount = (value, label = 'Amount') => {
  if (!String(value ?? '').trim()) return `${label} is required.`
  const num = parseFloat(value)
  if (isNaN(num) || num <= 0) return `${label} must be greater than zero.`
  return ''
}

// isPastOrTodayDate — date must not be in the future (for payment/attendance dates)
export const isPastOrTodayDate = (value, label = 'Date') => {
  if (!value) return ''  // optional; combine with required() separately
  const d = new Date(value)
  if (isNaN(d.getTime())) return `${label} is not a valid date.`
  const today = new Date(); today.setHours(23, 59, 59, 999)
  return d > today ? `${label} cannot be in the future.` : ''
}

// isValidDateRange — ensures end date is not before start date
export const isValidDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) return ''
  const s = new Date(startDate), e = new Date(endDate)
  if (isNaN(s.getTime()) || isNaN(e.getTime())) return ''
  return e < s ? 'End date cannot be before the start date.' : ''
}

// isAmountPaidValid — amount paid must not exceed total amount
export const isAmountPaidValid = (totalAmount, amountPaid) => {
  const total = parseFloat(totalAmount)
  const paid  = parseFloat(amountPaid)
  if (isNaN(total) || isNaN(paid)) return ''
  if (paid > total) return 'Amount paid cannot exceed the total amount.'
  return ''
}

// passwordStrength — basic password check for login form
export const passwordStrength = (value) => {
  if (!value) return 'Password is required.'
  if (value.length < 6) return 'Password must be at least 6 characters.'
  return ''
}

/* ── runValidations — run an array of validator fns, return first error ────── */
// Usage: runValidations([() => required(val, 'Name'), () => minLength(val, 2, 'Name')])
export const runValidations = (validators) => {
  for (const fn of validators) {
    const err = fn()
    if (err) return err
  }
  return ''
}

/* ── validateStep — validate a map of field → validator arrays, return errors object ─
   Usage: const errors = validateStep({ name: [() => required(name, 'Name')] })
   Returns: { name: 'Name is required.' } — only keys with errors included         */
export const validateStep = (fieldValidators) => {
  const errors = {}
  for (const [field, validators] of Object.entries(fieldValidators)) {
    const err = runValidations(validators)
    if (err) errors[field] = err
  }
  return errors
}
