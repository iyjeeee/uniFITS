// itemDetail/ContributionRow.tsx — One transaction line (#, member or External, signed amount) in the contribution/income/expense panels
import { formatCurrency, getPartyName } from '../../api/mockData'
import type { Transaction, OrgConfig } from '../../types'
import { isOutflow } from '../../utils/ledger'

export default function ContributionRow({ tx, idx, org }: { tx: Transaction; idx: number; org: OrgConfig }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', borderRadius: 8, background: idx % 2 === 0 ? 'var(--neutral-light)' : '#fff', border: '1px solid var(--border-inner)', gap: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', flexShrink: 0 }}>#{idx + 1}</span>
        <span style={{ fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {getPartyName(tx.user_id, 'External')}
        </span>
      </div>
      <span style={{ fontSize: 13.5, fontWeight: 800, color: isOutflow(tx) ? 'var(--danger)' : 'var(--success)', flexShrink: 0 }}>
        {isOutflow(tx) ? '−' : '+'}{formatCurrency(tx.amount, org.currency_symbol)}
      </span>
    </div>
  )
}
