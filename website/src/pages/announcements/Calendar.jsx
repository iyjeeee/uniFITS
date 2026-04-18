// Calendar.jsx — Monthly calendar with project/event markers + upcoming schedule list
import { useState } from 'react'
import { Card, CardHeader, Badge, Button, PageHeader } from '../../components/ui'
import { MOCK_PROJECTS, MOCK_EVENTS, formatDate } from '../../api/mockData'
import { useOrg } from '../../context/OrgContext'

function getDaysInMonth(year, month) { return new Date(year, month + 1, 0).getDate() }
function getFirstDay(year, month)   { return new Date(year, month, 1).getDay() }

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December']
const DAY_NAMES   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

export default function Calendar() {
  const org = useOrg()
  const today = new Date()
  const [year, setYear]   = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())

  const daysInMonth = getDaysInMonth(year, month)
  const firstDay    = getFirstDay(year, month)

  // Build a set of dates that have activities
  function getActivitiesOnDay(day) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    const projects = MOCK_PROJECTS.filter(p => p.start_date === dateStr)
    const events   = MOCK_EVENTS.filter(e => e.event_date === dateStr)
    return { projects, events }
  }

  function prevMonth() {
    if (month === 0) { setYear(y => y - 1); setMonth(11) }
    else setMonth(m => m - 1)
  }

  function nextMonth() {
    if (month === 11) { setYear(y => y + 1); setMonth(0) }
    else setMonth(m => m + 1)
  }

  // Upcoming activities in the next 30 days
  const upcoming = [
    ...MOCK_PROJECTS.filter(p => p.status !== 'completed').map(p => ({ ...p, kind: 'project', date: p.start_date, name: p.title })),
    ...MOCK_EVENTS.filter(e => e.status !== 'completed').map(e => ({ ...e, kind: 'event', date: e.event_date, name: e.title })),
  ].sort((a, b) => new Date(a.date) - new Date(b.date))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <PageHeader title="Calendar" subtitle={`${MONTH_NAMES[month]} ${year}`} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 16, alignItems: 'flex-start' }}>
        {/* Calendar grid */}
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
            <Button variant="secondary" size="sm" onClick={prevMonth}>‹ Prev</Button>
            <div style={{ fontSize: 15, fontWeight: 700 }}>{MONTH_NAMES[month]} {year}</div>
            <Button variant="secondary" size="sm" onClick={nextMonth}>Next ›</Button>
          </div>

          <div style={{ padding: '16px' }}>
            {/* Day headers */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: 8 }}>
              {DAY_NAMES.map(d => (
                <div key={d} style={{ textAlign: 'center', fontSize: 11.5, fontWeight: 600, color: 'var(--text-muted)', padding: '4px 0' }}>{d}</div>
              ))}
            </div>

            {/* Calendar cells */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
              {/* Empty cells before first day */}
              {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}

              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear()
                const { projects, events } = getActivitiesOnDay(day)
                const hasActivity = projects.length > 0 || events.length > 0

                return (
                  <div key={day} style={{ minHeight: 52, padding: '6px 4px', borderRadius: 6, background: isToday ? 'var(--accent-light)' : hasActivity ? 'var(--neutral-light)' : 'transparent', border: isToday ? '1px solid rgba(75,94,170,.3)' : '1px solid transparent', position: 'relative' }}>
                    <div style={{ fontSize: 12.5, fontWeight: isToday ? 700 : 400, color: isToday ? 'var(--accent)' : 'var(--text-primary)', marginBottom: 3, textAlign: 'center' }}>{day}</div>
                    {projects.map(p => <div key={p.id} style={{ fontSize: 9, background: 'var(--accent)', color: '#fff', borderRadius: 3, padding: '1px 3px', marginBottom: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.title}</div>)}
                    {events.map(e => <div key={e.id} style={{ fontSize: 9, background: 'var(--success)', color: '#fff', borderRadius: 3, padding: '1px 3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{e.title}</div>)}
                  </div>
                )
              })}
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11.5, color: 'var(--text-muted)' }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--accent)' }} /> {org.project_label}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11.5, color: 'var(--text-muted)' }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--success)' }} /> {org.event_label}
              </div>
            </div>
          </div>
        </Card>

        {/* Upcoming schedule sidebar */}
        <Card>
          <CardHeader title="Upcoming Schedule" subtitle="Next activities" />
          <div style={{ padding: '8px 0' }}>
            {upcoming.length === 0
              ? <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13.5 }}>No upcoming activities.</div>
              : upcoming.slice(0, 8).map(a => (
                  <div key={`${a.kind}-${a.id}`} style={{ padding: '12px 20px', borderBottom: '1px solid var(--border)', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: a.kind === 'event' ? 'var(--success-light)' : 'var(--accent-light)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: a.kind === 'event' ? 'var(--success)' : 'var(--accent)', lineHeight: 1 }}>{new Date(a.date).getDate()}</div>
                      <div style={{ fontSize: 9, color: a.kind === 'event' ? 'var(--success)' : 'var(--accent)', lineHeight: 1 }}>{MONTH_NAMES[new Date(a.date).getMonth()].slice(0, 3)}</div>
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.name}</div>
                      <div style={{ marginTop: 2 }}><Badge variant={a.kind === 'event' ? 'success' : 'accent'}>{a.kind}</Badge></div>
                    </div>
                  </div>
                ))
            }
          </div>
        </Card>
      </div>
    </div>
  )
}
