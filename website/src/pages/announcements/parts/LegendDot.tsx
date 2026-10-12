// parts/LegendDot.tsx — Colored dot + label legend entry


export default function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:5, fontSize:11.5, color:'var(--text-muted)' }}>
      <div style={{ width:8, height:8, borderRadius:'50%', background:color }} />{label}
    </div>
  )
}
