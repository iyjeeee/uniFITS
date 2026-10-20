// sidebar/sidebarStyles.ts — Inline style objects/functions for the sidebar (shell, brand, nav items, sub-items, pips, badges, collapse button)
import type { CSSProperties } from 'react'

export const sidebarStyle = (open: boolean, collapsed: boolean, isMobile: boolean): CSSProperties => ({
  width: isMobile ? 'var(--sidebar-w)' : collapsed ? 'var(--sidebar-mini)' : 'var(--sidebar-w)',
  background: 'var(--primary)', display: 'flex', flexDirection: 'column',
  position: 'fixed', top: 0, left: 0, bottom: 0,
  zIndex: 100, overflow: 'hidden', flexShrink: 0,
  transition: isMobile ? 'transform .25s cubic-bezier(.4,0,.2,1)' : 'width .25s cubic-bezier(.4,0,.2,1)',
  transform: isMobile ? (open ? 'translateX(0)' : 'translateX(-100%)') : 'none',
})

export const brandBar:  CSSProperties = { height: 62, display: 'flex', alignItems: 'center', padding: '0 14px', gap: 10, flexShrink: 0, borderBottom: '1px solid rgba(255,255,255,.08)', overflow: 'hidden', whiteSpace: 'nowrap' }
export const brandMark: CSSProperties = { width: 36, height: 36, borderRadius: 9, flexShrink: 0, background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, color: '#fff', letterSpacing: '-.5px' }
export const wordmark:  CSSProperties = { fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--text-on-dark)', letterSpacing: '-.3px', lineHeight: 1 }
export const navArea: CSSProperties = { flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '8px 8px', scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,.1) transparent' }
export const sectionLabel: CSSProperties = { fontSize: 10, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: 'rgba(249,250,251,.3)', padding: '14px 10px 4px', whiteSpace: 'nowrap', userSelect: 'none' }

export const navItemStyle = (active: boolean, hovered: boolean): CSSProperties => ({
  display: 'flex', alignItems: 'center', gap: 10,
  padding: '9px 10px 9px 13px', borderRadius: 8, cursor: 'pointer',
  color: active ? '#fff' : hovered ? 'rgba(249,250,251,.92)' : 'rgba(249,250,251,.65)',
  fontSize: 13.5, fontWeight: active ? 600 : hovered ? 500 : 400,
  background: active ? 'var(--accent)' : hovered ? 'linear-gradient(90deg, rgba(75,94,170,.28) 0%, rgba(75,94,170,.10) 100%)' : 'transparent',
  whiteSpace: 'nowrap',
  transition: 'background .18s ease, color .15s ease, transform .18s cubic-bezier(.34,1.56,.64,1), box-shadow .18s ease',
  transform: hovered && !active ? 'translateX(3px)' : 'none',
  boxShadow: hovered && !active ? 'inset 0 0 0 1px rgba(75,94,170,.35), 0 2px 8px rgba(75,94,170,.15)' : 'none',
  position: 'relative', userSelect: 'none', marginBottom: 2, overflow: 'hidden',
})

export const activePip: CSSProperties = { position: 'absolute', left: 0, top: '18%', bottom: '18%', width: 3, borderRadius: '0 3px 3px 0', background: 'rgba(255,255,255,.85)', flexShrink: 0 }
export const hoverPip: CSSProperties = { position: 'absolute', left: 0, top: '22%', bottom: '22%', width: 3, borderRadius: '0 3px 3px 0', background: 'rgba(75,94,170,.7)', flexShrink: 0, transition: 'opacity .15s' }

export const badgeStyle:  CSSProperties = { background: 'var(--accent)', color: '#fff', fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 20, lineHeight: 1.5 }
export const badgeActive: CSSProperties = { background: 'rgba(255,255,255,.25)', color: '#fff', fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 20, lineHeight: 1.5 }

export const subItemStyle = (active: boolean, hovered: boolean): CSSProperties => ({
  display: 'flex', alignItems: 'center', gap: 10,
  padding: '7px 10px 7px 38px', borderRadius: 8, cursor: 'pointer',
  color: active ? '#fff' : hovered ? 'rgba(249,250,251,.85)' : 'rgba(249,250,251,.5)',
  fontSize: 13, marginBottom: 1, userSelect: 'none',
  background: active ? 'rgba(75,94,170,.45)' : hovered ? 'rgba(255,255,255,.09)' : 'transparent',
  transition: 'background .15s ease, color .15s ease, transform .15s ease',
  transform: hovered && !active ? 'translateX(3px)' : 'none',
  fontWeight: active ? 500 : 400,
})

export const footerBar:   CSSProperties = { padding: '10px 8px', borderTop: '1px solid rgba(255,255,255,.08)', flexShrink: 0 }
export const collapseBtn: CSSProperties = { width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px', borderRadius: 8, cursor: 'pointer', background: 'transparent', border: 'none', fontFamily: 'var(--font-body)', transition: 'background .15s ease, transform .18s cubic-bezier(.34,1.56,.64,1), box-shadow .18s ease' }
