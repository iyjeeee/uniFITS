// parts/ReportSelectField.tsx — Labelled native select used by the report generator controls (optional minWidth)
interface Props { label: string; value: string; onChange: (value: string) => void; options: { value: string; label: string }[]; minWidth?: number }

export default function ReportSelectField({ label, value, onChange, options, minWidth }: Props) {
  return (
    <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 4 }}>
      <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' as const, letterSpacing: '.04em' }}>{label}</label>
      <select value={value} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onChange(e.target.value)}
        style={{ padding: '8px 12px', borderRadius: 8, border: '1.5px solid var(--border-card)', fontSize: 13.5, fontFamily: 'var(--font-body)', color: 'var(--text-primary)', background: '#fff', outline: 'none', cursor: 'pointer' as const, minWidth }}>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  )
}
