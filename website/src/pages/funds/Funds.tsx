// Funds.jsx — Manage Funds page now matches FundReport tile-card layout.
// Tile cards are clickable → opens detail InfoModal (same style as FundReport).
// Edit and Delete buttons live inside the InfoModal footer — no buttons on tile cards.
// Fully responsive via useBreakpoint.
import { useState } from 'react'
import { Card, Select, InfoModal, ResponseModal } from '../../components/ui'
import { MOCK_FUNDS, MOCK_TRANSACTIONS, formatCurrency } from '../../api/mockData'
import { useOrg } from '../../context/OrgContext'
import useBreakpoint from '../../hooks/useBreakpoint'
import type { Fund, OrgConfig } from '../../types'

// Edit form — annual_fee stays string|number|null: the number input yields strings (converted to number on save)
type FundEditState = Omit<Fund, 'annual_fee'> & { annual_fee: number | string | null }
import { capitalize } from '../../utils/formatters'

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
function IconLock()   { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> }
function IconGlobe()  { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg> }
// function IconEdit()   { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> }
// function IconDelete() { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg> }
// function IconPlus()   { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> }
// function IconSave()   { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg> }

/* ── TILE COLOR RULES:
   is_required = true  → GREEN top strip + lock icon (non-deletable, protected fund)
   is_required = false → random solid color from palette (deletable)
   Border always matches the strip color at 30% opacity for visual cohesion.     */
const PROTECTED_COLOR = '#2E7D52'                                        // green = non-deletable
const OPT_COLORS      = ['#4B5EAA','#2471A3','#7D3C98','#B7600A','#117A65','#C0392B','#1E2128','#0E6655']
function fundTileColor(fund: Fund) {
  if (fund.is_required) return PROTECTED_COLOR
  return OPT_COLORS[(parseInt(fund.id, 10) - 1 || 0) % OPT_COLORS.length]
}

/* ── Lock icon — shown top-right on non-deletable tiles ─────────── */
function IcoShieldLock() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  )
}

/* ── SectionLabel — same as FundReport ──────────────────────────── */
// function SectionLabel({ icon, label }: Record<string, any>) {
//   return (
//     <div style={{ display: 'flex' as const, alignItems: 'center', gap: 7, fontSize: 11.5, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' as const, letterSpacing: '.08em', marginBottom: 12, paddingBottom: 8, borderBottom: '1px solid var(--border-inner)' }}>
//       <span style={{ display: 'flex' as const, color: 'var(--accent)' }}>{icon}</span>
//       {label}
//     </div>
//   )
// }

/* ── FundTileCard — clickable tile ─────────────────────────────── */
function FundTileCard({ fund, org, onClick }: { fund: Fund; org: OrgConfig; onClick: () => void }) {
  const stripColor  = fundTileColor(fund)
  const isProtected = fund.is_required    // green + lock icon = cannot be deleted
  return (
    <div
      onClick={onClick}
      style={{
        borderRadius: 12, overflow: 'hidden', position: 'relative' as const,
        border: `2px solid ${stripColor}40`,
        background: '#fff', cursor: 'pointer' as const,
        display: 'flex' as const, flexDirection: 'column' as const,
        transition: 'transform .15s, box-shadow .15s',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 8px 20px ${stripColor}40` }}
      onMouseLeave={(e: React.MouseEvent<HTMLElement>) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}>
      {/* Solid color top strip — GREEN for protected, random for optional */}
      <div style={{ height: 6, background: stripColor }} />
      {/* Lock badge — top-right, only on non-deletable protected funds */}
      {isProtected && (
        <div title="Protected fund — cannot be deleted" style={{ position: 'absolute' as const, top: 10, right: 10, width: 24, height: 24, borderRadius: '50%', background: PROTECTED_COLOR, color: '#fff', display: 'flex' as const, alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 6px rgba(46,125,82,.4)', zIndex: 1 }}>
          <IcoShieldLock />
        </div>
      )}
      <div style={{ padding: '13px 14px', flex: 1, display: 'flex' as const, flexDirection: 'column' as const, gap: 7 }}>
        {/* Fund name */}
        <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.3, color: 'var(--text-primary)', overflow: 'hidden', display: '-webkit-box' as const, WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', paddingRight: isProtected ? 28 : 0 }}>{fund.name}</div>
        {/* Status pill */}
        <div style={{ display: 'inline-flex' as const, width: 'fit-content' }}>
          <span style={{ padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: fund.status === 'active' ? '#2E7D52' : '#C0392B', color: '#fff' }}>
            {fund.status.charAt(0).toUpperCase() + fund.status.slice(1)}
          </span>
        </div>
        {/* Balance */}
        <div style={{ fontSize: 18, fontWeight: 800, color: stripColor }}>{formatCurrency(fund.balance, org.currency_symbol)}</div>
        {/* Annual fee hint */}
        {fund.annual_fee != null && fund.annual_fee > 0 && <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>Fee: {formatCurrency(fund.annual_fee, org.currency_symbol)} / yr</div>}
        {/* Click hint */}
        <div style={{ fontSize: 11, color: stripColor, fontWeight: 600, marginTop: 'auto', paddingTop: 6, borderTop: '1px solid var(--border-inner)' }}>
          {isProtected ? 'Protected · Click for details →' : 'Click for details →'}
        </div>
      </div>
    </div>
  )
}

/* ── Fund Detail content — read-only view (same as FundReport) ───── */
function FundDetailContent({ fund, org }: { fund: Fund; org: OrgConfig }) {
  const { isMobile } = useBreakpoint()                   // own hook call — must be inside component
  const accentC = fund.is_required ? 'var(--accent)' : 'var(--info)'
  const bgC     = fund.is_required ? 'var(--accent-light)' : 'var(--info-light)'
  const received = MOCK_TRANSACTIONS.filter((t) => t.fund === fund.name && t.entry_type !== 'expense').reduce((s, t) => s + t.amount, 0)

  return (
    <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 18 }}>
      {/* Hero balance */}
      <div style={{ padding: '16px 20px', borderRadius: 12, background: bgC, border: '1.5px solid ' + accentC + '30' }}>
        <div style={{ fontSize: 26, fontWeight: 800, color: accentC, marginBottom: 6 }}>{formatCurrency(fund.balance, org.currency_symbol)}</div>
        <div style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{fund.description || 'No description provided.'}</div>
      </div>
      {/* Detail grid — 3-col desktop, 1-col mobile */}
      <div style={{ display: 'grid' as const, gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 12 }}>
        {[
          ['Fund Name',      fund.name],
          ['Type',           capitalize(fund.fund_type)],
          ['Status',         capitalize(fund.status)],
          ['Required',       fund.is_required ? 'Yes — all members' : 'No'],
          ['Pay Frequency',  capitalize(fund.payment_frequency)],
          ['Annual Fee',     fund.annual_fee ? formatCurrency(fund.annual_fee, org.currency_symbol) : '—'],
          ['Balance',        formatCurrency(fund.balance, org.currency_symbol)],
          ['Total Received', formatCurrency(received, org.currency_symbol)],
          ['Managed by',     fund.created_by || '—'],
        ].map(([k, v]) => (
          <div key={k} style={{ padding: '12px 14px', borderRadius: 10, background: 'var(--neutral-light)', border: '1px solid var(--border-card)' }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' as const, letterSpacing: '.07em', marginBottom: 4 }}>{k}</div>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)' }}>{v}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Fund Edit form — shown inside InfoModal when editMode=true ───── */
function FundEditForm({ editForm, onFormChange, org }: { editForm: FundEditState | null; onFormChange: (key: keyof FundEditState, value: string) => void; org: OrgConfig }) {
  const FREQ_OPTIONS   = [{ value: 'monthly', label: 'Monthly' }, { value: 'quarterly', label: 'Quarterly' }, { value: 'annually', label: 'Annually' }]
  const STATUS_OPTIONS = [{ value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }]
  const field = (label: string, key: 'name' | 'description' | 'annual_fee', type = 'text', hint?: string) => (
    <div key={key} style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 3 }}>
      <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' as const, letterSpacing: '.04em' }}>{label}</label>
      <input type={type} value={editForm?.[key] ?? ''} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => onFormChange(key, e.target.value)}
        style={{ padding: '8px 11px', borderRadius: 8, border: '1.5px solid var(--border-card)', fontSize: 13, fontFamily: 'var(--font-body)', color: 'var(--text-primary)', background: '#fff', outline: 'none', width: '100%', boxSizing: 'border-box' as const }}
        onFocus={e => { e.target.style.borderColor = 'var(--accent)' }}
        onBlur={e  => { e.target.style.borderColor = 'var(--border-card)' }} />
      {hint && <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{hint}</div>}
    </div>
  )
  return (
    <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 14 }}>
      {field('Fund Name', 'name')}
      {field('Description', 'description')}
      {field(`Annual Fee (${org.currency_symbol})`, 'annual_fee', 'number', 'Leave blank if not applicable')}
      <Select label="Status" value={editForm?.status} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => onFormChange('status', e.target.value)} options={STATUS_OPTIONS} />
      {editForm?.is_required && (
        <Select label="Payment Frequency" value={editForm.payment_frequency || ''} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => onFormChange('payment_frequency', e.target.value)} options={FREQ_OPTIONS} />
      )}
    </div>
  )
}

/* ── Delete body ─────────────────────────────────────────────────── */
function DeleteBody({ fund, org }: { fund: Fund; org: OrgConfig }) {
  return (
    <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 16 }}>
      <div style={{ padding: '14px 16px', borderRadius: 10, background: '#fdecea', border: '1.5px solid rgba(192,57,43,.30)', display: 'flex' as const, gap: 10, alignItems: 'flex-start' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" strokeWidth="2.5" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 1 }}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        <div>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--danger)' }}>Warning: This action cannot be undone</div>
          <div style={{ fontSize: 12.5, color: 'var(--danger)', marginTop: 3, lineHeight: 1.5 }}>Deleting "{fund.name}" will permanently remove this fund and all related records.</div>
        </div>
      </div>
      {[['Fund Name', fund.name], ['Balance', formatCurrency(fund.balance, org.currency_symbol)], ['Type', fund.fund_type], ['Status', fund.status]].map(([k, v], idx) => (
        <div key={k} style={{ display: 'flex' as const, gap: 16, padding: '10px 14px', borderBottom: '1px solid var(--border-inner)', background: idx % 2 === 0 ? 'var(--neutral-light)' : '#fff' }}>
          <div style={{ width: 130, fontSize: 12.5, color: 'var(--text-muted)', flexShrink: 0, fontWeight: 500 }}>{k}</div>
          <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)', textTransform: 'capitalize' as const }}>{v}</div>
        </div>
      ))}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════════ */
export default function Funds() {
  const org = useOrg()
  const { isMobile, isTablet } = useBreakpoint()
  const kpiCols  = isMobile || isTablet ? 'repeat(2,1fr)' : 'repeat(4,1fr)'
  const fundCols = isMobile ? '1fr' : isTablet ? 'repeat(2,1fr)' : 'repeat(4,1fr)'

  const [funds,        setFunds]        = useState(MOCK_FUNDS)
  const [viewItem,     setViewItem]     = useState<Fund | null>(null)    // fund open in detail modal
  const [editMode,     setEditMode]     = useState(false)   // toggle edit inside modal
  const [editForm,     setEditForm]     = useState<FundEditState | null>(null)    // local edit form state
  const [deleteItem,   setDeleteItem]   = useState<Fund | null>(null)    // fund pending deletion
  const [actionResult, setActionResult] = useState<{variant:string;title:string;message:string} | null>(null)    // feedback

  const totalBalance  = funds.reduce((s, f) => s + f.balance, 0)
  const activeFunds   = funds.filter((f) => f.status === 'active').length
  const inactiveFunds = funds.filter((f) => f.status !== 'active').length

  /* Split funds into internal and external sections */
  const internal = funds.filter((f) => f.fund_type === 'internal')
  const external = funds.filter((f) => f.fund_type === 'external')

  /* Open detail modal in read-only mode */
  function openDetail(fund: Fund) {
    setViewItem(fund)
    setEditForm({ ...fund })
    setEditMode(false)
  }

  function handleFormChange(key: keyof FundEditState, value: string) {
    setEditForm((prev) => prev ? ({ ...prev, [key]: value }) : null)
  }

  function handleSaveEdit() {
    if (!editForm) return
    const saved: Fund = { ...editForm, annual_fee: editForm.annual_fee === '' || editForm.annual_fee == null ? null : Number(editForm.annual_fee) }   // input yields a string
    setFunds(prev => prev.map((f) => f.id === saved.id ? saved : f))
    setViewItem(saved)
    setEditMode(false)
    setActionResult({ variant: 'success', title: `${org.fund_label} Updated`, message: `"${editForm?.name}" has been saved successfully.` })
  }

  function handleCancelEdit() {
    setEditForm(viewItem ? { ...viewItem } : null)
    setEditMode(false)
  }

  function handleDelete() {
    const name = deleteItem?.name
    setFunds(prev => prev.filter((f) => f.id !== deleteItem?.id))
    if (viewItem?.id === deleteItem?.id) setViewItem(null)
    setDeleteItem(null)
    setTimeout(() => setActionResult({ variant: 'danger', title: `${org.fund_label} Deleted`, message: `"${name}" has been permanently removed.` }), 260)
  }

  const kpis = [
    { label: `Total ${org.fund_label}s`, value: funds.length,                                          color: 'var(--accent)',  bg: 'var(--accent-light)'  },
    { label: 'Active',                   value: activeFunds,                                             color: 'var(--success)', bg: 'var(--success-light)' },
    { label: 'Inactive',                 value: inactiveFunds,                                           color: 'var(--danger)',  bg: 'var(--danger-light)'  },
    { label: 'Running Balance',          value: formatCurrency(totalBalance, org.currency_symbol),       color: 'var(--warning)', bg: 'var(--warning-light)' },
  ]

  return (
    <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 14 }}>

      {/* ── KPI strip ───────────────────────────────────────────── */}
      <div style={{ display: 'grid' as const, gridTemplateColumns: kpiCols, gap: 12 }}>
        {kpis.map((k) => (
          <Card key={k.label} style={{ padding: '14px 18px', background: '#FFFFFF', borderLeft: '4px solid ' + k.color, border: '1px solid ' + k.color + '25', transition: 'transform .18s ease, box-shadow .18s ease' }}
            onMouseEnter={(e: React.MouseEvent<HTMLElement>) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(75,94,170,.18)' }}
            onMouseLeave={(e: React.MouseEvent<HTMLElement>) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500, marginBottom: 6 }}>{k.label}</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: k.color, lineHeight: 1 }}>{k.value}</div>
          </Card>
        ))}
      </div>

      {/* ── Page header — title + Add Fund button above fund sections ── */}
      <Card style={{ padding: '14px 20px' }}>
        <div style={{ display: 'flex' as const, alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>{org.fund_label} Management</div>
            <div style={{ fontSize: 12.5, color: 'var(--text-muted)', marginTop: 2 }}>
              {funds.length} fund{funds.length !== 1 ? 's' : ''} configured — click any tile to view details
            </div>
          </div>
          <button onClick={() => { window.location.hash = '/funds/add' }}
            style={{ display: 'inline-flex' as const, alignItems: 'center', gap: 6, padding: '9px 18px', borderRadius: 8, border: 'none', background: 'var(--accent)', color: '#fff', fontSize: 13.5, fontWeight: 600, cursor: 'pointer' as const, fontFamily: 'var(--font-body)', whiteSpace: 'nowrap' as const }}>
            <BtnIco.Plus /> Add {org.fund_label}
          </button>
        </div>
      </Card>

      {/* ── Internal funds section ────────────────────────────────── */}
      {internal.length > 0 && (
        <Card style={{ padding: '18px 20px' }}>
          <div style={{ display: 'flex' as const, alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <div style={{ width: 28, height: 28, borderRadius: 7, background: 'var(--accent-light)', display: 'flex' as const, alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', flexShrink: 0 }}><IconLock /></div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>Internal Funds (Required)</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 1 }}>{internal.length} fund{internal.length !== 1 ? 's' : ''} — click any tile for full details</div>
            </div>
          </div>
          <div style={{ display: 'grid' as const, gridTemplateColumns: fundCols, gap: 14 }}>
            {internal.map((f) => <FundTileCard key={f.id} fund={f} org={org} onClick={() => openDetail(f)} />)}
          </div>
        </Card>
      )}

      {/* ── External funds section ────────────────────────────────── */}
      {external.length > 0 && (
        <Card style={{ padding: '18px 20px' }}>
          <div style={{ display: 'flex' as const, alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <div style={{ width: 28, height: 28, borderRadius: 7, background: 'var(--info-light)', display: 'flex' as const, alignItems: 'center', justifyContent: 'center', color: 'var(--info)', flexShrink: 0 }}><IconGlobe /></div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>External Funds</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 1 }}>{external.length} fund{external.length !== 1 ? 's' : ''} — click any tile for full details</div>
            </div>
          </div>
          <div style={{ display: 'grid' as const, gridTemplateColumns: fundCols, gap: 14 }}>
            {external.map((f) => <FundTileCard key={f.id} fund={f} org={org} onClick={() => openDetail(f)} />)}
          </div>
        </Card>
      )}

      {/* Empty state — shown when funds list is completely empty */}
      {funds.length === 0 && (
        <Card style={{ padding: '48px 24px', textAlign: 'center' as const }}>
          <div style={{ color: 'var(--text-muted)', marginBottom: 10 }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
          <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>No funds found</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>No funds have been added yet. Click "Add Fund" to get started.</div>
        </Card>
      )}

      {/* Transactions link */}
      <Card>
        <div style={{ padding: '14px 20px', fontSize: 13.5, color: 'var(--text-muted)' }}>
          View all fund transactions in the{' '}
          <a href="#/transactions" style={{ color: 'var(--accent)', fontWeight: 500 }}>Transactions</a> section.
        </div>
      </Card>

      {/* ── Detail / Edit InfoModal ───────────────────────────────── */}
      <InfoModal
        open={!!viewItem}
        onClose={() => { setViewItem(null); setEditMode(false) }}
        title={editMode ? `Edit ${org.fund_label}` : (viewItem?.name || '')}
        editMode={editMode}
        subtitle={editMode ? 'Update fund details' : (viewItem?.description || 'Fund details and financial summary')}
        accentColor={editMode ? 'var(--accent)' : (viewItem?.is_required ? 'var(--accent)' : 'var(--info)')}
        footer={
          editMode ? (
            /* Edit mode: Save + Cancel */
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
            /* View mode: Edit + Delete + Close */
            <div style={{ display: 'flex' as const, gap: 10, justifyContent: 'flex-end' }}>
              <div style={{ display: 'flex' as const, gap: 8 }}>
                <button onClick={() => setEditMode(true)}
                  style={{ display: 'inline-flex' as const, alignItems: 'center', gap: 6, padding: '10px 20px', borderRadius: 9, border: 'none', background: 'var(--accent)', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' as const, fontFamily: 'var(--font-body)', transition: 'transform .18s ease, box-shadow .18s ease' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 0 0 1.5px rgba(0,0,0,.70), 0 4px 12px rgba(0,0,0,.14)' }}
              onMouseLeave={(e: React.MouseEvent<HTMLElement>) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}>
                  <BtnIco.Edit /> Edit
                </button>
                {!viewItem?.is_required && (
                  <button onClick={() => { setDeleteItem(viewItem); setViewItem(null) }}
                    style={{ display: 'inline-flex' as const, alignItems: 'center', gap: 6, padding: '10px 20px', borderRadius: 9, border: 'none', background: 'var(--danger)', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' as const, fontFamily: 'var(--font-body)', transition: 'transform .18s ease, box-shadow .18s ease' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 0 0 1.5px rgba(0,0,0,.70), 0 4px 12px rgba(0,0,0,.14)' }}
              onMouseLeave={(e: React.MouseEvent<HTMLElement>) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}>
                    <BtnIco.Delete /> Delete
                  </button>
                )}
              </div>
              <button onClick={() => setViewItem(null)}
                style={{ padding: '10px 28px', borderRadius: 9, border: '1.5px solid var(--border-card)', background: 'var(--neutral-light)', color: 'var(--text-primary)', fontSize: 14, fontWeight: 600, cursor: 'pointer' as const, fontFamily: 'var(--font-body)' }}>
                Close
              </button>
            </div>
          )
        }>
        {viewItem && editForm && (
          editMode
            ? <FundEditForm editForm={editForm} onFormChange={handleFormChange} org={org} />
            : <FundDetailContent fund={viewItem} org={org} />
        )}
      </InfoModal>

      {/* ── Delete Confirmation Modal ────────────────────────────── */}
      <InfoModal
        open={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        title={`Delete ${org.fund_label}`}
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
        {deleteItem && <DeleteBody fund={deleteItem} org={org} />}
      </InfoModal>

      {/* ── Action Feedback ──────────────────────────────────────── */}
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
