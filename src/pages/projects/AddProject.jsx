// AddProject.jsx — 5-step wizard to create a new project
import { useState } from 'react'
import { Card, Button, Input, Select, Textarea, StepWizard, PageHeader, SectionDivider } from '../../components/ui'
import { useOrg } from '../../context/OrgContext'

const STEPS = ['Project Info', 'Schedule', 'Location', 'Funding', 'Review']
const TYPE_OPTIONS = [
  { value: 'Community Service', label: 'Community Service' },
  { value: 'Medical Mission',   label: 'Medical Mission'   },
  { value: 'Livelihood',        label: 'Livelihood'        },
  { value: 'Education',         label: 'Education'         },
  { value: 'Environmental',     label: 'Environmental'     },
  { value: 'Other',             label: 'Other'             },
]

export default function AddProject() {
  const org  = useOrg()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({ title: '', project_type: '', description: '', start_date: '', end_date: '', location: '', target_funding: '' })
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  function handleSubmit() { alert(`${org.project_label} created! (Connect to backend)`) }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <PageHeader title={`Add ${org.project_label}`} subtitle={`Create a new ${org.project_label.toLowerCase()} for your organization`} />
      <StepWizard steps={STEPS} current={step} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: 20, alignItems: 'flex-start' }}>
        <Card style={{ padding: 28 }}>
          {step === 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <SectionDivider label="Project Information" />
              <Input label="Project Name" value={form.title} onChange={set('title')} placeholder={`e.g. Medical Mission 2025`} required />
              <Select label="Project Type" value={form.project_type} onChange={set('project_type')} options={TYPE_OPTIONS} placeholder="Select type" required />
              <Textarea label="Description" value={form.description} onChange={set('description')} placeholder="Brief description of the project and its goals" rows={4} />
            </div>
          )}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <SectionDivider label="Schedule" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Input label="Start Date" type="date" value={form.start_date} onChange={set('start_date')} required />
                <Input label="End Date"   type="date" value={form.end_date}   onChange={set('end_date')} />
              </div>
            </div>
          )}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <SectionDivider label="Location" />
              <Input label="Location / Venue" value={form.location} onChange={set('location')} placeholder="e.g. Taal, Batangas" />
            </div>
          )}
          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <SectionDivider label="Funding" />
              <Input label="Target Funding (₱)" type="number" value={form.target_funding} onChange={set('target_funding')} placeholder="0.00" hint="Leave as 0 if no specific funding target" />
            </div>
          )}
          {step === 4 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <SectionDivider label="Review" />
              {[['Project Name', form.title], ['Type', form.project_type], ['Start Date', form.start_date], ['End Date', form.end_date], ['Location', form.location], ['Target Funding', form.target_funding ? `₱${form.target_funding}` : '—']].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', gap: 16, padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: 13.5 }}>
                  <div style={{ width: 140, color: 'var(--text-muted)', flexShrink: 0 }}>{k}</div>
                  <div style={{ fontWeight: 500 }}>{v || '—'}</div>
                </div>
              ))}
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
            <Button variant="secondary" onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}>← Back</Button>
            {step < STEPS.length - 1
              ? <Button onClick={() => setStep(s => s + 1)}>Continue →</Button>
              : <Button variant="success" onClick={handleSubmit}>✓ Create {org.project_label}</Button>
            }
          </div>
        </Card>

        {/* Live preview */}
        <Card style={{ padding: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 14 }}>Live Preview</div>
          {[['Project Name', form.title], ['Type', form.project_type], ['Start Date', form.start_date], ['Location', form.location], ['Target', form.target_funding ? `₱${form.target_funding}` : '—'], ['Status', 'Upcoming']].map(([k, v]) => (
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
