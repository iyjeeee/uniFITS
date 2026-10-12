// parts/AnnRow.tsx — One announcement row (panel + View All modal)
import { relativeTime } from '../../../api/mockData'
import type { Announcement } from '../../../types'
import { Ico } from './icons'

export default function AnnRow({ a, onClick }: { a: Announcement; onClick: () => void }) {
  return (
    <div onClick={onClick}
      style={{ display:'flex', alignItems:'flex-start', gap:9, padding:'10px 14px', cursor:'pointer', borderBottom:'1px solid var(--border-inner)', background: a.is_pinned ? 'rgba(75,94,170,.025)' : 'transparent', transition:'background .12s' }}
      onMouseEnter={e => e.currentTarget.style.background = a.is_pinned ? 'rgba(75,94,170,.05)' : 'var(--neutral-light)'}
      onMouseLeave={e => e.currentTarget.style.background = a.is_pinned ? 'rgba(75,94,170,.025)' : 'transparent'}>
      {a.is_pinned && <span style={{ color:'var(--accent)', display:'flex', flexShrink:0, marginTop:3 }}><Ico.Pin /></span>}
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontSize:13, fontWeight:600, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{a.title}</div>
        <div style={{ fontSize:11.5, color:'var(--text-muted)', marginTop:2 }}>{a.created_by} · {relativeTime(a.created_at)}</div>
      </div>
      <span style={{ color:'var(--text-muted)', flexShrink:0, marginTop:3 }}><Ico.Arrow /></span>
    </div>
  )
}
