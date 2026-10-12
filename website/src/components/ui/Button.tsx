// components/ui/Button.tsx — Button
import { useState } from 'react'
import type { ReactNode, CSSProperties } from 'react'
import type { ButtonVariant, ButtonSize } from '../../types'

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
