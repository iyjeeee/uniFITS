// parts/FundDetailModal.tsx — Fund detail modal: read-only view or edit form with Save/Cancel/Edit/Delete/Close
import { useOrg } from '../../../context/OrgContext'
import { BtnIco } from '../../../components/Icons'
import { InfoModal } from '../../../components/ui'
import type { FundWithBalance } from '../../../types'
import type { FundEditState } from './fundsShared'
import FundDetailContent from './FundDetailContent'
import FundEditForm from './FundEditForm'

export default function FundDetailModal({ viewItem, editMode, editForm, onClose, onSave, onCancel, onEdit, onRequestDelete, onFormChange }: { viewItem: FundWithBalance | null; editMode: boolean; editForm: FundEditState | null; onClose: () => void; onSave: () => void; onCancel: () => void; onEdit: () => void; onRequestDelete: () => void; onFormChange: (key: keyof FundEditState, value: string) => void }) {
  const org = useOrg()
  return (
  <InfoModal
    open={!!viewItem}
    onClose={onClose}
    title={editMode ? `Edit ${org.fund_label}` : (viewItem?.name || '')}
    editMode={editMode}
    subtitle={editMode ? 'Update fund details' : (viewItem?.description || 'Fund details and financial summary')}
    accentColor={editMode ? 'var(--accent)' : (viewItem?.is_required ? 'var(--accent)' : 'var(--info)')}
    footer={
      editMode ? (
        /* Edit mode: Save + Cancel */
        <div style={{ display: 'flex' as const, gap: 10, justifyContent: 'flex-end' }}>
          <button onClick={onSave}
            style={{ display: 'inline-flex' as const, alignItems: 'center', gap: 6, padding: '10px 22px', borderRadius: 9, border: 'none', background: 'var(--accent)', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' as const, fontFamily: 'var(--font-body)', transition: 'transform .18s ease, box-shadow .18s ease' }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 0 0 1.5px rgba(0,0,0,.70), 0 4px 12px rgba(0,0,0,.14)' }}
          onMouseLeave={(e: React.MouseEvent<HTMLElement>) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}>
            <BtnIco.Save /> Save Changes
          </button>
          <button onClick={onCancel}
            style={{ padding: '10px 24px', borderRadius: 9, border: '1.5px solid var(--border-card)', background: 'var(--neutral-light)', color: 'var(--text-primary)', fontSize: 14, fontWeight: 600, cursor: 'pointer' as const, fontFamily: 'var(--font-body)' }}>
            Cancel
          </button>
        </div>
      ) : (
        /* View mode: Edit + Delete + Close */
        <div style={{ display: 'flex' as const, gap: 10, justifyContent: 'flex-end' }}>
          <div style={{ display: 'flex' as const, gap: 8 }}>
            <button onClick={onEdit}
              style={{ display: 'inline-flex' as const, alignItems: 'center', gap: 6, padding: '10px 20px', borderRadius: 9, border: 'none', background: 'var(--accent)', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' as const, fontFamily: 'var(--font-body)', transition: 'transform .18s ease, box-shadow .18s ease' }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 0 0 1.5px rgba(0,0,0,.70), 0 4px 12px rgba(0,0,0,.14)' }}
          onMouseLeave={(e: React.MouseEvent<HTMLElement>) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}>
              <BtnIco.Edit /> Edit
            </button>
            {!viewItem?.is_required && (
              <button onClick={onRequestDelete}
                style={{ display: 'inline-flex' as const, alignItems: 'center', gap: 6, padding: '10px 20px', borderRadius: 9, border: 'none', background: 'var(--danger)', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' as const, fontFamily: 'var(--font-body)', transition: 'transform .18s ease, box-shadow .18s ease' }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 0 0 1.5px rgba(0,0,0,.70), 0 4px 12px rgba(0,0,0,.14)' }}
          onMouseLeave={(e: React.MouseEvent<HTMLElement>) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}>
                <BtnIco.Delete /> Delete
              </button>
            )}
          </div>
          <button onClick={onClose}
            style={{ padding: '10px 28px', borderRadius: 9, border: '1.5px solid var(--border-card)', background: 'var(--neutral-light)', color: 'var(--text-primary)', fontSize: 14, fontWeight: 600, cursor: 'pointer' as const, fontFamily: 'var(--font-body)' }}>
            Close
          </button>
        </div>
      )
    }>
    {viewItem && editForm && (
      editMode
        ? <FundEditForm editForm={editForm} onFormChange={onFormChange} org={org} />
        : <FundDetailContent fund={viewItem} org={org} />
    )}
  </InfoModal>
  )
}
