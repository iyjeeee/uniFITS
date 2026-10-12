// components/ui/Toast.tsx — ToastContainer (state comes from the useToast hook in hooks/useToast.ts)
import type { Toast, ToastVariant } from '../../types'

// ── Toast / ToastContainer ──────────────────────────────────────────────────────
// ToastContainer renders all active toasts fixed bottom-right (auto-dismiss is handled by useToast).
const TOAST_VARIANTS: Record<ToastVariant, { bg: string; icon: string }> = {
  success: { bg: '#2E7D52', icon: '✓' },
  error:   { bg: '#C0392B', icon: '✕' },
  warning: { bg: '#D4860A', icon: '⚠' },
  info:    { bg: '#4B5EAA', icon: 'i' },
}

export function ToastContainer({ toasts }: { toasts: Toast[] }) {
  if (!toasts.length) return null
  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 8, pointerEvents: 'none' }}>
      {toasts.map(t => {
        const v = TOAST_VARIANTS[t.variant] || TOAST_VARIANTS.info
        return (
          <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 16px', borderRadius: 10, backgroundColor: v.bg, color: '#fff', fontSize: 13.5, fontWeight: 500, fontFamily: 'var(--font-body)', boxShadow: '0 4px 20px rgba(0,0,0,.22)', minWidth: 220, maxWidth: 340, lineHeight: 1.4 }}>
            <span style={{ fontSize: 14, fontWeight: 700, flexShrink: 0 }}>{v.icon}</span>
            <span>{t.message}</span>
          </div>
        )
      })}
    </div>
  )
}
