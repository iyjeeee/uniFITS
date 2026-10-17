// parts/ReportSection.tsx — Numbered report section: accent uppercase title with underline, then content
import type { ReactNode } from 'react'

export default function ReportSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase' as const, letterSpacing: '.06em', paddingBottom: 8, borderBottom: '2px solid var(--accent)', marginBottom: 14 }}>
        {title}
      </div>
      {children}
    </div>
  )
}
