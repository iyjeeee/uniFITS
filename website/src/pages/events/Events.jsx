// Events.jsx — Manage events with Announcements-style detail modal, in-modal edit,
// funding progress bar, solid action buttons, status-colored rows, always-visible pagination
// Fully responsive via useBreakpoint — KPI grid collapses on mobile
import { useState } from 'react'
import { Card, StatusBadge, InfoModal, ResponseModal } from '../../components/ui'
import { MOCK_EVENTS, formatCurrency, formatDate, fmt12} from '../../api/mockData'
import { useOrg } from '../../context/OrgContext'
import { rowStyle, rowHoverBg, modalAccentColor } from '../../constants/tableColors'
import ItemDetailContent from '../../components/ItemDetailContent'
import EditItemModal from '../../components/EditItemModal'
import useBreakpoint from '../../hooks/useBreakpoint'

/* ── SVG icons ──────────────────────────────────────────────────── */
function IcoDelete()  { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"   strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg> }
function IcoApprove() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> }
function IcoReject()  { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> }
function IcoPlus()    { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> }
function IcoPen()     { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"   strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> }

function IconBtn({ children, solidBg, title, onClick }) {
  return (
    <button onClick={e => { e.stopPropagation(); onClick() }} title={title}
      style={{ width: 32, height: 32, borderRadius: 7, border: 'none', background: solidBg, color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform .18s ease, box-shadow .18s ease', flexShrink: 0 }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.boxShadow = '0 0 0 1.5px rgba(0,0,0,.70), 0 4px 12px rgba(0,0,0,.14)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = ''
        e.currentTarget.style.boxShadow = ''
      }}>
      {children}
    </button>
  )
}

function PaginationRow({ page, totalPages, onPageChange, total }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 20px', borderTop: '1px solid var(--border-inner)', flexWrap: 'wrap', gap: 8 }}>
      <span style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>Page {page} of {totalPages} · {total} records</span>
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
          <button key={p} onClick={() => onPageChange(p)} style={{ width: 30, height: 30, borderRadius: 6, border: '1.5px solid var(--border-card)', background: p === page ? 'var(--accent)' : '#fff', color: p === page ? '#fff' : 'var(--text-primary)', cursor: 'pointer', fontSize: 12, fontWeight: p === page ? 700 : 400 }}>{p}</button>
        ))}
      </div>
    </div>
  )
}

function DeleteBody({ item, type }) {
  const cap = s => s ? s.charAt(0).toUpperCase() + s.slice(1) : '—'
  const rows = [['Event Name', item.title], ['Date', formatDate(item.event_date)], ['Location', item.location || '—'], ['Status', cap(item.status)], ['Target Funding', item.target_funding > 0 ? formatCurrency(item.target_funding) : 'None']]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ padding: '14px 16px', borderRadius: 10, background: '#fdecea', border: '1.5px solid rgba(192,57,43,.30)', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" strokeWidth="2.5" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 1 }}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        <div>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--danger)' }}>Warning: This action cannot be undone</div>
          <div style={{ fontSize: 12.5, color: 'var(--danger)', marginTop: 3, lineHeight: 1.5 }}>Deleting this {type} will permanently remove all associated data.</div>
        </div>
      </div>
      <div>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 10 }}>{type} Summary</div>
        {rows.map(([k, v], idx) => (
          <div key={k} style={{ display: 'flex', gap: 16, padding: '10px 14px', borderBottom: '1px solid var(--border-inner)', background: idx % 2 === 0 ? 'var(--neutral-light)' : '#fff' }}>
            <div style={{ width: 140, fontSize: 12.5, color: 'var(--text-muted)', flexShrink: 0, fontWeight: 500 }}>{k}</div>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)' }}>{v}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════════ */
export default function Events() {
  const org = useOrg()
  const { isMobile, isTablet } = useBreakpoint()
  const kpiCols = isMobile || isTablet ? 'repeat(2,1fr)' : 'repeat(4,1fr)' // responsive KPI grid
  const [data,         setData]         = useState(MOCK_EVENTS)
  const [viewItem,     setViewItem]     = useState(null)
  const [editItem,     setEditItem]     = useState(null)
  const [deleteItem,   setDeleteItem]   = useState(null)
  const [actionResult, setActionResult] = useState(null)
  const [search,       setSearch]       = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter,   setTypeFilter]   = useState('all')   // filter by category keyword
  const [page,         setPage]         = useState(1)
  const PAGE_SIZE = 10

  const cap = s => s ? s.charAt(0).toUpperCase() + s.slice(1) : '—'
  // Derive event category from title keywords for type filter
  const getEventCategory = t => {
    const title = (t.title || '').toLowerCase()
    if (title.includes('gala') || title.includes('fundrais') || title.includes('benefit')) return 'Fundraising'
    if (title.includes('sport') || title.includes('game') || title.includes('tournament')) return 'Sports'
    if (title.includes('parade') || title.includes('civic') || title.includes('independence') || title.includes('national')) return 'Civic'
    if (title.includes('seminar') || title.includes('training') || title.includes('workshop')) return 'Training'
    return 'General'
  }
  const statusOptions  = ['all', ...Array.from(new Set(data.map(r => r.status)))]
  const typeOptions    = ['all', 'Fundraising', 'Sports', 'Civic', 'Training', 'General']
  const filtered  = data
    .filter(r => statusFilter === 'all' || r.status === statusFilter)
    .filter(r => typeFilter   === 'all' || getEventCategory(r) === typeFilter)
    .filter(r => Object.values(r).some(v => String(v).toLowerCase().includes(search.toLowerCase())))
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paged      = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const kpis = [
    { label: 'Overall Events', value: data.length,                                       color: 'var(--accent)',  bg: 'var(--accent-light)'  },
    { label: 'Completed',      value: data.filter(e => e.status === 'completed').length,  color: '#2E7D52',        bg: '#f0faf4'              },
    { label: 'Ongoing',        value: data.filter(e => e.status === 'ongoing').length,    color: 'var(--info)',    bg: 'var(--info-light)'    },
    { label: 'Upcoming',       value: data.filter(e => e.status === 'upcoming').length,   color: 'var(--warning)', bg: 'var(--warning-light)'  },
  ]

  function handleDelete() {
    const title = deleteItem.title
    setData(prev => prev.filter(r => r.id !== deleteItem.id))
    setDeleteItem(null)
    setTimeout(() => setActionResult({ variant: 'danger', title: 'Event Deleted', message: `"${title}" has been permanently removed.` }), 260)
  }
  function handleApprove(r) {
    setData(prev => prev.map(e => e.id === r.id ? { ...e, status: 'ongoing' } : e))
    setActionResult({ variant: 'success', title: 'Event Approved', message: `"${r.title}" approved and set to Ongoing.` })
  }
  function handleReject(r) {
    setData(prev => prev.map(e => e.id === r.id ? { ...e, status: 'cancelled' } : e))
    setActionResult({ variant: 'danger', title: 'Event Rejected', message: `"${r.title}" rejected and marked Cancelled.` })
  }
  function handleSaveEdit(updated) {
    setData(prev => prev.map(r => r.id === updated.id ? updated : r))
    setActionResult({ variant: 'success', title: 'Event Updated', message: `"${updated.title}" has been saved successfully.` })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* KPI row — 4-col desktop, 2-col on mobile/tablet */}
      <div style={{ display: 'grid', gridTemplateColumns: kpiCols, gap: 12 }}>
        {kpis.map(k => (
          <Card key={k.label} style={{ padding: '14px 18px', background: '#FFFFFF', borderLeft: '4px solid ' + k.color, border: '1px solid ' + k.color + '25', transition: 'transform .18s ease, box-shadow .18s ease' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(75,94,170,.18)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500, marginBottom: 6 }}>{k.label}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: k.color, lineHeight: 1 }}>{k.value}</div>
          </Card>
        ))}
      </div>

      <Card>
        {/* Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: '1px solid var(--border-inner)', flexWrap: 'wrap', gap: 10 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{org.event_label} Data Table</div>
            <div style={{ fontSize: 12.5, color: 'var(--text-muted)', marginTop: 2 }}>{filtered.length} records · click any row for details</div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Type filter — by event category */}
            <select value={typeFilter} onChange={e => { setTypeFilter(e.target.value); setPage(1) }}
              style={{ padding: '7px 10px', borderRadius: 7, border: '1.5px solid var(--border-card)', fontSize: 13, fontFamily: 'var(--font-body)', color: 'var(--text-primary)', background: '#fff', cursor: 'pointer', outline: 'none', transition: 'border-color .18s ease, box-shadow .18s ease' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.boxShadow = '0 0 0 1.5px rgba(75,94,170,.25)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-card)'; e.currentTarget.style.boxShadow = '' }}>
              {typeOptions.map(t => <option key={t} value={t}>{t === 'all' ? 'All Types' : t}</option>)}
            </select>
            {/* Status filter */}
            <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1) }}
              style={{ padding: '7px 10px', borderRadius: 7, border: '1.5px solid var(--border-card)', fontSize: 13, fontFamily: 'var(--font-body)', color: 'var(--text-primary)', background: '#fff', cursor: 'pointer', outline: 'none', transition: 'border-color .18s ease, box-shadow .18s ease' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.boxShadow = '0 0 0 1.5px rgba(75,94,170,.25)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-card)'; e.currentTarget.style.boxShadow = '' }}>
              {statusOptions.map(s => <option key={s} value={s}>{s === 'all' ? 'All Status' : cap(s)}</option>)}
            </select>
            <div style={{ position: 'relative' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} placeholder="Search…"
                style={{ padding: '7px 10px 7px 28px', borderRadius: 7, border: '1.5px solid var(--border-card)', fontSize: 13, fontFamily: 'var(--font-body)', color: 'var(--text-primary)', background: '#fff', outline: 'none', width: 180 }}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e  => e.target.style.borderColor = 'var(--border-card)'} />
            </div>
            <button onClick={() => window.location.hash = '/events/add'}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 8, border: 'none', background: 'var(--accent)', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)', whiteSpace: 'nowrap' }}>
              <IcoPlus /> Add {org.event_label}
            </button>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: 'var(--table-head-bg)' }}>
                {['Title','Date','Time','Location','Target Funding','Current Funding','Status','Actions'].map(h => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--table-head-fg)', textTransform: 'uppercase', letterSpacing: '.06em', borderBottom: '2px solid var(--border-table)', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 ? (
                <tr><td colSpan={8} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>No events found.</td></tr>
              ) : paged.map(r => (
                <tr key={r.id} style={rowStyle(r.status)} onClick={() => setViewItem(r)}
                  onMouseEnter={e => e.currentTarget.style.background = rowHoverBg(r.status)}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>{r.title}</td>
                  <td style={{ padding: '10px 14px' }}>{formatDate(r.event_date)}</td>
                  <td style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>{r.event_time ? fmt12(r.event_time) : '—'}</td>
                  <td style={{ padding: '10px 14px' }}>{r.location}</td>
                  <td style={{ padding: '10px 14px' }}>{r.target_funding > 0 ? formatCurrency(r.target_funding) : <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>None</span>}</td>
                  {/* Current funding with progress bar — same as Projects */}
                  <td style={{ padding: '10px 14px' }}>
                    <div style={{ fontWeight: 600, color: r.current_funding >= r.target_funding && r.target_funding > 0 ? 'var(--success)' : 'var(--text-primary)' }}>
                      {r.current_funding > 0 ? formatCurrency(r.current_funding) : '—'}
                    </div>
                    {r.target_funding > 0 && r.current_funding > 0 && (
                      <div style={{ marginTop: 4, height: 4, width: 80, background: 'var(--border)', borderRadius: 4, overflow: 'hidden' }}>
                        <div style={{ height: '100%', background: '#2E7D52', width: Math.min(100,(r.current_funding/r.target_funding)*100) + '%', borderRadius: 4 }} />
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '10px 14px' }}><StatusBadge status={r.status} /></td>
                  <td style={{ padding: '10px 14px' }} onClick={e => e.stopPropagation()}>
                    <div style={{ display: 'flex', gap: 5 }}>
                      <IconBtn solidBg="#2E7D52" title="Approve" onClick={() => handleApprove(r)}><IcoApprove /></IconBtn>
                      <IconBtn solidBg="#C0392B" title="Reject"  onClick={() => handleReject(r)}><IcoReject /></IconBtn>
                      <IconBtn solidBg="#8B1A1A" title="Delete"  onClick={() => setDeleteItem(r)}><IcoDelete /></IconBtn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <PaginationRow page={page} totalPages={totalPages} onPageChange={p => setPage(p)} total={filtered.length} />
      </Card>

      {/* ── Detail InfoModal — Announcements-style ──────────────── */}
      {viewItem && (
        <InfoModal
          open={!!viewItem}
          onClose={() => setViewItem(null)}
          title={viewItem.title}
          subtitle={`${org.event_label} · ${formatDate(viewItem.event_date)}`}
          accentColor={modalAccentColor(viewItem.status)}
          footer={
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button onClick={() => { setEditItem(viewItem); setViewItem(null) }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 20px', borderRadius: 9, border: 'none', background: 'var(--accent)', color: '#fff', fontSize: 13.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'transform .18s ease, box-shadow .18s ease' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 0 0 1.5px rgba(0,0,0,.70), 0 4px 12px rgba(0,0,0,.14)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}>
                <IcoPen /> Edit {org.event_label}
              </button>
              <button onClick={() => setViewItem(null)}
                style={{ padding: '10px 28px', borderRadius: 9, border: '1.5px solid var(--border-card)', background: 'var(--neutral-light)', color: 'var(--text-primary)', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                Close
              </button>
            </div>
          }>
          <ItemDetailContent item={viewItem} org={org} kind="event" />
        </InfoModal>
      )}

      {/* ── Edit Event Modal — in-modal, no redirect ─────────────── */}
      <EditItemModal
        open={!!editItem}
        onClose={() => setEditItem(null)}
        item={editItem}
        kind="event"
        org={org}
        onSave={handleSaveEdit}
      />

      {/* ── Confirmation Modal — Delete ─────────────────────────── */}
      {deleteItem && (
        <InfoModal
          open={!!deleteItem}
          onClose={() => setDeleteItem(null)}
          title="Delete Event"
          subtitle="This action is permanent and cannot be undone"
          accentColor="var(--danger)"
          footer={
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button onClick={handleDelete}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 24px', borderRadius: 9, border: 'none', background: 'var(--danger)', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'transform .18s ease, box-shadow .18s ease' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 0 0 1.5px rgba(0,0,0,.70), 0 4px 12px rgba(0,0,0,.14)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}>
                <IcoDelete /> Yes, Delete
              </button>
              <button onClick={() => setDeleteItem(null)}
                style={{ padding: '10px 28px', borderRadius: 9, border: '1.5px solid var(--border-card)', background: 'var(--neutral-light)', color: 'var(--text-primary)', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                Close
              </button>
            </div>
          }>
          <DeleteBody item={deleteItem} type={org.event_label} />
        </InfoModal>
      )}

      <ResponseModal open={!!actionResult} onClose={() => setActionResult(null)}
        variant={actionResult?.variant||'success'} title={actionResult?.title||''} message={actionResult?.message||''} confirmLabel="Got it" />
    </div>
  )
}
