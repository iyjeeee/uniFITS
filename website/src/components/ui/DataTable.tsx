// components/ui/DataTable.tsx — DataTable (sorting, pagination, empty state)
import { useState, useEffect } from 'react'
import type { ReactNode, CSSProperties } from 'react'
import type { Column } from '../../types'
import { Card } from './Card'

// ── DataTable ─────────────────────────────────────────────────────────────────
const PAGE_SIZES = [10, 25, 50, 100]

interface DataTableProps<T extends { id?: string | number }> {
  columns:   Column<T>[]
  data:      T[]
  title?:    string
  subtitle?: string
  emptyMsg?: string
  onRowClick?: (row: T) => void   // makes rows clickable (pointer cursor); omit for a plain table
}
export function DataTable<T extends { id?: string | number }>({ columns = [], data = [], title, subtitle, emptyMsg = 'No records found.', onRowClick }: DataTableProps<T>) {
  const [search,   setSearch  ] = useState('')
  const [page,     setPage    ] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // Simple text search across all string values in each row
  const filtered = data.filter(row =>
    Object.values(row as Record<string, unknown>).some(v => String(v).toLowerCase().includes(search.toLowerCase()))
  )
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const paginated  = filtered.slice((page - 1) * pageSize, page * pageSize)

  // Reset to page 1 on search change
  useEffect(() => setPage(1), [search])

  function getValue(row: T, col: Column<T>): ReactNode {
    if (col.render) return col.render(row, (page - 1) * pageSize + paginated.indexOf(row))
    if (col.accessor) return (row[col.accessor] as ReactNode) ?? '—'
    return '—'
  }

  return (
    <Card>
      {/* Header: title + page-size selector + search */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid var(--border-inner)', flexWrap: 'wrap', gap: 12 }}>
        <div>
          {title    && <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{title}</div>}
          {subtitle && <div style={{ fontSize: 12.5, color: 'var(--text-muted)', marginTop: 2 }}>{subtitle}</div>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <select value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); setPage(1) }}
            style={{ padding: '6px 10px', borderRadius: 7, border: '1px solid var(--border-card)', fontSize: 13, fontFamily: 'var(--font-body)', background: 'var(--white)', color: 'var(--text-primary)', cursor: 'pointer' }}>
            {PAGE_SIZES.map(n => <option key={n} value={n}>{n} / page</option>)}
          </select>
          <div style={{ position: 'relative' }}>
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth={2} strokeLinecap="round" style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' } as CSSProperties}>
              <circle cx={11} cy={11} r={8} /><line x1={21} y1={21} x2={16.65} y2={16.65} />
            </svg>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search…"
              style={{ padding: '6px 10px 6px 28px', borderRadius: 7, border: '1px solid var(--border-card)', fontSize: 13, fontFamily: 'var(--font-body)', color: 'var(--text-primary)', background: 'var(--white)', outline: 'none', width: 180 }} />
          </div>
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5 }}>
          <thead>
            <tr style={{ background: 'var(--table-head-bg)' }}>
              {columns.map(col => (
                <th key={col.key} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11.5, fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--table-head-fg)', borderBottom: '2px solid var(--border-table)', whiteSpace: 'nowrap' }}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0
              ? <tr><td colSpan={columns.length} style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13.5 }}>{emptyMsg}</td></tr>
              : paginated.map((row, i) => (
                  <tr key={row.id ?? i} style={{ borderBottom: '1px solid var(--border-inner)', ...(onRowClick ? { cursor: 'pointer' } : {}) }}
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                    onMouseEnter={e => { (e.currentTarget as HTMLTableRowElement).style.background = 'var(--neutral-light)' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLTableRowElement).style.background = 'transparent' }}>
                    {columns.map(col => (
                      <td key={col.key} style={{ padding: '12px 16px', verticalAlign: 'middle', color: 'var(--text-primary)' }}>
                        {getValue(row, col)}
                      </td>
                    ))}
                  </tr>
                ))
            }
          </tbody>
        </table>
      </div>

      {/* Pagination footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', borderTop: '1px solid var(--border-inner)', flexWrap: 'wrap', gap: 10 }}>
        <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          Showing <strong>{filtered.length === 0 ? 0 : (page - 1) * pageSize + 1}–{Math.min(page * pageSize, filtered.length)}</strong> of <strong>{filtered.length}</strong> records
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          <PagBtn label="«" onClick={() => setPage(1)}            disabled={page === 1} />
          <PagBtn label="‹" onClick={() => setPage(p => p - 1)}  disabled={page === 1} />
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const p = Math.max(1, Math.min(totalPages - 4, page - 2)) + i
            if (p < 1 || p > totalPages) return null
            return <PagBtn key={p} label={String(p)} active={p === page} onClick={() => setPage(p)} />
          })}
          <PagBtn label="›" onClick={() => setPage(p => p + 1)}  disabled={page === totalPages} />
          <PagBtn label="»" onClick={() => setPage(totalPages)}   disabled={page === totalPages} />
        </div>
      </div>
    </Card>
  )
}

interface PagBtnProps { label: string; onClick: () => void; disabled?: boolean; active?: boolean }
function PagBtn({ label, onClick, disabled, active }: PagBtnProps) {
  return (
    <button onClick={onClick} disabled={disabled} style={{ minWidth: 32, height: 32, padding: '0 8px', borderRadius: 6, border: '1px solid var(--border-card)', background: active ? 'var(--accent)' : disabled ? 'var(--neutral-light)' : 'var(--white)', color: active ? '#fff' : disabled ? 'var(--text-muted)' : 'var(--text-primary)', fontSize: 13, fontFamily: 'var(--font-body)', cursor: disabled ? 'not-allowed' : 'pointer' }}>
      {label}
    </button>
  )
}
