// parts/TransactionReceiptModal.tsx — Row-click detail InfoModal (receipt style); footer: Print + Close; accent follows status
import { InfoModal } from '../../../components/ui'
import { TableIco } from '../../../components/Icons'
import { formatDate } from '../../../api/mockData'
import { useOrg } from '../../../context/OrgContext'
import { modalAccentColor } from '../../../constants/tableColors'
import TransactionReceiptContent from './TransactionReceiptContent'
import type { TxRow } from './transactionsShared'

export default function TransactionReceiptModal({ item, onClose }: { item: TxRow | null; onClose: () => void }) {
  const org = useOrg()
  return (
    <InfoModal
      open={!!item}
      onClose={onClose}
      title={item?.reference_number || ''}
      subtitle={item ? `${org.transaction_label} · ${formatDate(item.transaction_date)}` : ''}
      accentColor={item ? modalAccentColor(item.status) : 'var(--accent)'}
      footer={
  <div style={{ display: 'flex' as const, gap: 10, justifyContent: 'flex-end' }}>
    <button onClick={() => window.print()}
      style={{ display: 'inline-flex' as const, alignItems: 'center', gap: 6, padding: '10px 20px', borderRadius: 9, border: 'none', background: 'var(--accent)', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' as const, fontFamily: 'var(--font-body)', transition: 'transform .18s ease, box-shadow .18s ease' }}
      onMouseEnter={(e: React.MouseEvent<HTMLElement>) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 0 0 1.5px rgba(0,0,0,.70), 0 4px 12px rgba(0,0,0,.14)' }}
      onMouseLeave={(e: React.MouseEvent<HTMLElement>) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}>
      <TableIco.Print /> Print
    </button>
    <button onClick={onClose}
      style={{ display: 'inline-flex' as const, alignItems: 'center', gap: 4, padding: '10px 28px', borderRadius: 9, border: '1px solid var(--border-card)', background: 'var(--neutral-light)', color: 'var(--text-primary)', fontSize: 14, fontWeight: 600, cursor: 'pointer' as const, fontFamily: 'var(--font-body)', transition: 'transform .18s ease, box-shadow .18s ease, background .18s ease' }}
      onMouseEnter={(e: React.MouseEvent<HTMLElement>) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 0 0 1.5px rgba(0,0,0,.70), 0 4px 12px rgba(0,0,0,.14)'; e.currentTarget.style.background = 'var(--border-inner)' }}
      onMouseLeave={(e: React.MouseEvent<HTMLElement>) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; e.currentTarget.style.background = 'var(--neutral-light)' }}>
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> Close
    </button>
  </div>
      }>
      {item && <TransactionReceiptContent tx={item} />}
    </InfoModal>
  )
}
