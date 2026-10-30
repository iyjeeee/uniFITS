// parts/EmployeeListSection.tsx — One group in the All Employees modal: colored header, paged rows, number pager (hidden for a single page); owns its own page number (B-52)
import { useState } from 'react'
import EmployeeListRow from './EmployeeListRow'
import { LIST_PAGE_SIZE } from './employeeReportShared'
import type { User } from '../../../types'

interface Props { label: string; color: string; list: User[]; isLast?: boolean }

export default function EmployeeListSection({ label, color, list, isLast }: Props) {
  const [page, setPage] = useState(1)
  const totalPages = Math.ceil(list.length / LIST_PAGE_SIZE)
  return (
    <div style={isLast ? undefined : { marginBottom: 20 }}>
      <div style={{ display: 'flex' as const, alignItems: 'center', gap: 8, marginBottom: 12, paddingBottom: 8, borderBottom: `2px solid ${color}` }}>
        <span style={{ padding: '3px 12px', borderRadius: 20, background: color, color: '#fff', fontSize: 11.5, fontWeight: 700 }}>{label}</span>
        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{list.length} total</span>
      </div>
      {/* Rows for this group's current page */}
      {list.slice((page-1)*LIST_PAGE_SIZE, page*LIST_PAGE_SIZE).map((u) => (
        <EmployeeListRow key={u.id} u={u} />
      ))}
      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex' as const, justifyContent: 'center', gap: 4, marginTop: 10 }}>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button key={p} onClick={() => setPage(p)} style={{ width: 28, height: 28, borderRadius: 6, border: '1.5px solid var(--border-card)', background: p === page ? 'var(--accent)' : '#fff', color: p === page ? '#fff' : 'var(--text-primary)', cursor: 'pointer' as const, fontSize: 11, fontWeight: p === page ? 700 : 400 }}>{p}</button>
          ))}
        </div>
      )}
    </div>
  )
}
