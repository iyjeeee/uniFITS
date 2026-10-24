// parts/utilitiesShared.ts — Types and constants shared by the Utilities page parts
import type { Utility } from '../../../types'

export const UTILITY_PAGE_SIZE = 10

// Edit form - BILL fields only (paid amount and status are derived from approved payments); the amount input yields a string (converted on save)
export type UtilityEditForm = Omit<Utility, 'total_amount'> & { total_amount: number | string }

// ActionResult — feedback shown in the ResponseModal after save/delete
export interface UtilityActionResult { variant: string; title: string; message: string }

export const UTILITY_STATUS_OPTIONS = [{ value: 'unpaid', label: 'Unpaid' }, { value: 'partial', label: 'Partial' }, { value: 'paid', label: 'Paid' }]
