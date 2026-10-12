// components/ui/ResponseModal.tsx — ResponseModal (compact feedback/confirmation modal)
import type { ReactNode } from 'react'
import type { ButtonVariant, ModalVariant } from '../../types'
import { Button } from './Button'
import useModalLock from '../../hooks/useModalLock'

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
  useModalLock(open)   // lock body scroll while open

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
