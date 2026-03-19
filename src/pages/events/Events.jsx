// Events.jsx — Master list of all organization events with funding progress
import { useState } from 'react'
import { DataTable, Button, StatusBadge } from '../../components/ui'
import { MOCK_EVENTS, formatCurrency, formatDate } from '../../api/mockData'
import { useOrg } from '../../context/OrgContext'

export default function Events() {
  const org    = useOrg()
  const [data] = useState(MOCK_EVENTS)

  const columns = [
    { label: 'Title',           key: 'title',  render: r => <span style={{ fontWeight: 600, fontSize: 13.5 }}>{r.title}</span> },
    { label: 'Date',            key: 'date',   render: r => <span style={{ fontSize: 13 }}>{formatDate(r.event_date)}</span> },
    { label: 'Time',            accessor: 'event_time', render: r => <span style={{ fontSize: 13 }}>{r.event_time || '—'}</span> },
    { label: 'Location',        accessor: 'location',   render: r => <span style={{ fontSize: 13 }}>{r.location}</span> },
    { label: 'Target Funding',  key: 'tf',     render: r => (
        r.target_funding > 0
          ? <span style={{ fontSize: 13 }}>{formatCurrency(r.target_funding)}</span>
          : <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>Not Required</span>
      )},
    { label: 'Current Funding', key: 'cf',     render: r => (
        r.current_funding > 0
          ? <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--success)' }}>{formatCurrency(r.current_funding)}</span>
          : <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>—</span>
      )},
    { label: 'Status',  key: 'st',  render: r => <StatusBadge status={r.status} /> },
    { label: 'Actions', key: 'act', render: r => (
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
        <Button>+ Add {org.event_label}</Button>
      </div>
      <DataTable
        columns={columns}
        data={data}
        title={`${org.event_label} Data Table`}
        emptyMsg={`No ${org.event_label.toLowerCase()}s found.`}
      />
    </div>
  )
}
