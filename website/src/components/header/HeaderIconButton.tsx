// header/HeaderIconButton.tsx — 36px square icon button with lift + accent border hover (hamburger, notification bell)
import type { ReactNode } from 'react'
import { iconBtn } from './headerStyles'

interface Props { onClick: () => void; ariaLabel: string; children: ReactNode }

export default function HeaderIconButton({ onClick, ariaLabel, children }: Props) {
  return (
    <button
      style={iconBtn}
      onClick={onClick}
      aria-label={ariaLabel}
      onMouseEnter={e => {
        e.currentTarget.style.transform    = 'translateY(-2px)'
        e.currentTarget.style.boxShadow   = '0 0 0 1.5px rgba(0,0,0,.70), 0 4px 12px rgba(0,0,0,.14)'
        e.currentTarget.style.background  = 'var(--neutral-light)'
        e.currentTarget.style.borderColor = 'var(--accent)'
        e.currentTarget.style.color       = 'var(--accent)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform    = ''
        e.currentTarget.style.boxShadow   = ''
        e.currentTarget.style.background  = ''
        e.currentTarget.style.borderColor = ''
        e.currentTarget.style.color       = ''
      }}>
      {children}
    </button>
  )
}
