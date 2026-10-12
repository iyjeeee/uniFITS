// components/ui/Badge.tsx — Badge + StatusBadge
import type { ReactNode, CSSProperties } from 'react'
import type { BadgeVariant } from '../../types'

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
