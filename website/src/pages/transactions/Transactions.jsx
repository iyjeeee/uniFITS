// Transactions.jsx — Full ledger matching Projects/Events table style.
// Statuses: pending, approved, rejected (approval workflow).
// Actions: Approve (green), Reject (red), Delete (dark red) — no receipt button in table.
// Row click opens transaction detail modal (receipt-style).
import { useState } from 'react'
import { Card, StatusBadge, Badge, InfoModal, ResponseModal, FilterSelect } from '../../components/ui'
import { IconBtn, PaginationRow, SearchInput } from '../../components/TableUtils'
import { BtnIco, TableIco } from '../../components/Icons'
import { MOCK_TRANSACTIONS, formatCurrency, formatDate } from '../../api/mockData'
import { useOrg } from '../../context/OrgContext'
import { rowStyle, rowHoverBg, modalAccentColor } from '../../constants/tableColors'
import useBreakpoint from '../../hooks/useBreakpoint'

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
      {/* Transaction Flow — card-based visual flow: From → Type → To */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 10 }}>Transaction Flow</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          {/* FROM node */}
          <div style={{ flex: 1, minWidth: 100, padding: '12px 14px', borderRadius: 10, background: 'var(--neutral-light)', border: '1px solid var(--border-card)', textAlign: 'center' }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 5 }}>From</div>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-primary)' }}>{tx.user_name || 'External'}</div>
          </div>
          {/* Arrow + type badge */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flexShrink: 0 }}>
            <TypeBadge type={tx.entry_type} />
            <svg width="20" height="14" viewBox="0 0 24 14" fill="none"><path d="M0 7h20M15 2l7 5-7 5" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          {/* TO node */}
          <div style={{ flex: 1, minWidth: 100, padding: '12px 14px', borderRadius: 10, background: tx.entry_type === 'expense' ? 'var(--danger-light)' : 'var(--success-light)', border: `1px solid ${tx.entry_type === 'expense' ? 'rgba(192,57,43,.20)' : 'rgba(46,125,82,.20)'}`, textAlign: 'center' }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 5 }}>To Fund</div>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-primary)' }}>{tx.fund}</div>
          </div>
        </div>
      </div>
      {/* Amount + category */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 12 }}>
        <div style={{ padding: '12px 14px', borderRadius: 10, background: 'var(--neutral-light)', border: '1px solid var(--border-card)' }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 5 }}>Category</div>
          <div style={{ fontSize: 14, fontWeight: 600, textTransform: 'capitalize', color: 'var(--text-primary)' }}>{tx.category}</div>
        </div>
        <div style={{ padding: '12px 14px', borderRadius: 10, background: tx.entry_type === 'expense' ? 'var(--danger-light)' : 'var(--success-light)', border: `1px solid ${tx.entry_type === 'expense' ? 'rgba(192,57,43,.20)' : 'rgba(46,125,82,.20)'}` }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 5 }}>Amount</div>
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
  const [statusFilter, setStatusFilter] = useState('all')   // filter by status
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
  const typeOptions   = ['all', 'contribution', 'income', 'expense']
  const statusOptions = ['all', 'approved', 'pending', 'rejected']

  /* Filter + paginate */
  const filtered = data
    .filter(t => typeFilter   === 'all' || t.entry_type === typeFilter)
    .filter(t => statusFilter === 'all' || t.status     === statusFilter)
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
            {/* Shared FilterSelect — type and status filters use the global shared component */}
            <FilterSelect value={typeFilter}   onChange={v => { setTypeFilter(v);   setPage(1) }} options={typeOptions.map(t => ({ value: t, label: t === 'all' ? 'All Types' : cap(t) }))} />
            <FilterSelect value={statusFilter} onChange={v => { setStatusFilter(v); setPage(1) }} options={statusOptions.map(s => ({ value: s, label: s === 'all' ? 'All Status' : cap(s) }))} />
            <SearchInput value={search} onChange={v => { setSearch(v); setPage(1) }} />
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
                    <code style={{ fontSize: 11, color: 'var(--text-primary)', fontFamily: 'monospace' }}>{t.reference_number}</code>
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
                      <IconBtn solidBg="#2E7D52" title="Approve" onClick={() => handleApprove(t)}><TableIco.Approve /></IconBtn>
                      <IconBtn solidBg="#C0392B" title="Reject"  onClick={() => handleReject(t)}><TableIco.Reject /></IconBtn>
                      <IconBtn solidBg="#7B1A1A" title="Delete"  onClick={() => setDeleteItem(t)}><TableIco.Delete /></IconBtn>
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
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 20px', borderRadius: 9, border: 'none', background: 'var(--accent)', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'transform .18s ease, box-shadow .18s ease' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 0 0 1.5px rgba(0,0,0,.70), 0 4px 12px rgba(0,0,0,.14)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}>
              <TableIco.Print /> Print
            </button>
            <button onClick={() => setViewItem(null)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '10px 28px', borderRadius: 9, border: '1px solid var(--border-card)', background: 'var(--neutral-light)', color: 'var(--text-primary)', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'transform .18s ease, box-shadow .18s ease, background .18s ease' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 0 0 1.5px rgba(0,0,0,.70), 0 4px 12px rgba(0,0,0,.14)'; e.currentTarget.style.background = 'var(--border-inner)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; e.currentTarget.style.background = 'var(--neutral-light)' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> Close
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
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 24px', borderRadius: 9, border: 'none', background: 'var(--danger)', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'transform .18s ease, box-shadow .18s ease' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 0 0 1.5px rgba(0,0,0,.70), 0 4px 12px rgba(0,0,0,.14)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}>
              <BtnIco.Delete /> Yes, Delete
            </button>
            <button onClick={() => setDeleteItem(null)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '10px 28px', borderRadius: 9, border: '1px solid var(--border-card)', background: 'var(--neutral-light)', color: 'var(--text-primary)', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'transform .18s ease, box-shadow .18s ease, background .18s ease' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 0 0 1.5px rgba(0,0,0,.70), 0 4px 12px rgba(0,0,0,.14)'; e.currentTarget.style.background = 'var(--border-inner)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; e.currentTarget.style.background = 'var(--neutral-light)' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> Cancel
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
