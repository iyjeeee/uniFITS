// components/ui/SectionDivider.tsx — SectionDivider

// ── SectionDivider ────────────────────────────────────────────────────────────
export function SectionDivider({ label }: { label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '4px 0 12px' }}>
      <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '.08em', whiteSpace: 'nowrap' }}>{label}</div>
      <div style={{ flex: 1, height: 1, background: 'var(--border-inner)' }} />
    </div>
  )
}
