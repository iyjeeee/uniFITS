// header/headerStyles.ts — Shared inline styles for the header icon buttons and dropdown menus
import type { CSSProperties } from 'react'

export const iconBtn: CSSProperties = { width: 36, height: 36, borderRadius: 8, border: '1px solid var(--border-card)', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', position: 'relative', transition: 'transform .18s ease, box-shadow .18s ease, background .15s ease, border-color .15s ease, color .15s ease' }
export const dropdown = (w: number): CSSProperties => ({ position: 'absolute', top: 'calc(100% + 8px)', right: 0, width: w, background: 'var(--white)', border: '1.5px solid var(--border-card)', borderRadius: 10, boxShadow: '0 8px 24px rgba(75,94,170,.14)', zIndex: 200, overflow: 'hidden' })
export const dropHeader: CSSProperties = { padding: '12px 16px 8px', fontSize: 11.5, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.06em', borderBottom: '1px solid var(--border-inner)' }
export const dropItem: CSSProperties = { display: 'flex', gap: 8, padding: '10px 16px', fontSize: 13.5, color: 'var(--text-primary)', cursor: 'pointer', transition: 'background .1s', lineHeight: 1.4 }
