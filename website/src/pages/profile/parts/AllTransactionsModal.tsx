// parts/AllTransactionsModal.tsx — Full personal transactions modal
import { useOrg } from '../../../context/OrgContext'
import { StatusBadge, InfoModal } from '../../../components/ui'
import { formatDate, formatCurrency, MOCK_TRANSACTIONS } from '../../../api/mockData'
import { IcoMoney } from './ProfileIcons'
import type { User } from '../../../types'

export default function AllTransactionsModal({ user, open, onClose }: { user: User; open: boolean; onClose: () => void }) {
  const org = useOrg()
  return (
    <InfoModal
      open={open}
      onClose={() => onClose()}
      title="All Personal Transactions"
      subtitle={`${MOCK_TRANSACTIONS.filter((t) => t.user_id === user.id).length} total transactions for ${user.full_name}`}
      accentColor="var(--success)"
      footer={
        <div style={{ display: 'flex' as const, gap: 10, justifyContent: 'flex-end' }}>
          <a href="#/profile/transactions"
            style={{ padding: '10px 20px', borderRadius: 9, border: '1.5px solid var(--accent)', background: 'var(--accent)', color: '#fff', fontSize: 13.5, fontWeight: 600, textDecoration: 'none', display: 'inline-flex' as const, alignItems: 'center', fontFamily: 'var(--font-body)' }}>
            View Full Transaction Page
          </a>
          <button onClick={() => onClose()} style={{ padding: '10px 28px', borderRadius: 9, border: '1.5px solid var(--border-card)', background: 'var(--neutral-light)', color: 'var(--text-primary)', fontSize: 14, fontWeight: 600, cursor: 'pointer' as const, fontFamily: 'var(--font-body)' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{marginRight:4}}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> Close
          </button>
        </div>
      }>
      <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 6 }}>
        {MOCK_TRANSACTIONS.filter((t) => t.user_id === user.id).length === 0
          ? <div style={{ textAlign: 'center' as const, padding: '32px', color: 'var(--text-muted)', fontSize: 13 }}>No transactions found.</div>
          : MOCK_TRANSACTIONS.filter((t) => t.user_id === user.id).map((t) => (
              <div key={t.id} style={{ display: 'flex' as const, alignItems: 'center', gap: 14, padding: '12px 16px', borderRadius: 10, background: 'var(--neutral-light)', border: '1px solid var(--border-card)' }}>
                <div style={{ width: 36, height: 36, borderRadius: 9, background: t.entry_type === 'expense' ? 'var(--danger-light)' : 'var(--success-light)', display: 'flex' as const, alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: t.entry_type === 'expense' ? 'var(--danger)' : 'var(--success)' }}>
                  <IcoMoney />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600 }}>{t.description || t.category}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 1 }}>
                    {formatDate(t.transaction_date)} · {t.fund} · {t.payment_method}
                  </div>
                  <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 1 }}>
                    Ref: {t.reference_number}
                  </div>
                </div>
                <div style={{ textAlign: 'right' as const, flexShrink: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: t.entry_type === 'expense' ? 'var(--danger)' : 'var(--success)' }}>
                    {t.entry_type === 'expense' ? '−' : '+'}{formatCurrency(t.amount, org.currency_symbol)}
                  </div>
                  <div style={{ marginTop: 3 }}><StatusBadge status={t.status} /></div>
                </div>
              </div>
            ))
        }
      </div>
    </InfoModal>
  )
}
