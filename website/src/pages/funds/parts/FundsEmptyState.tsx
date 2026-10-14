// parts/FundsEmptyState.tsx — Shown when no funds exist
import { Card } from '../../../components/ui'

export default function FundsEmptyState() {
  return (
    <Card style={{ padding: '48px 24px', textAlign: 'center' as const }}>
      <div style={{ color: 'var(--text-muted)', marginBottom: 10 }}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
      </div>
      <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>No funds found</div>
      <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>No funds have been added yet. Click "Add Fund" to get started.</div>
    </Card>
  )
}
