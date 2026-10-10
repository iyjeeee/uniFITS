// Utilities.jsx — Manage utility/operational expenses.
// Action column: Delete only (Eye + Edit removed per spec).
// Edit functionality moved inside the detail InfoModal footer.
// Matches Projects/Events table style: status-colored rows, KPI strip, search+filter, PaginationRow.
import { useState } from 'react'
import { StatusBadge, Card, Input, Select, InfoModal, ResponseModal } from '../../components/ui'
import { IconBtn, PaginationRow } from '../../components/TableUtils'
import { BtnIco, TableIco } from '../../components/Icons'
import { MOCK_UTILITIES, MOCK_FUNDS, formatCurrency, formatDate } from '../../api/mockData'
import { useOrg } from '../../context/OrgContext'
import { rowStyle, rowHoverBg, modalAccentColor } from '../../constants/tableColors'
import useBreakpoint from '../../hooks/useBreakpoint'
import type { Utility } from '../../types'

/* ── Utility detail + inline edit view inside InfoModal ──────────── */
// editMode toggles between read-only detail and editable form within the same modal
function UtilityDetailModal({ item, editForm, editMode, setEditMode: _setEditMode, onFormChange, org }: Record<string, any>) {
  const remaining = item.total_amount - item.amount_paid
  const pctPaid   = item.total_amount > 0 ? Math.round((item.amount_paid / item.total_amount) * 100) : 0
  const fundOptions = MOCK_FUNDS.map((f: any) => ({ value: f.name, label: f.name }))
  const statusOptions = [{ value: 'unpaid', label: 'Unpaid' }, { value: 'partial', label: 'Partial' }, { value: 'paid', label: 'Paid' }]

  if (editMode) {
    /* ── EDIT VIEW — inline form ──────────────────────────────── */
    return (
      <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 14 }}>
        <Input label="Category / Expense Type" value={editForm?.expense_type} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => onFormChange('expense_type', e.target.value)} />
        <div style={{ display: 'grid' as const, gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <Input label="Total Amount (₱)" type="number" value={editForm?.total_amount} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => onFormChange('total_amount', e.target.value)} />
          <Input label="Amount Paid (₱)"  type="number" value={editForm?.amount_paid}  onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => onFormChange('amount_paid', e.target.value)} />
        </div>
        <Input label="Payment Date" type="date" value={editForm?.payment_date} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => onFormChange('payment_date', e.target.value)} />
        <Input label="Paid To (Vendor / Biller)" value={editForm?.paid_to} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => onFormChange('paid_to', e.target.value)} placeholder="e.g. Meralco, PLDT" />
        <Select label="Fund (Paid From)" value={editForm?.fund} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => onFormChange('fund', e.target.value)} options={fundOptions} placeholder="-- Select fund --" />
        <Select label="Status" value={editForm?.status} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => onFormChange('status', e.target.value)} options={statusOptions} />
        <Input label="Notes" value={editForm?.notes || ''} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => onFormChange('notes', e.target.value)} placeholder="Optional notes" />
      </div>
    )
  }

  /* ── READ-ONLY DETAIL VIEW ────────────────────────────────── */
  return (
    <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 16 }}>

      {/* Payment progress bar */}
      <div style={{ padding: '14px 18px', borderRadius: 10, background: 'var(--neutral-light)', border: '1px solid var(--border-card)' }}>
        <div style={{ display: 'flex' as const, justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
          <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Payment Progress</span>
          <span style={{ fontWeight: 700, color: item.status === 'paid' ? 'var(--success)' : 'var(--warning)' }}>{pctPaid}% paid</span>
        </div>
        <div style={{ height: 8, background: 'var(--border)', borderRadius: 6, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${pctPaid}%`, background: item.status === 'paid' ? 'var(--success)' : 'var(--warning)', borderRadius: 6, transition: 'width .4s' }} />
        </div>
      </div>

      {/* Section 1 — Expense Identity */}
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' as const, letterSpacing: '.07em', marginBottom: 8 }}>Expense Details</div>
        <div style={{ display: 'grid' as const, gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[
            ['Utility ID',   `#${item.id}`],
            ['Category',     item.expense_type],
            ['Paid To',      item.paid_to || '—'],
            ['Fund',         item.fund    || '—'],
          ].map(([k, v]) => (
            <div key={k} style={{ padding: '12px 14px', borderRadius: 10, background: 'var(--neutral-light)', border: '1px solid var(--border-card)' }}>
              <div style={{ fontSize: 10.5, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '.07em', marginBottom: 4 }}>{k}</div>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)' }}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2 — Payment Info */}
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' as const, letterSpacing: '.07em', marginBottom: 8 }}>Payment Information</div>
        <div style={{ display: 'grid' as const, gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div style={{ padding: '12px 14px', borderRadius: 10, background: 'var(--neutral-light)', border: '1px solid var(--border-card)' }}>
            <div style={{ fontSize: 10.5, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '.07em', marginBottom: 4 }}>Payment Date</div>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)' }}>{formatDate(item.payment_date)}</div>
          </div>
          <div style={{ padding: '12px 14px', borderRadius: 10, background: 'var(--neutral-light)', border: '1px solid var(--border-card)' }}>
            <div style={{ fontSize: 10.5, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '.07em', marginBottom: 4 }}>Status</div>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: item.status === 'paid' ? 'var(--success)' : item.status === 'partial' ? 'var(--warning)' : 'var(--danger)' }}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </div>
          </div>
        </div>
      </div>

      {/* Section 3 — Financial Breakdown */}
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' as const, letterSpacing: '.07em', marginBottom: 8 }}>Financial Breakdown</div>
        <div style={{ display: 'grid' as const, gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          <div style={{ padding: '12px 14px', borderRadius: 10, background: 'var(--success-light)', border: '1px solid rgba(46,125,82,.18)' }}>
            <div style={{ fontSize: 10.5, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '.07em', marginBottom: 4 }}>Total</div>
            <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)' }}>{formatCurrency(item.total_amount, org.currency_symbol)}</div>
          </div>
          <div style={{ padding: '12px 14px', borderRadius: 10, background: 'var(--accent-light)', border: '1px solid rgba(75,94,170,.18)' }}>
            <div style={{ fontSize: 10.5, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '.07em', marginBottom: 4 }}>Paid</div>
            <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--accent)' }}>{formatCurrency(item.amount_paid, org.currency_symbol)}</div>
          </div>
          <div style={{ padding: '12px 14px', borderRadius: 10, background: remaining > 0 ? 'var(--danger-light)' : 'var(--neutral-light)', border: `1px solid ${remaining > 0 ? 'rgba(192,57,43,.18)' : 'var(--border-card)'}` }}>
            <div style={{ fontSize: 10.5, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '.07em', marginBottom: 4 }}>Remaining</div>
            <div style={{ fontSize: 15, fontWeight: 800, color: remaining > 0 ? 'var(--danger)' : 'var(--success)' }}>{formatCurrency(remaining, org.currency_symbol)}</div>
          </div>
        </div>
      </div>

      {/* Section 4 — Notes (if any) */}
      {item.notes && (
        <div style={{ padding: '12px 14px', borderRadius: 10, background: 'var(--neutral-light)', border: '1px solid var(--border-card)' }}>
          <div style={{ fontSize: 10.5, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '.07em', marginBottom: 6 }}>Notes</div>
          <div style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{item.notes}</div>
        </div>
      )}
    </div>
  )
}

/* ── Delete confirmation body ────────────────────────────────────── */
function DeleteBody({ item, org }: Record<string, any>) {
  const cap = (s: any): string => s ? s.charAt(0).toUpperCase() + s.slice(1) : '—'
  return (
    <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 16 }}>
      <div style={{ padding: '14px 16px', borderRadius: 10, background: '#fdecea', border: '1.5px solid rgba(192,57,43,.30)', display: 'flex' as const, gap: 10, alignItems: 'flex-start' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" strokeWidth="2.5" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 1 }}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        <div>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--danger)' }}>Warning: This action cannot be undone</div>
          <div style={{ fontSize: 12.5, color: 'var(--danger)', marginTop: 3, lineHeight: 1.5 }}>Deleting this {org.utility_label} will permanently remove all associated records.</div>
        </div>
      </div>
      <div>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' as const, letterSpacing: '.06em', marginBottom: 10 }}>{org.utility_label} Summary</div>
        {[['Category', item.expense_type], ['Total', formatCurrency(item.total_amount, org.currency_symbol)], ['Status', cap(item.status)], ['Paid To', item.paid_to || '—']].map(([k, v], idx) => (
          <div key={k} style={{ display: 'flex' as const, gap: 16, padding: '10px 14px', borderBottom: '1px solid var(--border-inner)', background: idx % 2 === 0 ? 'var(--neutral-light)' : '#fff' }}>
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
  const [typeFilter,   setTypeFilter]   = useState('all')   // filter by expense_type/category
  const [page,         setPage]         = useState(1)
  const [viewItem,     setViewItem]     = useState<Utility | null>(null)    // item open in detail modal
  const [editMode, setEditMode]     = useState(false)   // toggle edit view inside detail modal
  const [editForm,     setEditForm]     = useState<Utility | null>(null)    // local edit form state
  const [deleteItem,   setDeleteItem]   = useState<Utility | null>(null)    // item pending deletion
  const [actionResult, setActionResult] = useState<{variant:string;title:string;message:string} | null>(null)    // feedback

  const PAGE_SIZE = 10
  const cap = (s: any): string => s ? s.charAt(0).toUpperCase() + s.slice(1) : '—'

  /* Open detail modal — always starts in read-only mode */
  function openDetail(item: any) {
    setViewItem(item)
    setEditForm({ ...item } as any)
    setEditMode(false)
  }

  /* Apply field change to local edit form */
  function handleFormChange(key: any, value: any) {
    setEditForm((prev: any) => ({ ...(prev || {}), [key]: value }))
  }

  /* Save edit — update record in list */
  function handleSaveEdit() {
    setData(prev => prev.map((u: any) => u.id === editForm?.id ? { ...editForm, total_amount: Number(editForm?.total_amount), amount_paid: Number(editForm?.amount_paid) } : u))
    if (editForm) setViewItem({ ...editForm, total_amount: Number(editForm.total_amount), amount_paid: Number(editForm.amount_paid) })
    setEditMode(false)
    setActionResult({ variant: 'success', title: `${org.utility_label} Updated`, message: `"${editForm?.expense_type}" has been saved successfully.` })
  }

  /* Cancel edit — revert form to current item state */
  function handleCancelEdit() {
    setEditForm({ ...viewItem } as any)
    setEditMode(false)
  }

  /* Handle delete */
  function handleDelete() {
    const cat = deleteItem?.expense_type
    setData(prev => prev.filter((u: any) => u.id !== deleteItem?.id))
    if (viewItem?.id === deleteItem?.id) setViewItem(null)
    setDeleteItem(null)
    setTimeout(() => setActionResult({ variant: 'danger', title: `${org.utility_label} Deleted`, message: `"${cat}" has been permanently removed.` }), 260)
  }

  /* Computed KPIs */
  const totalOwed    = data.reduce((s, u) => s + u.total_amount, 0)
  const totalPaid    = data.reduce((s, u) => s + u.amount_paid, 0)
  const totalUnpaid  = totalOwed - totalPaid

  /* Filter + paginate */
  const statusOptions = ['all', ...Array.from(new Set(data.map((u: any) => u.status)))]
  const typeOptions   = ['all', ...Array.from(new Set(data.map((u: any) => u.expense_type).filter(Boolean)))]
  const filtered = data
    .filter((u: any) => statusFilter === 'all' || u.status       === statusFilter)
    .filter((u: any) => typeFilter   === 'all' || u.expense_type === typeFilter)
    .filter((u: any) => Object.values(u).some((v: any) => String(v).toLowerCase().includes(search.toLowerCase())))
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paged      = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const kpis = [
    { label: `Total ${org.utility_label}s`, value: data.length,                                      color: 'var(--accent)',  bg: 'var(--accent-light)'  },
    { label: 'Total Owed',                   value: formatCurrency(totalOwed,   org.currency_symbol),  color: 'var(--warning)', bg: 'var(--warning-light)' },
    { label: 'Total Paid',                   value: formatCurrency(totalPaid,   org.currency_symbol),  color: 'var(--success)', bg: 'var(--success-light)' },
    { label: 'Remaining Unpaid',             value: formatCurrency(totalUnpaid, org.currency_symbol),  color: totalUnpaid > 0 ? 'var(--danger)' : 'var(--success)', bg: totalUnpaid > 0 ? 'var(--danger-light)' : 'var(--success-light)' },
  ]

  return (
    <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 14 }}>

      {/* ── KPI strip ───────────────────────────────────────────── */}
      <div style={{ display: 'grid' as const, gridTemplateColumns: kpiCols, gap: 12 }}>
        {kpis.map((k: any) => (
          <Card key={k.label} style={{ padding: '14px 18px', background: '#FFFFFF', borderLeft: '4px solid ' + k.color, border: '1px solid ' + k.color + '25', transition: 'transform .18s ease, box-shadow .18s ease' }}
            onMouseEnter={(e: React.MouseEvent<HTMLElement>) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(75,94,170,.18)' }}
            onMouseLeave={(e: React.MouseEvent<HTMLElement>) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500, marginBottom: 6 }}>{k.label}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: k.color, lineHeight: 1 }}>{k.value}</div>
          </Card>
        ))}
      </div>

      {/* ── Data table card ─────────────────────────────────────── */}
      <Card>
        {/* Toolbar */}
        <div style={{ display: 'flex' as const, alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: '1px solid var(--border-inner)', flexWrap: 'wrap', gap: 10 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{org.utility_label} Data Table</div>
            <div style={{ fontSize: 12.5, color: 'var(--text-muted)', marginTop: 2 }}>{filtered.length} records · click any row for details</div>
          </div>
          <div style={{ display: 'flex' as const, gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Type filter — white style, consistent with all other filter dropdowns */}
            <select value={typeFilter} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => { setTypeFilter(e.target.value); setPage(1) }}
              style={{ padding: '7px 28px 7px 10px', borderRadius: 7, border: '1.5px solid var(--border-card)', fontSize: 13, fontFamily: 'var(--font-body)', color: 'var(--text-primary)', background: '#fff', cursor: 'pointer' as const, outline: 'none', transition: 'border-color .18s ease, transform .18s ease, box-shadow .18s ease', appearance: 'none', WebkitAppearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%231E2128' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center', backgroundSize: '10px' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 0 0 1.5px rgba(0,0,0,.70), 0 4px 12px rgba(0,0,0,.14)'; e.currentTarget.style.borderColor = 'var(--accent)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; e.currentTarget.style.borderColor = 'var(--border-card)' }}>
              {typeOptions.map((t: any) => <option key={t} value={t}>{t === 'all' ? 'All Types' : t}</option>)}
            </select>
            {/* Status filter — white style, consistent with all other filter dropdowns */}
            <select value={statusFilter} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => { setStatusFilter(e.target.value); setPage(1) }}
              style={{ padding: '7px 28px 7px 10px', borderRadius: 7, border: '1.5px solid var(--border-card)', fontSize: 13, fontFamily: 'var(--font-body)', color: 'var(--text-primary)', background: '#fff', cursor: 'pointer' as const, outline: 'none', transition: 'border-color .18s ease, transform .18s ease, box-shadow .18s ease', appearance: 'none', WebkitAppearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%231E2128' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center', backgroundSize: '10px' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 0 0 1.5px rgba(0,0,0,.70), 0 4px 12px rgba(0,0,0,.14)'; e.currentTarget.style.borderColor = 'var(--accent)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; e.currentTarget.style.borderColor = 'var(--border-card)' }}>
              {statusOptions.map((s: any) => <option key={s} value={s}>{s === 'all' ? 'All Status' : cap(s)}</option>)}
            </select>
            {/* Search */}
            <div style={{ position: 'relative' as const }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" style={{ position: 'absolute' as const, left: 9, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input value={search} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => { setSearch(e.target.value); setPage(1) }} placeholder="Search…"
                style={{ padding: '7px 10px 7px 28px', borderRadius: 7, border: '1.5px solid var(--border-card)', fontSize: 13, fontFamily: 'var(--font-body)', color: 'var(--text-primary)', background: '#fff', outline: 'none', width: 180 }}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e  => e.target.style.borderColor = 'var(--border-card)'} />
            </div>
            {/* Add button */}
            <button onClick={() => window.location.hash = '/transactions/utilities/add'}
              style={{ display: 'inline-flex' as const, alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 8, border: 'none', background: 'var(--accent)', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' as const, fontFamily: 'var(--font-body)', whiteSpace: 'nowrap' as const }}>
              <BtnIco.Plus /> Add {org.utility_label}
            </button>
          </div>
        </div>

        {/* Table — action column has Delete only */}
        <div style={{ overflowX: 'auto' as const }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: 'var(--table-head-bg)' }}>
                {['#', 'Category', 'Total', 'Paid', 'Remaining', 'Due Date', 'Paid To', 'Fund', 'Status', 'Actions'].map((h: any) => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'left' as const, fontSize: 11, fontWeight: 600, color: 'var(--table-head-fg)', textTransform: 'uppercase' as const, letterSpacing: '.06em', borderBottom: '2px solid var(--border-table)', whiteSpace: 'nowrap' as const }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 ? (
                <tr><td colSpan={10} style={{ padding: '32px', textAlign: 'center' as const, color: 'var(--text-muted)' }}>No utilities found.</td></tr>
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
                      <IconBtn solidBg="var(--danger)" title="Delete" onClick={() => setDeleteItem(u)}><TableIco.Delete /></IconBtn>
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
            <div style={{ display: 'flex' as const, gap: 10, justifyContent: 'flex-end' }}>
              <button onClick={handleSaveEdit}
                style={{ display: 'inline-flex' as const, alignItems: 'center', gap: 6, padding: '10px 22px', borderRadius: 9, border: 'none', background: 'var(--accent)', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' as const, fontFamily: 'var(--font-body)', transition: 'transform .18s ease, box-shadow .18s ease' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 0 0 1.5px rgba(0,0,0,.70), 0 4px 12px rgba(0,0,0,.14)' }}
              onMouseLeave={(e: React.MouseEvent<HTMLElement>) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}>
                <BtnIco.Save /> Save Changes
              </button>
              <button onClick={handleCancelEdit}
                style={{ padding: '10px 24px', borderRadius: 9, border: '1.5px solid var(--border-card)', background: 'var(--neutral-light)', color: 'var(--text-primary)', fontSize: 14, fontWeight: 600, cursor: 'pointer' as const, fontFamily: 'var(--font-body)' }}>
                Cancel
              </button>
            </div>
          ) : (
            /* View mode footer: Edit + Close only (Delete removed from modal per spec) */
            <div style={{ display: 'flex' as const, gap: 10, justifyContent: 'flex-end' }}>
              <button onClick={() => setEditMode(true)}
                style={{ display: 'inline-flex' as const, alignItems: 'center', gap: 6, padding: '10px 20px', borderRadius: 9, border: 'none', background: 'var(--accent)', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' as const, fontFamily: 'var(--font-body)', transition: 'transform .18s ease, box-shadow .18s ease' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 0 0 1.5px rgba(0,0,0,.70), 0 4px 12px rgba(0,0,0,.14)' }}
              onMouseLeave={(e: React.MouseEvent<HTMLElement>) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}>
                <BtnIco.Edit /> Edit
              </button>
              <button onClick={() => setViewItem(null)}
                style={{ padding: '10px 28px', borderRadius: 9, border: '1.5px solid var(--border-card)', background: 'var(--neutral-light)', color: 'var(--text-primary)', fontSize: 14, fontWeight: 600, cursor: 'pointer' as const, fontFamily: 'var(--font-body)' }}>
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
          <div style={{ display: 'flex' as const, gap: 10, justifyContent: 'flex-end' }}>
            <button onClick={handleDelete}
              style={{ display: 'inline-flex' as const, alignItems: 'center', gap: 6, padding: '10px 24px', borderRadius: 9, border: 'none', background: 'var(--danger)', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer' as const, fontFamily: 'var(--font-body)', transition: 'transform .18s ease, box-shadow .18s ease' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 0 0 1.5px rgba(0,0,0,.70), 0 4px 12px rgba(0,0,0,.14)' }}
              onMouseLeave={(e: React.MouseEvent<HTMLElement>) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}>
              <BtnIco.Delete /> Yes, Delete
            </button>
            <button onClick={() => setDeleteItem(null)}
              style={{ padding: '10px 28px', borderRadius: 9, border: '1.5px solid var(--border-card)', background: 'var(--neutral-light)', color: 'var(--text-primary)', fontSize: 14, fontWeight: 600, cursor: 'pointer' as const, fontFamily: 'var(--font-body)', transition: 'transform .18s ease, box-shadow .18s ease' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 0 0 1.5px rgba(0,0,0,.70), 0 4px 12px rgba(0,0,0,.14)' }}
              onMouseLeave={(e: React.MouseEvent<HTMLElement>) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}>
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
        variant={(actionResult?.variant || 'success') as import('../../types').ModalVariant || 'success'}
        title={actionResult?.title   || ''}
        message={actionResult?.message || ''}
        confirmLabel="Got it"
      />
    </div>
  )
}
