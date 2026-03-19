// AuditLogs.jsx — Searchable, filterable audit trail for all system actions
import { useState } from 'react'
import { DataTable, Badge } from '../../components/ui'
import { MOCK_AUDIT_LOGS, formatDate, relativeTime } from '../../api/mockData'

// Map action types to badge variants
const ACTION_VARIANT = {
  login: 'success', logout: 'neutral', insert: 'accent',
  update: 'warning', delete: 'danger', backup: 'info', restore: 'info', export: 'info',
}

export default function AuditLogs() {
  const [data] = useState(MOCK_AUDIT_LOGS)

  const columns = [
    { label: '#',         key: 'num',    render: (_, i) => <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>{data.length - i}</span> },
    { label: 'User',      accessor: 'user',       render: r => <span style={{ fontWeight: 600, fontSize: 13.5 }}>{r.user}</span> },
    { label: 'Action',    key: 'action',           render: r => <Badge variant={ACTION_VARIANT[r.action] || 'neutral'}>{r.action.toUpperCase()}</Badge> },
    { label: 'Summary',   accessor: 'summary',     render: r => <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{r.summary}</span> },
    { label: 'Table',     accessor: 'table_name',  render: r => <code style={{ fontSize: 11, background: 'var(--neutral-light)', padding: '2px 6px', borderRadius: 4 }}>{r.table_name}</code> },
    { label: 'IP',        accessor: 'ip_address',  render: r => <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{r.ip_address}</span> },
    { label: 'Timestamp', key: 'ts',               render: r => (
        <div>
          <div style={{ fontSize: 13 }}>{formatDate(r.created_at)}</div>
          <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{relativeTime(r.created_at)}</div>
        </div>
      )},
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

      {/* Action count summary chips — SVG dots instead of emoji */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {['login','insert','update','delete','backup'].map(action => {
          const count = data.filter(l => l.action === action).length
          return (
            <div key={action} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 20, background: 'var(--white)', border: '1px solid var(--border)', fontSize: 13 }}>
              <Badge variant={ACTION_VARIANT[action] || 'neutral'}>{action}</Badge>
              <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{count}</span>
            </div>
          )
        })}
      </div>

      <DataTable
        columns={columns}
        data={data}
        title="Audit Log Records"
        subtitle="Filter by user, action, or date range"
        emptyMsg="No audit log entries found."
      />
    </div>
  )
}
