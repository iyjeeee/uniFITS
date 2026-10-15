// parts/UtilityDetailFooter.tsx — Detail modal footer: Save/Cancel while editing, Edit/Close while viewing
import { BtnIco } from '../../../components/Icons'

interface Props { editMode: boolean; onEdit: () => void; onClose: () => void; onSave: () => void; onCancel: () => void }

export default function UtilityDetailFooter({ editMode, onEdit, onClose, onSave, onCancel }: Props) {
  return editMode ? (
    /* Edit mode footer: Save + Cancel */
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
    /* View mode footer: Edit + Close only (Delete removed from modal per spec) */
      <div style={{ display: 'flex' as const, gap: 10, justifyContent: 'flex-end' }}>
        <button onClick={onEdit}
          style={{ display: 'inline-flex' as const, alignItems: 'center', gap: 6, padding: '10px 20px', borderRadius: 9, border: 'none', background: 'var(--accent)', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' as const, fontFamily: 'var(--font-body)', transition: 'transform .18s ease, box-shadow .18s ease' }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 0 0 1.5px rgba(0,0,0,.70), 0 4px 12px rgba(0,0,0,.14)' }}
        onMouseLeave={(e: React.MouseEvent<HTMLElement>) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}>
          <BtnIco.Edit /> Edit
        </button>
        <button onClick={onClose}
          style={{ padding: '10px 28px', borderRadius: 9, border: '1.5px solid var(--border-card)', background: 'var(--neutral-light)', color: 'var(--text-primary)', fontSize: 14, fontWeight: 600, cursor: 'pointer' as const, fontFamily: 'var(--font-body)' }}>
          Close
        </button>
      </div>
  )
}
