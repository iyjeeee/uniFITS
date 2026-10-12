// parts/ScheduleCard.tsx — Upcoming schedule card with View All
import { Card } from '../../../components/ui'
import { Ico } from './icons'
import type { ScheduleEntry } from './types'
import ScheduleItem from './ScheduleItem'

export default function ScheduleCard({ items, total, onViewAll }: { items: ScheduleEntry[]; total: number; onViewAll: () => void }) {
  return (
    <Card style={{ display:'flex', flexDirection:'column' }}>
      <div style={{ padding:'12px 16px', borderBottom:'1px solid var(--border-inner)', display:'flex', alignItems:'center', gap:7, flexShrink:0 }}>
        <span style={{ color:'var(--accent)', display:'flex' }}><Ico.Cal /></span>
        <span style={{ fontSize:13.5, fontWeight:600 }}>Upcoming Schedule</span>
      </div>
      <div style={{ flex:1, padding:'4px 0' }}>
        {items.length === 0
          ? <div style={{ padding:'24px', textAlign:'center', color:'var(--text-muted)', fontSize:13 }}>No upcoming activities.</div>
          : items.map((a) => <ScheduleItem key={`${a.kind}-${a.id}`} a={a} />)
        }
      </div>
      {/* View All — centered */}
      <div style={{ padding:'12px 16px', borderTop:'1px solid var(--border-inner)', flexShrink:0, textAlign:'center' }}>
        <button
          onClick={onViewAll}
          style={{ padding:'8px 24px', borderRadius:8, border:'1.5px solid var(--border-card)', background:'var(--neutral-light)', cursor:'pointer', fontSize:13, fontWeight:600, color:'var(--accent)', fontFamily:'var(--font-body)' }}>
          View All Schedule ({total})
        </button>
      </div>
    </Card>
  )
}
