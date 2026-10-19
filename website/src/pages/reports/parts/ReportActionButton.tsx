// parts/ReportActionButton.tsx — Solid-color action button for report headers (primary accent / secondary grey)
import type { ReactNode } from 'react'

export default function ReportActionButton({ children, icon, onClick, variant = 'primary' }: { children: ReactNode; icon?: ReactNode; onClick: () => void; variant?: 'primary' | 'secondary' }) {
  const styles: Record<'primary' | 'secondary', { bg: string; border: string; color: string }> = {
    primary:   { bg: 'var(--accent)',  border: 'var(--accent)',      color: '#fff' },
    secondary: { bg: '#5A6474',        border: '#5A6474',            color: '#fff' },
  }
  const s = styles[variant] || styles.primary
  return (
    <button onClick={onClick} style={{
      display: 'flex' as const, alignItems: 'center', justifyContent: 'center', gap: 6,
      padding: '9px 18px', borderRadius: 8,
      border: '1.5px solid ' + s.border, background: s.bg, color: s.color,
      fontSize: 13, fontWeight: 600, cursor: 'pointer' as const, fontFamily: 'var(--font-body)',
      whiteSpace: 'nowrap' as const, transition: 'opacity .15s',
    }}>
      {icon}{children}
    </button>
  )
}
