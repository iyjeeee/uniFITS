// parts/dueShared.ts — Types and constants shared by the Personal Transactions pieces
import type { Fund } from '../../../types'

// Fund plus the (future, backend) per-member due status — demo statuses are derived when absent
export type DueFund = Fund & { due_status?: 'paid' | 'partial' | 'unpaid' }
export const DUES_PER_PAGE = 6   // tiles per page in the View All dues modal
export const PANEL_LIMIT  = 6   // required-dues tiles shown in the side panel
