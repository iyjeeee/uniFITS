// parts/SettingsActionButton.tsx — Compact solid action button (primary accent / secondary grey / danger red), max 200px wide
import type { ReactNode } from 'react'

/* Action button — compact width, centered text, solid color */
export default function SettingsActionButton({ children, variant = 'primary', onClick, icon, danger }: { children: ReactNode; variant?: 'primary' | 'secondary'; onClick?: () => void; icon?: ReactNode; danger?: boolean }) {
  const bg     = danger ? 'var(--danger)'  : variant === 'secondary' ? '#5A6474' : 'var(--accent)'
  const border = danger ? 'var(--danger)'  : variant === 'secondary' ? '#4A5264' : 'var(--accent)'
  return (
    <button onClick={onClick} style={{
      display: 'inline-flex' as const, alignItems: 'center', justifyContent: 'center', gap: 6,
      padding: '8px 16px', borderRadius: 8, border: '1.5px solid ' + border,
      background: bg, color: '#fff', fontSize: 12.5, fontWeight: 600,
      fontFamily: 'var(--font-body)', cursor: 'pointer' as const, whiteSpace: 'nowrap' as const,
      transition: 'opacity .15s', width: '100%', maxWidth: 200,
    }}>
      {icon && icon}{children}
    </button>
  )
}
