// Projects.jsx — Master list of all projects with status filtering and funding progress
import { useState } from 'react'
import { DataTable, Button, StatusBadge, Badge } from '../../components/ui'
import { MOCK_PROJECTS, formatCurrency, formatDate } from '../../api/mockData'
import { useOrg } from '../../context/OrgContext'

export default function Projects() {
  const org    = useOrg()
  const [data] = useState(MOCK_PROJECTS)

  const columns = [
    { label: 'Title',           key: 'title',  render: r => <span style={{ fontWeight: 600, fontSize: 13.5 }}>{r.title}</span> },
    { label: 'Type',            accessor: 'project_type', render: r => <Badge variant="neutral">{r.project_type || '—'}</Badge> },
    { label: 'Target Funding',  key: 'tf',     render: r => <span style={{ fontSize: 13 }}>{formatCurrency(r.target_funding)}</span> },
    { label: 'Current Funding', key: 'cf',     render: r => (
        <div>
          <div style={{ fontWeight: 600, fontSize: 13, color: r.current_funding >= r.target_funding ? 'var(--success)' : 'var(--text-primary)' }}>
            {formatCurrency(r.current_funding)}
          </div>
          {r.target_funding > 0 && (
            <div style={{ marginTop: 4, height: 4, width: 72, background: 'var(--border)', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ height: '100%', background: 'var(--success)', width: `${Math.min(100, (r.current_funding / r.target_funding) * 100)}%`, borderRadius: 4 }} />
            </div>
          )}
        </div>
      )},
    { label: 'Start Date', key: 'start', render: r => <span style={{ fontSize: 13 }}>{formatDate(r.start_date)}</span> },
    { label: 'End Date',   key: 'end',   render: r => <span style={{ fontSize: 13 }}>{formatDate(r.end_date)}</span> },
    { label: 'Status',     key: 'st',    render: r => <StatusBadge status={r.status} /> },
    { label: 'Actions',    key: 'act',   render: r => (
        <div style={{ display: 'flex', gap: 6 }}>
          <Button variant="secondary" size="sm">View</Button>
          <Button variant="secondary" size="sm">Edit</Button>
          <Button variant="danger"    size="sm">Delete</Button>
        </div>
      )},
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 4 }}>
        <Button>+ Add {org.project_label}</Button>
      </div>
      <DataTable
        columns={columns}
        data={data}
        title={`${org.project_label} Data Table`}
        emptyMsg={`No ${org.project_label.toLowerCase()}s found.`}
      />
    </div>
  )
}
