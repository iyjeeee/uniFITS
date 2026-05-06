// Utilities.jsx — Manage utility/operational expenses.
// Action column: Delete only (Eye + Edit removed per spec).
// Edit functionality moved inside the detail InfoModal footer.
// Matches Projects/Events table style: status-colored rows, KPI strip, search+filter, PaginationRow.
import { useState } from 'react'
import { Card, StatusBadge, InfoModal, ResponseModal, Input, Select } from '../../components/ui'
import { MOCK_UTILITIES, MOCK_FUNDS, formatCurrency, formatDate } from '../../api/mockData'
import { useOrg } from '../../context/OrgContext'
import { rowStyle, rowHoverBg, modalAccentColor } from '../../constants/tableColors'
import useBreakpoint from '../../hooks/useBreakpoint'


/* ── Shared SVG button icons ──────────────────────────────────────── */
const BtnIco = {
  Save:   () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>,
  Edit:   () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  Delete: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>,
  Cancel: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Close:  () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Plus:   () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Check:  () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  PDF:    () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  Print:  () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>,
  Export: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  Shield: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  View:   () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  Arrow:  () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
  Back:   () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>,
}


/* ── SVG Icons ───────────────────────────────────────────────────── */
function IcoDelete() { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg> }
function IcoPen()    { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> }
function IcoPlus()   { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> }
function IcoSave()   { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg> }

/* ── IconBtn — solid-color square action button ──────────────────── */
function IconBtn({ children, solidBg, title, onClick }) {
  return (
    <button
      onClick={e => { e.stopPropagation(); onClick() }}
      title={title}
      style={{ width: 32, height: 32, borderRadius: 7, border: 'none', background: solidBg, color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform .18s ease, box-shadow .18s ease', flexShrink: 0 }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.boxShadow = '0 0 0 2px rgba(0,0,0,.80), 0 5px 14px rgba(0,0,0,.28)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = ''
        e.currentTarget.style.boxShadow = ''
      }}>
      {children}
    </button>
  )
}

/* ── PaginationRow — always-visible page buttons ─────────────────── */
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

/* ── Utility detail + inline edit view inside InfoModal ──────────── */
// editMode toggles between read-only detail and editable form within the same modal
function UtilityDetailModal({ item, editForm, editMode, setEditMode, onFormChange, org }) {
  const remaining = item.total_amount - item.amount_paid
  const pctPaid   = item.total_amount > 0 ? Math.round((item.amount_paid / item.total_amount) * 100) : 0
  const fundOptions = MOCK_FUNDS.map(f => ({ value: f.name, label: f.name }))
  const statusOptions = [{ value: 'unpaid', label: 'Unpaid' }, { value: 'partial', label: 'Partial' }, { value: 'paid', label: 'Paid' }]

  if (editMode) {
    /* ── EDIT VIEW — inline form ──────────────────────────────── */
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Input label="Category / Expense Type" value={editForm.expense_type} onChange={e => onFormChange('expense_type', e.target.value)} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <Input label="Total Amount (₱)" type="number" value={editForm.total_amount} onChange={e => onFormChange('total_amount', e.target.value)} />
          <Input label="Amount Paid (₱)"  type="number" value={editForm.amount_paid}  onChange={e => onFormChange('amount_paid', e.target.value)} />
        </div>
        <Input label="Payment Date" type="date" value={editForm.payment_date} onChange={e => onFormChange('payment_date', e.target.value)} />
        <Input label="Paid To (Vendor / Biller)" value={editForm.paid_to} onChange={e => onFormChange('paid_to', e.target.value)} placeholder="e.g. Meralco, PLDT" />
        <Select label="Fund (Paid From)" value={editForm.fund} onChange={e => onFormChange('fund', e.target.value)} options={fundOptions} placeholder="-- Select fund --" />
        <Select label="Status" value={editForm.status} onChange={e => onFormChange('status', e.target.value)} options={statusOptions} />
        <Input label="Notes" value={editForm.notes || ''} onChange={e => onFormChange('notes', e.target.value)} placeholder="Optional notes" />
      </div>
    )
  }

  /* ── READ-ONLY DETAIL VIEW ────────────────────────────────── */
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Payment progress bar */}
      <div style={{ padding: '14px 18px', borderRadius: 10, background: 'var(--neutral-light)', border: '1px solid var(--border-card)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
          <span style={{ color: 'var(--text-muted)' }}>Payment Progress</span>
          <span style={{ fontWeight: 700, color: item.status === 'paid' ? 'var(--success)' : 'var(--warning)' }}>{pctPaid}% paid</span>
        </div>
        <div style={{ height: 8, background: 'var(--border)', borderRadius: 6, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${pctPaid}%`, background: item.status === 'paid' ? 'var(--success)' : 'var(--warning)', borderRadius: 6, transition: 'width .4s' }} />
        </div>
      </div>
      {/* Detail rows */}
      {[
        ['Utility ID',   `#${item.id}`],
        ['Category',     item.expense_type],
        ['Paid To',      item.paid_to   || '—'],
        ['Fund',         item.fund      || '—'],
        ['Payment Date', formatDate(item.payment_date)],
        ['Status',       item.status.charAt(0).toUpperCase() + item.status.slice(1)],
        ['Total Amount', formatCurrency(item.total_amount, org.currency_symbol)],
        ['Amount Paid',  formatCurrency(item.amount_paid, org.currency_symbol)],
        ['Remaining',    formatCurrency(remaining, org.currency_symbol)],
        ['Notes',        item.notes || '—'],
      ].map(([k, v], idx) => (
        <div key={k} style={{ display: 'flex', gap: 16, padding: '10px 14px', borderBottom: '1px solid var(--border-inner)', background: idx % 2 === 0 ? 'var(--neutral-light)' : '#fff' }}>
          <div style={{ width: 140, fontSize: 12.5, color: 'var(--text-muted)', flexShrink: 0, fontWeight: 500 }}>{k}</div>
          <div style={{ fontSize: 13.5, fontWeight: 600, color: k === 'Remaining' && remaining > 0 ? 'var(--danger)' : 'var(--text-primary)' }}>{v}</div>
        </div>
      ))}
    </div>
  )
}

/* ── Delete confirmation body ────────────────────────────────────── */
function DeleteBody({ item, org }) {
  const cap = s => s ? s.charAt(0).toUpperCase() + s.slice(1) : '—'
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ padding: '14px 16px', borderRadius: 10, background: '#fdecea', border: '1.5px solid rgba(192,57,43,.30)', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" strokeWidth="2.5" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 1 }}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        <div>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--danger)' }}>Warning: This action cannot be undone</div>
          <div style={{ fontSize: 12.5, color: 'var(--danger)', marginTop: 3, lineHeight: 1.5 }}>Deleting this {org.utility_label} will permanently remove all associated records.</div>
        </div>
      </div>
      <div>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 10 }}>{org.utility_label} Summary</div>
        {[['Category', item.expense_type], ['Total', formatCurrency(item.total_amount, org.currency_symbol)], ['Status', cap(item.status)], ['Paid To', item.paid_to || '—']].map(([k, v], idx) => (
          <div key={k} style={{ display: 'flex', gap: 16, padding: '10px 14px', borderBottom: '1px solid var(--border-inner)', background: idx % 2 === 0 ? 'var(--neutral-light)' : '#fff' }}>
            <div style={{ width: 130, fontSize: 12.5, color: 'var(--text-muted)', flexShrink: 0, fontWeight: 500 }}>{k}</div>
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
export default function Utilities() {
  const org = useOrg()
  const { isMobile, isTablet } = useBreakpoint()
  const kpiCols = isMobile || isTablet ? 'repeat(2,1fr)' : 'repeat(4,1fr)'

  const [data,         setData]         = useState(MOCK_UTILITIES)
  const [search,       setSearch]       = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [page,         setPage]         = useState(1)
  const [viewItem,     setViewItem]     = useState(null)    // item open in detail modal
  const [editMode,     setEditMode]     = useState(false)   // toggle edit view inside detail modal
  const [editForm,     setEditForm]     = useState(null)    // local edit form state
  const [deleteItem,   setDeleteItem]   = useState(null)    // item pending deletion
  const [actionResult, setActionResult] = useState(null)    // feedback

  const PAGE_SIZE = 10
  const cap = s => s ? s.charAt(0).toUpperCase() + s.slice(1) : '—'

  /* Open detail modal — always starts in read-only mode */
  function openDetail(item) {
    setViewItem(item)
    setEditForm({ ...item })
    setEditMode(false)
  }

  /* Apply field change to local edit form */
  function handleFormChange(key, value) {
    setEditForm(prev => ({ ...prev, [key]: value }))
  }

  /* Save edit — update record in list */
  function handleSaveEdit() {
    setData(prev => prev.map(u => u.id === editForm.id ? { ...editForm, total_amount: Number(editForm.total_amount), amount_paid: Number(editForm.amount_paid) } : u))
    setViewItem({ ...editForm, total_amount: Number(editForm.total_amount), amount_paid: Number(editForm.amount_paid) })
    setEditMode(false)
    setActionResult({ variant: 'success', title: `${org.utility_label} Updated`, message: `"${editForm.expense_type}" has been saved successfully.` })
  }

  /* Cancel edit — revert form to current item state */
  function handleCancelEdit() {
    setEditForm({ ...viewItem })
    setEditMode(false)
  }

  /* Handle delete */
  function handleDelete() {
    const cat = deleteItem.expense_type
    setData(prev => prev.filter(u => u.id !== deleteItem.id))
    if (viewItem?.id === deleteItem.id) setViewItem(null)
    setDeleteItem(null)
    setTimeout(() => setActionResult({ variant: 'danger', title: `${org.utility_label} Deleted`, message: `"${cat}" has been permanently removed.` }), 260)
  }

  /* Computed KPIs */
  const totalOwed    = data.reduce((s, u) => s + u.total_amount, 0)
  const totalPaid    = data.reduce((s, u) => s + u.amount_paid, 0)
  const totalUnpaid  = totalOwed - totalPaid

  /* Filter + paginate */
  const statusOptions = ['all', ...Array.from(new Set(data.map(u => u.status)))]
  const filtered = data
    .filter(u => statusFilter === 'all' || u.status === statusFilter)
    .filter(u => Object.values(u).some(v => String(v).toLowerCase().includes(search.toLowerCase())))
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paged      = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const kpis = [
    { label: `Total ${org.utility_label}s`, value: data.length,                                      color: 'var(--accent)',  bg: 'var(--accent-light)'  },
    { label: 'Total Owed',                   value: formatCurrency(totalOwed,   org.currency_symbol),  color: 'var(--warning)', bg: 'var(--warning-light)' },
    { label: 'Total Paid',                   value: formatCurrency(totalPaid,   org.currency_symbol),  color: 'var(--success)', bg: 'var(--success-light)' },
    { label: 'Remaining Unpaid',             value: formatCurrency(totalUnpaid, org.currency_symbol),  color: totalUnpaid > 0 ? 'var(--danger)' : 'var(--success)', bg: totalUnpaid > 0 ? 'var(--danger-light)' : 'var(--success-light)' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

      {/* ── KPI strip ───────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: kpiCols, gap: 12 }}>
        {kpis.map(k => (
          <Card key={k.label} style={{ padding: '14px 18px', background: '#FFFFFF', borderLeft: '4px solid ' + k.color, border: '1px solid ' + k.color + '25', transition: 'transform .18s ease, box-shadow .18s ease' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(75,94,170,.18)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500, marginBottom: 6 }}>{k.label}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: k.color, lineHeight: 1 }}>{k.value}</div>
          </Card>
        ))}
      </div>

      {/* ── Data table card ─────────────────────────────────────── */}
      <Card>
        {/* Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: '1px solid var(--border-inner)', flexWrap: 'wrap', gap: 10 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{org.utility_label} Data Table</div>
            <div style={{ fontSize: 12.5, color: 'var(--text-muted)', marginTop: 2 }}>{filtered.length} records · click any row for details</div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Status filter */}
            <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1) }}
              style={{ padding: '7px 10px', borderRadius: 7, border: '1.5px solid var(--border-card)', fontSize: 13, fontFamily: 'var(--font-body)', color: 'var(--text-primary)', background: '#fff', cursor: 'pointer', outline: 'none' }}>
              {statusOptions.map(s => <option key={s} value={s}>{s === 'all' ? 'All Statuses' : cap(s)}</option>)}
            </select>
            {/* Search */}
            <div style={{ position: 'relative' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} placeholder="Search…"
                style={{ padding: '7px 10px 7px 28px', borderRadius: 7, border: '1.5px solid var(--border-card)', fontSize: 13, fontFamily: 'var(--font-body)', color: 'var(--text-primary)', background: '#fff', outline: 'none', width: 180 }}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e  => e.target.style.borderColor = 'var(--border-card)'} />
            </div>
            {/* Add button */}
            <button onClick={() => alert('Add Utility — coming soon')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 8, border: 'none', background: 'var(--accent)', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)', whiteSpace: 'nowrap' }}>
              <BtnIco.Plus /> Add {org.utility_label}
            </button>
          </div>
        </div>

        {/* Table — action column has Delete only */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: 'var(--table-head-bg)' }}>
                {['#', 'Category', 'Total', 'Paid', 'Remaining', 'Due Date', 'Paid To', 'Fund', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--table-head-fg)', textTransform: 'uppercase', letterSpacing: '.06em', borderBottom: '2px solid var(--border-table)', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 ? (
                <tr><td colSpan={10} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>No utilities found.</td></tr>
              ) : paged.map((u, i) => {
                const remaining = u.total_amount - u.amount_paid
                return (
                  <tr key={u.id}
                    style={rowStyle(u.status)}
                    onClick={() => openDetail(u)}
                    onMouseEnter={e => e.currentTarget.style.background = rowHoverBg(u.status)}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '10px 14px', color: 'var(--text-muted)', fontSize: 12 }}>{(page - 1) * PAGE_SIZE + i + 1}</td>
                    <td style={{ padding: '10px 14px', fontWeight: 600 }}>{u.expense_type}</td>
                    <td style={{ padding: '10px 14px', fontWeight: 600 }}>{formatCurrency(u.total_amount, org.currency_symbol)}</td>
                    <td style={{ padding: '10px 14px', color: 'var(--success)', fontWeight: 600 }}>{formatCurrency(u.amount_paid, org.currency_symbol)}</td>
                    <td style={{ padding: '10px 14px', color: remaining > 0 ? 'var(--danger)' : 'var(--success)', fontWeight: 600 }}>{formatCurrency(remaining, org.currency_symbol)}</td>
                    <td style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>{formatDate(u.payment_date)}</td>
                    <td style={{ padding: '10px 14px' }}>{u.paid_to || '—'}</td>
                    <td style={{ padding: '10px 14px', fontSize: 12.5 }}>{u.fund || '—'}</td>
                    <td style={{ padding: '10px 14px' }}><StatusBadge status={u.status} /></td>
                    {/* Actions: Delete only — Edit is inside the detail modal */}
                    <td style={{ padding: '10px 14px' }} onClick={e => e.stopPropagation()}>
                      <IconBtn solidBg="var(--danger)" title="Delete" onClick={() => setDeleteItem(u)}><IcoDelete /></IconBtn>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <PaginationRow page={page} totalPages={totalPages} onPageChange={setPage} total={filtered.length} />
      </Card>

      {/* ── Detail / Edit InfoModal — Edit button lives in footer ── */}
      <InfoModal
        open={!!viewItem}
        onClose={() => { setViewItem(null); setEditMode(false) }}
        title={editMode ? `Edit ${org.utility_label}` : (viewItem?.expense_type || '')}
        editMode={editMode}
        subtitle={editMode ? 'Update utility expense details' : (viewItem ? `${org.utility_label} · ${formatDate(viewItem.payment_date)}` : '')}
        accentColor={editMode ? 'var(--accent)' : (viewItem ? modalAccentColor(viewItem.status) : 'var(--accent)')}
        footer={
          editMode ? (
            /* Edit mode footer: Save + Cancel */
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button onClick={handleSaveEdit}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 22px', borderRadius: 9, border: 'none', background: 'var(--accent)', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                <BtnIco.Save /> Save Changes
              </button>
              <button onClick={handleCancelEdit}
                style={{ padding: '10px 24px', borderRadius: 9, border: '1.5px solid var(--border-card)', background: 'var(--neutral-light)', color: 'var(--text-primary)', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                Cancel
              </button>
            </div>
          ) : (
            /* View mode footer: Edit + Close only (Delete removed from modal per spec) */
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button onClick={() => setEditMode(true)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 20px', borderRadius: 9, border: 'none', background: 'var(--accent)', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                <BtnIco.Edit /> Edit
              </button>
              <button onClick={() => setViewItem(null)}
                style={{ padding: '10px 28px', borderRadius: 9, border: '1.5px solid var(--border-card)', background: 'var(--neutral-light)', color: 'var(--text-primary)', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                Close
              </button>
            </div>
          )
        }>
        {viewItem && editForm && (
          <UtilityDetailModal
            item={viewItem}
            editForm={editForm}
            editMode={editMode}
            setEditMode={setEditMode}
            onFormChange={handleFormChange}
            org={org}
          />
        )}
      </InfoModal>

      {/* ── Delete Confirmation Modal ───────────────────────────── */}
      <InfoModal
        open={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        title={`Delete ${org.utility_label}`}
        subtitle="This action is permanent and cannot be undone"
        accentColor="var(--danger)"
        footer={
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button onClick={handleDelete}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 24px', borderRadius: 9, border: 'none', background: 'var(--danger)', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
              <BtnIco.Delete /> Yes, Delete
            </button>
            <button onClick={() => setDeleteItem(null)}
              style={{ padding: '10px 28px', borderRadius: 9, border: '1.5px solid var(--border-card)', background: 'var(--neutral-light)', color: 'var(--text-primary)', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{marginRight:4}}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> Cancel
            </button>
          </div>
        }>
        {deleteItem && <DeleteBody item={deleteItem} org={org} />}
      </InfoModal>

      {/* ── Action Feedback ─────────────────────────────────────── */}
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
