// Announcements.tsx — Hub with paginated View All modals, pinned/unpinned sections
// Fully responsive via useBreakpoint — calendar/tiles layout collapses on mobile
import React, { useState, useRef } from 'react'
import { Badge, StatusBadge, Card, Button, Input, Textarea, InfoModal, ResponseModal } from '../../components/ui'
import {
  MOCK_ANNOUNCEMENTS, MOCK_PROJECTS, MOCK_EVENTS,
  formatDate, formatCurrency, relativeTime,
} from '../../api/mockData'
import { useOrg } from '../../context/OrgContext'
import useBreakpoint from '../../hooks/useBreakpoint'
import type { Announcement, Project, AppEvent } from '../../types'

/* ── Merged project/event types — `kind` tells tiles, schedule rows and the detail modal which one an item is ── */
type TileItem      = (Project | AppEvent) & { kind: 'project' | 'event' }
type ScheduleEntry = TileItem & { name: string; date: string }   // ScheduleItem reads name/date/kind


/* ── Convert 24-hr "HH:MM" to 12-hr "h:MM AM/PM" ─────────────────── */
function fmt12(t: string): string | null {
  if (!t) return null
  const [h, m] = t.split(':').map(Number)
  const ampm = h >= 12 ? 'PM' : 'AM'
  const h12  = h % 12 || 12
  return `${h12}:${String(m).padStart(2,'0')} ${ampm}`
}

/* ─── Calendar helpers ─────────────────────────────────────────── */
const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December']
const DAY_NAMES   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

/* ─── Solid-color tile palette ─────────────────────────────────── */
/* Fixed type colors — project = brand blue, event = success green, for easy identification */
const KIND_COLOR = { project: '#4B5EAA', event: '#2E7D52' }
function tileColor(_id: string, kind: string): string { return (KIND_COLOR as Record<string,any>)[kind] || '#4B5EAA' }

/* ─── SVG icons ────────────────────────────────────────────────── */
const Ico = {
  Bell:   () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  Cal:    () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  Proj:   () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>,
  Event:  () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  ChevL:  () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>,
  ChevR:  () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>,
  Pin:    () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="17" x2="12" y2="22"/><path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"/></svg>,
  MapPin: () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  Clock:  () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Plus:   () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Arrow:  () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>,
}

/* ─── Pagination component ─────────────────────────────────────── */
function Pagination({ page, total, onChange }: Record<string, any>) {
  return (
    <div style={{ display: 'flex' as const, alignItems: 'center', justifyContent: 'center', gap: 4, padding: '12px 0 4px' }}>
      <PageBtn disabled={page === 1} onClick={() => onChange(page - 1)}><Ico.ChevL /></PageBtn>
      {Array.from({ length: total }, (_, i) => i + 1).map((p: any) => (
        <PageBtn key={p} active={p === page} onClick={() => onChange(p)}>{p}</PageBtn>
      ))}
      <PageBtn disabled={page === total} onClick={() => onChange(page + 1)}><Ico.ChevR /></PageBtn>
    </div>
  )
}

/* ─── Section label inside modal ───────────────────────────────── */
function ModalSection({ icon, label, count, color = 'var(--accent)' }: Record<string, any>) {
  return (
    <div style={{ display: 'flex' as const, alignItems: 'center', gap: 8, padding: '12px 0 8px', borderBottom: '2px solid var(--border-table)', marginBottom: 8 }}>
      <span style={{ color, display: 'flex' as const }}>{icon}</span>
      <span style={{ fontSize: 12, fontWeight: 700, color, textTransform: 'uppercase' as const, letterSpacing: '.08em' }}>{label}</span>
      {count !== undefined && (
        <span style={{ marginLeft: 'auto', background: color, color: '#fff', fontSize: 10.5, fontWeight: 700, padding: '2px 8px', borderRadius: 20 }}>{count}</span>
      )}
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ════════════════════════════════════════════════════════════════ */
/* ── CalDay — a single calendar day cell with smart activity display ── */
/* Projects spanning multiple days show as a continuous bar:
   - Start day: left-rounded pill with title
   - Middle days: full-width bar (no text) — keeps reading clean
   - End day: right-rounded pill
   Single-day events show as a standard pill with title.                  */
function CalDay({ day, isToday, hasAct, projects, events, totalActs, onClick }: Record<string, any>) {
  const [hov, setHov] = React.useState(false)
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
      {projects.slice(0,2).map((p: any) => (
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
      {events.slice(0, Math.max(0, 2 - projects.length)).map((e: any) => (
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


export default function Announcements() {
  const org   = useOrg()
  const { isMobile } = useBreakpoint()
  const today = new Date()

  /* ── Announcements layout helpers — responsive column counts ─── */
  const twoColLayout  = isMobile ? '1fr' : '1fr 300px'   // announcements + calendar/tiles side panel
  const tileGridCols  = isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)' // activity tile strip

  /* ── Announcement state ──────────────────────────────────────── */
  const [announcements, setAnnouncements] = useState(MOCK_ANNOUNCEMENTS)
  const [showNewModal,  setShowNewModal]  = useState(false)
  const [showAllModal,  setShowAllModal]  = useState(false)
  const [allAnnPage,    setAllAnnPage]    = useState(1)  // pagination inside All Announcements modal
  const [viewAnn,       setViewAnn]       = useState<Announcement | null>(null)
  const [form, setForm] = useState<Record<string,any>>({ title: '', content: '', is_pinned: false })
  const [annResponse,   setAnnResponse]   = useState<{variant:string;title:string;message:string} | null>(null)
  const [pendingDelete, setPendingDelete] = useState<string | null>(null)

  /* ── Announcement CRUD ───────────────────────────────────────── */
  function handleAdd() {
    if (!form.title || !form.content) return
    setAnnouncements(prev => [{ id: String(Date.now()), ...form, created_by: 'Current User', created_at: new Date().toISOString() } as Announcement, ...prev])
    setForm({ title:'', content:'', is_pinned:false })
    setShowNewModal(false)
    setAnnResponse({ variant:'success', title:'Announcement Posted', message:'Your announcement has been published and is now visible to all members.' })
  }
  function togglePin(id: string) {
    const ann = announcements.find((a: any) => a.id === id)
    setAnnouncements(prev => prev.map((a: any) => a.id === id ? { ...a, is_pinned: !a.is_pinned } : a))
    setViewAnn(null)
    setAnnResponse({ variant:'info', title: ann?.is_pinned ? 'Announcement Unpinned' : 'Announcement Pinned', message: ann?.is_pinned ? 'The announcement has been removed from the pinned section.' : 'The announcement is now pinned at the top of the list.' })
  }
  function confirmDelete(id: string) { setViewAnn(null); setPendingDelete(id as string) }
  function handleDelete() {
    setAnnouncements(prev => prev.filter((a: any) => a.id !== pendingDelete))
    setPendingDelete(null)
    setAnnResponse({ variant:'danger', title:'Announcement Deleted', message:'The announcement has been permanently removed and is no longer visible to members.' })
  }

  /* ── Calendar + schedule state ───────────────────────────────── */
  const [month,          setMonth]          = useState(today.getMonth())
  const [year,           setYear]           = useState(today.getFullYear())
  const [selectedDay,    setSelectedDay]    = useState<{day:number;projects:any[];events:any[]} | null>(null)
  const [overviewH,      setOverviewH]      = useState<string | number>('auto')
  const overviewRef                         = useRef<HTMLDivElement | null>(null)

  /* ── Calendar helpers ────────────────────────────────────────── */
  function daysInMonth(y: number, m: number)   { return new Date(y, m + 1, 0).getDate() }
  function firstDayOfMonth(y: number, m: number) { return new Date(y, m, 1).getDay() }
  function getActivitiesOnDay(day: number): {projects: any[]; events: any[]} {
    const dateStr = `${year}-${String(month + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`
    const projects = MOCK_PROJECTS.filter((p: any) => p.start_date === dateStr || p.end_date === dateStr)
    const events   = MOCK_EVENTS.filter((e: any) => e.event_date === dateStr)
    return { projects, events }
  }
  const firstDay    = firstDayOfMonth(year, month)
  const daysInMonth_ = daysInMonth(year, month)
  function prevMonth() { if (month === 0) { setYear((y: number) => y - 1); setMonth(11) } else setMonth((m: number) => m - 1) }
  function nextMonth() { if (month === 11) { setYear((y: number) => y + 1); setMonth(0) } else setMonth((m: number) => m + 1) }

  /* ── Activity tile strip + pagination ────────────────────────── */
  const TILES_PER_PAGE     = 8
  const allTiles: TileItem[] = [
    ...MOCK_PROJECTS.map((p): TileItem => ({ ...p, kind: 'project' })),
    ...MOCK_EVENTS.map((e): TileItem => ({ ...e, kind: 'event' })),
  ]
  const [tilePage,    setTilePage]    = useState(1)
  const totalTilePages = Math.max(1, Math.ceil(allTiles.length / TILES_PER_PAGE))
  const pagedTiles     = allTiles.slice((tilePage - 1) * TILES_PER_PAGE, tilePage * TILES_PER_PAGE)

  /* ── Detail modal (activity click from tile) ─────────────────── */
  const [detailItem,  setDetailItem]  = useState<Record<string,any> | null>(null)

  /* ── Schedule modal ──────────────────────────────────────────── */
  const ANN_MODAL_PER_PAGE  = 8
  const SCHED_MODAL_PER_PAGE = 8
  const [showAllSched,  setShowAllSched]  = useState(false)
  const [schedPage,     setSchedPage]     = useState(1)

  /* ── Derived announcement lists ──────────────────────────────── */
  const allSorted    = [...announcements].sort((a: any, b: any) =>
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )
  const pinnedAnn    = allSorted.filter((a: any) => a.is_pinned)
  const regularAnn   = allSorted.filter((a: any) => !a.is_pinned)
  const pagedModalAnn = regularAnn.slice(0, ANN_MODAL_PER_PAGE)
  const upcoming: ScheduleEntry[] = allTiles
    .filter(a => a.status === 'upcoming' || a.status === 'ongoing')
    .map((a): ScheduleEntry => ({ ...a, name: a.title, date: 'start_date' in a ? a.start_date : a.event_date }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  const schedModalPages  = Math.max(1, Math.ceil(upcoming.length / SCHED_MODAL_PER_PAGE))
  const pagedModalSched  = upcoming.slice((schedPage - 1) * SCHED_MODAL_PER_PAGE, schedPage * SCHED_MODAL_PER_PAGE)

  // Suppress ResizeObserver — use direct ref measurement instead
  const _overviewH_setter = (h: number) => setOverviewH(h)
  void _overviewH_setter
  void overviewH

  /* ── Display limits ──────────────────────────────────────────── */
  const ANN_LIMIT   = 5
  const SCHED_LIMIT = 5
  const panelAnn    = allSorted.slice(0, ANN_LIMIT)
  const panelSched  = upcoming.slice(0, SCHED_LIMIT)

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:14 }}>

      {/* ══ TOP ROW ══════════════════════════════════════════════════ */}
      <div style={{ display:'grid', gridTemplateColumns:twoColLayout, gap:14 }}>

        {/* LEFT — tile overview */}
        <div ref={overviewRef} style={{ display:'flex', flexDirection:'column' }}>
        <Card style={{ display:'flex', flexDirection:'column', flex: 1 }}>
          <div style={{ padding:'12px 16px', borderBottom:'1px solid var(--border-inner)', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
            <div>
              <div style={{ fontSize:13.5, fontWeight:600 }}>Project &amp; Event Overview</div>
              <div style={{ fontSize:11.5, color:'var(--text-muted)', marginTop:1 }}>Ongoing &amp; upcoming activities</div>
            </div>
            <div style={{ display:'flex', gap:12, alignItems:'center' }}>
              <LegendDot color="var(--accent)"  label={`${org.project_label}s`} />
              <LegendDot color="var(--success)" label={`${org.event_label}s`} />
            </div>
          </div>

          <div style={{ padding:'14px 16px', flex:1 }}>
            {pagedTiles.length === 0
              ? <div style={{ textAlign:'center', padding:'40px 0', color:'var(--text-muted)', fontSize:13 }}>No active activities.</div>
              : (
                <div style={{ display:'grid', gridTemplateColumns:tileGridCols, gap:12 }}>
                  {pagedTiles.map((item: any) => (
                    <TileCard key={`${item.kind}-${item.id}`} item={item} org={org} onClick={() => setDetailItem(item)} />
                  ))}
                </div>
              )
            }
          </div>

          {/* Always-visible pagination */}
          <div style={{ padding:'10px 16px', borderTop:'1px solid var(--border-inner)', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
            <div style={{ fontSize:12, color:'var(--text-muted)' }}>Page {tilePage} of {totalTilePages} · {allTiles.length} total</div>
            <div style={{ display:'flex', gap:4 }}>
              <PageBtn disabled={tilePage===1}              onClick={() => setTilePage(p=>p-1)}><Ico.ChevL /></PageBtn>
              {Array.from({ length: totalTilePages }, (_,i) => i+1).map((p: any) => (
                <PageBtn key={p} active={p===tilePage} onClick={() => setTilePage(p)}>{p}</PageBtn>
              ))}
              <PageBtn disabled={tilePage===totalTilePages} onClick={() => setTilePage(p=>p+1)}><Ico.ChevR /></PageBtn>
            </div>
          </div>
        </Card>
        </div>

        {/* RIGHT — Announcements */}
        <Card style={{ display:'flex', flexDirection:'column', minHeight: overviewH || 0 }}>
          <div style={{ padding:'12px 14px', borderBottom:'1px solid var(--border-inner)', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
            <div style={{ display:'flex', alignItems:'center', gap:7 }}>
              <span style={{ color:'var(--accent)', display:'flex' }}><Ico.Bell /></span>
              <span style={{ fontSize:13.5, fontWeight:600 }}>Announcements</span>
            </div>
            <button onClick={() => setShowNewModal(true)} title="New Announcement"
              style={{ width:28, height:28, borderRadius:7, border:'none', background:'var(--accent)', color:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 2px 8px rgba(75,94,170,.3)' }}>
              <Ico.Plus />
            </button>
          </div>

          <div style={{ flex:1, overflowY:'auto', minHeight:0 }}>
            {panelAnn.length === 0
              ? <div style={{ padding:'24px', textAlign:'center', color:'var(--text-muted)', fontSize:13 }}>No announcements yet. Click + to add one.</div>
              : panelAnn.map((a: any) => <AnnRow key={a.id} a={a} onClick={() => setViewAnn(a)} />)
            }
          </div>

          {/* View All — centered */}
          <div style={{ padding:'12px 14px', borderTop:'1px solid var(--border-inner)', flexShrink:0, textAlign:'center' }}>
            <button
              onClick={() => { setAllAnnPage(1); setShowAllModal(true) }}
              style={{ padding:'8px 24px', borderRadius:8, border:'1.5px solid var(--border-card)', background:'var(--neutral-light)', cursor:'pointer', fontSize:13, fontWeight:600, color:'var(--accent)', fontFamily:'var(--font-body)' }}>
              View All Announcements ({allSorted.length})
            </button>
          </div>
        </Card>
      </div>

      {/* ══ BOTTOM ROW ═══════════════════════════════════════════════ */}
      <div style={{ display:'grid', gridTemplateColumns:twoColLayout, gap:14 }}>

        {/* Calendar */}
        <Card>
          <div style={{ padding:'12px 18px', borderBottom:'1px solid var(--border-inner)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <button onClick={prevMonth} style={calNavBtn}><Ico.ChevL /></button>
            <div style={{ fontSize:15, fontWeight:700 }}>{MONTH_NAMES[month]} {year}</div>
            <button onClick={nextMonth} style={calNavBtn}><Ico.ChevR /></button>
          </div>

          <div style={{ padding:'14px 18px' }}>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', marginBottom:6 }}>
              {DAY_NAMES.map((d: any) => (
                <div key={d} style={{ textAlign:'center', fontSize:10.5, fontWeight:700, color:'var(--text-muted)', padding:'2px 0', textTransform:'uppercase', letterSpacing:'.06em' }}>{d}</div>
              ))}
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:3 }}>
              {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
              {Array.from({ length: daysInMonth_ }, (_: any, i: number) => i+1).map((day: number) => {
                const isToday   = day===today.getDate() && month===today.getMonth() && year===today.getFullYear()
                const { projects, events } = getActivitiesOnDay(day)
                const hasAct    = projects.length>0 || events.length>0
                const totalActs = projects.length + events.length

                // Determine visual style for each activity pill
                // For projects spanning multiple days: show a subtle "continuing" indicator
                // instead of a full pill on every day — only show full pill on start day
                const ds = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`
                const projectPills = projects.map((p: any) => {
                  const isStart = p.start_date === ds
                  const isEnd   = p.end_date   === ds
                  return { ...p, isStart, isEnd, isMid: !isStart && !isEnd }
                })

                return (
                  <CalDay key={day}
                    day={day} isToday={isToday} hasAct={hasAct}
                    projects={projectPills} events={events}
                    totalActs={totalActs}
                    onClick={() => { if (hasAct) setSelectedDay({ day, projects, events }) }}
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

        {/* Upcoming Schedule */}
        <Card style={{ display:'flex', flexDirection:'column' }}>
          <div style={{ padding:'12px 16px', borderBottom:'1px solid var(--border-inner)', display:'flex', alignItems:'center', gap:7, flexShrink:0 }}>
            <span style={{ color:'var(--accent)', display:'flex' }}><Ico.Cal /></span>
            <span style={{ fontSize:13.5, fontWeight:600 }}>Upcoming Schedule</span>
          </div>
          <div style={{ flex:1, padding:'4px 0' }}>
            {panelSched.length === 0
              ? <div style={{ padding:'24px', textAlign:'center', color:'var(--text-muted)', fontSize:13 }}>No upcoming activities.</div>
              : panelSched.map((a: any) => <ScheduleItem key={`${a.kind}-${a.id}`} a={a} />)
            }
          </div>
          {/* View All — centered */}
          <div style={{ padding:'12px 16px', borderTop:'1px solid var(--border-inner)', flexShrink:0, textAlign:'center' }}>
            <button
              onClick={() => { setSchedPage(1); setShowAllSched(true) }}
              style={{ padding:'8px 24px', borderRadius:8, border:'1.5px solid var(--border-card)', background:'var(--neutral-light)', cursor:'pointer', fontSize:13, fontWeight:600, color:'var(--accent)', fontFamily:'var(--font-body)' }}>
              View All Schedule ({upcoming.length})
            </button>
          </div>
        </Card>
      </div>

      {/* ══ MODALS ══════════════════════════════════════════════════ */}

      {/* Announcement detail */}
      {viewAnn && (
        <InfoModal open={!!viewAnn} onClose={() => setViewAnn(null)}
          title={viewAnn.title}
          subtitle={`By ${viewAnn.created_by} · ${relativeTime(viewAnn.created_at)}`}
          accentColor={viewAnn.is_pinned ? 'var(--accent)' : 'var(--text-muted)'}
          footer={
            <div style={{ display:'flex', gap:8, justifyContent:'flex-end' }}>
              <div style={{ display:'flex', gap:8 }}>
                <Button variant="secondary" size="sm" onClick={() => togglePin(viewAnn.id)}>{viewAnn.is_pinned ? 'Unpin' : 'Pin'}</Button>
                <Button variant="danger" size="sm" onClick={() => confirmDelete(viewAnn.id)}>Delete</Button>
              </div>
              <Button variant="secondary" onClick={() => setViewAnn(null)}>Close</Button>
            </div>
          }>
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {viewAnn.is_pinned && (
              <div style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 12px', background:'var(--accent-light)', borderRadius:8, border:'1px solid rgba(75,94,170,.2)', color:'var(--accent)', fontSize:13, fontWeight:600 }}>
                <Ico.Pin /> Pinned Announcement
              </div>
            )}
            <p style={{ fontSize:15, lineHeight:1.75, color:'var(--text-secondary)', margin:0 }}>{viewAnn.content}</p>
          </div>
        </InfoModal>
      )}

      {/* New Announcement */}
      <InfoModal open={showNewModal} onClose={() => setShowNewModal(false)}
        title="New Announcement"
        subtitle="Post an update visible to all members"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowNewModal(false)}>Close</Button>
            <Button onClick={handleAdd}>Post Announcement</Button>
          </>
        }>
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <Input label="Title" value={form.title} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Announcement title" required />
          <Textarea label="Content" value={form.content} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setForm(f => ({ ...f, content: e.target.value }))} placeholder="Write your announcement here…" rows={6} required />
          <label style={{ display:'flex', alignItems:'center', gap:10, fontSize:13.5, cursor:'pointer' }}>
            <input type="checkbox" checked={form.is_pinned} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setForm(f => ({ ...f, is_pinned: (e.target as HTMLInputElement).checked }))} style={{ accentColor:'var(--accent)', width:15, height:15 }} />
            Pin this announcement to the top
          </label>
        </div>
      </InfoModal>

      {/* ── View All Announcements — with pinned/unpinned sections + pagination ── */}
      <InfoModal open={showAllModal} onClose={() => setShowAllModal(false)}
        title="All Announcements"
        subtitle={`${allSorted.length} total · ${pinnedAnn.length} pinned · ${regularAnn.length} unpinned`}>
        <div>
          {/* Pinned section */}
          {pinnedAnn.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <ModalSection
                icon={<Ico.Pin />}
                label="Pinned"
                count={pinnedAnn.length}
                color="var(--accent)"
              />
              {pinnedAnn.map((a: any) => (
                <AnnRow key={a.id} a={a} onClick={() => { setShowAllModal(false); setViewAnn(a) }} />
              ))}
            </div>
          )}

          {/* Unpinned section */}
          {regularAnn.length > 0 && (
            <div>
              <ModalSection
                icon={<Ico.Bell />}
                label="Recent Posts"
                count={regularAnn.length}
                color="var(--text-secondary)"
              />
              {/* Paginated unpinned list */}
              {pagedModalAnn
                .filter((a: any) => !a.is_pinned)
                .map((a: any) => (
                  <AnnRow key={a.id} a={a} onClick={() => { setShowAllModal(false); setViewAnn(a) }} />
                ))}
              {/* Show all pinned on first page too if they were included in slice */}
              {allSorted
                .filter((a: any) => !a.is_pinned)
                .slice((allAnnPage - 1) * ANN_MODAL_PER_PAGE, allAnnPage * ANN_MODAL_PER_PAGE)
                .filter((a, _, _arr) => !pagedModalAnn.filter((p: any) => !p.is_pinned).find((p: any) => p.id === a.id))
                .map((a: any) => (
                  <AnnRow key={a.id} a={a} onClick={() => { setShowAllModal(false); setViewAnn(a) }} />
                ))}
            </div>
          )}

          {/* Pagination for unpinned */}
          {regularAnn.length > ANN_MODAL_PER_PAGE && (
            <Pagination
              page={allAnnPage}
              total={Math.ceil(regularAnn.length / ANN_MODAL_PER_PAGE)}
              onChange={setAllAnnPage}
            />
          )}

          {allSorted.length === 0 && (
            <div style={{ textAlign:'center', padding:'32px 0', color:'var(--text-muted)', fontSize:13 }}>
              No announcements yet.
            </div>
          )}
        </div>
      </InfoModal>

      {/* ── View All Schedule — with pagination ───────────────────── */}
      <InfoModal open={showAllSched} onClose={() => setShowAllSched(false)}
        title="Full Upcoming Schedule"
        subtitle={`${upcoming.length} activities · Page ${schedPage} of ${schedModalPages} · 10 per page`}>
        <div>
          {pagedModalSched.map((a: any) => <ScheduleItem key={`${a.kind}-${a.id}`} a={a} />)}
          <Pagination page={schedPage} total={schedModalPages} onChange={setSchedPage} />
        </div>
      </InfoModal>

      {/* Tile detail */}
      {detailItem && (
        <InfoModal open={!!detailItem} onClose={() => setDetailItem(null)}
          title={detailItem.title}
          subtitle={detailItem.kind==='project' ? `${org.project_label} · ${detailItem.project_type||''}` : org.event_label}
          accentColor={detailItem.kind==='project' ? 'var(--accent)' : 'var(--success)'}
          footer={
            <div style={{ display:'flex', gap:10, justifyContent:'flex-end' }}>
              {/* "View Full Details" — redirects to the manage page for this item */}
              <button
                onClick={() => {
                  setDetailItem(null)
                  window.location.hash = detailItem.kind === 'project' ? '/projects' : '/events'
                }}
                style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'10px 20px', borderRadius:9, border:'none', background: detailItem.kind==='project' ? 'var(--accent)' : 'var(--success)', color:'#fff', fontSize:14, fontWeight:600, cursor:'pointer', fontFamily:'var(--font-body)' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                View Full Details
              </button>
              <button onClick={() => setDetailItem(null)}
                style={{ padding:'10px 24px', borderRadius:9, border:'1.5px solid var(--border-card)', background:'var(--neutral-light)', color:'var(--text-primary)', fontSize:14, fontWeight:600, cursor:'pointer', fontFamily:'var(--font-body)' }}>
                Close
              </button>
            </div>
          }>
          <DetailContent item={detailItem} org={org} />
        </InfoModal>
      )}

      {/* Calendar day detail */}
      {selectedDay && (
        <InfoModal open={!!selectedDay} onClose={() => setSelectedDay(null)}
          title={`${MONTH_NAMES[month]} ${selectedDay.day}, ${year}`}
          subtitle="Activities on this day">
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {(selectedDay as any).projects.map((p: any) => <DayCard key={p.id} item={{ ...p, kind:'project' }} org={org} />)}
            {(selectedDay as any).events.map((e: any) => <DayCard key={e.id} item={{ ...e, kind:'event' }} org={org} />)}
          </div>
        </InfoModal>
      )}

      {/* Delete confirm */}
      <ResponseModal
        open={!!pendingDelete}
        onClose={() => setPendingDelete(null)}
        variant="danger"
        title="Delete Announcement?"
        message="This will permanently remove the announcement. All members will lose access to this post and it cannot be recovered."
        confirmLabel="Yes, Delete"
        cancelLabel="Close"
        onConfirm={handleDelete}
      />

      {/* Action feedback */}
      <ResponseModal
        open={!!annResponse}
        onClose={() => setAnnResponse(null)}
        variant={(annResponse?.variant || 'success') as import('../../types').ModalVariant || 'success'}
        title={annResponse?.title  || ''}
        message={annResponse?.message || ''}
        confirmLabel="Got it"
      />
    </div>
  )
}

/* ─── Sub-components (same as before, solid colors) ─────────────────────────  */
function TileCard({ item, org, onClick }: Record<string, any>) {
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

function DetailContent({ item, org }: Record<string, any>) {
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

function DayCard({ item, org: _org }: Record<string, any>) {
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

function AnnRow({ a, onClick }: Record<string, any>) {
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

function ScheduleItem({ a }: Record<string, any>) {
  const d  = new Date(a.date)
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

function LegendDot({ color, label }: Record<string, any>) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:5, fontSize:11.5, color:'var(--text-muted)' }}>
      <div style={{ width:8, height:8, borderRadius:'50%', background:color }} />{label}
    </div>
  )
}

function PageBtn({ children, active, disabled, onClick }: Record<string, any>) {
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ display:'flex', alignItems:'center', justifyContent:'center', width:28, height:28, borderRadius:6, border:'1.5px solid var(--border-card)', background: active ? 'var(--accent)' : disabled ? 'var(--neutral-light)' : '#fff', color: active ? '#fff' : disabled ? 'var(--text-muted)' : 'var(--text-primary)', cursor: disabled ? 'not-allowed' : 'pointer', fontSize:12, fontWeight: active ? 700 : 400 }}>
      {children}
    </button>
  )
}

const calNavBtn = { display:'flex', alignItems:'center', justifyContent:'center', width:30, height:30, borderRadius:7, border:'1.5px solid var(--border-card)', background:'#fff', cursor:'pointer', color:'var(--text-secondary)' }
