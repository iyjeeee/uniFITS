// TableUtils.jsx — Shared table UI primitives used by Employees, Projects, Events, Funds
// Eliminates code duplication: IconBtn, PaginationRow, DeleteWarning are defined once here

import { useState } from 'react'

// ── IconBtn — solid-color square icon button (32×32) ─────────────────────────
// Used in table action columns; stopPropagation prevents row-click conflicts
export function IconBtn({ children, solidBg, title, onClick }) {
  return (
    <button
      onClick={e => { e.stopPropagation(); onClick() }}
      title={title}
      style={{
        width: 32, height: 32, borderRadius: 7, border: 'none',
        background: solidBg, color: '#fff', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        /* box-shadow ring = smoothly animatable border (outline is NOT animatable) */
        transition: 'transform .18s ease, box-shadow .18s ease',
        flexShrink: 0,
      }}
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

// ── PaginationRow — always-visible page number buttons ────────────────────────
// Shows "Page X of Y · N records" on the left, numbered buttons on the right
export function PaginationRow({ page, totalPages, onPageChange, total }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '10px 20px', borderTop: '1px solid var(--border-inner)',
      flexWrap: 'wrap', gap: 8,
    }}>
      <span style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>
        Page {page} of {totalPages} · {total} records
      </span>
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            style={{
              width: 30, height: 30, borderRadius: 6,
              border: '1.5px solid var(--border-card)',
              background: p === page ? 'var(--accent)' : '#fff',
              color:      p === page ? '#fff'          : 'var(--text-primary)',
              cursor: 'pointer', fontSize: 12, fontWeight: p === page ? 700 : 400,
            }}>
            {p}
          </button>
        ))}
      </div>
    </div>
  )
}

// ── DeleteWarningBanner — red alert stripe shown inside all delete confirmations
export function DeleteWarningBanner({ typeName }) {
  return (
    <div style={{
      padding: '14px 16px', borderRadius: 10,
      background: '#fdecea', border: '1.5px solid rgba(192,57,43,.30)',
      display: 'flex', gap: 10, alignItems: 'flex-start',
    }}>
      {/* Warning triangle icon */}
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="var(--danger)" strokeWidth="2.5" strokeLinecap="round"
        style={{ flexShrink: 0, marginTop: 1 }}>
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
        <line x1="12" y1="9"  x2="12"   y2="13"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
      <div>
        <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--danger)' }}>
          Warning: This action cannot be undone
        </div>
        <div style={{ fontSize: 12.5, color: 'var(--danger)', marginTop: 3, lineHeight: 1.5 }}>
          Deleting this {typeName} will permanently remove all associated records from the system.
        </div>
      </div>
    </div>
  )
}

// ── DeleteBodyRows — key/value summary grid inside delete confirmation modal ──
// rows: array of [label, value] pairs
export function DeleteBodyRows({ label: sectionLabel, rows }) {
  return (
    <div>
      <div style={{
        fontSize: 12, fontWeight: 700, color: 'var(--text-muted)',
        textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 10,
      }}>
        {sectionLabel || 'Summary'}
      </div>
      {rows.map(([k, v], idx) => (
        <div key={k} style={{
          display: 'flex', gap: 16, padding: '10px 14px',
          borderBottom: '1px solid var(--border-inner)',
          background: idx % 2 === 0 ? 'var(--neutral-light)' : '#fff',
        }}>
          <div style={{ width: 140, fontSize: 12.5, color: 'var(--text-muted)', flexShrink: 0, fontWeight: 500 }}>{k}</div>
          <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)' }}>{v}</div>
        </div>
      ))}
    </div>
  )
}

// ── SearchBar — standard single-line search input used across manage pages ────
export function SearchBar({ value, onChange, placeholder = 'Search…' }) {
  return (
    <div style={{ position: 'relative', flexShrink: 0 }}>
      {/* Search icon */}
      <svg
        width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round"
        style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          paddingLeft: 32, paddingRight: 12, paddingTop: 7, paddingBottom: 7,
          borderRadius: 8, border: '1.5px solid var(--border-card)',
          fontSize: 13, fontFamily: 'var(--font-body)', color: 'var(--text-primary)',
          background: 'var(--white)', outline: 'none', width: 220, boxSizing: 'border-box',
          transition: 'border-color .15s',
        }}
        onFocus={e => { e.target.style.borderColor = 'var(--accent)' }}
        onBlur={e  => { e.target.style.borderColor = 'var(--border-card)' }}
      />
    </div>
  )
}

// ── FilterSelect — compact status/type filter dropdown ───────────────────────
export function FilterSelect({ value, onChange, options = [], placeholder = 'All' }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{
        padding: '7px 10px', borderRadius: 8,
        border: '1.5px solid var(--border-card)',
        fontSize: 13, fontFamily: 'var(--font-body)',
        color: 'var(--text-primary)', background: 'var(--white)',
        outline: 'none', cursor: 'pointer', flexShrink: 0,
      }}
      onFocus={e => { e.target.style.borderColor = 'var(--accent)' }}
      onBlur={e  => { e.target.style.borderColor = 'var(--border-card)' }}>
      <option value="">{placeholder}</option>
      {options.map(o => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  )
}
