// parts/EntryTypeBadge.tsx -- Entry type pill (Contribution accent / Income success / Expense danger / Refund warning / Opening info) via ui Badge
import { Badge } from '../../../components/ui'
import { entryTypeLabel } from '../../../utils/formatters'
import type { EntryType } from '../../../types'

const VARIANT = { expense: 'danger', contribution: 'accent', refund: 'warning', opening_balance: 'info', income: 'success' } as const

export default function EntryTypeBadge({ type }: { type: EntryType }) {
  return <Badge variant={VARIANT[type]}>{entryTypeLabel(type)}</Badge>
}
