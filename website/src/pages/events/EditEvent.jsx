// EditEvent.jsx — Edit an existing event
import { useState } from 'react'
import { Card, PageHeader, Button, Input, Select, Textarea, SectionDivider } from '../../components/ui'
import { MOCK_EVENTS } from '../../api/mockData'
import { useOrg } from '../../context/OrgContext'

const STATUS_OPTIONS = [{ value: 'upcoming', label: 'Upcoming' },{ value: 'ongoing', label: 'Ongoing' },{ value: 'completed', label: 'Completed' },{ value: 'cancelled', label: 'Cancelled' }]

export default function EditEvent({ eventId = '1' }) {
  const org   = useOrg()
  const event = MOCK_EVENTS.find(e => e.id === eventId) || MOCK_EVENTS[0]
  const [form, setForm] = useState({ title: event.title, description: event.description || '', event_date: event.event_date, event_time: event.event_time || '', location: event.location || '', status: event.status, target_funding: event.target_funding })
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <PageHeader title="Edit Event" subtitle={event.title} actions={
        <><Button variant="secondary">Cancel</Button><Button onClick={() => alert('Saved!')}>Save Changes</Button></>
      } />
      <Card style={{ padding: 28 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <SectionDivider label="Event Information" />
          <Input label="Event Name" value={form.title} onChange={set('title')} required />
          <Textarea label="Description" value={form.description} onChange={set('description')} rows={3} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Input label="Date" type="date" value={form.event_date} onChange={set('event_date')} />
            <Input label="Time" type="time" value={form.event_time} onChange={set('event_time')} />
          </div>
          <Input label="Location" value={form.location} onChange={set('location')} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Select label="Status" value={form.status} onChange={set('status')} options={STATUS_OPTIONS} />
            <Input label="Target Funding (₱)" type="number" value={form.target_funding} onChange={set('target_funding')} />
          </div>
        </div>
      </Card>
    </div>
  )
}
