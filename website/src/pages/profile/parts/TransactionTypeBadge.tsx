// parts/TransactionTypeBadge.tsx — Income / Expense / Contribution pill
import type { EntryType } from '../../../types'

/* ── TypeBadge — Income / Expense / Contribution pill ────────── */
export default function TypeBadge({ type }: { type: EntryType }) {
  const map = {
    income:       { bg: 'var(--success-light)', color: 'var(--success)', label: 'Income'       },
    expense:      { bg: 'var(--danger-light)',  color: 'var(--danger)',  label: 'Expense'      },
    contribution: { bg: 'var(--accent-light)',  color: 'var(--accent)',  label: 'Contribution' },
  }
  const s = (map as Record<string,{bg:string;color:string;label:string}>)[type] || { bg: 'var(--neutral-light)', color: 'var(--text-muted)', label: type }
  return (
    <span style={{ padding: '2px 10px', borderRadius: 20, fontSize: 11.5, fontWeight: 700, background: s.bg, color: s.color }}>
      {s.label}
    </span>
  )
}
