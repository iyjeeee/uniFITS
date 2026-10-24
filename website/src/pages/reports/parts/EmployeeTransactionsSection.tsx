// parts/EmployeeTransactionsSection.tsx — "Recent Transactions" table of the selected member (first 6, array order — see bug log)
import { StatusBadge } from '../../../components/ui'
import { formatCurrency, formatDate } from '../../../api/mockData'
import { useOrg } from '../../../context/OrgContext'
import type { Transaction } from '../../../types'

export default function EmployeeTransactionsSection({ myTx }: { myTx: Transaction[] }) {
  const org = useOrg()
  return (
    <div style={{ padding: '18px 28px' }}>
      <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--accent)', marginBottom: 12, textTransform: 'uppercase' as const, letterSpacing: '.06em' }}>
        Recent Transactions
      </div>
      {myTx.length === 0
        ? <div style={{ color: 'var(--text-muted)', fontSize: 13, textAlign: 'center' as const, padding: '20px 0' }}>No transactions found for this member.</div>
        : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: 'var(--table-head-bg)' }}>
                {['Reference', 'Amount', 'Category', 'Method', 'Status', 'Date'].map((h) => (
                  <th key={h} style={{ padding: '8px 12px', textAlign: 'left' as const, fontSize: 11, fontWeight: 600, color: 'var(--table-head-fg)', textTransform: 'uppercase' as const, letterSpacing: '.05em', borderBottom: '2px solid var(--border-table)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {myTx.map((t) => (
                <tr key={t.id} style={{ borderBottom: '1px solid var(--border-inner)' }}>
                  <td style={{ padding: '9px 12px' }}><code style={{ fontSize: 11 }}>{t.reference_number}</code></td>
                  <td style={{ padding: '9px 12px', fontWeight: 700, color: 'var(--success)' }}>{formatCurrency(t.amount, org.currency_symbol)}</td>
                  <td style={{ padding: '9px 12px' }}>
                    <span style={{ display: 'inline-flex' as const, padding: '3px 10px', borderRadius: 20, background: '#4B5EAA', color: '#fff', fontSize: 11, fontWeight: 700 }}>
                      {t.category.charAt(0).toUpperCase() + t.category.slice(1)}
                    </span>
                  </td>
                  <td style={{ padding: '9px 12px' }}>{t.payment_method ?? '—'}</td>
                  <td style={{ padding: '9px 12px' }}><StatusBadge status={t.status} /></td>
                  <td style={{ padding: '9px 12px' }}>{formatDate(t.transaction_date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      }
    </div>
  )
}
