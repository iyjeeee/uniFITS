// TableUtils.jsx — Shared table UI primitives used by Employees, Projects, Events, Funds
// Eliminates code duplication: IconBtn, PaginationRow, SearchInput, DeleteWarning are defined once here

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

// ── PaginationRow — Prev/Next arrows + windowed page numbers ─────────────────
// Shows "Page X of Y · N records" left; Prev, windowed pages, Next right.
// Window: always shows first, last, current ±1, with "…" gaps between.
export function PaginationRow({ page, totalPages, onPageChange, total }) {
  // Build the visible page number window: first, …, cur-1, cur, cur+1, …, last
  function getPageWindow(cur, total) {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
    const pages = new Set([1, total, cur])
    if (cur - 1 > 1)     pages.add(cur - 1)
    if (cur + 1 < total) pages.add(cur + 1)
    const sorted = [...pages].sort((a, b) => a - b)
    // Insert null gaps where page numbers skip by more than 1
    const result = []
    for (let i = 0; i < sorted.length; i++) {
      if (i > 0 && sorted[i] - sorted[i - 1] > 1) result.push(null) // null = "…"
      result.push(sorted[i])
    }
    return result
  }

  const pageWindow = getPageWindow(page, totalPages)
  const btnBase = { height: 30, minWidth: 30, borderRadius: 6, border: '1.5px solid var(--border-card)', cursor: 'pointer', fontSize: 12, fontWeight: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 6px', transition: 'transform .15s ease, box-shadow .15s ease' }
  const activeBtn = { ...btnBase, background: 'var(--accent)', color: '#fff', fontWeight: 700, borderColor: 'var(--accent)' }
  const inactiveBtn = { ...btnBase, background: '#fff', color: 'var(--text-primary)' }
  const disabledBtn = { ...btnBase, background: 'var(--neutral-light)', color: 'var(--text-muted)', cursor: 'not-allowed', opacity: .5 }

  function NavBtn({ label, disabled, onClick }) {
    return (
      <button
        onClick={onClick} disabled={disabled}
        style={disabled ? disabledBtn : inactiveBtn}
        onMouseEnter={e => { if (!disabled) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,.12)' } }}
        onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}>
        {label}
      </button>
    )
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 20px', borderTop: '1px solid var(--border-inner)', flexWrap: 'wrap', gap: 8 }}>
      {/* Left: record count */}
      <span style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>
        Page {page} of {totalPages} · {total} record{total !== 1 ? 's' : ''}
      </span>
      {/* Right: Prev + windowed page numbers + Next */}
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', alignItems: 'center' }}>
        <NavBtn label="← Prev" disabled={page <= 1} onClick={() => onPageChange(page - 1)} />
        {pageWindow.map((p, i) =>
          p === null
            ? <span key={`gap-${i}`} style={{ fontSize: 12, color: 'var(--text-muted)', padding: '0 2px' }}>…</span>
            : <button
                key={p}
                onClick={() => onPageChange(p)}
                style={p === page ? activeBtn : inactiveBtn}
                onMouseEnter={e => { if (p !== page) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,.12)' } }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}>
                {p}
              </button>
        )}
        <NavBtn label="Next →" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)} />
      </div>
    </div>
  )
}

// ── SearchInput — standard search bar used across all data table pages ────────
// Single source of truth: consistent icon, border, focus style, sizing.
export function SearchInput({ value, onChange, placeholder = 'Search…' }) {
  return (
    <div style={{ position: 'relative', flexShrink: 0 }}>
      {/* Search icon */}
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round"
        style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
      <input
        type="text" value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ padding: '7px 10px 7px 28px', borderRadius: 7, border: '1.5px solid var(--border-card)', fontSize: 13, fontFamily: 'var(--font-body)', color: 'var(--text-primary)', backgroundColor: '#fff', outline: 'none', width: 180, transition: 'border-color .15s ease' }}
        onFocus={e => { e.target.style.borderColor = 'var(--accent)' }}
        onBlur={e  => { e.target.style.borderColor = 'var(--border-card)' }}
      />
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
export function DeleteBodyRows({ label: sectionLabel, rows }) {
  return (
    <div>
      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 10 }}>
        {sectionLabel || 'Summary'}
      </div>
      {rows.map(([k, v], idx) => (
        <div key={k} style={{ display: 'flex', gap: 16, padding: '10px 14px', borderBottom: '1px solid var(--border-inner)', background: idx % 2 === 0 ? 'var(--neutral-light)' : '#fff' }}>
          <div style={{ width: 140, fontSize: 12.5, color: 'var(--text-muted)', flexShrink: 0, fontWeight: 500 }}>{k}</div>
          <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)' }}>{v}</div>
        </div>
      ))}
    </div>
  )
}

// ── SearchBar / FilterSelect — legacy aliases kept for backwards compat ────────
// New code should use SearchInput from this file and FilterSelect from components/ui
export function SearchBar({ value, onChange, placeholder = 'Search…' }) {
  return <SearchInput value={value} onChange={onChange} placeholder={placeholder} />
}
export function FilterSelect({ value, onChange, options = [], placeholder = 'All' }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)}
      style={{ padding: '7px 10px', borderRadius: 8, border: '1.5px solid var(--border-card)', fontSize: 13, fontFamily: 'var(--font-body)', color: 'var(--text-primary)', background: 'var(--white)', outline: 'none', cursor: 'pointer', flexShrink: 0 }}
      onFocus={e => { e.target.style.borderColor = 'var(--accent)' }}
      onBlur={e  => { e.target.style.borderColor = 'var(--border-card)' }}>
      <option value="">{placeholder}</option>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  )
}
