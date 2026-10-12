// parts/ActivityDetailContent.tsx — Body of the activity detail modal
import { StatusBadge } from '../../../components/ui'
import { formatDate, formatCurrency, fmt12 } from '../../../api/mockData'
import type { OrgConfig } from '../../../types'
import { tileColor } from './helpers'
import type { TileItem } from './types'

export default function ActivityDetailContent({ item, org }: { item: TileItem; org: OrgConfig }) {
  const isProject = item.kind === 'project'
  const accentC   = isProject ? 'var(--accent)' : 'var(--success)'
  const bgC       = isProject ? 'var(--accent-light)' : 'var(--success-light)'
  const pct = item.target_funding > 0 ? Math.min(100, Math.round((item.current_funding / item.target_funding) * 100)) : null
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      <div style={{ height:140, borderRadius:12, background: tileColor(item.id, item.kind), position:'relative', overflow:'hidden', display:'flex', alignItems:'flex-end', padding:'18px 20px' }}>
        <div style={{ background:'rgba(0,0,0,.50)', borderRadius:8, padding:'10px 16px' }}>
          <div style={{ fontSize:20, fontWeight:800, color:'#fff', lineHeight:1.2 }}>{item.title}</div>
          {item.description && <div style={{ fontSize:13, color:'rgba(255,255,255,.8)', marginTop:4, lineHeight:1.5 }}>{item.description}</div>}
        </div>
        <div style={{ position:'absolute', top:14, right:14 }}><StatusBadge status={item.status} /></div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:12 }}>
        {[
          ['Location', item.location || '—'],
          isProject ? ['Duration', `${formatDate(item.start_date)} – ${formatDate(item.end_date)}`] : ['Date & Time', `${formatDate(item.event_date)}${item.event_time ? ' · ' + fmt12(item.event_time) : ''}`],
          ['Target Funding', item.target_funding>0 ? formatCurrency(item.target_funding, org.currency_symbol) : 'Not Required'],
          ['Current Funding', item.current_funding>0 ? formatCurrency(item.current_funding, org.currency_symbol) : '—'],
        ].map(([k,v]) => (
          <div key={k} style={{ padding:'12px 14px', borderRadius:10, background:'var(--neutral-light)', border:'1.5px solid var(--border-card)' }}>
            <div style={{ fontSize:11, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'.07em', marginBottom:4 }}>{k}</div>
            <div style={{ fontSize:14, fontWeight:600 }}>{v}</div>
          </div>
        ))}
      </div>
      {pct !== null && (
        <div style={{ padding:'16px 18px', borderRadius:10, background:bgC, border:`1px solid ${accentC}25` }}>
          <div style={{ display:'flex', justifyContent:'space-between', fontSize:13, marginBottom:8 }}>
            <span style={{ fontWeight:600, color:accentC }}>Funding Progress</span>
            <span style={{ fontWeight:700, color:accentC }}>{pct}%</span>
          </div>
          <div style={{ height:10, background:'rgba(0,0,0,.08)', borderRadius:10, overflow:'hidden' }}>
            <div style={{ height:'100%', background:accentC, width:`${pct}%`, borderRadius:10 }} />
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', fontSize:11.5, color:'var(--text-muted)', marginTop:6 }}>
            <span>{formatCurrency(item.current_funding, org.currency_symbol)} raised</span>
            <span>{formatCurrency(item.target_funding, org.currency_symbol)} goal</span>
          </div>
        </div>
      )}
    </div>
  )
}
