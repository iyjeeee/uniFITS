// Employees.jsx — Main employees list with search, role filter, compact layout
import { useState } from 'react'
import { DataTable, Button, StatusBadge, Avatar, Badge } from '../../components/ui'
import { MOCK_USERS, formatDate } from '../../api/mockData'
import { useOrg } from '../../context/OrgContext'

// SVG icons for action buttons — no emoji
function IconUpload() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
}
function IconPlus() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
}

export default function Employees() {
  const org    = useOrg()
  const [data] = useState(MOCK_USERS)

  const columns = [
    { label: '#',       key: 'num',  render: (_, i) => <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>{i + 1}</span> },
    { label: 'Name',    key: 'name', render: r => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <Avatar name={r.full_name} size={30} src={r.photo_url} />
          <div>
            <div style={{ fontWeight: 600, fontSize: 13.5 }}>{r.full_name}</div>
            <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{r.employee_number}</div>
          </div>
        </div>
      )},
    { label: 'Role',    accessor: 'role',           render: r => <Badge variant="accent">{r.role}</Badge> },
    { label: 'Email',   accessor: 'email',           render: r => <a href={`mailto:${r.email}`} style={{ color: 'var(--accent)', fontSize: 13 }}>{r.email}</a> },
    { label: 'Contact', accessor: 'contact_number',  render: r => <span style={{ fontSize: 13 }}>{r.contact_number}</span> },
    { label: 'Dept.',   accessor: 'department',      render: r => <span style={{ fontSize: 13 }}>{r.department}</span> },
    { label: 'Joined',  key: 'joined',               render: r => <span style={{ fontSize: 13 }}>{formatDate(r.joined)}</span> },
    { label: 'Status',  key: 'status',               render: r => <StatusBadge status={r.status} /> },
    { label: 'Actions', key: 'actions',              render: r => (
        <div style={{ display: 'flex', gap: 6 }}>
          <Button variant="secondary" size="sm" onClick={() => {}}>View</Button>
          <Button variant="secondary" size="sm" onClick={() => {}}>Edit</Button>
        </div>
      )},
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginBottom: 4 }}>
        <Button variant="secondary" icon={<IconUpload />}>Import</Button>
        <Button onClick={() => {}} icon={<IconPlus />}>Add {org.people_label}</Button>
      </div>
      <DataTable
        columns={columns}
        data={data}
        title={`${org.people_label} Data Table`}
        subtitle="Filter, search or sort the list below"
        emptyMsg={`No ${org.people_label.toLowerCase()}s found.`}
      />
    </div>
  )
}
