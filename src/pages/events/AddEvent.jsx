// AddEvent.jsx — 5-step wizard to create a new event
import { useState } from 'react'
import { Card, Button, Input, Select, Textarea, StepWizard, PageHeader, SectionDivider } from '../../components/ui'
import { useOrg } from '../../context/OrgContext'

const STEPS = ['Event Info', 'Date & Time', 'Location & Status', 'Funding', 'Review']
const STATUS_OPTIONS = [{ value: 'upcoming', label: 'Upcoming' },{ value: 'ongoing', label: 'Ongoing' },{ value: 'completed', label: 'Completed' }]

export default function AddEvent() {
  const org  = useOrg()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({ title: '', description: '', event_date: '', event_time: '', location: '', status: 'upcoming', target_funding: '' })
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <PageHeader title={`Add ${org.event_label}`} subtitle={`Register a new ${org.event_label.toLowerCase()} for your organization`} />
      <StepWizard steps={STEPS} current={step} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: 20, alignItems: 'flex-start' }}>
        <Card style={{ padding: 28 }}>
          {step === 0 && <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <SectionDivider label="Event Information" />
            <Input label="Event Name" value={form.title} onChange={set('title')} placeholder="e.g. Annual Gala Night" required />
            <Textarea label="Description" value={form.description} onChange={set('description')} placeholder="Describe the event…" rows={4} />
          </div>}
          {step === 1 && <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <SectionDivider label="Date & Time" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <Input label="Event Date" type="date" value={form.event_date} onChange={set('event_date')} required />
              <Input label="Start Time" type="time" value={form.event_time} onChange={set('event_time')} />
            </div>
          </div>}
          {step === 2 && <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <SectionDivider label="Location & Status" />
            <Input label="Location / Venue" value={form.location} onChange={set('location')} placeholder="e.g. Grand Ballroom, Manila Hotel" />
            <Select label="Status" value={form.status} onChange={set('status')} options={STATUS_OPTIONS} />
          </div>}
          {step === 3 && <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <SectionDivider label="Funding" />
            <Input label="Target Funding (₱)" type="number" value={form.target_funding} onChange={set('target_funding')} placeholder="0.00" hint="Leave as 0 if no funding target" />
          </div>}
          {step === 4 && <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <SectionDivider label="Review" />
            {[['Event Name', form.title], ['Date', form.event_date], ['Time', form.event_time], ['Location', form.location], ['Status', form.status], ['Target Funding', form.target_funding ? `₱${form.target_funding}` : '—']].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', gap: 16, padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: 13.5 }}>
                <div style={{ width: 140, color: 'var(--text-muted)', flexShrink: 0 }}>{k}</div>
                <div style={{ fontWeight: 500 }}>{v || '—'}</div>
              </div>
            ))}
          </div>}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
            <Button variant="secondary" onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}>← Back</Button>
            {step < STEPS.length - 1
              ? <Button onClick={() => setStep(s => s + 1)}>Continue →</Button>
              : <Button variant="success" onClick={() => alert('Event created!')}>✓ Create {org.event_label}</Button>
            }
          </div>
        </Card>
        <Card style={{ padding: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 14 }}>Live Preview</div>
          {[['Name', form.title], ['Date', form.event_date], ['Time', form.event_time], ['Location', form.location], ['Status', form.status], ['Target', form.target_funding ? `₱${form.target_funding}` : '—']].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid var(--border)', fontSize: 12.5 }}>
              <span style={{ color: 'var(--text-muted)' }}>{k}</span>
              <span style={{ color: v ? 'var(--text-primary)' : 'var(--border)', fontWeight: v ? 500 : 400 }}>{v || '—'}</span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  )
}
