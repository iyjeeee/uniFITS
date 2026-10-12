// components/ui/InfoModal.tsx — InfoModal (large detail/form modal) + legacy Modal alias
import { useState } from 'react'
import type { ReactNode } from 'react'
import useModalLock from '../../hooks/useModalLock'

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

  useModalLock(open)   // lock body scroll while open

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
        background: 'var(--white)', borderRadius: 16, borderTop: `4px solid ${accentColor}`, // accent stripe — status color passed by caller
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

// ── Modal — backwards-compatible alias that routes to InfoModal ────────────────
interface LegacyModalProps { open: boolean; onClose: () => void; title?: string; subtitle?: string; children?: ReactNode; width?: number; footer?: ReactNode }
export function Modal({ open, onClose, title, subtitle, children, footer }: LegacyModalProps) {
  return <InfoModal open={open} onClose={onClose} title={title} subtitle={subtitle} footer={footer}>{children}</InfoModal>
}
