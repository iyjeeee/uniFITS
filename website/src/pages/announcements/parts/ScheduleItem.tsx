// parts/ScheduleItem.tsx — One upcoming-schedule row
import { Badge } from '../../../components/ui'
import { parseDate } from '../../../utils/formatters'
import { MONTH_NAMES } from '../../../constants/calendar'
import type { ScheduleEntry } from './types'

export default function ScheduleItem({ a }: { a: ScheduleEntry }) {
  const d  = parseDate(a.date)
  const dd = isNaN(d.getTime()) ? '??' : d.getDate()
  const mm = isNaN(d.getTime()) ? '???' : MONTH_NAMES[d.getMonth()].slice(0,3)
  return (
    <div style={{ display:'flex', gap:10, alignItems:'flex-start', padding:'9px 16px', borderBottom:'1px solid var(--border-inner)' }}>
      <div style={{ width:36, height:36, borderRadius:8, background: a.kind==='event' ? 'var(--success-light)' : 'var(--accent-light)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
        <div style={{ fontSize:12.5, fontWeight:700, color: a.kind==='event' ? 'var(--success)' : 'var(--accent)', lineHeight:1 }}>{dd}</div>
        <div style={{ fontSize:9, color: a.kind==='event' ? 'var(--success)' : 'var(--accent)', lineHeight:1, marginTop:1 }}>{mm}</div>
      </div>
      <div style={{ minWidth:0 }}>
        <div style={{ fontSize:13, fontWeight:600, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{a.name}</div>
        <div style={{ marginTop:3 }}><Badge variant={a.kind==='event' ? 'success' : 'accent'}>{a.kind}</Badge></div>
      </div>
    </div>
  )
}
