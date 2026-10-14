// parts/DueTileCard.tsx — Square tile for a fund/due with paid status
import { formatCurrency } from '../../../api/mockData'
import type { OrgConfig } from '../../../types'
import type { DueFund } from './dueShared'
import { IcoCalendar } from './PersonalTransactionsIcons'

/* ── DueTileCard — square-ish tile card for a fund/due ───────────── */
// Status derives from whether annual_fee is set and a mock "amount_paid" field
// paid: annual_fee fully covered → green
// partial: some amount paid but not full → amber
// unpaid: no payment recorded → red
export default function DueTileCard({ fund, org, onClick }: { fund: DueFund; org: OrgConfig; onClick: () => void }) {
  // Derive payment status from mock data (in real app, would come from member_dues table)
  // For demo: use fund.id to assign varied statuses
  const idNum = parseInt(fund.id, 10) || 1
  const demoStatus = idNum % 3 === 0 ? 'partial' : idNum % 2 === 0 ? 'paid' : 'unpaid'
  const payStatus   = fund.due_status || demoStatus  // real field or demo

  const statusMap: Record<'paid' | 'partial' | 'unpaid', { color: string; bg: string; label: string; strip: string }> = {
    paid:    { color: '#2E7D52', bg: '#e8f7ef', label: 'Paid',        strip: '#2E7D52' },
    partial: { color: '#D4860A', bg: '#fff8ec', label: 'Partial',     strip: '#D4860A' },
    unpaid:  { color: '#C0392B', bg: '#fdecea', label: 'Unpaid',      strip: '#C0392B' },
  }
  const st = statusMap[payStatus] || statusMap.unpaid
  // Border accent is always the status color so it's immediately clear
  const borderC = st.color

  return (
    <div
      onClick={onClick}
      style={{
        borderRadius: 12,
        border: `2px solid ${borderC}40`,
        background: '#fff',
        cursor: 'pointer' as const,
        overflow: 'hidden',
        transition: 'transform .15s, box-shadow .15s',
        display: 'flex' as const, flexDirection: 'column' as const,
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 8px 20px ${borderC}30` }}
      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}>

      {/* Status-colored top strip */}
      <div style={{ height: 6, background: st.strip }} />

      <div style={{ padding: '12px 14px', flex: 1, display: 'flex' as const, flexDirection: 'column' as const, gap: 8 }}>
        {/* Fund name */}
        <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.3, color: 'var(--text-primary)' }}>
          {fund.name}
        </div>

        {/* Status pill — color reflects payment state */}
        <div style={{
          display: 'inline-flex' as const, alignItems: 'center',
          padding: '3px 10px', borderRadius: 20,
          background: st.bg, color: st.color,
          fontSize: 11, fontWeight: 700, letterSpacing: '.03em',
          width: 'fit-content',
        }}>
          {st.label}
        </div>

        {/* Amount */}
        <div style={{ fontSize: 18, fontWeight: 800, color: st.color, marginTop: 2 }}>
          {formatCurrency(fund.annual_fee || fund.balance, org.currency_symbol)}
        </div>

        {/* Frequency */}
        {fund.payment_frequency && (
          <div style={{ display: 'flex' as const, alignItems: 'center', gap: 5, fontSize: 11.5, color: 'var(--text-muted)' }}>
            <IcoCalendar />
            {fund.payment_frequency.charAt(0).toUpperCase() + fund.payment_frequency.slice(1)}
          </div>
        )}

        {/* View hint */}
        <div style={{ fontSize: 11, color: st.color, fontWeight: 600, marginTop: 'auto', paddingTop: 6, borderTop: '1px solid var(--border-inner)' }}>
          Click for details →
        </div>
      </div>
    </div>
  )
}
