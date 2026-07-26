// components/ui/index.tsx — Complete reusable UI component library
// Exports: Badge, StatusBadge, Avatar, Card, CardHeader, Button, Input, Select, Textarea,
//          DataTable, InfoModal, ResponseModal, Modal, StepWizard, KpiCard,
//          EmptyState, PageHeader, SectionDivider
import { useState, useEffect } from 'react'
import type { ReactNode, CSSProperties, InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'
import type { BadgeVariant, ButtonVariant, ButtonSize, ModalVariant, Column } from '../../types'

// ── Badge ─────────────────────────────────────────────────────────────────────
const BADGE_STYLES: Record<BadgeVariant, { bg: string; color: string; border: string }> = {
  accent:  { bg: '#4B5EAA', color: '#fff', border: '#3D52A0' },
  success: { bg: '#2E7D52', color: '#fff', border: '#256642' },
  danger:  { bg: '#C0392B', color: '#fff', border: '#A93226' },
  warning: { bg: '#D4860A', color: '#fff', border: '#B7770D' },
  info:    { bg: '#2471A3', color: '#fff', border: '#1A5C87' },
  neutral: { bg: '#5A6474', color: '#fff', border: '#4A5264' },
}

interface BadgeProps { variant?: BadgeVariant; children: ReactNode; style?: CSSProperties }
export function Badge({ variant = 'neutral', children, style }: BadgeProps) {
  const s = BADGE_STYLES[variant] ?? BADGE_STYLES.neutral
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 9px', borderRadius: 20, fontSize: 11.5, fontWeight: 600, letterSpacing: '.02em', background: s.bg, color: s.color, border: `1px solid ${s.border}`, whiteSpace: 'nowrap', ...style }}>
      {children}
    </span>
  )
}

// StatusBadge — auto-maps common status strings to the correct badge color
const STATUS_MAP: Record<string, BadgeVariant> = {
  active: 'success', inactive: 'danger', present: 'success', absent: 'danger',
  late: 'warning', excused: 'info', upcoming: 'warning', ongoing: 'accent',
  completed: 'success', cancelled: 'danger', paid: 'success', unpaid: 'danger',
  partial: 'warning', success: 'success', failed: 'danger', pending: 'warning',
  approved: 'success', rejected: 'danger',
}
export function StatusBadge({ status }: { status: string }) {
  const variant = STATUS_MAP[String(status).toLowerCase()] ?? 'neutral'
  return <Badge variant={variant}>{String(status).charAt(0).toUpperCase() + String(status).slice(1)}</Badge>
}

// ── Avatar ────────────────────────────────────────────────────────────────────
const AVATAR_COLORS = ['#4B5EAA','#2E7D52','#C0392B','#D4860A','#2471A3','#7D3C98','#117A65']
interface AvatarProps { name?: string; size?: number; src?: string; style?: CSSProperties }
export function Avatar({ name = '?', size = 36, src, style }: AvatarProps) {
  const initials = name.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase()
  const color = AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length]
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: src ? 'transparent' : color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * .37, fontWeight: 700, color: '#fff', flexShrink: 0, overflow: 'hidden', ...style }}>
      {src ? <img src={src} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initials}
    </div>
  )
}

// ── Card ──────────────────────────────────────────────────────────────────────
interface CardProps { children: ReactNode; style?: CSSProperties; onClick?: () => void; onMouseEnter?: ((e: React.MouseEvent<HTMLElement>) => void) | (() => void); onMouseLeave?: ((e: React.MouseEvent<HTMLElement>) => void) | (() => void) }
export function Card({ children, style, onClick, onMouseEnter, onMouseLeave }: CardProps) {
  return (
    <div onClick={onClick} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} style={{ background: 'var(--white)', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--border-card)', boxShadow: 'var(--shadow-sm)', ...style }}>
      {children}
    </div>
  )
}

// CardHeader — standardized top of a card with title, optional subtitle, and actions slot
interface CardHeaderProps { title: string; subtitle?: string; actions?: ReactNode }
export function CardHeader({ title, subtitle, actions }: CardHeaderProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid var(--border-inner)', gap: 12, flexWrap: 'wrap' }}>
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{title}</div>
        {subtitle && <div style={{ fontSize: 12.5, color: 'var(--text-muted)', marginTop: 2 }}>{subtitle}</div>}
      </div>
      {actions && <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>{actions}</div>}
    </div>
  )
}

// ── Button ────────────────────────────────────────────────────────────────────
const BTN_VARIANTS: Record<ButtonVariant, { bg: string; color: string; border: string; hover: string }> = {
  primary:   { bg: 'var(--accent)',  color: '#fff',          border: 'var(--accent)',  hover: '#3a4d99' },
  secondary: { bg: '#5A6474',        color: '#fff',          border: '#4A5264',        hover: '#4A5264' },
  danger:    { bg: 'var(--danger)',  color: '#fff',          border: 'var(--danger)',  hover: '#a93226' },
  success:   { bg: 'var(--success)', color: '#fff',          border: 'var(--success)', hover: '#256640' },
  ghost:     { bg: 'transparent',    color: 'var(--accent)', border: 'transparent',    hover: 'var(--accent-light)' },
}
interface ButtonProps {
  children?:  ReactNode
  variant?:   ButtonVariant
  size?:      ButtonSize
  icon?:      ReactNode
  disabled?:  boolean
  onClick?:   () => void
  style?:     CSSProperties
  type?:      'button' | 'submit' | 'reset'
}
export function Button({ children, variant = 'primary', size = 'md', icon, disabled, onClick, style, type = 'button' }: ButtonProps) {
  const [hovered, setHovered] = useState(false)
  const v   = BTN_VARIANTS[variant] ?? BTN_VARIANTS.primary
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
        transition: 'background .18s ease, transform .18s ease, box-shadow .18s ease',
        transform: !disabled && hovered ? 'translateY(-2px)' : 'none',
        boxShadow: !disabled && hovered ? '0 0 0 1.5px rgba(0,0,0,.70), 0 4px 12px rgba(0,0,0,.14)' : 'none',
        whiteSpace: 'nowrap', lineHeight: 1.4, ...style,
      }}>
      {icon && icon}
      {children}
    </button>
  )
}

// ── Input ─────────────────────────────────────────────────────────────────────
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?:    string
  hint?:     string
  error?:    string
  required?: boolean
  style?:    CSSProperties
}
export function Input({ label, hint, error, required, style, ...props }: InputProps) {
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
          padding: '8px 12px', borderRadius: 8, border: `1px solid ${error ? 'var(--danger)' : 'var(--border-card)'}`,
          fontSize: 13.5, fontFamily: 'var(--font-body)', color: 'var(--text-primary)',
          background: props.disabled ? 'var(--neutral-light)' : 'var(--white)',
          outline: 'none', transition: 'border-color .15s', width: '100%', boxSizing: 'border-box',
        }}
        onFocus={e => { if (!error) e.target.style.borderColor = 'var(--accent)' }}
        onBlur={e  => { if (!error) e.target.style.borderColor = 'var(--border-card)' }}
      />
      {hint  && !error && <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{hint}</div>}
      {error && <div style={{ fontSize: 11.5, color: 'var(--danger)' }}>{error}</div>}
    </div>
  )
}

// ── Select ────────────────────────────────────────────────────────────────────
interface SelectOption { value: string; label: string }
interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?:       string
  hint?:        string
  error?:       string
  required?:    boolean
  options?:     SelectOption[]
  placeholder?: string
  style?:       CSSProperties
}
export function Select({ label, hint, error, required, options = [], placeholder, style, ...props }: SelectProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, ...style }}>
      {label && (
        <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }}>
          {label}{required && <span style={{ color: 'var(--danger)', marginLeft: 2 }}>*</span>}
        </label>
      )}
      <select
        {...props}
        style={{
          padding: '8px 12px', borderRadius: 8,
          border: `1px solid ${error ? 'var(--danger)' : 'var(--border-card)'}`,
          fontSize: 13.5, fontFamily: 'var(--font-body)',
          color: props.value ? 'var(--text-primary)' : 'var(--text-muted)',
          background: error ? '#fff8f8' : props.disabled ? 'var(--neutral-light)' : 'var(--white)',
          outline: 'none', cursor: props.disabled ? 'not-allowed' : 'pointer',
          width: '100%', boxSizing: 'border-box',
        }}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      {hint  && !error && <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{hint}</div>}
      {error && <div style={{ fontSize: 11.5, color: 'var(--danger)' }}>{error}</div>}
    </div>
  )
}

// ── Textarea ──────────────────────────────────────────────────────────────────
interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  hint?:  string
  rows?:  number
  style?: CSSProperties
}
export function Textarea({ label, hint, rows = 3, style, ...props }: TextareaProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, ...style }}>
      {label && <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }}>{label}</label>}
      <textarea {...props} rows={rows}
        style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border-card)', fontSize: 13.5, fontFamily: 'var(--font-body)', color: 'var(--text-primary)', background: 'var(--white)', outline: 'none', resize: 'vertical', lineHeight: 1.5, width: '100%', boxSizing: 'border-box' }}
        onFocus={e => { e.target.style.borderColor = 'var(--accent)' }}
        onBlur={e  => { e.target.style.borderColor = 'var(--border-card)' }}
      />
      {hint && <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{hint}</div>}
    </div>
  )
}

// ── DataTable ─────────────────────────────────────────────────────────────────
const PAGE_SIZES = [10, 25, 50, 100]

interface DataTableProps<T extends { id?: string | number }> {
  columns:   Column<T>[]
  data:      T[]
  title?:    string
  subtitle?: string
  emptyMsg?: string
}
export function DataTable<T extends { id?: string | number }>({ columns = [], data = [], title, subtitle, emptyMsg = 'No records found.' }: DataTableProps<T>) {
  const [search,   setSearch  ] = useState('')
  const [page,     setPage    ] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // Simple text search across all string values in each row
  const filtered = data.filter(row =>
    Object.values(row as Record<string, unknown>).some(v => String(v).toLowerCase().includes(search.toLowerCase()))
  )
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const paginated  = filtered.slice((page - 1) * pageSize, page * pageSize)

  // Reset to page 1 on search change
  useEffect(() => setPage(1), [search])

  function getValue(row: T, col: Column<T>): ReactNode {
    if (col.render) return col.render(row, (page - 1) * pageSize + paginated.indexOf(row))
    if (col.accessor) return (row[col.accessor] as ReactNode) ?? '—'
    return '—'
  }

  return (
    <Card>
      {/* Header: title + page-size selector + search */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid var(--border-inner)', flexWrap: 'wrap', gap: 12 }}>
        <div>
          {title    && <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{title}</div>}
          {subtitle && <div style={{ fontSize: 12.5, color: 'var(--text-muted)', marginTop: 2 }}>{subtitle}</div>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <select value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); setPage(1) }}
            style={{ padding: '6px 10px', borderRadius: 7, border: '1px solid var(--border-card)', fontSize: 13, fontFamily: 'var(--font-body)', background: 'var(--white)', color: 'var(--text-primary)', cursor: 'pointer' }}>
            {PAGE_SIZES.map(n => <option key={n} value={n}>{n} / page</option>)}
          </select>
          <div style={{ position: 'relative' }}>
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth={2} strokeLinecap="round" style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' } as CSSProperties}>
              <circle cx={11} cy={11} r={8} /><line x1={21} y1={21} x2={16.65} y2={16.65} />
            </svg>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search…"
              style={{ padding: '6px 10px 6px 28px', borderRadius: 7, border: '1px solid var(--border-card)', fontSize: 13, fontFamily: 'var(--font-body)', color: 'var(--text-primary)', background: 'var(--white)', outline: 'none', width: 180 }} />
          </div>
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5 }}>
          <thead>
            <tr style={{ background: 'var(--table-head-bg)' }}>
              {columns.map(col => (
                <th key={col.key} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11.5, fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--table-head-fg)', borderBottom: '2px solid var(--border-table)', whiteSpace: 'nowrap' }}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0
              ? <tr><td colSpan={columns.length} style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13.5 }}>{emptyMsg}</td></tr>
              : paginated.map((row, i) => (
                  <tr key={row.id ?? i} style={{ borderBottom: '1px solid var(--border-inner)' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLTableRowElement).style.background = 'var(--neutral-light)' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLTableRowElement).style.background = 'transparent' }}>
                    {columns.map(col => (
                      <td key={col.key} style={{ padding: '12px 16px', verticalAlign: 'middle', color: 'var(--text-primary)' }}>
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', borderTop: '1px solid var(--border-inner)', flexWrap: 'wrap', gap: 10 }}>
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

interface PagBtnProps { label: string; onClick: () => void; disabled?: boolean; active?: boolean }
function PagBtn({ label, onClick, disabled, active }: PagBtnProps) {
  return (
    <button onClick={onClick} disabled={disabled} style={{ minWidth: 32, height: 32, padding: '0 8px', borderRadius: 6, border: '1px solid var(--border-card)', background: active ? 'var(--accent)' : disabled ? 'var(--neutral-light)' : 'var(--white)', color: active ? '#fff' : disabled ? 'var(--text-muted)' : 'var(--text-primary)', fontSize: 13, fontFamily: 'var(--font-body)', cursor: disabled ? 'not-allowed' : 'pointer' }}>
      {label}
    </button>
  )
}

// CloseButton — solid dark button with white X, always visible against any content color
function CloseButton({ onClose }: { onClose: () => void }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onClick={onClose}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: 32, height: 32, borderRadius: 8, border: 'none',
        background: hov ? '#111827' : '#374151',
        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#ffffff',
        transition: 'background .18s ease, transform .18s ease, box-shadow .18s ease',
        transform: hov ? 'translateY(-1px)' : 'none',
        boxShadow: hov ? '0 0 0 1.5px rgba(0,0,0,.70), 0 4px 12px rgba(0,0,0,.14)' : 'none',
        flexShrink: 0,
      }}>
      <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
        <line x1={18} y1={6} x2={6} y2={18}/><line x1={6} y1={6} x2={18} y2={18}/>
      </svg>
    </button>
  )
}

// ── InfoModal — large detail/form modal (max 920px wide, up to 92vh tall) ─────
// Instant open/close — no closing animation, no resize flash, no timer complexity.
interface InfoModalProps {
  open:          boolean
  onClose:       () => void
  title?:        string
  subtitle?:     string
  accentColor?:  string
  editMode?:     boolean
  children?:     ReactNode
  footer?:       ReactNode
}
export function InfoModal({ open, onClose, title, subtitle, accentColor = 'var(--accent)', editMode = false, children, footer }: InfoModalProps) {
  const EDIT_COLOR = '#7C3AED'

  // Lock body scroll while open; release immediately on close
  useEffect(() => {
    if (!open) return
    const sbw = window.innerWidth - document.documentElement.clientWidth
    document.body.style.overflow     = 'hidden'
    document.body.style.paddingRight = sbw + 'px'
    return () => {
      document.body.style.overflow     = ''
      document.body.style.paddingRight = ''
    }
  }, [open])

  if (!open) return null

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 300,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px 16px', backdropFilter: 'blur(3px)',
        background: 'rgba(15,18,30,.55)',
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{
        background: 'var(--white)', borderRadius: 16,
        boxShadow: '0 12px 48px rgba(0,0,0,.22), 0 36px 96px rgba(0,0,0,.20)',
        width: '100%', maxWidth: 920, maxHeight: '92vh',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '22px 32px 18px', borderBottom: '1.5px solid var(--border-inner)', flexShrink: 0, gap: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.25 }}>{title}</div>
              {editMode && (
                <span style={{ padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: '#EDE9FE', color: EDIT_COLOR, border: `1px solid ${EDIT_COLOR}40`, whiteSpace: 'nowrap' }}>
                  Editing
                </span>
              )}
            </div>
            {subtitle && <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>{subtitle}</div>}
          </div>
          <CloseButton onClose={onClose} />
        </div>
        {/* Scrollable body */}
        <div style={{ padding: '26px 32px', overflowY: 'auto', flex: 1, minHeight: 0 }}>{children}</div>
        {/* Optional footer */}
        {footer && (
          <div style={{ padding: '18px 32px', borderTop: '1.5px solid var(--border-inner)', flexShrink: 0, display: 'flex', justifyContent: 'flex-end', gap: 10, background: 'var(--white)' }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

// ── ResponseModal — compact feedback/confirmation modal (max 460px) ────────────
// variant: success=green  danger=red  warning=amber  info=blue
// Always include a descriptive message so the user understands what happened
interface ResponseVariantConfig { color: string; bg: string; border: string; strip: string; icon: ReactNode }
const RESPONSE_VARIANTS: Record<ModalVariant, ResponseVariantConfig> = {
  success: {
    color: '#2E7D52', bg: '#f0faf4', border: 'rgba(46,125,82,.3)', strip: '#2E7D52',
    icon: <svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx={12} cy={12} r={10}/><polyline points="9 12 11 14 15 10"/></svg>,
  },
  danger: {
    color: '#C0392B', bg: '#fdf3f2', border: 'rgba(192,57,43,.3)', strip: '#C0392B',
    icon: <svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx={12} cy={12} r={10}/><line x1={15} y1={9} x2={9} y2={15}/><line x1={9} y1={9} x2={15} y2={15}/></svg>,
  },
  warning: {
    color: '#B7770D', bg: '#fffbf0', border: 'rgba(183,119,13,.3)', strip: '#D4860A',
    icon: <svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1={12} y1={9} x2={12} y2={13}/><line x1={12} y1={17} x2={12.01} y2={17}/></svg>,
  },
  info: {
    color: '#2471A3', bg: '#f0f7fd', border: 'rgba(36,113,163,.3)', strip: '#2471A3',
    icon: <svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx={12} cy={12} r={10}/><line x1={12} y1={16} x2={12} y2={12}/><line x1={12} y1={8} x2={12.01} y2={8}/></svg>,
  },
}

interface ResponseModalProps {
  open:           boolean
  onClose:        () => void
  variant?:       ModalVariant
  title:          string
  message?:       string
  confirmLabel?:  string
  cancelLabel?:   string
  onConfirm?:     () => void
  loading?:       boolean
}

export function ResponseModal({ open, onClose, variant = 'success', title, message, confirmLabel = 'OK', cancelLabel, onConfirm, loading = false }: ResponseModalProps) {
  // Lock body scroll while open; release immediately on close
  useEffect(() => {
    if (!open) return
    const sbw = window.innerWidth - document.documentElement.clientWidth
    document.body.style.overflow     = 'hidden'
    document.body.style.paddingRight = sbw + 'px'
    return () => {
      document.body.style.overflow     = ''
      document.body.style.paddingRight = ''
    }
  }, [open])

  if (!open) return null

  const v  = RESPONSE_VARIANTS[variant] ?? RESPONSE_VARIANTS.info
  const btnVariant: ButtonVariant = variant === 'danger' ? 'danger' : variant === 'success' ? 'success' : 'primary'

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 400,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px 16px', backdropFilter: 'blur(3px)',
        background: 'rgba(15,18,30,.58)',
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{
        background: 'var(--white)', borderRadius: 18,
        boxShadow: '0 12px 48px rgba(0,0,0,.22), 0 36px 96px rgba(0,0,0,.20)',
        width: '100%', maxWidth: 460, overflow: 'hidden',
      }}>
        <div style={{ padding: '32px 32px 24px', textAlign: 'center' }}>
          <div style={{ width: 68, height: 68, borderRadius: '50%', background: v.bg, border: `2px solid ${v.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: v.color }}>
            {v.icon}
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10, lineHeight: 1.25 }}>{title}</div>
          {message && <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: 340, margin: '0 auto' }}>{message}</div>}
        </div>
        <div style={{ padding: '0 32px 28px', display: 'flex', gap: 12, flexDirection: cancelLabel ? 'row' : 'column' }}>
          {cancelLabel && (
            <Button variant="secondary" style={{ flex: 1, justifyContent: 'center', padding: '11px 0', borderRadius: 10 }} onClick={onClose}>{cancelLabel}</Button>
          )}
          <Button
            variant={btnVariant}
            disabled={loading}
            style={{ flex: cancelLabel ? 1 : undefined, width: cancelLabel ? undefined : '100%', justifyContent: 'center', padding: '11px 32px', borderRadius: 10 }}
            onClick={onConfirm ?? onClose}>
            {loading ? 'Processing…' : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}

// ── Modal — backwards-compatible alias that routes to InfoModal ────────────────
interface LegacyModalProps { open: boolean; onClose: () => void; title?: string; subtitle?: string; children?: ReactNode; width?: number; footer?: ReactNode }
export function Modal({ open, onClose, title, subtitle, children, footer }: LegacyModalProps) {
  return <InfoModal open={open} onClose={onClose} title={title} subtitle={subtitle} footer={footer}>{children}</InfoModal>
}

// ── StepWizard ────────────────────────────────────────────────────────────────
interface StepWizardProps { steps?: string[]; current?: number }
export function StepWizard({ steps = [], current = 0 }: StepWizardProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 4, overflowX: 'auto' }}>
      {steps.map((label, i) => {
        const done = i < current; const active = i === current
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', flex: i < steps.length - 1 ? 1 : 'none', minWidth: 0 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flexShrink: 0 }}>
              <div style={{ width: 30, height: 30, borderRadius: '50%', background: done ? 'var(--success)' : active ? 'var(--accent)' : 'var(--border)', color: done || active ? '#fff' : 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, transition: 'background .25s' }}>
                {done ? '✓' : i + 1}
              </div>
              <div style={{ fontSize: 11, fontWeight: active ? 600 : 400, color: active ? 'var(--accent)' : done ? 'var(--success)' : 'var(--text-muted)', whiteSpace: 'nowrap' }}>{label}</div>
            </div>
            {i < steps.length - 1 && <div style={{ flex: 1, height: 2, background: done ? 'var(--success)' : 'var(--border)', margin: '0 6px', marginBottom: 18, transition: 'background .25s' }} />}
          </div>
        )
      })}
    </div>
  )
}

// ── KpiCard ───────────────────────────────────────────────────────────────────
interface KpiCardProps { label: string; value: ReactNode; icon?: ReactNode; color?: string; delta?: number; bg?: string; onClick?: () => void }
export function KpiCard({ label, value, icon, color = 'var(--accent)', delta, bg, onClick }: KpiCardProps) {
  const [hov, setHov] = useState(false)
  return (
    <Card
      onClick={onClick}
      style={{ padding: '20px 22px', background: '#FFFFFF', borderLeft: `3px solid ${color}`, cursor: onClick ? 'pointer' : 'default', transform: hov ? 'translateY(-3px)' : 'none', boxShadow: hov ? '0 8px 20px rgba(75,94,170,.18)' : undefined, transition: 'transform .18s ease, box-shadow .18s ease' }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--text-muted)' }}>{label}</div>
        {icon && <div style={{ width: 36, height: 36, borderRadius: 9, background: bg ? 'rgba(255,255,255,.2)' : 'var(--neutral-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{icon}</div>}
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
interface EmptyStateProps { icon?: string; title?: string; subtitle?: string; action?: ReactNode }
export function EmptyState({ icon = '📭', title, subtitle, action }: EmptyStateProps) {
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
interface PageHeaderProps { title: string; subtitle?: string; actions?: ReactNode }
export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
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

// ── FilterSelect ──────────────────────────────────────────────────────────────
// Shared filter dropdown — single source of truth used by all data table pages.
// White bg, accent border + lift + ring-shadow on hover, custom dark chevron SVG.
interface FilterSelectOption { value: string; label: string }
interface FilterSelectProps { value: string; onChange: (v: string) => void; options: (FilterSelectOption | string)[] }
export function FilterSelect({ value, onChange, options }: FilterSelectProps) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{
        padding: '7px 28px 7px 10px', borderRadius: 7, fontSize: 13, fontFamily: 'var(--font-body)',
        border: '1.5px solid var(--border-card)', backgroundColor: '#fff', color: 'var(--text-primary)',
        cursor: 'pointer' as const, outline: 'none',
        transition: 'border-color .18s ease, transform .18s ease, box-shadow .18s ease',
        appearance: 'none', WebkitAppearance: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%231E2128' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat', backgroundPosition: 'right 9px center', backgroundSize: '10px',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 0 0 1.5px rgba(0,0,0,.70), 0 4px 12px rgba(0,0,0,.14)'; e.currentTarget.style.borderColor = 'var(--accent)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; e.currentTarget.style.borderColor = 'var(--border-card)' }}>
      {options.map(o => {
        const val = typeof o === 'string' ? o : o.value
        const lbl = typeof o === 'string' ? o : o.label
        return <option key={val} value={val}>{lbl}</option>
      })}
    </select>
  )
}

// ── SectionDivider ────────────────────────────────────────────────────────────
export function SectionDivider({ label }: { label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '4px 0 12px' }}>
      <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '.08em', whiteSpace: 'nowrap' }}>{label}</div>
      <div style={{ flex: 1, height: 1, background: 'var(--border-inner)' }} />
    </div>
  )
}
