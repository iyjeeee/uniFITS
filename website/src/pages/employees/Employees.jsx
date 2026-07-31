// Employees.jsx — Manage employees with: KPI row, status-colored rows, row-click detail modal,
// in-modal edit, import modal, solid icon buttons, always-visible pagination
// Fully responsive via useBreakpoint — KPI grid collapses on mobile
import { useState } from 'react'
import { Card, StatusBadge, Avatar, InfoModal, ResponseModal, Input, SectionDivider, FilterSelect } from '../../components/ui'
import { IconBtn, PaginationRow, SearchInput } from '../../components/TableUtils'
import { MOCK_USERS, formatDate } from '../../api/mockData'
import { useOrg } from '../../context/OrgContext'
import { rowStyle, rowHoverBg, modalAccentColor } from '../../constants/tableColors'
import EditEmployeeModal from '../../components/EditEmployeeModal'
import useBreakpoint from '../../hooks/useBreakpoint'

/* ── SVG icons ──────────────────────────────────────────────────── */
function IcoDelete()  { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"   strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg> }
function IcoPlus()    { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> }
function IcoUpload()  { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"   strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg> }
function IcoPen()     { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"   strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> }
function IcoFileUp()  { return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg> }

/* ── Delete confirmation body ───────────────────────────────────── */
function DeleteBody({ item, type }) {
  const cap = s => s ? s.charAt(0).toUpperCase() + s.slice(1) : '—'
  const rows = [['Full Name', item.full_name], ['Employee ID', item.employee_number], ['Role', item.role], ['Email', item.email], ['Department', item.department || '—'], ['Status', cap(item.status)]]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ padding: '14px 16px', borderRadius: 10, background: '#fdecea', border: '1.5px solid rgba(192,57,43,.30)', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" strokeWidth="2.5" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 1 }}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        <div>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--danger)' }}>Warning: This action cannot be undone</div>
          <div style={{ fontSize: 12.5, color: 'var(--danger)', marginTop: 3, lineHeight: 1.5 }}>Removing this {type} will delete their account and all associated records permanently.</div>
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
export default function Employees() {
  const org = useOrg()
  const { isMobile, isTablet } = useBreakpoint()
  const kpiCols = isMobile || isTablet ? 'repeat(2,1fr)' : 'repeat(4,1fr)' // responsive KPI grid

  // State
  const [data,         setData]         = useState(MOCK_USERS)
  const [viewItem,     setViewItem]     = useState(null)   // detail modal
  const [editItem,     setEditItem]     = useState(null)   // edit modal
  const [deleteItem,   setDeleteItem]   = useState(null)   // confirmation modal
  const [showImport,   setShowImport]   = useState(false)  // import modal
  const [actionResult, setActionResult] = useState(null)   // feedback
  const [search,       setSearch]       = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter,   setTypeFilter]   = useState('all')   // filter by role
  const [page,         setPage]         = useState(1)
  const PAGE_SIZE = 10

  // Helper — capitalize
  const cap = s => s ? s.charAt(0).toUpperCase() + s.slice(1) : '—'

  // Derived
  const statusOptions = ['all', ...Array.from(new Set(data.map(r => r.status)))]
  const typeOptions   = ['all', ...Array.from(new Set(data.map(r => r.role).filter(Boolean)))]
  const filtered = data
    .filter(r => statusFilter === 'all' || r.status === statusFilter)
    .filter(r => typeFilter   === 'all' || r.role   === typeFilter)
    .filter(r => Object.values(r).some(v => String(v).toLowerCase().includes(search.toLowerCase())))
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paged      = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const officers   = data.filter(u => u.role !== 'Member')

  // KPI tiles
  const kpis = [
    { label: `Total ${org.people_label}s`, value: data.length,                                    color: 'var(--accent)',  bg: 'var(--accent-light)' },
    { label: 'Active',                     value: data.filter(u => u.status === 'active').length,  color: '#2E7D52',        bg: '#f0faf4'             },
    { label: 'Inactive',                   value: data.filter(u => u.status === 'inactive').length,color: '#C0392B',        bg: '#fdf3f2'             },
    { label: 'Officers',                   value: officers.length,                                 color: '#2471A3',        bg: '#f0f7fd'             },
  ]

  // Handlers
  function handleDelete() {
    const name = deleteItem.full_name
    setData(prev => prev.filter(r => r.id !== deleteItem.id))
    setDeleteItem(null)
    setTimeout(() => setActionResult({ variant: 'danger', title: 'Employee Removed', message: `"${name}" has been permanently removed.` }), 260)
  }

  function handleSaveEdit(updated) {
    setData(prev => prev.map(r => r.id === updated.id ? updated : r))
    // If the view modal is open for this item, update it too
    if (viewItem?.id === updated.id) setViewItem(updated)
    setActionResult({ variant: 'success', title: 'Employee Updated', message: `"${updated.full_name || updated.first_name}" has been updated successfully.` })
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

      {/* Data table card */}
      <Card>
        {/* Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: '1px solid var(--border-inner)', flexWrap: 'wrap', gap: 10 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{org.people_label} Data Table</div>
            <div style={{ fontSize: 12.5, color: 'var(--text-muted)', marginTop: 2 }}>{filtered.length} records · click any row for details</div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Shared FilterSelect — type and status filters use the global shared component */}
            <FilterSelect value={typeFilter}   onChange={v => { setTypeFilter(v);   setPage(1) }} options={typeOptions.map(t => ({ value: t, label: t === 'all' ? 'All Types' : t }))} />
            <FilterSelect value={statusFilter} onChange={v => { setStatusFilter(v); setPage(1) }} options={statusOptions.map(s => ({ value: s, label: s === 'all' ? 'All Status' : cap(s) }))} />
            {/* Shared SearchInput — single source of truth for all search bars */}
            <SearchInput value={search} onChange={v => { setSearch(v); setPage(1) }} />
            {/* Import — opens InfoModal */}
            <button onClick={() => setShowImport(true)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, border: 'none', background: '#5A6474', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)', whiteSpace: 'nowrap' }}>
              <IcoUpload /> Import
            </button>
            {/* Add employee */}
            <button onClick={() => window.location.hash = '/employees/add'}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 8, border: 'none', background: 'var(--accent)', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)', whiteSpace: 'nowrap' }}>
              <IcoPlus /> Add {org.people_label}
            </button>
          </div>
        </div>

        {/* Scrollable table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: 'var(--table-head-bg)' }}>
                {['#','Name','Role','Email','Contact','Department','Joined','Status','Actions'].map(h => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--table-head-fg)', textTransform: 'uppercase', letterSpacing: '.06em', borderBottom: '2px solid var(--border-table)', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 ? (
                <tr><td colSpan={9} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>No employees found.</td></tr>
              ) : paged.map((r, i) => (
                <tr key={r.id}
                  style={rowStyle(r.status)}
                  onClick={() => setViewItem(r)}
                  onMouseEnter={e => e.currentTarget.style.background = rowHoverBg(r.status)}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '10px 14px', color: 'var(--text-muted)', fontSize: 12 }}>{(page - 1) * PAGE_SIZE + i + 1}</td>
                  <td style={{ padding: '10px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                      <Avatar name={r.full_name} size={30} />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 13.5 }}>{r.full_name}</div>
                        <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{r.employee_number}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <span style={{ padding: '3px 10px', borderRadius: 20, background: '#4B5EAA', color: '#fff', fontSize: 11, fontWeight: 700 }}>{r.role}</span>
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <a href={`mailto:${r.email}`} onClick={e => e.stopPropagation()} style={{ color: 'var(--accent)', fontSize: 13 }}>{r.email}</a>
                  </td>
                  <td style={{ padding: '10px 14px' }}>{r.contact_number}</td>
                  <td style={{ padding: '10px 14px' }}>{r.department}</td>
                  <td style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>{formatDate(r.joined)}</td>
                  <td style={{ padding: '10px 14px' }}><StatusBadge status={r.status} /></td>
                  {/* Actions — propagation stopped */}
                  <td style={{ padding: '10px 14px' }} onClick={e => e.stopPropagation()}>
                    <IconBtn solidBg="#C0392B" title="Delete" onClick={() => setDeleteItem(r)}>
                      <IcoDelete />
                    </IconBtn>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination — always visible */}
        <PaginationRow page={page} totalPages={totalPages} onPageChange={setPage} total={filtered.length} />
      </Card>

      {/* ── Detail InfoModal — border matches employee status ─── */}
      {viewItem && (
        <InfoModal
          open={!!viewItem}
          onClose={() => setViewItem(null)}
          title={viewItem.full_name}
          subtitle={`${viewItem.role} · ${viewItem.employee_number}`}
          accentColor={modalAccentColor(viewItem.status)}
          footer={
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              {/* Edit opens EditEmployeeModal — no page redirect */}
              <button onClick={() => { setEditItem(viewItem); setViewItem(null) }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 20px', borderRadius: 9, border: 'none', background: 'var(--accent)', color: '#fff', fontSize: 13.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'transform .18s ease, box-shadow .18s ease' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 0 0 1.5px rgba(0,0,0,.70), 0 4px 12px rgba(0,0,0,.14)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}>
                <IcoPen /> Edit {org.people_label}
              </button>
              <button onClick={() => setViewItem(null)}
                style={{ padding: '10px 28px', borderRadius: 9, border: '1.5px solid var(--border-card)', background: 'var(--neutral-light)', color: 'var(--text-primary)', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                Close
              </button>
            </div>
          }>
          {/* Full details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Profile hero */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', borderRadius: 12, background: 'var(--accent-light)', border: '1.5px solid rgba(75,94,170,.2)' }}>
              <Avatar name={viewItem.full_name} size={56} />
              <div>
                <div style={{ fontSize: 18, fontWeight: 700 }}>{viewItem.full_name}</div>
                <div style={{ display: 'flex', gap: 8, marginTop: 6, flexWrap: 'wrap' }}>
                  <span style={{ padding: '3px 10px', borderRadius: 20, background: '#4B5EAA', color: '#fff', fontSize: 11, fontWeight: 700 }}>{viewItem.role}</span>
                  <StatusBadge status={viewItem.status} />
                </div>
              </div>
            </div>
            {/* Full detail grid — 3-col desktop, 2-col mobile */}
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(3,1fr)', gap: 12 }}>
              {[
                ['Employee ID',  viewItem.employee_number],
                ['Status',       cap(viewItem.status)],
                ['Gender',       viewItem.gender || '—'],
                ['Email',        viewItem.email],
                ['Contact',      viewItem.contact_number],
                ['Department',   viewItem.department || '—'],
                ['Occupation',   viewItem.occupation  || '—'],
                ['City',         viewItem.address_city || '—'],
                ['Joined',       formatDate(viewItem.joined)],
              ].map(([k, v]) => (
                <div key={k} style={{ padding: '12px 14px', borderRadius: 10, background: 'var(--neutral-light)', border: '1px solid var(--border-card)' }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 4 }}>{k}</div>
                  <div style={{ fontSize: 13.5, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        </InfoModal>
      )}

      {/* ── Edit Employee Modal — in-modal, no page redirect ─── */}
      <EditEmployeeModal
        open={!!editItem}
        onClose={() => setEditItem(null)}
        employee={editItem}
        org={org}
        onSave={handleSaveEdit}
      />

      {/* ── Import Employees InfoModal ────────────────────────── */}
      {showImport && (
        <InfoModal
          open={showImport}
          onClose={() => setShowImport(false)}
          title="Import Employees"
          subtitle="Upload a CSV or Excel file to batch-import employee records"
          accentColor="var(--accent)"
          footer={
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 22px', borderRadius: 9, border: 'none', background: 'var(--accent)', color: '#fff', fontSize: 13.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'transform .18s ease, box-shadow .18s ease' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 0 0 1.5px rgba(0,0,0,.70), 0 4px 12px rgba(0,0,0,.14)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}>
                <IcoUpload /> Import File
              </button>
              <button onClick={() => setShowImport(false)}
                style={{ padding: '10px 28px', borderRadius: 9, border: '1.5px solid var(--border-card)', background: 'var(--neutral-light)', color: 'var(--text-primary)', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                Close
              </button>
            </div>
          }>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Drop zone */}
            <div style={{ border: '2px dashed var(--border-card)', borderRadius: 14, padding: '36px 24px', textAlign: 'center', background: 'var(--neutral-light)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <div style={{ color: 'var(--accent)', opacity: .6 }}><IcoFileUp /></div>
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>Drop your file here</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Supports .csv and .xlsx (Excel) files</div>
              <label style={{ marginTop: 4 }}>
                <input type="file" accept=".csv,.xlsx,.xls" style={{ display: 'none' }} />
                <span style={{ display: 'inline-flex', padding: '8px 20px', borderRadius: 8, border: 'none', background: 'var(--accent)', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                  Browse File
                </span>
              </label>
            </div>
            {/* Instructions */}
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10 }}>Required CSV Columns</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 8 }}>
                {['first_name','last_name','email','contact_number','gender','date_of_birth','department','occupation'].map(col => (
                  /* CSV column pills — neutral-light bg ensures code text is readable (removed dark table-head-bg) */
                  <div key={col} style={{ padding: '8px 12px', borderRadius: 8, background: 'var(--neutral-light)', border: '1.5px solid var(--border-card)', fontSize: 12.5 }}>
                    <code style={{ color: 'var(--accent)', fontWeight: 600 }}>{col}</code>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 10 }}>
                Download the <a href="#" style={{ color: 'var(--accent)', fontWeight: 600 }}>template file</a> to ensure correct formatting.
              </div>
            </div>
          </div>
        </InfoModal>
      )}

      {/* ── Confirmation Modal — Delete ────────────────────────── */}
      {deleteItem && (
        <InfoModal
          open={!!deleteItem}
          onClose={() => setDeleteItem(null)}
          title="Remove Employee"
          subtitle="This action is permanent and cannot be undone"
          accentColor="var(--danger)"
          footer={
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button onClick={handleDelete}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 24px', borderRadius: 9, border: 'none', background: 'var(--danger)', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'transform .18s ease, box-shadow .18s ease' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 0 0 1.5px rgba(0,0,0,.70), 0 4px 12px rgba(0,0,0,.14)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}>
                <IcoDelete /> Yes, Remove
              </button>
              <button onClick={() => setDeleteItem(null)}
                style={{ padding: '10px 28px', borderRadius: 9, border: '1.5px solid var(--border-card)', background: 'var(--neutral-light)', color: 'var(--text-primary)', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                Close
              </button>
            </div>
          }>
          <DeleteBody item={deleteItem} type={org.people_label} />
        </InfoModal>
      )}

      {/* Feedback ResponseModal */}
      <ResponseModal
        open={!!actionResult}
        onClose={() => setActionResult(null)}
        variant={actionResult?.variant || 'success'}
        title={actionResult?.title   || ''}
        message={actionResult?.message || ''}
        confirmLabel="Got it"
      />
    </div>
  )
}
