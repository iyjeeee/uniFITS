// parts/EventsTable.tsx — Events data table (status-colored rows, funding mini-bar); actions: Approve / Reject (pending rows only), Delete
import { StatusBadge } from '../../../components/ui'
import { IconBtn } from '../../../components/TableUtils'
import { BtnIco } from '../../../components/Icons'
import { formatCurrency, formatDate, fmt12 } from '../../../api/mockData'
import { rowStyle, rowHoverBg } from '../../../constants/tableColors'
import { useOrg } from '../../../context/OrgContext'
import type { EventWithFunding } from '../../../types'

interface Props { rows: EventWithFunding[]; onRowClick: (e: EventWithFunding) => void; onApprove: (e: EventWithFunding) => void; onReject: (e: EventWithFunding) => void; onDelete: (e: EventWithFunding) => void }

export default function EventsTable({ rows, onRowClick, onApprove, onReject, onDelete }: Props) {
  const org = useOrg()
  return (
    <div style={{ overflowX: 'auto' as const }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ background: 'var(--table-head-bg)' }}>
            {['Title','Date','Time','Location','Target Funding','Current Funding','Status','Actions'].map((h) => (
              <th key={h} style={{ padding: '10px 14px', textAlign: 'left' as const, fontSize: 11, fontWeight: 600, color: 'var(--table-head-fg)', textTransform: 'uppercase' as const, letterSpacing: '.06em', borderBottom: '2px solid var(--border-table)', whiteSpace: 'nowrap' as const }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr><td colSpan={8} style={{ padding: '32px', textAlign: 'center' as const, color: 'var(--text-muted)' }}>No events found.</td></tr>
          ) : rows.map((r) => (
            <tr key={r.id} style={rowStyle(r.status)} onClick={() => onRowClick(r)}
              onMouseEnter={e => e.currentTarget.style.background = rowHoverBg(r.status)}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <td style={{ padding: '10px 14px', fontWeight: 600 }}>{r.title}</td>
              <td style={{ padding: '10px 14px' }}>{formatDate(r.event_date)}</td>
              <td style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>{r.event_time ? fmt12(r.event_time) : '—'}</td>
              <td style={{ padding: '10px 14px' }}>{r.location}</td>
              <td style={{ padding: '10px 14px' }}>{r.target_funding > 0 ? formatCurrency(r.target_funding, org.currency_symbol) : <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>None</span>}</td>
              {/* Current funding with progress bar — same as Projects */}
              <td style={{ padding: '10px 14px' }}>
                <div style={{ fontWeight: 600, color: r.current_funding >= r.target_funding && r.target_funding > 0 ? 'var(--success)' : 'var(--text-primary)' }}>
                  {r.current_funding > 0 ? formatCurrency(r.current_funding, org.currency_symbol) : '—'}
                </div>
                {r.target_funding > 0 && r.current_funding > 0 && (
                  <div style={{ marginTop: 4, height: 4, width: 80, background: 'var(--border)', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: '#2E7D52', width: Math.min(100,(r.current_funding/r.target_funding)*100) + '%', borderRadius: 4 }} />
                  </div>
                )}
              </td>
              <td style={{ padding: '10px 14px' }}>
                <StatusBadge status={r.status} />
                {r.approval_status !== 'approved' && <span style={{ marginLeft: 6 }}><StatusBadge status={r.approval_status} /></span>}   {/* Pending / Rejected */}
              </td>
              <td style={{ padding: '10px 14px' }} onClick={e => e.stopPropagation()}>
                <div style={{ display: 'flex' as const, gap: 5 }}>
                  {r.approval_status === 'pending' && <>   {/* review actions only while waiting for a decision */}
                    <IconBtn solidBg="#2E7D52" title="Approve" onClick={() => onApprove(r)}><BtnIco.Check /></IconBtn>
                    <IconBtn solidBg="#C0392B" title="Reject"  onClick={() => onReject(r)}><BtnIco.Reject /></IconBtn>
                  </>}
                  <IconBtn solidBg="#8B1A1A" title="Delete"  onClick={() => onDelete(r)}><BtnIco.Delete /></IconBtn>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
