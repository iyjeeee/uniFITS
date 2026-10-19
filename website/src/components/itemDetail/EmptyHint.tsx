// itemDetail/EmptyHint.tsx — Placeholder shown when a panel has no records
export default function EmptyHint({ text }: { text: string }) {
  return (
    <div style={{ padding: '20px', textAlign: 'center', fontSize: 13, color: 'var(--text-muted)', background: 'var(--neutral-light)', borderRadius: 8, border: '1px solid var(--border-inner)' }}>
      {text}
    </div>
  )
}
