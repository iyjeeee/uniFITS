// parts/TransactionReceiptContent.tsx — Receipt-style transaction detail: header, key-value grid, From -> Type -> To flow, category + amount
import { formatCurrency, formatDate, getFundName, getPaymentMethodName } from '../../../api/mockData'
import { useOrg } from '../../../context/OrgContext'
import useBreakpoint from '../../../hooks/useBreakpoint'
import EntryTypeBadge from './EntryTypeBadge'
import type { Transaction } from '../../../types'

export default function TransactionReceiptContent({ tx }: { tx: Transaction }) {
  const org = useOrg()
  const { isMobile } = useBreakpoint()
  return (
    <div>
      {/* Receipt header */}
      <div style={{ background: 'var(--accent)', color: '#fff', padding: '16px 22px', borderRadius: 10, textAlign: 'center' as const, marginBottom: 18 }}>
        <div style={{ fontSize: 16, fontWeight: 700 }}>Transaction Detail</div>
        <div style={{ fontSize: 12, opacity: .8, marginTop: 3 }}>Reference: {tx.reference_number}</div>
      </div>
      {/* Key-value grid */}
      <div style={{ display: 'grid' as const, gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 12, marginBottom: 18 }}>
        {[
          ['Reference #',    tx.reference_number],
          ['Date',           formatDate(tx.transaction_date)],
          ['Member',         tx.user_name || 'External'],
          ['Status',         tx.status.charAt(0).toUpperCase() + tx.status.slice(1)],
          ['Payment Method', getPaymentMethodName(tx.payment_method_id)],
          ['Fund',           getFundName(tx.fund_id)],
        ].map(([k, v]) => (
          <div key={k}>
            <div style={{ fontSize: 10.5, color: 'var(--text-muted)', textTransform: 'uppercase' as const, letterSpacing: '.06em', marginBottom: 3 }}>{k}</div>
            <div style={{ fontSize: 13.5, fontWeight: 600 }}>{v || '—'}</div>
          </div>
        ))}
      </div>
      {/* Transaction Flow — card-based visual flow: From → Type → To */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' as const, letterSpacing: '.07em', marginBottom: 10 }}>Transaction Flow</div>
        <div style={{ display: 'flex' as const, alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          {/* FROM node */}
          <div style={{ flex: 1, minWidth: 100, padding: '12px 14px', borderRadius: 10, background: 'var(--neutral-light)', border: '1px solid var(--border-card)', textAlign: 'center' as const }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' as const, letterSpacing: '.07em', marginBottom: 5 }}>From</div>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-primary)' }}>{tx.user_name || 'External'}</div>
          </div>
          {/* Arrow + type badge */}
          <div style={{ display: 'flex' as const, flexDirection: 'column' as const, alignItems: 'center', gap: 4, flexShrink: 0 }}>
            <EntryTypeBadge type={tx.entry_type} />
            <svg width="20" height="14" viewBox="0 0 24 14" fill="none"><path d="M0 7h20M15 2l7 5-7 5" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          {/* TO node */}
          <div style={{ flex: 1, minWidth: 100, padding: '12px 14px', borderRadius: 10, background: tx.entry_type === 'expense' ? 'var(--danger-light)' : 'var(--success-light)', border: `1px solid ${tx.entry_type === 'expense' ? 'rgba(192,57,43,.20)' : 'rgba(46,125,82,.20)'}`, textAlign: 'center' as const }}>
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
        <div style={{ padding: '12px 14px', borderRadius: 10, background: tx.entry_type === 'expense' ? 'var(--danger-light)' : 'var(--success-light)', border: `1px solid ${tx.entry_type === 'expense' ? 'rgba(192,57,43,.20)' : 'rgba(46,125,82,.20)'}` }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' as const, letterSpacing: '.07em', marginBottom: 5 }}>Amount</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: tx.entry_type === 'expense' ? 'var(--danger)' : 'var(--success)' }}>
            {tx.entry_type === 'expense' ? '−' : '+'}{formatCurrency(tx.amount, org.currency_symbol)}
          </div>
        </div>
      </div>
      {tx.description && (
        <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--border-inner)', fontSize: 13.5, color: 'var(--text-secondary)' }}>
          <span style={{ fontWeight: 600, color: 'var(--text-muted)', fontSize: 11, textTransform: 'uppercase' as const, letterSpacing: '.06em' }}>Description</span>
          <div style={{ marginTop: 4 }}>{tx.description}</div>
        </div>
      )}
    </div>
  )
}
