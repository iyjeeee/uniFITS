// parts/TransactionsTable.tsx — Ledger table (status-colored rows); actions: Approve, Reject, Delete (no receipt button)
import { StatusBadge } from '../../../components/ui'
import { IconBtn } from '../../../components/TableUtils'
import { TableIco } from '../../../components/Icons'
import { formatCurrency, formatDate, getFundName } from '../../../api/mockData'
import { useOrg } from '../../../context/OrgContext'
import { rowStyle, rowHoverBg } from '../../../constants/tableColors'
import { TX_PAGE_SIZE } from './transactionsShared'
import EntryTypeBadge from './EntryTypeBadge'
import type { Transaction } from '../../../types'

interface Props { rows: Transaction[]; page: number; onRowClick: (t: Transaction) => void; onApprove: (t: Transaction) => void; onReject: (t: Transaction) => void; onDelete: (t: Transaction) => void }

export default function TransactionsTable({ rows, page, onRowClick, onApprove, onReject, onDelete }: Props) {
  const org = useOrg()
  return (
    <div style={{ overflowX: 'auto' as const }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ background: 'var(--table-head-bg)' }}>
            {['#', 'Reference', 'Member', 'Amount', 'Type', 'Category', 'Fund', 'Date', 'Status', 'Actions'].map((h) => (
              <th key={h} style={{ padding: '10px 14px', textAlign: 'left' as const, fontSize: 11, fontWeight: 600, color: 'var(--table-head-fg)', textTransform: 'uppercase' as const, letterSpacing: '.06em', borderBottom: '2px solid var(--border-table)', whiteSpace: 'nowrap' as const }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr><td colSpan={10} style={{ padding: '32px', textAlign: 'center' as const, color: 'var(--text-muted)' }}>No transactions found.</td></tr>
          ) : rows.map((t, i) => (
            <tr key={t.id}
              style={rowStyle(t.status)}
              onClick={() => onRowClick(t)}
              onMouseEnter={e => e.currentTarget.style.background = rowHoverBg(t.status)}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <td style={{ padding: '10px 14px', color: 'var(--text-muted)', fontSize: 12 }}>{(page - 1) * TX_PAGE_SIZE + i + 1}</td>
              <td style={{ padding: '10px 14px' }}>
                <code style={{ fontSize: 11, color: 'var(--text-primary)', fontFamily: 'monospace' }}>{t.reference_number}</code>
              </td>
              <td style={{ padding: '10px 14px', fontWeight: 500 }}>{t.user_name || <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>External</span>}</td>
              <td style={{ padding: '10px 14px', fontWeight: 700, color: t.entry_type === 'expense' ? 'var(--danger)' : 'var(--success)' }}>
                {t.entry_type === 'expense' ? '−' : '+'}{formatCurrency(t.amount, org.currency_symbol)}
              </td>
              <td style={{ padding: '10px 14px' }}><EntryTypeBadge type={t.entry_type} /></td>
              <td style={{ padding: '10px 14px', textTransform: 'capitalize' as const }}>{t.category}</td>
              <td style={{ padding: '10px 14px', fontSize: 12.5 }}>{getFundName(t.fund_id)}</td>
              <td style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>{formatDate(t.transaction_date)}</td>
              <td style={{ padding: '10px 14px' }}><StatusBadge status={t.status} /></td>
              {/* Actions: Approve, Reject, Delete — no receipt button */}
              <td style={{ padding: '10px 14px' }} onClick={e => e.stopPropagation()}>
                <div style={{ display: 'flex' as const, gap: 5 }}>
                  <IconBtn solidBg="#2E7D52" title="Approve" onClick={() => onApprove(t)}><TableIco.Approve /></IconBtn>
                  <IconBtn solidBg="#C0392B" title="Reject"  onClick={() => onReject(t)}><TableIco.Reject /></IconBtn>
                  <IconBtn solidBg="#7B1A1A" title="Delete"  onClick={() => onDelete(t)}><TableIco.Delete /></IconBtn>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
