// parts/UtilitiesTable.tsx — Utilities data table (status-colored rows); action column has Delete only, Edit lives in the detail modal
import { StatusBadge } from '../../../components/ui'
import { IconBtn } from '../../../components/TableUtils'
import { TableIco } from '../../../components/Icons'
import { formatCurrency, formatDate, getFundName } from '../../../api/mockData'
import { useOrg } from '../../../context/OrgContext'
import { rowStyle, rowHoverBg } from '../../../constants/tableColors'
import { UTILITY_PAGE_SIZE } from './utilitiesShared'
import type { UtilityWithBalance } from '../../../types'

interface Props { rows: UtilityWithBalance[]; page: number; onRowClick: (u: UtilityWithBalance) => void; onDelete: (u: UtilityWithBalance) => void }

export default function UtilitiesTable({ rows, page, onRowClick, onDelete }: Props) {
  const org = useOrg()
  return (
    <div style={{ overflowX: 'auto' as const }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ background: 'var(--table-head-bg)' }}>
            {['#', 'Category', 'Total', 'Paid', 'Remaining', 'Due Date', 'Paid To', 'Fund', 'Status', 'Actions'].map((h) => (
              <th key={h} style={{ padding: '10px 14px', textAlign: 'left' as const, fontSize: 11, fontWeight: 600, color: 'var(--table-head-fg)', textTransform: 'uppercase' as const, letterSpacing: '.06em', borderBottom: '2px solid var(--border-table)', whiteSpace: 'nowrap' as const }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr><td colSpan={10} style={{ padding: '32px', textAlign: 'center' as const, color: 'var(--text-muted)' }}>No utilities found.</td></tr>
          ) : rows.map((u, i) => {
            const remaining = u.total_amount - u.amount_paid
            return (
              <tr key={u.id}
                style={rowStyle(u.status)}
                onClick={() => onRowClick(u)}
                onMouseEnter={e => e.currentTarget.style.background = rowHoverBg(u.status)}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <td style={{ padding: '10px 14px', color: 'var(--text-muted)', fontSize: 12 }}>{(page - 1) * UTILITY_PAGE_SIZE + i + 1}</td>
                <td style={{ padding: '10px 14px', fontWeight: 600 }}>{u.expense_type}</td>
                <td style={{ padding: '10px 14px', fontWeight: 600 }}>{formatCurrency(u.total_amount, org.currency_symbol)}</td>
                <td style={{ padding: '10px 14px', color: 'var(--success)', fontWeight: 600 }}>{formatCurrency(u.amount_paid, org.currency_symbol)}</td>
                <td style={{ padding: '10px 14px', color: remaining > 0 ? 'var(--danger)' : 'var(--success)', fontWeight: 600 }}>{formatCurrency(remaining, org.currency_symbol)}</td>
                <td style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>{formatDate(u.due_date)}</td>
                <td style={{ padding: '10px 14px' }}>{u.paid_to || '—'}</td>
                <td style={{ padding: '10px 14px', fontSize: 12.5 }}>{getFundName(u.fund_id)}</td>
                <td style={{ padding: '10px 14px' }}><StatusBadge status={u.status} /></td>
                {/* Actions: Delete only — Edit is inside the detail modal */}
                <td style={{ padding: '10px 14px' }} onClick={e => e.stopPropagation()}>
                  <IconBtn solidBg="var(--danger)" title="Delete" onClick={() => onDelete(u)}><TableIco.Delete /></IconBtn>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
