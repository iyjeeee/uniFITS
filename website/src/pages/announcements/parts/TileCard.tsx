// parts/TileCard.tsx — Activity tile in the project/event overview strip
import { StatusBadge } from '../../../components/ui'
import { formatDate, fmt12 } from '../../../api/mockData'
import type { OrgConfig } from '../../../types'
import { Ico } from './icons'
import { tileColor } from './helpers'
import type { TileItem } from './types'

export default function TileCard({ item, org, onClick }: { item: TileItem; org: OrgConfig; onClick: () => void }) {
  const isProject = item.kind === 'project'
  const accentC   = isProject ? 'var(--accent)' : 'var(--success)'
  const pct = item.target_funding > 0 ? Math.min(100, Math.round((item.current_funding / item.target_funding) * 100)) : null
  return (
    <div onClick={onClick}
      style={{ borderRadius:10, overflow:'hidden', border:'1.5px solid var(--border-card)', cursor:'pointer', background:'#fff', display:'flex', flexDirection:'column', transition:'transform .18s, box-shadow .18s' }}
      onMouseEnter={e => { e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow='0 8px 24px rgba(0,0,0,.12)' }}
      onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow='' }}>
      {/* Default photo banner — solid color bg with centered icon illustration */}
      <div style={{ height:88, background: tileColor(item.id, item.kind), position:'relative', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden' }}>
        {/* Large background icon as default "photo" */}
        <div style={{ opacity:.18, color:'#fff', display:'flex' }}>
          {isProject
            ? <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
            : <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          }
        </div>
        {/* Type label pill — bottom-left */}
        <div style={{ position:'absolute', bottom:8, left:8, display:'flex', alignItems:'center', gap:4, background:'rgba(0,0,0,.40)', borderRadius:5, padding:'3px 8px' }}>
          <span style={{ color:'#fff', display:'flex' }}>{isProject ? <Ico.Proj /> : <Ico.Event />}</span>
          <span style={{ fontSize:10, fontWeight:700, color:'#fff', textTransform:'uppercase', letterSpacing:'.06em' }}>{isProject ? org.project_label : org.event_label}</span>
        </div>
        {/* Status badge — top-right */}
        <div style={{ position:'absolute', top:8, right:8 }}><StatusBadge status={item.status} /></div>
      </div>
      <div style={{ padding:'10px 11px 12px', flex:1, display:'flex', flexDirection:'column', gap:6 }}>
        <div style={{ fontSize:12.5, fontWeight:700, lineHeight:1.35, overflow:'hidden', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical' }}>{item.title}</div>
        <div style={{ display:'flex', flexDirection:'column', gap:3 }}>
          {item.location && <div style={{ display:'flex', alignItems:'center', gap:4, fontSize:11, color:'var(--text-muted)' }}><Ico.MapPin />{item.location}</div>}
          <div style={{ display:'flex', alignItems:'center', gap:4, fontSize:11, color:'var(--text-muted)' }}>
            <Ico.Clock />{isProject ? formatDate(item.start_date) : `${formatDate(item.event_date)}${item.event_time ? ' · ' + fmt12(item.event_time) : ''}`}
          </div>
        </div>
        {pct !== null && (
          <div style={{ marginTop:'auto' }}>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:10, color:'var(--text-muted)', marginBottom:3 }}>
              <span>Funded</span><span style={{ fontWeight:700, color:accentC }}>{pct}%</span>
            </div>
            <div style={{ height:3, background:'var(--border)', borderRadius:3, overflow:'hidden' }}>
              <div style={{ height:'100%', background:accentC, width:`${pct}%`, borderRadius:3 }} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
