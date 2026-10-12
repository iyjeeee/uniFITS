// parts/AttendanceSectionHeader.tsx — Header for the project/event tile sections

/* ── Section Header for the two tile-grid sections ───────────────── */
interface SectionHeaderProps { icon: React.ReactNode; label: string; count: number; color: string }
export default function SectionHeader({ icon, label, count, color }: SectionHeaderProps) {
  return (
    <div style={{ display: 'flex' as const, alignItems: 'center', gap: 10, marginBottom: 14 }}>
      <div style={{ width: 32, height: 32, borderRadius: 8, background: color + '20', display: 'flex' as const, alignItems: 'center', justifyContent: 'center', color, flexShrink: 0 }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{label}</div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 1 }}>
          {count} activit{count !== 1 ? 'ies' : 'y'} — click any card to manage attendance
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════════ */
