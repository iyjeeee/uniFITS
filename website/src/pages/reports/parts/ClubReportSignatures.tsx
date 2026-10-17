// parts/ClubReportSignatures.tsx — Report footer: Prepared / Reviewed / Approved signature lines
export default function ClubReportSignatures() {
  return (
    <div style={{ marginTop: 32, paddingTop: 20, borderTop: '2px solid var(--border-inner)', display: 'flex' as const, justifyContent: 'space-between', flexWrap: 'wrap', gap: 24 }}>
      {['Prepared by', 'Reviewed by', 'Approved by'].map(role => (
        <div key={role} style={{ textAlign: 'center' as const, minWidth: 160, flex: 1 }}>
          {/* Signature space — 72px gives enough room to write */}
          <div style={{ height: 72, borderBottom: '1.5px solid var(--text-primary)', marginBottom: 8, width: '100%' }} />
          <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase' as const, letterSpacing: '.06em' }}>{role}</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>Signature over Printed Name</div>
        </div>
      ))}
    </div>
  )
}
