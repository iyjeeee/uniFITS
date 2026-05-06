// Transactions.jsx — Full ledger matching Projects/Events table style.
// Statuses: pending, approved, rejected (approval workflow).
// Actions: Approve (green), Reject (red), Delete (dark red) — no receipt button in table.
// Row click opens transaction detail modal (receipt-style).
import { useState } from 'react'
import { Card, StatusBadge, Badge, InfoModal, ResponseModal } from '../../components/ui'
import { MOCK_TRANSACTIONS, formatCurrency, formatDate } from '../../api/mockData'
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
function IcoDelete()  { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg> }
function IcoApprove() { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> }
function IcoReject()  { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> }
function IcoPlus()    { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> }
function IcoPrint()   { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg> }

/* ── IconBtn — solid-color square action button (same as Projects/Events) ── */
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

/* ── TypeBadge — entry type uses Badge with proper variant ──────── */
function TypeBadge({ type }) {
  const variant = type === 'expense' ? 'danger' : type === 'contribution' ? 'accent' : 'success'
  const cap = s => s ? s.charAt(0).toUpperCase() + s.slice(1) : '—'
  return <Badge variant={variant}>{cap(type)}</Badge>
}

/* ── Transaction detail modal content (receipt-style) ───────────── */
function TransactionDetail({ tx, org, isMobile }) {
  return (
    <div>
      {/* Receipt header */}
      <div style={{ background: 'var(--accent)', color: '#fff', padding: '16px 22px', borderRadius: 10, textAlign: 'center', marginBottom: 18 }}>
        <div style={{ fontSize: 16, fontWeight: 700 }}>Transaction Detail</div>
        <div style={{ fontSize: 12, opacity: .8, marginTop: 3 }}>Reference: {tx.reference_number}</div>
      </div>
      {/* Key-value grid */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 12, marginBottom: 18 }}>
        {[
          ['Reference #',    tx.reference_number],
          ['Date',           formatDate(tx.transaction_date)],
          ['Member',         tx.user_name || 'External'],
          ['Status',         tx.status.charAt(0).toUpperCase() + tx.status.slice(1)],
          ['Payment Method', tx.payment_method],
          ['Fund',           tx.fund],
        ].map(([k, v]) => (
          <div key={k}>
            <div style={{ fontSize: 10.5, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 3 }}>{k}</div>
            <div style={{ fontSize: 13.5, fontWeight: 600 }}>{v || '—'}</div>
          </div>
        ))}
      </div>
      {/* Flow */}
      <div style={{ background: 'var(--table-head-bg)', borderRadius: 8, padding: '12px 16px', marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.06em' }}>Transaction Flow</div>
        <div style={{ fontSize: 13.5 }}>
          <div><strong>From:</strong> {tx.user_name || 'External'}</div>
          <div style={{ marginTop: 4 }}><strong>To Fund:</strong> {tx.fund}</div>
          <div style={{ marginTop: 8 }}><TypeBadge type={tx.entry_type} /></div>
        </div>
      </div>
      {/* Amount + category */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 12 }}>
        <div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 3 }}>Category</div>
          <div style={{ fontSize: 14, textTransform: 'capitalize' }}>{tx.category}</div>
        </div>
        <div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 3 }}>Amount</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: tx.entry_type === 'expense' ? 'var(--danger)' : 'var(--success)' }}>
            {tx.entry_type === 'expense' ? '−' : '+'}{formatCurrency(tx.amount, org.currency_symbol)}
          </div>
        </div>
      </div>
      {tx.description && (
        <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--border-inner)', fontSize: 13.5, color: 'var(--text-secondary)' }}>
          <span style={{ fontWeight: 600, color: 'var(--text-muted)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '.06em' }}>Description</span>
          <div style={{ marginTop: 4 }}>{tx.description}</div>
        </div>
      )}
    </div>
  )
}

/* ── Delete confirmation body ─────────────────────────────────────── */
function DeleteBody({ tx, org }) {
  const cap = s => s ? s.charAt(0).toUpperCase() + s.slice(1) : '—'
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ padding: '14px 16px', borderRadius: 10, background: '#fdecea', border: '1.5px solid rgba(192,57,43,.30)', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" strokeWidth="2.5" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 1 }}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        <div>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--danger)' }}>Warning: This action cannot be undone</div>
          <div style={{ fontSize: 12.5, color: 'var(--danger)', marginTop: 3, lineHeight: 1.5 }}>Deleting this {org.transaction_label} will permanently remove all associated records.</div>
        </div>
      </div>
      <div>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 10 }}>Transaction Summary</div>
        {[['Reference', tx.reference_number], ['Amount', formatCurrency(tx.amount, org.currency_symbol)], ['Type', cap(tx.entry_type)], ['Category', cap(tx.category)], ['Fund', tx.fund], ['Status', cap(tx.status)]].map(([k, v], idx) => (
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
export default function Transactions() {
  const org = useOrg()
  const { isMobile, isTablet } = useBreakpoint()
  const kpiCols = isMobile || isTablet ? 'repeat(2,1fr)' : 'repeat(4,1fr)'

  /* Normalise mock data — map old status values to pending/approved/rejected */
  const normalise = t => ({
    ...t,
    status: t.status === 'completed' ? 'approved'
           : t.status === 'failed'   ? 'rejected'
           : 'pending',
  })

  const [data,         setData]         = useState(MOCK_TRANSACTIONS.map(normalise))
  const [search,       setSearch]       = useState('')
  const [typeFilter,   setTypeFilter]   = useState('all')   // filter by entry_type
  const [page,         setPage]         = useState(1)
  const [viewItem,     setViewItem]     = useState(null)    // tx open in detail modal
  const [deleteItem,   setDeleteItem]   = useState(null)    // tx pending deletion
  const [actionResult, setActionResult] = useState(null)    // feedback modal

  const PAGE_SIZE = 10
  const cap = s => s ? s.charAt(0).toUpperCase() + s.slice(1) : '—'

  /* Computed KPIs */
  const totalIncome  = data.filter(t => t.entry_type !== 'expense').reduce((s, t) => s + t.amount, 0)
  const totalExpense = data.filter(t => t.entry_type === 'expense').reduce((s, t) => s + t.amount, 0)
  const balance      = totalIncome - totalExpense
  const typeOptions  = ['all', 'contribution', 'income', 'expense']

  /* Filter + paginate */
  const filtered = data
    .filter(t => typeFilter === 'all' || t.entry_type === typeFilter)
    .filter(t => Object.values(t).some(v => String(v).toLowerCase().includes(search.toLowerCase())))
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paged      = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  /* Approve — sets status to approved */
  function handleApprove(tx) {
    setData(prev => prev.map(t => t.id === tx.id ? { ...t, status: 'approved' } : t))
    setActionResult({ variant: 'success', title: `${org.transaction_label} Approved`, message: `Transaction ${tx.reference_number} has been approved successfully.` })
  }

  /* Reject — sets status to rejected */
  function handleReject(tx) {
    setData(prev => prev.map(t => t.id === tx.id ? { ...t, status: 'rejected' } : t))
    setActionResult({ variant: 'danger', title: `${org.transaction_label} Rejected`, message: `Transaction ${tx.reference_number} has been rejected.` })
  }

  /* Delete — removes from list */
  function handleDelete() {
    const ref = deleteItem.reference_number
    setData(prev => prev.filter(t => t.id !== deleteItem.id))
    if (viewItem?.id === deleteItem.id) setViewItem(null)
    setDeleteItem(null)
    setTimeout(() => setActionResult({ variant: 'danger', title: `${org.transaction_label} Deleted`, message: `Transaction ${ref} has been permanently removed.` }), 260)
  }

  const kpis = [
    { label: `Total ${org.transaction_label}s`, value: data.length,                                      color: 'var(--accent)',  bg: 'var(--accent-light)'  },
    { label: 'Total Income',                     value: formatCurrency(totalIncome,  org.currency_symbol), color: 'var(--success)', bg: 'var(--success-light)' },
    { label: 'Total Expenses',                   value: formatCurrency(totalExpense, org.currency_symbol), color: 'var(--danger)',  bg: 'var(--danger-light)'  },
    { label: 'Net Balance',                      value: formatCurrency(balance, org.currency_symbol),      color: balance >= 0 ? 'var(--success)' : 'var(--danger)', bg: balance >= 0 ? 'var(--success-light)' : 'var(--danger-light)' },
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
            <div style={{ fontSize: 14, fontWeight: 600 }}>{org.transaction_label} Data Table</div>
            <div style={{ fontSize: 12.5, color: 'var(--text-muted)', marginTop: 2 }}>{filtered.length} records · click any row for details</div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Entry type filter */}
            <select value={typeFilter} onChange={e => { setTypeFilter(e.target.value); setPage(1) }}
              style={{ padding: '7px 10px', borderRadius: 7, border: '1.5px solid var(--border-card)', fontSize: 13, fontFamily: 'var(--font-body)', color: 'var(--text-primary)', background: '#fff', cursor: 'pointer', outline: 'none' }}>
              {typeOptions.map(t => <option key={t} value={t}>{t === 'all' ? 'All Types' : cap(t)}</option>)}
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
            <button onClick={() => { window.location.hash = '/transactions/add' }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 8, border: 'none', background: 'var(--accent)', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)', whiteSpace: 'nowrap' }}>
              <BtnIco.Plus /> Add {org.transaction_label}
            </button>
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: 'var(--table-head-bg)' }}>
                {['#', 'Reference', 'Member', 'Amount', 'Type', 'Category', 'Fund', 'Date', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--table-head-fg)', textTransform: 'uppercase', letterSpacing: '.06em', borderBottom: '2px solid var(--border-table)', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 ? (
                <tr><td colSpan={10} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>No transactions found.</td></tr>
              ) : paged.map((t, i) => (
                <tr key={t.id}
                  style={rowStyle(t.status)}
                  onClick={() => setViewItem(t)}
                  onMouseEnter={e => e.currentTarget.style.background = rowHoverBg(t.status)}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '10px 14px', color: 'var(--text-muted)', fontSize: 12 }}>{(page - 1) * PAGE_SIZE + i + 1}</td>
                  <td style={{ padding: '10px 14px' }}>
                    <code style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'monospace' }}>{t.reference_number}</code>
                  </td>
                  <td style={{ padding: '10px 14px', fontWeight: 500 }}>{t.user_name || <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>External</span>}</td>
                  <td style={{ padding: '10px 14px', fontWeight: 700, color: t.entry_type === 'expense' ? 'var(--danger)' : 'var(--success)' }}>
                    {t.entry_type === 'expense' ? '−' : '+'}{formatCurrency(t.amount, org.currency_symbol)}
                  </td>
                  <td style={{ padding: '10px 14px' }}><TypeBadge type={t.entry_type} /></td>
                  <td style={{ padding: '10px 14px', textTransform: 'capitalize' }}>{t.category}</td>
                  <td style={{ padding: '10px 14px', fontSize: 12.5 }}>{t.fund}</td>
                  <td style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>{formatDate(t.transaction_date)}</td>
                  <td style={{ padding: '10px 14px' }}><StatusBadge status={t.status} /></td>
                  {/* Actions: Approve, Reject, Delete — no receipt button */}
                  <td style={{ padding: '10px 14px' }} onClick={e => e.stopPropagation()}>
                    <div style={{ display: 'flex', gap: 5 }}>
                      <IconBtn solidBg="#2E7D52" title="Approve" onClick={() => handleApprove(t)}><BtnIco.Check /></IconBtn>
                      <IconBtn solidBg="#C0392B" title="Reject"  onClick={() => handleReject(t)}><BtnIco.Cancel /></IconBtn>
                      <IconBtn solidBg="#7B1A1A" title="Delete"  onClick={() => setDeleteItem(t)}><BtnIco.Delete /></IconBtn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <PaginationRow page={page} totalPages={totalPages} onPageChange={setPage} total={filtered.length} />
      </Card>

      {/* ── Transaction Detail InfoModal (row click) ────────────── */}
      <InfoModal
        open={!!viewItem}
        onClose={() => setViewItem(null)}
        title={viewItem?.reference_number || ''}
        subtitle={viewItem ? `${org.transaction_label} · ${formatDate(viewItem.transaction_date)}` : ''}
        accentColor={viewItem ? modalAccentColor(viewItem.status) : 'var(--accent)'}
        footer={
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button onClick={() => window.print()}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 20px', borderRadius: 9, border: 'none', background: 'var(--accent)', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
              <IcoPrint /> Print
            </button>
            <button onClick={() => setViewItem(null)}
              style={{ padding: '10px 28px', borderRadius: 9, border: '1.5px solid var(--border-card)', background: 'var(--neutral-light)', color: 'var(--text-primary)', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{marginRight:4}}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> Close
            </button>
          </div>
        }>
        {viewItem && <TransactionDetail tx={viewItem} org={org} isMobile={isMobile} />}
      </InfoModal>

      {/* ── Delete Confirmation Modal ───────────────────────────── */}
      <InfoModal
        open={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        title={`Delete ${org.transaction_label}`}
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
        {deleteItem && <DeleteBody tx={deleteItem} org={org} />}
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
