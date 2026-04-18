// Attendance.jsx — Project + Event tile cards. Clicking a tile opens an InfoModal
// with 3 interactive sections: No Record | Present | Absent.
// Each member card has a dropdown to set Present/Absent.
// Section headers have "Mark All Present" / "Mark All Absent" bulk-action buttons.
import { useState } from 'react'
import { Card, InfoModal, Badge } from '../../components/ui'
import { MOCK_ATTENDANCES, MOCK_PROJECTS, MOCK_EVENTS, MOCK_USERS, formatDate } from '../../api/mockData'
import { useOrg } from '../../context/OrgContext'
import useBreakpoint from '../../hooks/useBreakpoint'

/* ── SVG Icons ───────────────────────────────────────────────────── */
function IcoProject()   { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg> }
function IcoEvent()     { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> }
function IcoUsers()     { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg> }
function IcoClock()     { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> }
function IcoPin()       { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> }
function IcoCheck()     { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> }
function IcoX()         { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> }
function IcoSave()      { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg> }

/* ── Status config ───────────────────────────────────────────────── */
const STATUS_COLOR = { present: '#2E7D52', absent: '#C0392B', 'no-record': '#9CA3AF' }
const STATUS_BG    = { present: '#f0faf4', absent: '#fdf3f2', 'no-record': '#F9FAFB' }

/* ── AttendanceTileCard — clickable activity summary card ────────── */
function AttendanceTileCard({ activity, kind, records, org, onClick }) {
  const actRecords = records.filter(r => r.activity === activity.title)
  const present    = actRecords.filter(r => r.status === 'present' || r.status === 'late').length
  const absent     = actRecords.filter(r => r.status === 'absent').length
  const total      = MOCK_USERS.length
  const noRecord   = total - actRecords.length
  const accentHex  = kind === 'project' ? '#4B5EAA' : '#2E7D52'

  return (
    <div
      onClick={onClick}
      style={{ borderRadius: 12, overflow: 'hidden', border: `2px solid ${accentHex}30`, background: '#fff', cursor: 'pointer', display: 'flex', flexDirection: 'column', transition: 'transform .15s, box-shadow .15s' }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 8px 20px ${accentHex}30` }}
      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}>
      <div style={{ height: 5, background: accentHex }} />
      <div style={{ padding: '14px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {/* Title */}
        <div style={{ fontSize: 13.5, fontWeight: 700, lineHeight: 1.3, color: 'var(--text-primary)', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
          {activity.title}
        </div>
        {/* Meta */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {(activity.start_date || activity.event_date) && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--text-muted)' }}>
              <IcoClock /> {formatDate(activity.start_date || activity.event_date)}
            </div>
          )}
          {activity.location && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--text-muted)' }}>
              <IcoPin /> {activity.location}
            </div>
          )}
        </div>
        {/* Summary chips */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {present  > 0 && <span style={{ padding: '2px 9px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: '#f0faf4', color: '#2E7D52', border: '1px solid #2E7D5230' }}>Present: {present}</span>}
          {absent   > 0 && <span style={{ padding: '2px 9px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: '#fdf3f2', color: '#C0392B', border: '1px solid #C0392B30' }}>Absent: {absent}</span>}
          {noRecord > 0 && <span style={{ padding: '2px 9px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: '#F9FAFB', color: '#9CA3AF', border: '1px solid #E5E7EB' }}>No Record: {noRecord}</span>}
          {actRecords.length === 0 && <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>No records yet</span>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: accentHex, fontWeight: 600, marginTop: 'auto', paddingTop: 8, borderTop: '1px solid var(--border-inner)' }}>
          <IcoUsers /> {actRecords.length}/{total} recorded — click to manage
        </div>
      </div>
    </div>
  )
}

/* ── MemberCard — individual member with dropdown + status ──────── */
function MemberCard({ member, num, onStatusChange }) {
  const [open, setOpen] = useState(false)  // dropdown open state
  const status   = member.status          // 'present' | 'absent' | null (no record)
  const sKey     = status || 'no-record'
  const color    = STATUS_COLOR[sKey]
  const bg       = STATUS_BG[sKey]
  const label    = status ? (status.charAt(0).toUpperCase() + status.slice(1)) : 'No Record'

  return (
    <div style={{
      padding: '10px 12px', borderRadius: 10, position: 'relative',
      background: bg, border: `1.5px solid ${color}40`,
      display: 'flex', flexDirection: 'column', gap: 7,
    }}>
      {/* Number + name */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
        <div style={{ width: 22, height: 22, borderRadius: '50%', flexShrink: 0, background: color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10.5, fontWeight: 800 }}>
          {num}
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 12.5, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text-primary)' }}>
            {member.name}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>{member.role}</div>
        </div>
      </div>

      {/* Status dropdown trigger */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', padding: '4px 8px', borderRadius: 7, cursor: 'pointer',
          border: `1.5px solid ${color}60`, background: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600, color,
        }}>
        <span>{label}</span>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .15s' }}>
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>

      {/* Dropdown options */}
      {open && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50,
          background: '#fff', border: '1.5px solid var(--border-card)',
          borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,.12)',
          overflow: 'hidden', marginTop: 2,
        }}>
          {[
            { value: 'present', label: 'Present', color: '#2E7D52', bg: '#f0faf4' },
            { value: 'absent',  label: 'Absent',  color: '#C0392B', bg: '#fdf3f2' },
          ].map(opt => (
            <button
              key={opt.value}
              onClick={() => { onStatusChange(member.userId, opt.value); setOpen(false) }}
              style={{
                width: '100%', padding: '8px 12px', cursor: 'pointer',
                border: 'none', background: opt.value === status ? opt.bg : '#fff',
                display: 'flex', alignItems: 'center', gap: 8,
                fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, color: opt.color,
                transition: 'background .1s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = opt.bg }}
              onMouseLeave={e => { e.currentTarget.style.background = opt.value === status ? opt.bg : '#fff' }}>
              {opt.value === 'present' ? <IcoCheck /> : <IcoX />}
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/* ── Attendance Section — No Record / Present / Absent ───────────── */
function AttendanceSection({ title, members, color, bg, icon, bulkActions, gridCols, onStatusChange }) {
  if (members.length === 0) return null

  return (
    <div>
      {/* Section header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 14px', borderRadius: 8, marginBottom: 12,
        background: bg, border: `1.5px solid ${color}40`,
        flexWrap: 'wrap', gap: 8,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color, display: 'flex' }}>{icon}</span>
          <span style={{ fontSize: 13, fontWeight: 700, color }}>
            {title} <span style={{ fontSize: 12, fontWeight: 600, opacity: .8 }}>({members.length})</span>
          </span>
        </div>
        {/* Bulk-action buttons shown for the "No Record" section */}
        {bulkActions && (
          <div style={{ display: 'flex', gap: 6 }}>
            {bulkActions.map(btn => (
              <button key={btn.label} onClick={btn.onClick}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 12px', borderRadius: 7, border: 'none', background: btn.solidBg, color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                {btn.icon} {btn.label}
              </button>
            ))}
          </div>
        )}
      </div>
      {/* Member card grid */}
      <div style={{ display: 'grid', gridTemplateColumns: gridCols, gap: 10 }}>
        {members.map(m => (
          <MemberCard key={m.userId} member={m} num={m.num} onStatusChange={onStatusChange} />
        ))}
      </div>
    </div>
  )
}

/* ── Attendance Detail Modal content ────────────────────────────── */
function AttendanceDetailContent({ activity, kind, localAttendance, onStatusChange, onMarkAllNoRecord, onResetAll, org, isMobile, isTablet }) {
  const accentC   = kind === 'project' ? 'var(--accent)' : 'var(--success)'
  const bgC       = kind === 'project' ? 'var(--accent-light)' : 'var(--success-light)'
  const gridCols  = isMobile ? 'repeat(2,1fr)' : isTablet ? 'repeat(3,1fr)' : 'repeat(4,1fr)'

  // Build full member list with numbered positions
  const memberList = MOCK_USERS.map((user, idx) => ({
    num:    idx + 1,
    userId: user.id,
    name:   user.full_name,
    role:   user.role,
    status: localAttendance[user.id] || null,
  }))

  // Split into the 3 sections
  const noRecord = memberList.filter(m => !m.status)
  const present  = memberList.filter(m => m.status === 'present')
  const absent   = memberList.filter(m => m.status === 'absent')

  const presentCount = present.length
  const absentCount  = absent.length
  const noRecCount   = noRecord.length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>

      {/* Activity hero */}
      <div style={{ padding: '14px 18px', borderRadius: 12, background: bgC, border: `1.5px solid ${accentC}30` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <span style={{ color: accentC }}>{kind === 'project' ? <IcoProject /> : <IcoEvent />}</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: accentC, textTransform: 'uppercase', letterSpacing: '.06em' }}>
            {kind === 'project' ? org.project_label : org.event_label}
          </span>
        </div>
        <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)' }}>{activity.title}</div>
      </div>

      {/* Summary stat row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
        {[
          ['No Record', noRecCount,   '#9CA3AF', '#F9FAFB'],
          ['Present',   presentCount, '#2E7D52', '#f0faf4'],
          ['Absent',    absentCount,  '#C0392B', '#fdf3f2'],
        ].map(([label, count, color, bg]) => (
          <div key={label} style={{ padding: '10px 12px', borderRadius: 10, background: bg, border: `1.5px solid ${color}30`, textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 800, color, lineHeight: 1 }}>{count}</div>
            <div style={{ fontSize: 11.5, color, fontWeight: 600, marginTop: 3 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* ── Section 1: No Record — Mark All Present + Mark All Absent + Reset All ── */}
      <AttendanceSection
        title="No Record"
        members={noRecord}
        color="#9CA3AF"
        bg="#F9FAFB"
        icon={<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>}
        bulkActions={noRecord.length > 0 ? [
          { label: 'Mark All Present', solidBg: '#2E7D52', icon: <IcoCheck />, onClick: () => onMarkAllNoRecord(noRecord, 'present') },
          { label: 'Mark All Absent',  solidBg: '#C0392B', icon: <IcoX />,     onClick: () => onMarkAllNoRecord(noRecord, 'absent')  },
        ] : null}
        gridCols={gridCols}
        onStatusChange={onStatusChange}
      />

      {/* ── Section 2: Present — Mark All Absent + Mark All No Record ── */}
      <AttendanceSection
        title="Present"
        members={present}
        color="#2E7D52"
        bg="#f0faf4"
        icon={<IcoCheck />}
        bulkActions={present.length > 0 ? [
          { label: 'Mark All No Record', solidBg: '#9CA3AF', icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>, onClick: () => onResetAll(present) },
          { label: 'Mark All Absent',    solidBg: '#C0392B', icon: <IcoX />, onClick: () => onMarkAllNoRecord(present, 'absent') },
        ] : null}
        gridCols={gridCols}
        onStatusChange={onStatusChange}
      />

      {/* ── Section 3: Absent — Mark All No Record + Mark All Present ── */}
      <AttendanceSection
        title="Absent"
        members={absent}
        color="#C0392B"
        bg="#fdf3f2"
        icon={<IcoX />}
        bulkActions={absent.length > 0 ? [
          { label: 'Mark All No Record', solidBg: '#9CA3AF', icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>, onClick: () => onResetAll(absent) },
          { label: 'Mark All Present',   solidBg: '#2E7D52', icon: <IcoCheck />, onClick: () => onMarkAllNoRecord(absent, 'present') },
        ] : null}
        gridCols={gridCols}
        onStatusChange={onStatusChange}
      />
    </div>
  )
}

/* ── Section Header for the two tile-grid sections ───────────────── */
function SectionHeader({ icon, label, count, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
      <div style={{ width: 32, height: 32, borderRadius: 8, background: color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', color, flexShrink: 0 }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{label}</div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 1 }}>
          {count} activit{count !== 1 ? 'ies' : 'y'} — click any card to manage attendance
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════════ */
export default function Attendance() {
  const org = useOrg()
  const { isMobile, isTablet } = useBreakpoint()
  const tileCols = isMobile ? '1fr' : isTablet ? 'repeat(2,1fr)' : 'repeat(3,1fr)'

  // Global attendance records (would come from API — using mock as seed)
  const [allRecords, setAllRecords] = useState(MOCK_ATTENDANCES)

  // Modal state
  const [viewItem,       setViewItem]       = useState(null)    // { activity, kind }
  const [localAttendance, setLocalAttendance] = useState({})    // { userId: 'present'|'absent' }

  // Open modal — pre-populate localAttendance from existing records for this activity
  function openModal(activity, kind) {
    const actRecords = allRecords.filter(r => r.activity === activity.title)
    const init = {}
    actRecords.forEach(r => {
      // Map late/excused to present for the simplified 2-option UI
      init[r.user_id] = (r.status === 'present' || r.status === 'late') ? 'present' : 'absent'
    })
    setLocalAttendance(init)
    setViewItem({ activity, kind })
  }

  // Update a single member's status
  function handleStatusChange(userId, newStatus) {
    setLocalAttendance(prev => ({ ...prev, [userId]: newStatus }))
  }

  // Bulk mark all "no record" members with a given status
  function handleMarkAllNoRecord(members, status) {
    setLocalAttendance(prev => {
      const updated = { ...prev }
      members.forEach(m => { updated[m.userId] = status })
      return updated
    })
  }

  // Reset members back to "no record" — removes their status key entirely
  function handleResetAll(members) {
    setLocalAttendance(prev => {
      const updated = { ...prev }
      members.forEach(m => { delete updated[m.userId] })
      return updated
    })
  }

  // Save attendance — merge localAttendance back into allRecords
  function handleSave() {
    if (!viewItem) return
    const activityTitle = viewItem.activity.title
    const kind          = viewItem.kind

    // Remove existing records for this activity then add updated ones
    const base = allRecords.filter(r => r.activity !== activityTitle)
    const newRecords = Object.entries(localAttendance).map(([userId, status]) => {
      const user = MOCK_USERS.find(u => u.id === userId)
      return {
        id:              `${activityTitle}-${userId}`,
        user_id:          userId,
        user_name:        user?.full_name || '',
        activity_type:    kind,
        activity:         activityTitle,
        attendance_date:  new Date().toISOString().split('T')[0],
        status,
        remarks:          null,
        recorded_by:      'Current User',
      }
    })
    setAllRecords([...base, ...newRecords])
    setViewItem(null)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

      {/* ── Projects Section ──────────────────────────────────── */}
      <Card style={{ padding: '18px 20px' }}>
        <SectionHeader icon={<IcoProject />} label={`${org.project_label} Attendance`} count={MOCK_PROJECTS.length} color="var(--accent)" />
        <div style={{ display: 'grid', gridTemplateColumns: tileCols, gap: 14 }}>
          {MOCK_PROJECTS.map(project => (
            <AttendanceTileCard
              key={project.id}
              activity={project}
              kind="project"
              records={allRecords}
              org={org}
              onClick={() => openModal(project, 'project')}
            />
          ))}
        </div>
      </Card>

      {/* ── Events Section ────────────────────────────────────── */}
      <Card style={{ padding: '18px 20px' }}>
        <SectionHeader icon={<IcoEvent />} label={`${org.event_label} Attendance`} count={MOCK_EVENTS.length} color="var(--success)" />
        <div style={{ display: 'grid', gridTemplateColumns: tileCols, gap: 14 }}>
          {MOCK_EVENTS.map(event => (
            <AttendanceTileCard
              key={event.id}
              activity={event}
              kind="event"
              records={allRecords}
              org={org}
              onClick={() => openModal(event, 'event')}
            />
          ))}
        </div>
      </Card>

      {/* ── Attendance Detail / Marking InfoModal ─────────────── */}
      <InfoModal
        open={!!viewItem}
        onClose={() => setViewItem(null)}
        title={viewItem?.activity.title || ''}
        subtitle={viewItem ? `${viewItem.kind === 'project' ? org.project_label : org.event_label} · Mark Attendance` : ''}
        accentColor={viewItem?.kind === 'project' ? 'var(--accent)' : 'var(--success)'}
        footer={
          <div style={{ display: 'flex', gap: 10, justifyContent: 'space-between', width: '100%' }}>
            <button onClick={handleSave}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 22px', borderRadius: 9, border: 'none', background: 'var(--success)', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
              <IcoSave /> Save Attendance
            </button>
            <button onClick={() => setViewItem(null)}
              style={{ padding: '10px 28px', borderRadius: 9, border: '1.5px solid var(--border-card)', background: 'var(--neutral-light)', color: 'var(--text-primary)', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{marginRight:4}}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> Close
            </button>
          </div>
        }>
        {viewItem && (
          <AttendanceDetailContent
            activity={viewItem.activity}
            kind={viewItem.kind}
            localAttendance={localAttendance}
            onStatusChange={handleStatusChange}
            onMarkAllNoRecord={handleMarkAllNoRecord}
            onResetAll={handleResetAll}
            org={org}
            isMobile={isMobile}
            isTablet={isTablet}
          />
        )}
      </InfoModal>
    </div>
  )
}
