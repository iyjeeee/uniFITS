// EditProject.jsx — Edit an existing project's details
import { useState } from 'react'
import { Card, PageHeader, Button, Input, Select, Textarea, SectionDivider } from '../../components/ui'
import { MOCK_PROJECTS } from '../../api/mockData'
import { useOrg } from '../../context/OrgContext'

const TYPE_OPTIONS = [
  { value: 'Community Service', label: 'Community Service' },{ value: 'Medical Mission', label: 'Medical Mission' },
  { value: 'Livelihood', label: 'Livelihood' },{ value: 'Education', label: 'Education' },{ value: 'Other', label: 'Other' },
]
const STATUS_OPTIONS = [
  { value: 'upcoming', label: 'Upcoming' },{ value: 'ongoing', label: 'Ongoing' },
  { value: 'completed', label: 'Completed' },{ value: 'cancelled', label: 'Cancelled' },
]

export default function EditProject({ projectId = '1' }) {
  const org  = useOrg()
  const proj = MOCK_PROJECTS.find(p => p.id === projectId) || MOCK_PROJECTS[0]
  const [form, setForm] = useState({ title: proj.title, project_type: proj.project_type || '', description: proj.description || '', start_date: proj.start_date, end_date: proj.end_date || '', location: proj.location || '', target_funding: proj.target_funding, status: proj.status })
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <PageHeader title="Edit Project" subtitle={proj.title} actions={
        <><Button variant="secondary">Cancel</Button><Button onClick={() => alert('Saved!')}>Save Changes</Button></>
      } />
      <Card style={{ padding: 28 }}>
        <SectionDivider label="Project Information" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Input label="Project Name" value={form.title} onChange={set('title')} required />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Select label="Type" value={form.project_type} onChange={set('project_type')} options={TYPE_OPTIONS} />
            <Select label="Status" value={form.status} onChange={set('status')} options={STATUS_OPTIONS} />
          </div>
          <Textarea label="Description" value={form.description} onChange={set('description')} rows={4} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Input label="Start Date" type="date" value={form.start_date} onChange={set('start_date')} />
            <Input label="End Date"   type="date" value={form.end_date}   onChange={set('end_date')} />
          </div>
          <Input label="Location" value={form.location} onChange={set('location')} />
          <Input label="Target Funding (₱)" type="number" value={form.target_funding} onChange={set('target_funding')} />
        </div>
      </Card>
    </div>
  )
}
