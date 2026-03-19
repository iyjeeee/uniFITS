// ui/index.jsx — Complete reusable UI component library
// Exports: Badge, StatusBadge, Card, CardHeader, Button, Input, Select, Textarea,
//          DataTable, Modal, InfoModal, ResponseModal, StepWizard, KpiCard, EmptyState, PageHeader,
//          SectionDivider, Avatar
import { useState, useEffect, useRef } from 'react'

// ── Badge ─────────────────────────────────────────────────────────────────────
const BADGE_STYLES = {
  accent:  { bg: 'var(--accent-light)',   color: 'var(--accent)',   border: 'rgba(75,94,170,.2)' },
  success: { bg: 'var(--success-light)',  color: 'var(--success)',  border: 'rgba(46,125,82,.2)' },
  danger:  { bg: 'var(--danger-light)',   color: 'var(--danger)',   border: 'rgba(192,57,43,.2)' },
  warning: { bg: 'var(--warning-light)',  color: 'var(--warning)',  border: 'rgba(212,134,10,.2)' },
  info:    { bg: 'var(--info-light)',     color: 'var(--info)',     border: 'rgba(36,113,163,.2)' },
  neutral: { bg: 'var(--neutral-light)',  color: 'var(--text-secondary)', border: 'var(--border)' },
}

export function Badge({ variant = 'neutral', children, style }) {
  const s = BADGE_STYLES[variant] || BADGE_STYLES.neutral
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 9px', borderRadius: 20, fontSize: 11.5, fontWeight: 600, letterSpacing: '.02em', background: s.bg, color: s.color, border: `1px solid ${s.border}`, whiteSpace: 'nowrap', ...style }}>
      {children}
    </span>
  )
}

// StatusBadge maps common status strings to appropriate badge colors
const STATUS_MAP = {
  active: 'success', inactive: 'danger', present: 'success', absent: 'danger',
  late: 'warning', excused: 'info', upcoming: 'info', ongoing: 'accent',
  completed: 'success', cancelled: 'danger', paid: 'success', unpaid: 'danger',
  partial: 'warning', success: 'success', failed: 'danger', pending: 'warning',
}
export function StatusBadge({ status }) {
  const variant = STATUS_MAP[String(status).toLowerCase()] || 'neutral'
  return <Badge variant={variant}>{String(status).charAt(0).toUpperCase() + String(status).slice(1)}</Badge>
}

// ── Avatar ────────────────────────────────────────────────────────────────────
const AVATAR_COLORS = ['#4B5EAA','#2E7D52','#C0392B','#D4860A','#2471A3','#7D3C98','#117A65']
export function Avatar({ name = '?', size = 36, src, style }) {
  const initials = name.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase()
  const color = AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length]
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: src ? 'transparent' : color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * .37, fontWeight: 700, color: '#fff', flexShrink: 0, overflow: 'hidden', ...style }}>
      {src ? <img src={src} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initials}
    </div>
  )
}

// ── Card ──────────────────────────────────────────────────────────────────────
export function Card({ children, style, onClick }) {
  return (
    <div onClick={onClick} style={{ background: 'var(--white)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)', ...style }}>
      {children}
    </div>
  )
}

// CardHeader — standardized top of a card with title, optional subtitle + actions
export function CardHeader({ title, subtitle, actions }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid var(--border)', gap: 12, flexWrap: 'wrap' }}>
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{title}</div>
        {subtitle && <div style={{ fontSize: 12.5, color: 'var(--text-muted)', marginTop: 2 }}>{subtitle}</div>}
      </div>
      {actions && <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>{actions}</div>}
    </div>
  )
}

// ── Button ────────────────────────────────────────────────────────────────────
const BTN_VARIANTS = {
  primary:   { bg: 'var(--accent)',   color: '#fff',          border: 'var(--accent)',         hover: '#3a4d99' },
  secondary: { bg: 'var(--white)',    color: 'var(--text-primary)', border: 'var(--border)',   hover: 'var(--neutral-light)' },
  danger:    { bg: 'var(--danger)',   color: '#fff',          border: 'var(--danger)',         hover: '#a93226' },
  success:   { bg: 'var(--success)',  color: '#fff',          border: 'var(--success)',        hover: '#256640' },
  ghost:     { bg: 'transparent',     color: 'var(--accent)', border: 'transparent',           hover: 'var(--accent-light)' },
}

export function Button({ children, variant = 'primary', size = 'md', icon, disabled, onClick, style, type = 'button' }) {
  const [hovered, setHovered] = useState(false)
  const v = BTN_VARIANTS[variant] || BTN_VARIANTS.primary
  const pad = size === 'sm' ? '6px 12px' : size === 'lg' ? '12px 24px' : '9px 18px'
  const fs  = size === 'sm' ? 12.5 : size === 'lg' ? 15 : 13.5
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: pad, borderRadius: 8, border: `1px solid ${v.border}`,
        background: disabled ? 'var(--border)' : hovered ? v.hover : v.bg,
        color: disabled ? 'var(--text-muted)' : v.color,
        fontSize: fs, fontWeight: 500, fontFamily: 'var(--font-body)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'background .15s, color .15s', whiteSpace: 'nowrap',
        lineHeight: 1.4, ...style,
      }}>
      {icon && icon}
      {children}
    </button>
  )
}

// ── Input ─────────────────────────────────────────────────────────────────────
export function Input({ label, hint, error, required, style, ...props }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, ...style }}>
      {label && (
        <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }}>
          {label}{required && <span style={{ color: 'var(--danger)', marginLeft: 2 }}>*</span>}
        </label>
      )}
      <input
        {...props}
        style={{
          padding: '8px 12px', borderRadius: 8, border: `1px solid ${error ? 'var(--danger)' : 'var(--border)'}`,
          fontSize: 13.5, fontFamily: 'var(--font-body)', color: 'var(--text-primary)',
          background: props.disabled ? 'var(--neutral-light)' : 'var(--white)',
          outline: 'none', transition: 'border-color .15s', width: '100%', boxSizing: 'border-box',
        }}
        onFocus={e => { if (!error) e.target.style.borderColor = 'var(--accent)' }}
        onBlur={e  => { if (!error) e.target.style.borderColor = 'var(--border)' }}
      />
      {hint  && !error && <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{hint}</div>}
      {error && <div style={{ fontSize: 11.5, color: 'var(--danger)' }}>{error}</div>}
    </div>
  )
}

// ── Select ────────────────────────────────────────────────────────────────────
export function Select({ label, hint, required, options = [], placeholder, style, ...props }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, ...style }}>
      {label && (
        <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }}>
          {label}{required && <span style={{ color: 'var(--danger)', marginLeft: 2 }}>*</span>}
        </label>
      )}
      <select
        {...props}
        style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', fontSize: 13.5, fontFamily: 'var(--font-body)', color: props.value ? 'var(--text-primary)' : 'var(--text-muted)', background: props.disabled ? 'var(--neutral-light)' : 'var(--white)', outline: 'none', cursor: props.disabled ? 'not-allowed' : 'pointer', width: '100%', boxSizing: 'border-box' }}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      {hint && <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{hint}</div>}
    </div>
  )
}

// ── Textarea ──────────────────────────────────────────────────────────────────
export function Textarea({ label, hint, rows = 3, style, ...props }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, ...style }}>
      {label && <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }}>{label}</label>}
      <textarea {...props} rows={rows}
        style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', fontSize: 13.5, fontFamily: 'var(--font-body)', color: 'var(--text-primary)', background: 'var(--white)', outline: 'none', resize: 'vertical', lineHeight: 1.5, width: '100%', boxSizing: 'border-box' }}
        onFocus={e => e.target.style.borderColor = 'var(--accent)'}
        onBlur={e  => e.target.style.borderColor = 'var(--border)'}
      />
      {hint && <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{hint}</div>}
    </div>
  )
}

// ── DataTable ─────────────────────────────────────────────────────────────────
// columns: [{ label, key, accessor, render }]
const PAGE_SIZES = [10, 25, 50, 100]

export function DataTable({ columns = [], data = [], title, subtitle, emptyMsg = 'No records found.' }) {
  const [search, setSearch] = useState('')
  const [page, setPage]     = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // Simple text search across all string values
  const filtered = data.filter(row =>
    Object.values(row).some(v => String(v).toLowerCase().includes(search.toLowerCase()))
  )

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const paginated  = filtered.slice((page - 1) * pageSize, page * pageSize)

  // Reset to page 1 on search change
  useEffect(() => setPage(1), [search])

  function getValue(row, col) {
    if (col.render) return col.render(row, (page - 1) * pageSize + paginated.indexOf(row))
    if (col.accessor) return row[col.accessor] ?? '—'
    return '—'
  }

  return (
    <Card>
      {/* Header row: title + search */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid var(--border)', flexWrap: 'wrap', gap: 12 }}>
        <div>
          {title    && <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{title}</div>}
          {subtitle && <div style={{ fontSize: 12.5, color: 'var(--text-muted)', marginTop: 2 }}>{subtitle}</div>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* rows per page selector */}
          <select value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); setPage(1) }}
            style={{ padding: '6px 10px', borderRadius: 7, border: '1px solid var(--border)', fontSize: 13, fontFamily: 'var(--font-body)', background: 'var(--white)', color: 'var(--text-primary)', cursor: 'pointer' }}>
            {PAGE_SIZES.map(n => <option key={n} value={n}>{n} / page</option>)}
          </select>
          {/* search */}
          <div style={{ position: 'relative' }}>
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth={2} strokeLinecap="round" style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
              <circle cx={11} cy={11} r={8} /><line x1={21} y1={21} x2={16.65} y2={16.65} />
            </svg>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search…"
              style={{ padding: '6px 10px 6px 28px', borderRadius: 7, border: '1px solid var(--border)', fontSize: 13, fontFamily: 'var(--font-body)', color: 'var(--text-primary)', background: 'var(--white)', outline: 'none', width: 180 }} />
          </div>
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5 }}>
          <thead>
            <tr style={{ background: 'var(--neutral-light)' }}>
              {columns.map(col => (
                <th key={col.label || col.key} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11.5, fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--text-muted)', borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap' }}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0
              ? <tr><td colSpan={columns.length} style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13.5 }}>{emptyMsg}</td></tr>
              : paginated.map((row, i) => (
                  <tr key={row.id || i} style={{ borderBottom: '1px solid var(--border)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--neutral-light)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    {columns.map(col => (
                      <td key={col.label || col.key} style={{ padding: '12px 16px', verticalAlign: 'middle', color: 'var(--text-primary)' }}>
                        {getValue(row, col)}
                      </td>
                    ))}
                  </tr>
                ))
            }
          </tbody>
        </table>
      </div>

      {/* Pagination footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', borderTop: '1px solid var(--border)', flexWrap: 'wrap', gap: 10 }}>
        <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          Showing <strong>{filtered.length === 0 ? 0 : (page - 1) * pageSize + 1}–{Math.min(page * pageSize, filtered.length)}</strong> of <strong>{filtered.length}</strong> records
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          <PagBtn label="«" onClick={() => setPage(1)}            disabled={page === 1} />
          <PagBtn label="‹" onClick={() => setPage(p => p - 1)}  disabled={page === 1} />
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const p = Math.max(1, Math.min(totalPages - 4, page - 2)) + i
            if (p < 1 || p > totalPages) return null
            return <PagBtn key={p} label={String(p)} active={p === page} onClick={() => setPage(p)} />
          })}
          <PagBtn label="›" onClick={() => setPage(p => p + 1)}  disabled={page === totalPages} />
          <PagBtn label="»" onClick={() => setPage(totalPages)}   disabled={page === totalPages} />
        </div>
      </div>
    </Card>
  )
}

function PagBtn({ label, onClick, disabled, active }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{ minWidth: 32, height: 32, padding: '0 8px', borderRadius: 6, border: '1px solid var(--border)', background: active ? 'var(--accent)' : disabled ? 'var(--neutral-light)' : 'var(--white)', color: active ? '#fff' : disabled ? 'var(--text-muted)' : 'var(--text-primary)', fontSize: 13, fontFamily: 'var(--font-body)', cursor: disabled ? 'not-allowed' : 'pointer' }}>
      {label}
    </button>
  )
}

// ── Modal System ──────────────────────────────────────────────────────────────
// Two distinct modal types for consistent UX:
//   Modal       — backwards-compatible default, routes to InfoModal
//   InfoModal   — large (max 800px), rich detail view with header accent bar
//   ResponseModal — compact (max 420px), success/error/confirm feedback

// Shared overlay lock — prevents body scroll while any modal is open
function useModalLock(open) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else      document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])
}

// CloseButton — shared X button used in both modal types
function CloseButton({ onClose }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onClick={onClose}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: 32, height: 32, borderRadius: 8, border: 'none',
        background: hov ? 'var(--border)' : 'var(--neutral-light)',
        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: hov ? 'var(--text-primary)' : 'var(--text-secondary)',
        transition: 'background .15s, color .15s', flexShrink: 0,
      }}>
      <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
        <line x1={18} y1={6} x2={6} y2={18}/><line x1={6} y1={6} x2={18} y2={18}/>
      </svg>
    </button>
  )
}

// ── InfoModal — large detail/form modal (max 800px wide, up to 90vh tall) ─────
// Use for: project/event details, full forms, reports, receipts, list overviews
export function InfoModal({ open, onClose, title, subtitle, accentColor = 'var(--accent)', children, footer }) {
  useModalLock(open)
  if (!open) return null
  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(15,18,30,.55)', zIndex: 300,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px 16px', backdropFilter: 'blur(3px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{
        background: 'var(--white)', borderRadius: 16,
        boxShadow: '0 8px 32px rgba(0,0,0,.14), 0 32px 80px rgba(0,0,0,.18)',
        width: '100%', maxWidth: 920, maxHeight: '92vh',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        border: '1px solid rgba(255,255,255,.08)',
      }}>
        {/* Top accent bar */}
        <div style={{ height: 4, background: accentColor, flexShrink: 0 }} />

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
          padding: '22px 32px 18px', borderBottom: '1px solid var(--border)', flexShrink: 0, gap: 16,
        }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.25 }}>{title}</div>
            {subtitle && <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>{subtitle}</div>}
          </div>
          <CloseButton onClose={onClose} />
        </div>

        {/* Scrollable body */}
        <div style={{ padding: '26px 32px', overflowY: 'auto', flex: 1, minHeight: 0 }}>{children}</div>

        {/* Optional footer */}
        {footer && (
          <div style={{ padding: '18px 32px', borderTop: '1px solid var(--border)', flexShrink: 0,
            display: 'flex', justifyContent: 'flex-end', gap: 10, background: 'var(--neutral-light)' }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

// ── ResponseModal — compact feedback modal (max 460px) ─────────────────────────
// Variant usage:
//   success → green  — saved, posted, accepted, confirmed, completed, approved
//   danger  → red    — deleted, rejected, error, failed, removed
//   warning → yellow — pending, caution, partial, draft, awaiting
//   info    → blue   — neutral info, FYI notifications, general updates
// Always include a descriptive `message` so the user understands what happened.
const RESPONSE_VARIANTS = {
  success: {
    color: '#2E7D52', bg: '#f0faf4', border: 'rgba(46,125,82,.3)',
    strip: '#2E7D52',
    icon: <svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx={12} cy={12} r={10}/><polyline points="9 12 11 14 15 10"/></svg>,
  },
  danger: {
    color: '#C0392B', bg: '#fdf3f2', border: 'rgba(192,57,43,.3)',
    strip: '#C0392B',
    icon: <svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx={12} cy={12} r={10}/><line x1={15} y1={9} x2={9} y2={15}/><line x1={9} y1={9} x2={15} y2={15}/></svg>,
  },
  warning: {
    color: '#B7770D', bg: '#fffbf0', border: 'rgba(183,119,13,.3)',
    strip: '#D4860A',
    icon: <svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1={12} y1={9} x2={12} y2={13}/><line x1={12} y1={17} x2={12.01} y2={17}/></svg>,
  },
  info: {
    color: '#2471A3', bg: '#f0f7fd', border: 'rgba(36,113,163,.3)',
    strip: '#2471A3',
    icon: <svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx={12} cy={12} r={10}/><line x1={12} y1={16} x2={12} y2={12}/><line x1={12} y1={8} x2={12.01} y2={8}/></svg>,
  },
}

export function ResponseModal({ open, onClose, variant = 'success', title, message, confirmLabel = 'OK', cancelLabel, onConfirm, loading = false }) {
  useModalLock(open)
  if (!open) return null
  const v = RESPONSE_VARIANTS[variant] || RESPONSE_VARIANTS.info
  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(15,18,30,.58)', zIndex: 400,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px 16px', backdropFilter: 'blur(3px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{
        background: 'var(--white)', borderRadius: 18,
        boxShadow: '0 8px 32px rgba(0,0,0,.14), 0 24px 64px rgba(0,0,0,.18)',
        width: '100%', maxWidth: 460, overflow: 'hidden',
        border: `1px solid ${v.border}`,
        animation: 'modalPop .22s cubic-bezier(.34,1.56,.64,1)',
      }}>
        {/* Top coloured strip — solid, full width */}
        <div style={{ height: 6, background: v.strip }} />

        {/* Icon + content area */}
        <div style={{ padding: '32px 32px 24px', textAlign: 'center' }}>
          {/* Icon circle with solid background tint */}
          <div style={{
            width: 68, height: 68, borderRadius: '50%',
            background: v.bg, border: `2px solid ${v.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px', color: v.color,
          }}>
            {v.icon}
          </div>

          {/* Title */}
          <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10, lineHeight: 1.25 }}>
            {title}
          </div>

          {/* Description — always present, user-friendly explanation */}
          {message && (
            <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: 340, margin: '0 auto' }}>
              {message}
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div style={{
          padding: '0 32px 28px',
          display: 'flex', gap: 12,
          flexDirection: cancelLabel ? 'row' : 'column',
        }}>
          {cancelLabel && (
            <button onClick={onClose} style={{
              flex: 1, padding: '11px 0', borderRadius: 10,
              border: '1.5px solid var(--border)',
              background: 'var(--white)', color: 'var(--text-secondary)',
              fontSize: 14, fontWeight: 600, cursor: 'pointer',
              fontFamily: 'var(--font-body)', transition: 'background .15s',
            }}>{cancelLabel}</button>
          )}
          <button
            onClick={onConfirm || onClose}
            disabled={loading}
            style={{
              flex: cancelLabel ? 1 : undefined,
              width: cancelLabel ? undefined : '100%',
              padding: '11px 32px', borderRadius: 10, border: 'none',
              background: loading ? 'var(--border)' : v.color,
              color: '#fff', fontSize: 14, fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'var(--font-body)', transition: 'opacity .15s',
              letterSpacing: '.02em',
            }}>
            {loading ? 'Processing…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Modal — backwards-compatible alias → routes to InfoModal ──────────────────
// All existing <Modal> usages continue to work unchanged
export function Modal({ open, onClose, title, subtitle, children, width, footer }) {
  return (
    <InfoModal open={open} onClose={onClose} title={title} subtitle={subtitle} footer={footer}>
      {children}
    </InfoModal>
  )
}

// ── StepWizard ────────────────────────────────────────────────────────────────
export function StepWizard({ steps = [], current = 0 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 4, overflowX: 'auto' }}>
      {steps.map((label, i) => {
        const done   = i < current
        const active = i === current
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', flex: i < steps.length - 1 ? 1 : 'none', minWidth: 0 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flexShrink: 0 }}>
              <div style={{ width: 30, height: 30, borderRadius: '50%', background: done ? 'var(--success)' : active ? 'var(--accent)' : 'var(--border)', color: done || active ? '#fff' : 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, transition: 'background .25s' }}>
                {done ? '✓' : i + 1}
              </div>
              <div style={{ fontSize: 11, fontWeight: active ? 600 : 400, color: active ? 'var(--accent)' : done ? 'var(--success)' : 'var(--text-muted)', whiteSpace: 'nowrap' }}>{label}</div>
            </div>
            {i < steps.length - 1 && (
              <div style={{ flex: 1, height: 2, background: done ? 'var(--success)' : 'var(--border)', margin: '0 6px', marginBottom: 18, transition: 'background .25s' }} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── KpiCard ───────────────────────────────────────────────────────────────────
export function KpiCard({ label, value, icon, color = 'var(--accent)', delta, bg }) {
  return (
    <Card style={{ padding: '20px 22px', background: bg }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--text-muted)' }}>{label}</div>
        {icon && (
          <div style={{ width: 36, height: 36, borderRadius: 9, background: bg ? 'rgba(255,255,255,.2)' : 'var(--neutral-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {icon}
          </div>
        )}
      </div>
      <div style={{ fontSize: 26, fontWeight: 800, color: bg ? '#fff' : color, lineHeight: 1 }}>{value}</div>
      {delta != null && (
        <div style={{ fontSize: 12, color: bg ? 'rgba(255,255,255,.75)' : delta >= 0 ? 'var(--success)' : 'var(--danger)', marginTop: 6, fontWeight: 500 }}>
          {delta >= 0 ? '↑' : '↓'} {Math.abs(delta)}% vs last period
        </div>
      )}
    </Card>
  )
}

// ── EmptyState ────────────────────────────────────────────────────────────────
export function EmptyState({ icon = '📭', title, subtitle, action }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', color: 'var(--text-muted)', textAlign: 'center' }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>{icon}</div>
      <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>{title}</div>
      {subtitle && <div style={{ fontSize: 13.5, color: 'var(--text-muted)', marginBottom: 20 }}>{subtitle}</div>}
      {action}
    </div>
  )
}

// ── PageHeader ────────────────────────────────────────────────────────────────
export function PageHeader({ title, subtitle, actions }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 4 }}>
      <div>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', lineHeight: 1.2 }}>{title}</h1>
        {subtitle && <p style={{ margin: '4px 0 0', fontSize: 13.5, color: 'var(--text-muted)' }}>{subtitle}</p>}
      </div>
      {actions && <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0, flexWrap: 'wrap' }}>{actions}</div>}
    </div>
  )
}

// ── SectionDivider ────────────────────────────────────────────────────────────
export function SectionDivider({ label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '4px 0 12px' }}>
      <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '.08em', whiteSpace: 'nowrap' }}>{label}</div>
      <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
    </div>
  )
}
