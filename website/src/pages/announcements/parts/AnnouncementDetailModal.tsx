// parts/AnnouncementDetailModal.tsx — Read one announcement; pin/unpin or delete it
import { Button, InfoModal } from '../../../components/ui'
import { relativeTime } from '../../../api/mockData'
import type { Announcement } from '../../../types'
import { Ico } from './icons'

export default function AnnouncementDetailModal({ ann, onClose, onTogglePin, onDelete }: { ann: Announcement | null; onClose: () => void; onTogglePin: (id: string) => void; onDelete: (id: string) => void }) {
  if (!ann) return null
  return (
    <InfoModal open={!!ann} onClose={onClose}
      title={ann.title}
      subtitle={`By ${ann.created_by} · ${relativeTime(ann.created_at)}`}
      accentColor={ann.is_pinned ? 'var(--accent)' : 'var(--text-muted)'}
      footer={
        <div style={{ display:'flex', gap:8, justifyContent:'flex-end' }}>
          <div style={{ display:'flex', gap:8 }}>
            <Button variant="secondary" size="sm" onClick={() => onTogglePin(ann.id)}>{ann.is_pinned ? 'Unpin' : 'Pin'}</Button>
            <Button variant="danger" size="sm" onClick={() => onDelete(ann.id)}>Delete</Button>
          </div>
          <Button variant="secondary" onClick={onClose}>Close</Button>
        </div>
      }>
      <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
        {ann.is_pinned && (
          <div style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 12px', background:'var(--accent-light)', borderRadius:8, border:'1px solid rgba(75,94,170,.2)', color:'var(--accent)', fontSize:13, fontWeight:600 }}>
            <Ico.Pin /> Pinned Announcement
          </div>
        )}
        <p style={{ fontSize:15, lineHeight:1.75, color:'var(--text-secondary)', margin:0 }}>{ann.content}</p>
      </div>
    </InfoModal>
  )
}
