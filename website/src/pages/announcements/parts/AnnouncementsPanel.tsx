// parts/AnnouncementsPanel.tsx — Latest announcements card with + New and View All
import { Card } from '../../../components/ui'
import type { Announcement } from '../../../types'
import { Ico } from './icons'
import AnnRow from './AnnRow'

export default function AnnouncementsPanel({ items, total, onNew, onView, onViewAll }: { items: Announcement[]; total: number; onNew: () => void; onView: (a: Announcement) => void; onViewAll: () => void }) {
  return (
    <Card style={{ display:'flex', flexDirection:'column' }}>
      <div style={{ padding:'12px 14px', borderBottom:'1px solid var(--border-inner)', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:7 }}>
          <span style={{ color:'var(--accent)', display:'flex' }}><Ico.Bell /></span>
          <span style={{ fontSize:13.5, fontWeight:600 }}>Announcements</span>
        </div>
        <button onClick={onNew} title="New Announcement"
          style={{ width:28, height:28, borderRadius:7, border:'none', background:'var(--accent)', color:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 2px 8px rgba(75,94,170,.3)' }}>
          <Ico.Plus />
        </button>
      </div>

      <div style={{ flex:1, overflowY:'auto', minHeight:0 }}>
        {items.length === 0
          ? <div style={{ padding:'24px', textAlign:'center', color:'var(--text-muted)', fontSize:13 }}>No announcements yet. Click + to add one.</div>
          : items.map((a) => <AnnRow key={a.id} a={a} onClick={() => onView(a)} />)
        }
      </div>

      {/* View All — centered */}
      <div style={{ padding:'12px 14px', borderTop:'1px solid var(--border-inner)', flexShrink:0, textAlign:'center' }}>
        <button
          onClick={onViewAll}
          style={{ padding:'8px 24px', borderRadius:8, border:'1.5px solid var(--border-card)', background:'var(--neutral-light)', cursor:'pointer', fontSize:13, fontWeight:600, color:'var(--accent)', fontFamily:'var(--font-body)' }}>
          View All Announcements ({total})
        </button>
      </div>
    </Card>
  )
}
