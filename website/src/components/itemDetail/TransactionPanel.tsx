// itemDetail/TransactionPanel.tsx — Panel for a list of transactions: header strip, empty hint or rows + colored total bar
import type { ReactNode } from 'react'
import { formatCurrency } from '../../api/mockData'
import MiniSection from './MiniSection'
import EmptyHint from './EmptyHint'
import ContributionRow from './ContributionRow'
import type { Transaction, OrgConfig } from '../../types'

interface Props {
  icon: ReactNode; title: string; color: string; bg: string; border: string
  emptyText: string; totalLabel: string; txs: Transaction[]; org: OrgConfig
}

export default function TransactionPanel({ icon, title, color, bg, border, emptyText, totalLabel, txs, org }: Props) {
  return (
    <div>
      <MiniSection icon={icon} title={title} count={txs.length} color={color} bg={bg} border={border} />
      {txs.length === 0
        ? <EmptyHint text={emptyText} />
        : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {txs.map((tx, i) => <ContributionRow key={tx.id} tx={tx} idx={i} org={org} />)}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', borderRadius: 8, background: bg, border: `1.5px solid ${border}`, marginTop: 4 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color }}>{totalLabel}</span>
              <span style={{ fontSize: 14, fontWeight: 800, color }}>
                {formatCurrency(txs.reduce((s, t) => s + t.amount, 0), org.currency_symbol)}
              </span>
            </div>
          </div>
        )
      }
    </div>
  )
}
