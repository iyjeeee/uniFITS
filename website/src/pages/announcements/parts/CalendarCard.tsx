// parts/CalendarCard.tsx — Month calendar with project/event pills (owns the month/year state)
import { useState } from 'react'
import { useOrg } from '../../../context/OrgContext'
import { Card } from '../../../components/ui'
import { MONTH_NAMES, DAY_NAMES } from '../../../constants/calendar'
import { Ico } from './icons'
import { getActivitiesOnDay } from './helpers'
import type { SelectedDay } from './types'
import CalDay from './CalDay'
import LegendDot from './LegendDot'

const calNavBtn = { display:'flex', alignItems:'center', justifyContent:'center', width:30, height:30, borderRadius:7, border:'1.5px solid var(--border-card)', background:'#fff', cursor:'pointer', color:'var(--text-secondary)' }

export default function CalendarCard({ onSelectDay }: { onSelectDay: (day: SelectedDay) => void } ) {
  const org   = useOrg()
  const today = new Date()
  const [month, setMonth] = useState(today.getMonth())
  const [year,  setYear]  = useState(today.getFullYear())

  const firstDay    = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  function prevMonth() { if (month === 0) { setYear(y => y - 1); setMonth(11) } else setMonth(m => m - 1) }
  function nextMonth() { if (month === 11) { setYear(y => y + 1); setMonth(0) } else setMonth(m => m + 1) }

  return (
    <Card>
      <div style={{ padding:'12px 18px', borderBottom:'1px solid var(--border-inner)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <button onClick={prevMonth} style={calNavBtn}><Ico.ChevL /></button>
        <div style={{ fontSize:15, fontWeight:700 }}>{MONTH_NAMES[month]} {year}</div>
        <button onClick={nextMonth} style={calNavBtn}><Ico.ChevR /></button>
      </div>

      <div style={{ padding:'14px 18px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', marginBottom:6 }}>
          {DAY_NAMES.map((d) => (
            <div key={d} style={{ textAlign:'center', fontSize:10.5, fontWeight:700, color:'var(--text-muted)', padding:'2px 0', textTransform:'uppercase', letterSpacing:'.06em' }}>{d}</div>
          ))}
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:3 }}>
          {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
          {Array.from({ length: daysInMonth }, (_, i) => i+1).map(day => {
            const isToday   = day===today.getDate() && month===today.getMonth() && year===today.getFullYear()
            const { projects, events } = getActivitiesOnDay(year, month, day)
            const hasAct    = projects.length>0 || events.length>0
            const totalActs = projects.length + events.length

            // Determine visual style for each activity pill
            // For projects spanning multiple days: show a subtle "continuing" indicator
            // instead of a full pill on every day — only show full pill on start day
            const ds = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`
            const projectPills = projects.map((p) => {
              const isStart = p.start_date === ds
              const isEnd   = p.end_date   === ds
              return { ...p, isStart, isEnd, isMid: !isStart && !isEnd }
            })

            return (
              <CalDay key={day}
                day={day} isToday={isToday} hasAct={hasAct}
                projects={projectPills} events={events}
                totalActs={totalActs}
                onClick={() => { if (hasAct) onSelectDay({ day, month, year, projects, events }) }}
              />
            )
          })}
        </div>
        <div style={{ display:'flex', gap:16, marginTop:12, paddingTop:12, borderTop:'1px solid var(--border-inner)' }}>
          <LegendDot color="var(--accent)"  label={`${org.project_label} (span)`} />
          <LegendDot color="var(--success)" label={org.event_label} />
          <div style={{ fontSize:11.5, color:'var(--text-muted)', marginLeft:'auto' }}>Click days for details</div>
        </div>
      </div>
    </Card>
  )
}
