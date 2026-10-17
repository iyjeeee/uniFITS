// parts/EntryTypeBadge.tsx — Entry type pill (Contribution accent / Income success / Expense danger) via ui Badge
import { Badge } from '../../../components/ui'
import { capitalize } from '../../../utils/formatters'
import type { EntryType } from '../../../types'

export default function EntryTypeBadge({ type }: { type: EntryType }) {
  const variant = type === 'expense' ? 'danger' : type === 'contribution' ? 'accent' : 'success'
  return <Badge variant={variant}>{capitalize(type)}</Badge>
}
