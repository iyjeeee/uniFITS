// parts/DeleteTransactionModal.tsx — Delete confirmation InfoModal (Yes, Delete / Cancel)
import { InfoModal } from '../../../components/ui'
import { BtnIco } from '../../../components/Icons'
import { useOrg } from '../../../context/OrgContext'
import TransactionDeleteBody from './TransactionDeleteBody'
import type { Transaction } from '../../../types'

interface Props { item: Transaction | null; onClose: () => void; onConfirm: () => void }

export default function DeleteTransactionModal({ item, onClose, onConfirm }: Props) {
  const org = useOrg()
  return (
    <InfoModal
      open={!!item}
      onClose={onClose}
      title={`Delete ${org.transaction_label}`}
      subtitle="This action is permanent and cannot be undone"
      accentColor="var(--danger)"
      footer={
        <div style={{ display: 'flex' as const, gap: 10, justifyContent: 'flex-end' }}>
          <button onClick={onConfirm}
            style={{ display: 'inline-flex' as const, alignItems: 'center', gap: 6, padding: '10px 24px', borderRadius: 9, border: 'none', background: 'var(--danger)', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer' as const, fontFamily: 'var(--font-body)', transition: 'transform .18s ease, box-shadow .18s ease' }}
            onMouseEnter={(e: React.MouseEvent<HTMLElement>) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 0 0 1.5px rgba(0,0,0,.70), 0 4px 12px rgba(0,0,0,.14)' }}
            onMouseLeave={(e: React.MouseEvent<HTMLElement>) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}>
            <BtnIco.Delete /> Yes, Delete
          </button>
          <button onClick={onClose}
            style={{ display: 'inline-flex' as const, alignItems: 'center', gap: 4, padding: '10px 28px', borderRadius: 9, border: '1px solid var(--border-card)', background: 'var(--neutral-light)', color: 'var(--text-primary)', fontSize: 14, fontWeight: 600, cursor: 'pointer' as const, fontFamily: 'var(--font-body)', transition: 'transform .18s ease, box-shadow .18s ease, background .18s ease' }}
            onMouseEnter={(e: React.MouseEvent<HTMLElement>) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 0 0 1.5px rgba(0,0,0,.70), 0 4px 12px rgba(0,0,0,.14)'; e.currentTarget.style.background = 'var(--border-inner)' }}
            onMouseLeave={(e: React.MouseEvent<HTMLElement>) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; e.currentTarget.style.background = 'var(--neutral-light)' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> Cancel
          </button>
        </div>
      }>
      {item && <TransactionDeleteBody tx={item} org={org} />}
    </InfoModal>
  )
}
