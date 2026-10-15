// parts/UtilityDetailView.tsx — Read-only utility detail: payment progress, expense details, payment info, financial breakdown, notes
import type { ReactNode } from 'react'
import { formatCurrency, formatDate } from '../../../api/mockData'
import { useOrg } from '../../../context/OrgContext'
import type { Utility } from '../../../types'

// SectionLabel — small uppercase heading above each block
function SectionLabel({ children }: { children: ReactNode }) {
  return <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' as const, letterSpacing: '.07em', marginBottom: 8 }}>{children}</div>
}

// Tile — bordered info box with a small uppercase label; children = the value element
function Tile({ label, bg = 'var(--neutral-light)', border = '1px solid var(--border-card)', labelGap = 4, children }: { label: string; bg?: string; border?: string; labelGap?: number; children: ReactNode }) {
  return (
    <div style={{ padding: '12px 14px', borderRadius: 10, background: bg, border }}>
      <div style={{ fontSize: 10.5, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '.07em', marginBottom: labelGap }}>{label}</div>
      {children}
    </div>
  )
}

const valueStyle = { fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)' }

export default function UtilityDetailView({ item }: { item: Utility }) {
  const org = useOrg()
  const remaining = item.total_amount - item.amount_paid
  const pctPaid   = item.total_amount > 0 ? Math.round((item.amount_paid / item.total_amount) * 100) : 0
  return (
    <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 16 }}>

      {/* Payment progress bar */}
      <div style={{ padding: '14px 18px', borderRadius: 10, background: 'var(--neutral-light)', border: '1px solid var(--border-card)' }}>
        <div style={{ display: 'flex' as const, justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
          <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Payment Progress</span>
          <span style={{ fontWeight: 700, color: item.status === 'paid' ? 'var(--success)' : 'var(--warning)' }}>{pctPaid}% paid</span>
        </div>
        <div style={{ height: 8, background: 'var(--border)', borderRadius: 6, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${pctPaid}%`, background: item.status === 'paid' ? 'var(--success)' : 'var(--warning)', borderRadius: 6, transition: 'width .4s' }} />
        </div>
      </div>

      {/* Section 1 — Expense Identity */}
      <div>
        <SectionLabel>Expense Details</SectionLabel>
        <div style={{ display: 'grid' as const, gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[
            ['Utility ID',   `#${item.id}`],
            ['Category',     item.expense_type],
            ['Paid To',      item.paid_to || '—'],
            ['Fund',         item.fund    || '—'],
          ].map(([k, v]) => (
            <Tile key={k} label={k}><div style={valueStyle}>{v}</div></Tile>
          ))}
        </div>
      </div>

      {/* Section 2 — Payment Info */}
      <div>
        <SectionLabel>Payment Information</SectionLabel>
        <div style={{ display: 'grid' as const, gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <Tile label="Payment Date"><div style={valueStyle}>{formatDate(item.payment_date)}</div></Tile>
          <Tile label="Status">
            <div style={{ fontSize: 13.5, fontWeight: 700, color: item.status === 'paid' ? 'var(--success)' : item.status === 'partial' ? 'var(--warning)' : 'var(--danger)' }}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </div>
          </Tile>
        </div>
      </div>

      {/* Section 3 — Financial Breakdown */}
      <div>
        <SectionLabel>Financial Breakdown</SectionLabel>
        <div style={{ display: 'grid' as const, gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          <Tile label="Total" bg="var(--success-light)" border="1px solid rgba(46,125,82,.18)">
            <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)' }}>{formatCurrency(item.total_amount, org.currency_symbol)}</div>
          </Tile>
          <Tile label="Paid" bg="var(--accent-light)" border="1px solid rgba(75,94,170,.18)">
            <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--accent)' }}>{formatCurrency(item.amount_paid, org.currency_symbol)}</div>
          </Tile>
          <Tile label="Remaining" bg={remaining > 0 ? 'var(--danger-light)' : 'var(--neutral-light)'} border={`1px solid ${remaining > 0 ? 'rgba(192,57,43,.18)' : 'var(--border-card)'}`}>
            <div style={{ fontSize: 15, fontWeight: 800, color: remaining > 0 ? 'var(--danger)' : 'var(--success)' }}>{formatCurrency(remaining, org.currency_symbol)}</div>
          </Tile>
        </div>
      </div>

      {/* Section 4 — Notes (if any) */}
      {item.notes && (
        <Tile label="Notes" labelGap={6}>
          <div style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{item.notes}</div>
        </Tile>
      )}
    </div>
  )
}
