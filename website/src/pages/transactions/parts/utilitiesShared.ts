// parts/utilitiesShared.ts — Types and constants shared by the Utilities page parts
import type { Utility } from '../../../types'

export const UTILITY_PAGE_SIZE = 10

// Edit form — amounts stay string|number: stored values are numbers, the inputs yield strings (converted on save)
export type UtilityEditForm = Omit<Utility, 'total_amount' | 'amount_paid'> & { total_amount: number | string; amount_paid: number | string }

// ActionResult — feedback shown in the ResponseModal after save/delete
export interface UtilityActionResult { variant: string; title: string; message: string }

export const UTILITY_STATUS_OPTIONS = [{ value: 'unpaid', label: 'Unpaid' }, { value: 'partial', label: 'Partial' }, { value: 'paid', label: 'Paid' }]
