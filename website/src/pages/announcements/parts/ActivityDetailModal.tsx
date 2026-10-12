// parts/ActivityDetailModal.tsx — Detail view for a project/event tile (with link to its manage page)
import { useOrg } from '../../../context/OrgContext'
import { InfoModal } from '../../../components/ui'
import type { TileItem } from './types'
import ActivityDetailContent from './ActivityDetailContent'

export default function ActivityDetailModal({ item, onClose }: { item: TileItem | null; onClose: () => void }) {
  const org = useOrg()
  if (!item) return null
  return (
    <InfoModal open={!!item} onClose={onClose}
      title={item.title}
      subtitle={item.kind==='project' ? `${org.project_label} · ${item.project_type||''}` : org.event_label}
      accentColor={item.kind==='project' ? 'var(--accent)' : 'var(--success)'}
      footer={
        <div style={{ display:'flex', gap:10, justifyContent:'flex-end' }}>
          {/* "View Full Details" — redirects to the manage page for this item */}
          <button
            onClick={() => {
              onClose()
              window.location.hash = item.kind === 'project' ? '/projects' : '/events'
            }}
            style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'10px 20px', borderRadius:9, border:'none', background: item.kind==='project' ? 'var(--accent)' : 'var(--success)', color:'#fff', fontSize:14, fontWeight:600, cursor:'pointer', fontFamily:'var(--font-body)' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
            View Full Details
          </button>
          <button onClick={() => onClose()}
            style={{ padding:'10px 24px', borderRadius:9, border:'1.5px solid var(--border-card)', background:'var(--neutral-light)', color:'var(--text-primary)', fontSize:14, fontWeight:600, cursor:'pointer', fontFamily:'var(--font-body)' }}>
            Close
          </button>
        </div>
      }>
      <ActivityDetailContent item={item} org={org} />
    </InfoModal>
  )
}
