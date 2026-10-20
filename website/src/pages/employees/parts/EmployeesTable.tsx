// parts/EmployeesTable.tsx — Employees data table (status-colored rows, mailto link, Delete-only action column)
import { StatusBadge, Avatar, TypePill } from '../../../components/ui'
import { IconBtn } from '../../../components/TableUtils'
import { BtnIco } from '../../../components/Icons'
import { formatDate } from '../../../api/mockData'
import { rowStyle, rowHoverBg } from '../../../constants/tableColors'
import { EMPLOYEE_PAGE_SIZE } from './employeesShared'
import type { User } from '../../../types'

interface Props { rows: User[]; page: number; onRowClick: (u: User) => void; onDelete: (u: User) => void }

export default function EmployeesTable({ rows, page, onRowClick, onDelete }: Props) {
  return (
    <div style={{ overflowX: 'auto' as const }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ background: 'var(--table-head-bg)' }}>
            {['#','Name','Role','Email','Contact','Department','Joined','Status','Actions'].map((h) => (
              <th key={h} style={{ padding: '10px 14px', textAlign: 'left' as const, fontSize: 11, fontWeight: 600, color: 'var(--table-head-fg)', textTransform: 'uppercase' as const, letterSpacing: '.06em', borderBottom: '2px solid var(--border-table)', whiteSpace: 'nowrap' as const }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr><td colSpan={9} style={{ padding: '32px', textAlign: 'center' as const, color: 'var(--text-muted)' }}>No employees found.</td></tr>
          ) : rows.map((r, i) => (
            <tr key={r.id}
              style={rowStyle(r.status)}
              onClick={() => onRowClick(r)}
              onMouseEnter={e => e.currentTarget.style.background = rowHoverBg(r.status)}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <td style={{ padding: '10px 14px', color: 'var(--text-muted)', fontSize: 12 }}>{(page - 1) * EMPLOYEE_PAGE_SIZE + i + 1}</td>
              <td style={{ padding: '10px 14px' }}>
                <div style={{ display: 'flex' as const, alignItems: 'center', gap: 9 }}>
                  <Avatar name={r.full_name} size={30} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13.5 }}>{r.full_name}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{r.employee_number}</div>
                  </div>
                </div>
              </td>
              <td style={{ padding: '10px 14px' }}>
                <TypePill>{r.role}</TypePill>
              </td>
              <td style={{ padding: '10px 14px' }}>
                <a href={`mailto:${r.email}`} onClick={e => e.stopPropagation()} style={{ color: 'var(--accent)', fontSize: 13 }}>{r.email}</a>
              </td>
              <td style={{ padding: '10px 14px' }}>{r.contact_number}</td>
              <td style={{ padding: '10px 14px' }}>{r.department}</td>
              <td style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>{formatDate(r.joined)}</td>
              <td style={{ padding: '10px 14px' }}><StatusBadge status={r.status} /></td>
              {/* Actions — propagation stopped */}
              <td style={{ padding: '10px 14px' }} onClick={e => e.stopPropagation()}>
                <IconBtn solidBg="#C0392B" title="Delete" onClick={() => onDelete(r)}>
                  <BtnIco.Delete />
                </IconBtn>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
