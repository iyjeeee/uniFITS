// parts/ProjectsTable.tsx — Projects data table (status-colored rows, funding mini-bar); actions: Approve / Reject (pending rows only), Delete
import { StatusBadge, TypePill } from '../../../components/ui'
import { IconBtn } from '../../../components/TableUtils'
import { BtnIco } from '../../../components/Icons'
import { formatCurrency, formatDate } from '../../../api/mockData'
import { rowStyle, rowHoverBg } from '../../../constants/tableColors'
import type { ProjectWithFunding } from '../../../types'

interface Props { rows: ProjectWithFunding[]; onRowClick: (p: ProjectWithFunding) => void; onApprove: (p: ProjectWithFunding) => void; onReject: (p: ProjectWithFunding) => void; onDelete: (p: ProjectWithFunding) => void }

export default function ProjectsTable({ rows, onRowClick, onApprove, onReject, onDelete }: Props) {
  return (
    <div style={{ overflowX: 'auto' as const }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ background: 'var(--table-head-bg)' }}>
            {['Title','Type','Target Funding','Current Funding','Start Date','End Date','Status','Actions'].map((h) => (
              <th key={h} style={{ padding: '10px 14px', textAlign: 'left' as const, fontSize: 11, fontWeight: 600, color: 'var(--table-head-fg)', textTransform: 'uppercase' as const, letterSpacing: '.06em', borderBottom: '2px solid var(--border-table)', whiteSpace: 'nowrap' as const }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr><td colSpan={8} style={{ padding: '32px', textAlign: 'center' as const, color: 'var(--text-muted)' }}>No projects found.</td></tr>
          ) : rows.map((r) => (
            <tr key={r.id} style={rowStyle(r.status)} onClick={() => onRowClick(r)}
              onMouseEnter={e => e.currentTarget.style.background = rowHoverBg(r.status)}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <td style={{ padding: '10px 14px', fontWeight: 600 }}>{r.title}</td>
              <td style={{ padding: '10px 14px' }}>
                <TypePill>{r.project_type || '—'}</TypePill>
              </td>
              <td style={{ padding: '10px 14px' }}>{formatCurrency(r.target_funding)}</td>
              {/* Current funding with progress bar */}
              <td style={{ padding: '10px 14px' }}>
                <div style={{ fontWeight: 600, color: r.current_funding >= r.target_funding ? 'var(--success)' : 'var(--text-primary)' }}>{formatCurrency(r.current_funding)}</div>
                {r.target_funding > 0 && (
                  <div style={{ marginTop: 4, height: 4, width: 80, background: 'var(--border)', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: '#2E7D52', width: Math.min(100,(r.current_funding/r.target_funding)*100) + '%', borderRadius: 4 }} />
                  </div>
                )}
              </td>
              <td style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>{formatDate(r.start_date)}</td>
              <td style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>{formatDate(r.end_date)}</td>
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
