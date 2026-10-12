// parts/CalDay.tsx — A single calendar day cell with smart activity display
import { useState } from 'react'
import type { AppEvent } from '../../../types'
import type { CalProject } from './types'

export default function CalDay({ day, isToday, hasAct, projects, events, totalActs, onClick }: { day: number; isToday: boolean; hasAct: boolean; projects: CalProject[]; events: AppEvent[]; totalActs: number; onClick: () => void }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => { if (hasAct) setHov(true) }}
      onMouseLeave={() => setHov(false)}
      style={{
        minHeight: 72, padding: '5px 3px 4px', borderRadius: 8,
        background: isToday
          ? 'var(--accent-light)'
          : hov
          ? 'rgba(75,94,170,.07)'
          : hasAct
          ? 'rgba(0,0,0,.012)'
          : 'transparent',
        border: isToday
          ? '2px solid rgba(75,94,170,.45)'
          : hov
          ? '1.5px solid rgba(75,94,170,.35)'
          : hasAct
          ? '1.5px solid var(--border-card)'
          : '1px solid transparent',
        cursor: hasAct ? 'pointer' : 'default',
        /* Smooth hover transition — same as buttons */
        transition: 'background .18s ease, border-color .18s ease, transform .18s ease, box-shadow .18s ease',
        transform: hov && hasAct ? 'translateY(-2px)' : 'none',
        boxShadow: hov && hasAct ? '0 0 0 1.5px rgba(0,0,0,.70), 0 4px 12px rgba(0,0,0,.14)' : 'none',
      }}>

      {/* Day number */}
      <div style={{ textAlign:'center', fontSize:12.5, fontWeight: isToday ? 700 : 400, color: isToday ? 'var(--accent)' : 'var(--text-primary)', marginBottom: 4 }}>
        {day}
      </div>

      {/* Project pills — continuous bar style for multi-day projects */}
      {projects.slice(0,2).map((p) => (
        <div key={p.id} style={{
          fontSize: p.isMid ? 7 : 8.5,
          background: p.isMid ? 'rgba(75,94,170,.7)' : 'var(--accent)',
          color: '#fff',
          borderRadius: p.isStart ? '3px 0 0 3px'
                       : p.isEnd  ? '0 3px 3px 0'
                       : '0',
          /* Start/End get padding and text; Mid gets thin silent bar */
          padding: p.isMid ? '3px 2px' : '2px 4px',
          marginBottom: 2, marginLeft: p.isStart ? 0 : -3, marginRight: p.isEnd ? 0 : -3,
          whiteSpace: 'nowrap' as const, overflow: 'hidden', textOverflow: 'ellipsis',
          display: 'block' as const,
        }}>
          {p.isMid ? ' ' : p.title}
        </div>
      ))}

      {/* Event pills — always single-day, standard pill */}
      {events.slice(0, Math.max(0, 2 - projects.length)).map((e) => (
        <div key={e.id} style={{ fontSize:8.5, background:'var(--success)', color:'#fff', borderRadius:3, padding:'2px 4px', marginBottom:2, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
          {e.title}
        </div>
      ))}

      {/* Overflow indicator */}
      {totalActs > 2 && (
        <div style={{ fontSize:9, color: isToday ? 'var(--accent)' : 'var(--text-muted)', textAlign:'center', fontWeight:600 }}>
          +{totalActs - 2}
        </div>
      )}
    </div>
  )
}
