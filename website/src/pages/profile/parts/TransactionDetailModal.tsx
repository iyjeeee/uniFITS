// parts/TransactionDetailModal.tsx — Detail view for one transaction
import { useOrg } from '../../../context/OrgContext'
import useBreakpoint from '../../../hooks/useBreakpoint'
import { Button, InfoModal } from '../../../components/ui'
import { formatDate, formatCurrency, getFundName, getPaymentMethodName, getPartyName } from '../../../api/mockData'
import type { Transaction } from '../../../types'
import TypeBadge from './TransactionTypeBadge'
import { isOutflow } from '../../../utils/ledger'

export default function TransactionDetailModal({ tx, onClose }: { tx: Transaction | null; onClose: () => void }) {
  const org = useOrg()
  const { isMobile } = useBreakpoint()
  if (!tx) return null
  return (
    <InfoModal
      open={!!tx}
      onClose={onClose}
      title={tx.description || 'Transaction Detail'}
      subtitle={`${formatDate(tx.transaction_date)} · ${getFundName(tx.fund_id)}`}
      accentColor={isOutflow(tx) ? 'var(--danger)' : 'var(--success)'}
      footer={<Button variant="secondary" onClick={onClose}>Close</Button>}>
      <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 16 }}>
        {/* Transaction Flow */}
        <div style={{ marginBottom: 4 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' as const, letterSpacing: '.07em', marginBottom: 10 }}>Transaction Flow</div>
          <div style={{ display: 'flex' as const, alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 100, padding: '12px 14px', borderRadius: 10, background: 'var(--neutral-light)', border: '1px solid var(--border-card)', textAlign: 'center' as const }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' as const, letterSpacing: '.07em', marginBottom: 5 }}>From</div>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-primary)' }}>{getPartyName(tx.user_id, 'Me')}</div>
            </div>
            <div style={{ display: 'flex' as const, flexDirection: 'column' as const, alignItems: 'center', gap: 4, flexShrink: 0 }}>
              <TypeBadge type={tx.entry_type} />
              <svg width="20" height="14" viewBox="0 0 24 14" fill="none"><path d="M0 7h20M15 2l7 5-7 5" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div style={{ flex: 1, minWidth: 100, padding: '12px 14px', borderRadius: 10, background: isOutflow(tx) ? 'var(--danger-light)' : 'var(--success-light)', border: `1px solid ${isOutflow(tx) ? 'rgba(192,57,43,.20)' : 'rgba(46,125,82,.20)'}`, textAlign: 'center' as const }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' as const, letterSpacing: '.07em', marginBottom: 5 }}>To Fund</div>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-primary)' }}>{getFundName(tx.fund_id)}</div>
            </div>
          </div>
        </div>
        {/* Amount + category */}
        <div style={{ display: 'grid' as const, gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 12 }}>
          <div style={{ padding: '12px 14px', borderRadius: 10, background: 'var(--neutral-light)', border: '1px solid var(--border-card)' }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' as const, letterSpacing: '.07em', marginBottom: 5 }}>Category</div>
            <div style={{ fontSize: 14, fontWeight: 600, textTransform: 'capitalize' as const, color: 'var(--text-primary)' }}>{tx.category}</div>
          </div>
          <div style={{ padding: '12px 14px', borderRadius: 10, background: isOutflow(tx) ? 'var(--danger-light)' : 'var(--success-light)', border: `1px solid ${isOutflow(tx) ? 'rgba(192,57,43,.20)' : 'rgba(46,125,82,.20)'}` }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' as const, letterSpacing: '.07em', marginBottom: 5 }}>Amount</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: isOutflow(tx) ? 'var(--danger)' : 'var(--success)' }}>
              {isOutflow(tx) ? '−' : '+'}{formatCurrency(tx.amount, org.currency_symbol)}
            </div>
          </div>
        </div>
        {/* Details grid */}
        <div style={{ display: 'grid' as const, gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 10 }}>
          {[
            ['Date',           formatDate(tx.transaction_date)],
            ['Status',         tx.status],
            ['Payment Method', getPaymentMethodName(tx.payment_method_id)],
            ['Reference No.',  tx.reference_number || '—'],
          ].map(([k, v]) => (
            <div key={k} style={{ padding: '10px 14px', borderRadius: 10, background: 'var(--neutral-light)', border: '1px solid var(--border-card)' }}>
              <div style={{ fontSize: 10.5, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '.07em', marginBottom: 4 }}>{k}</div>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)', textTransform: k === 'Status' ? 'capitalize' : 'none' }}>{v}</div>
            </div>
          ))}
        </div>
        {/* Notes */}
        {tx?.notes && (
          <div style={{ padding: '12px 14px', borderRadius: 10, background: 'var(--neutral-light)', border: '1px solid var(--border-card)' }}>
            <div style={{ fontSize: 10.5, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '.07em', marginBottom: 6 }}>Notes</div>
            <div style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{tx.notes}</div>
          </div>
        )}
      </div>
    </InfoModal>
  )
}
