// Attendance.jsx — View and manage all attendance records; add new records
import { useState } from 'react'
import { DataTable, Button, StatusBadge, Badge, Modal, Select, PageHeader, StepWizard } from '../../components/ui'
import { MOCK_ATTENDANCES, MOCK_PROJECTS, MOCK_EVENTS, MOCK_USERS, formatDate } from '../../api/mockData'
import { useOrg } from '../../context/OrgContext'

const STEPS    = ['Category', 'Activity', 'Mark Attendance', 'Review']
const STATUSES = [{ value: 'present', label: 'Present' },{ value: 'absent', label: 'Absent' },{ value: 'late', label: 'Late' },{ value: 'excused', label: 'Excused' }]

export default function Attendance() {
  const org    = useOrg()
  const [data] = useState(MOCK_ATTENDANCES)
  const [showModal, setShowModal] = useState(false)
  const [step, setStep]           = useState(0)
  const [form, setForm]           = useState({ category: '', activity_id: '', attendance: {} }) // attendance: {userId: status}

  const activityOptions = form.category === 'project'
    ? MOCK_PROJECTS.map(p => ({ value: p.id, label: p.title }))
    : MOCK_EVENTS.map(e => ({ value: e.id, label: e.title }))

  // Columns for the attendance table
  const columns = [
    { label: 'Member',        key: 'name',   render: r => <span style={{ fontWeight: 500 }}>{r.user_name}</span> },
    { label: 'Type',          key: 'type',   render: r => <Badge variant={r.activity_type === 'event' ? 'success' : 'accent'}>{r.activity_type}</Badge> },
    { label: 'Activity',      accessor: 'activity' },
    { label: 'Date',          key: 'date',   render: r => formatDate(r.attendance_date) },
    { label: 'Status',        key: 'status', render: r => <StatusBadge status={r.status} /> },
    { label: 'Remarks',       key: 'remarks',render: r => r.remarks || <span style={{ color: 'var(--text-muted)' }}>—</span> },
    { label: 'Recorded By',   accessor: 'recorded_by' },
    { label: 'Actions',       key: 'actions',render: r => (
      <div style={{ display: 'flex', gap: 6 }}>
        <Button variant="secondary" size="sm">Edit</Button>
        <Button variant="danger"    size="sm">Delete</Button>
      </div>
    )},
  ]

  function resetModal() { setStep(0); setForm({ category: '', activity_id: '', attendance: {} }); setShowModal(false) }

  // Submission — would POST to attendances table on backend
  function handleSubmit() { alert(`Attendance recorded! (Connect to backend)`); resetModal() }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <PageHeader
        title={`${org.attendance_label} Records`}
        subtitle="Track and manage member participation in projects and events"
        actions={<Button onClick={() => setShowModal(true)}>+ Add {org.attendance_label}</Button>}
      />

      <DataTable
        columns={columns}
        data={data}
        title={`${org.attendance_label} Data Table`}
        subtitle="Filter by category or activity"
        emptyMsg="No attendance records found."
      />

      {/* Add Attendance Wizard Modal */}
      <Modal open={showModal} onClose={resetModal} title={`Add ${org.attendance_label}`} width={600}>
        <StepWizard steps={STEPS} current={step} />

        {step === 0 && (
          <div>
            <p style={{ fontSize: 13.5, color: 'var(--text-muted)', marginBottom: 16 }}>Select the attendance category below.</p>
            <div style={{ display: 'flex', gap: 12 }}>
              {['project','event'].map(cat => (
                <button key={cat} onClick={() => setForm(f => ({ ...f, category: cat }))} style={{
                  flex: 1, padding: '16px', borderRadius: 10, cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600,
                  border: `2px solid ${form.category === cat ? 'var(--accent)' : 'var(--border)'}`,
                  background: form.category === cat ? 'var(--accent-light)' : 'var(--white)',
                  color: form.category === cat ? 'var(--accent)' : 'var(--text-primary)',
                }}>
                  {cat === 'project' ? `📋 ${org.project_label}` : `🗓 ${org.event_label}`}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <Select label="Select Activity" value={form.activity_id} onChange={e => setForm(f => ({ ...f, activity_id: e.target.value }))} options={activityOptions} placeholder="-- Choose an activity --" required />
        )}

        {step === 2 && (
          <div>
            <p style={{ fontSize: 13.5, color: 'var(--text-muted)', marginBottom: 14 }}>Mark attendance status for each member.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {MOCK_USERS.map(u => (
                <div key={u.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--neutral-light)', borderRadius: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 500 }}>{u.full_name}</span>
                  <Select
                    value={form.attendance[u.id] || 'present'}
                    onChange={e => setForm(f => ({ ...f, attendance: { ...f.attendance, [u.id]: e.target.value } }))}
                    options={STATUSES}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <p style={{ fontSize: 13.5, color: 'var(--text-muted)', margin: '0 0 12px' }}>Review and confirm attendance below.</p>
            {[['Category', form.category], ['Activity ID', form.activity_id], ['Members Marked', Object.keys(form.attendance).length]].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', gap: 16, padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: 13.5 }}>
                <div style={{ width: 160, color: 'var(--text-muted)' }}>{k}</div>
                <div style={{ fontWeight: 500 }}>{v || '—'}</div>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
          <Button variant="secondary" onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}>← Back</Button>
          {step < STEPS.length - 1
            ? <Button onClick={() => setStep(s => s + 1)} disabled={step === 0 && !form.category}>Continue →</Button>
            : <Button variant="success" onClick={handleSubmit}>✓ Submit Attendance</Button>
          }
        </div>
      </Modal>
    </div>
  )
}
