// parts/PersonalTransactionsCard.tsx — Recent personal transactions
import { useOrg } from '../../../context/OrgContext'
import { StatusBadge, Card, CardHeader } from '../../../components/ui'
import { formatDate, formatCurrency, getFundName, MOCK_TRANSACTIONS } from '../../../api/mockData'
import { IcoMoney } from './ProfileIcons'
import type { User, Transaction } from '../../../types'
import { isOutflow } from '../../../utils/ledger'

export default function PersonalTransactionsCard({ user, userTransactions, onViewAll }: { user: User; userTransactions: Transaction[]; onViewAll: () => void }) {
  const org = useOrg()
  return (
    <Card style={{ display:'flex', flexDirection:'column' }}>
      <CardHeader title="Personal Transactions" subtitle="Recent financial activity" />
      <div style={{ padding: '6px 0', flex: 1 }}>
        {userTransactions.length === 0
          ? <div style={{ padding: '20px', textAlign: 'center' as const, color: 'var(--text-muted)', fontSize: 13 }}>No transactions found.</div>
          : userTransactions.map((t) => (
              <div key={t.id} style={{ display: 'flex' as const, alignItems: 'center', gap: 12, padding: '10px 18px', borderBottom: '1px solid var(--border-inner)' }}>
                {/* Type icon */}
                <div style={{ width: 32, height: 32, borderRadius: 8, background: isOutflow(t) ? 'var(--danger-light)' : 'var(--success-light)', display: 'flex' as const, alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: isOutflow(t) ? 'var(--danger)' : 'var(--success)' }}>
                  <IcoMoney />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap' as const, overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.description || t.category}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 1 }}>{formatDate(t.transaction_date)} · {getFundName(t.fund_id)}</div>
                </div>
                <div style={{ textAlign: 'right' as const, flexShrink: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: isOutflow(t) ? 'var(--danger)' : 'var(--success)' }}>
                    {isOutflow(t) ? '−' : '+'}{formatCurrency(t.amount, org.currency_symbol)}
                  </div>
                  <StatusBadge status={t.status} />
                </div>
              </div>
            ))
        }
      </div>
      {MOCK_TRANSACTIONS.filter((t) => t.user_id === user.id).length > 0 && (
        <div style={{ padding: '10px 16px', borderTop: '1px solid var(--border-inner)', textAlign: 'center' as const }}>
          <button
            onClick={() => onViewAll()}
            style={{ padding: '7px 22px', borderRadius: 8, border: '1.5px solid var(--success)', background: 'var(--success)', color: '#fff', fontSize: 12.5, fontWeight: 600, cursor: 'pointer' as const, fontFamily: 'var(--font-body)' }}>
            View All Transactions ({MOCK_TRANSACTIONS.filter((t) => t.user_id === user.id).length})
          </button>
        </div>
      )}
    </Card>
  )
}
