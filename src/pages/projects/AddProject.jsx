// AddProject.jsx — 3-col layout: StepWizard sidebar | Form | Preview; no page title header
import { useState } from 'react'
import { Card, Button, Input, Select, Textarea, SectionDivider } from '../../components/ui'
import { useOrg } from '../../context/OrgContext'
import useBreakpoint from '../../hooks/useBreakpoint'

const STEPS = ['Project Info', 'Schedule', 'Location', 'Funding', 'Review']
const TYPE_OPTIONS = [
  { value: 'Community Service', label: 'Community Service' },
  { value: 'Medical Mission',   label: 'Medical Mission'   },
  { value: 'Livelihood',        label: 'Livelihood'        },
  { value: 'Education',         label: 'Education'         },
  { value: 'Environmental',     label: 'Environmental'     },
  { value: 'Other',             label: 'Other'             },
]

function StepSidebar({ steps, current }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {steps.map((label, i) => {
        const done = i < current, active = i === current
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 9, background: active ? 'var(--accent-light)' : done ? 'var(--success-light)' : 'transparent', border: '1.5px solid ' + (active ? 'rgba(75,94,170,.3)' : done ? 'rgba(46,125,82,.2)' : 'var(--border-card)') }}>
            <div style={{ width: 26, height: 26, borderRadius: '50%', background: done ? '#2E7D52' : active ? 'var(--accent)' : 'var(--border-card)', color: done || active ? '#fff' : 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11.5, fontWeight: 700, flexShrink: 0 }}>
              {done ? '✓' : i + 1}
            </div>
            <span style={{ fontSize: 13, fontWeight: active ? 700 : done ? 600 : 400, color: active ? 'var(--accent)' : done ? 'var(--success)' : 'var(--text-muted)' }}>{label}</span>
          </div>
        )
      })}
    </div>
  )
}

export default function AddProject() {
  const org = useOrg()
  const { isMobile } = useBreakpoint()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({ title: '', project_type: '', description: '', start_date: '', end_date: '', location: '', target_funding: '', photo_url: '' })
  const [photoPreview, setPhotoPreview] = useState(null)  /* preview URL for uploaded photo */
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  return (
    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '200px 1fr 240px', gap: 14, alignItems: 'stretch' }}>

      <Card style={{ padding: '18px 14px' }}>
        <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 12 }}>Steps</div>
        <StepSidebar steps={STEPS} current={step} />
      </Card>

      <Card style={{ padding: 24 }}>
        {step === 0 && <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <SectionDivider label="Project Information" />
          <Input label="Project Name" value={form.title} onChange={set('title')} placeholder="e.g. Medical Mission 2025" required />
          <Select label="Project Type" value={form.project_type} onChange={set('project_type')} options={TYPE_OPTIONS} placeholder="Select type" required />
          <Textarea label="Description" value={form.description} onChange={set('description')} placeholder="Brief description of the project…" rows={5} />
          {/* Photo upload — uses file input; falls back to default illustration if none */}
          <div>
            <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '.04em', display: 'block', marginBottom: 8 }}>Project Photo (optional)</label>
            <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
              <div style={{ width: 72, height: 72, borderRadius: 10, background: '#4B5EAA', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {photoPreview
                  ? <img src={photoPreview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.7)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
                }
              </div>
              <div>
                <label style={{ display: 'inline-flex', padding: '7px 16px', borderRadius: 8, background: 'var(--accent)', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                  Upload Photo
                  <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => {
                    const file = e.target.files[0]
                    if (file) setPhotoPreview(URL.createObjectURL(file))
                  }} />
                </label>
                <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 5 }}>PNG, JPG or WebP · Max 5 MB</div>
                {photoPreview && <button onClick={() => setPhotoPreview(null)} style={{ fontSize: 11.5, color: 'var(--danger)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginTop: 4 }}>Remove photo</button>}
              </div>
            </div>
          </div>
        </div>}
        {step === 1 && <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <SectionDivider label="Schedule" />
          <Input label="Start Date" type="date" value={form.start_date} onChange={set('start_date')} required />
          <Input label="End Date"   type="date" value={form.end_date}   onChange={set('end_date')} />
        </div>}
        {step === 2 && <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <SectionDivider label="Location" />
          <Input label="Location / Venue" value={form.location} onChange={set('location')} placeholder="e.g. Taal, Batangas" />
        </div>}
        {step === 3 && <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <SectionDivider label="Funding" />
          <Input label="Target Funding (₱)" type="number" value={form.target_funding} onChange={set('target_funding')} placeholder="0.00" hint="Leave as 0 if no specific funding target" />
        </div>}
        {step === 4 && <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <SectionDivider label="Review" />
          {[['Project Name',form.title],['Type',form.project_type],['Start Date',form.start_date],['End Date',form.end_date],['Location',form.location],['Target Funding',form.target_funding?`₱${form.target_funding}`:'—']].map(([k,v]) => (
            <div key={k} style={{ display: 'flex', gap: 16, padding: '9px 0', borderBottom: '1px solid var(--border-inner)', fontSize: 13.5 }}>
              <div style={{ width: 140, color: 'var(--text-muted)', flexShrink: 0 }}>{k}</div>
              <div style={{ fontWeight: 500 }}>{v||'—'}</div>
            </div>
          ))}
        </div>}

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
          <Button variant="secondary" onClick={() => setStep(s => Math.max(0, s-1))} disabled={step===0}>← Back</Button>
          {step < STEPS.length-1
            ? <Button onClick={() => setStep(s => s+1)}>Continue →</Button>
            : <Button variant="success" onClick={() => alert('Project created!')}>✓ Create {org.project_label}</Button>
          }
        </div>
      </Card>

      <Card style={{ padding: 18 }}>
        <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 14 }}>Live Preview</div>
        <div style={{ height: 6, background: '#4B5EAA', borderRadius: 3, marginBottom: 12 }} />
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>{form.title || '—'}</div>
        {[['Type',form.project_type],['Start',form.start_date],['End',form.end_date],['Location',form.location],['Target',form.target_funding?`₱${form.target_funding}`:'—'],['Status','Upcoming']].map(([k,v]) => (
          <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-inner)', fontSize: 12.5 }}>
            <span style={{ color: 'var(--text-muted)' }}>{k}</span>
            <span style={{ color: v ? 'var(--text-primary)' : 'var(--border-card)', fontWeight: v ? 500 : 400 }}>{v||'—'}</span>
          </div>
        ))}
      </Card>
    </div>
  )
}
