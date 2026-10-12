// parts/DayCard.tsx — One activity row inside the calendar day modal
import { fmt12 } from '../../../api/mockData'
import type { OrgConfig } from '../../../types'
import { Ico } from './icons'
import { tileColor } from './helpers'
import type { TileItem } from './types'

export default function DayCard({ item, org: _org }: { item: TileItem; org: OrgConfig }) {
  const isProject = item.kind === 'project'
  const accentC   = isProject ? 'var(--accent)' : 'var(--success)'
  const bgC       = isProject ? 'var(--accent-light)' : 'var(--success-light)'
  return (
    <div style={{ borderRadius:10, overflow:'hidden', border:`1px solid ${accentC}22` }}>
      <div style={{ height:36, background: tileColor(item.id, item.kind) }} />
      <div style={{ padding:'12px 14px', background:bgC }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:5 }}>
          <span style={{ color:accentC }}>{isProject ? <Ico.Proj /> : <Ico.Event />}</span>
          <span style={{ fontSize:14, fontWeight:700, color:accentC }}>{item.title}</span>
        </div>
        <div style={{ fontSize:13, color:'var(--text-secondary)', lineHeight:1.6 }}>{item.description}</div>
        <div style={{ fontSize:12, color:'var(--text-muted)', marginTop:5 }}>
          {item.location && <span>{item.location}</span>}
          {isProject && item.start_date && (
            <span>{item.location ? ' · ' : ''}{item.start_date === item.end_date ? item.start_date : `${item.start_date} – ${item.end_date}`}</span>
          )}
          {!isProject && item.event_time && (
            <span style={{ marginLeft: item.location ? 6 : 0, padding:'1px 7px', borderRadius:20, background:'var(--success)', color:'#fff', fontSize:11, fontWeight:700 }}>
              {fmt12(item.event_time)}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
