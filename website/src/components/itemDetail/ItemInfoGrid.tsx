// itemDetail/ItemInfoGrid.tsx — Auto-fit grid of label/value tiles (status, duration or date, location, type, funding)
export default function ItemInfoGrid({ rows }: { rows: [string, string][] }) {
  return (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px,1fr))', gap: 12 }}>
    {rows.map(([k, v]) => (
      <div key={k} style={{ padding: '12px 14px', borderRadius: 10, background: 'var(--neutral-light)', border: '1.5px solid var(--border-card)' }}>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 4 }}>{k}</div>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{v}</div>
      </div>
    ))}
  </div>
  )
}
