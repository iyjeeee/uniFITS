// AddEvent.jsx — 3-col layout: StepWizard sidebar | Form | Preview; no page title header
import { useState } from 'react'
import { Card, Button, Input, Select, Textarea, SectionDivider } from '../../components/ui'
import { useOrg } from '../../context/OrgContext'
import useBreakpoint from '../../hooks/useBreakpoint'
import { fmt12 } from '../../api/mockData'

const STEPS = ['Event Info', 'Date & Time', 'Location & Status', 'Funding', 'Review']
const STATUS_OPTIONS = [{ value: 'upcoming', label: 'Upcoming' },{ value: 'ongoing', label: 'Ongoing' },{ value: 'completed', label: 'Completed' }]

function StepSidebar({ steps, current }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {steps.map((label, i) => {
        const done   = i < current
        const active = i === current
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

export default function AddEvent() {
  const org = useOrg()
  const { isMobile } = useBreakpoint()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({ title: '', description: '', event_date: '', event_time: '', location: '', status: 'upcoming', target_funding: '', photo_url: '' })
  const [photoPreview, setPhotoPreview] = useState(null)  /* preview URL for uploaded photo */
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  return (
    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '200px 1fr 240px', gap: 14, alignItems: 'stretch' }}>

      {/* LEFT — Step sidebar */}
      <Card style={{ padding: '18px 14px' }}>
        <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 12 }}>Steps</div>
        <StepSidebar steps={STEPS} current={step} />
      </Card>

      {/* MIDDLE — Form */}
      <Card style={{ padding: 24 }}>
        {step === 0 && <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <SectionDivider label="Event Information" />
          <Input label="Event Name" value={form.title} onChange={set('title')} placeholder="e.g. Annual Gala Night" required />
          <Textarea label="Description" value={form.description} onChange={set('description')} placeholder="Describe the event…" rows={5} />
          {/* Photo upload — uses file input; falls back to default illustration if none */}
          <div>
            <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '.04em', display: 'block', marginBottom: 8 }}>Event Photo (optional)</label>
            <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
              {/* Preview — default colored block if no photo */}
              <div style={{ width: 72, height: 72, borderRadius: 10, background: '#2E7D52', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {photoPreview
                  ? <img src={photoPreview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.7)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
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
          <SectionDivider label="Date & Time" />
          <Input label="Event Date" type="date" value={form.event_date} onChange={set('event_date')} required />
          <Input label="Start Time" type="time" value={form.event_time} onChange={set('event_time')} />
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
          {[['Event Name', form.title], ['Date', form.event_date], ['Time', form.event_time ? fmt12(form.event_time) : '—'], ['Location', form.location], ['Status', form.status], ['Target Funding', form.target_funding ? `₱${form.target_funding}` : '—']].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', gap: 16, padding: '9px 0', borderBottom: '1px solid var(--border-inner)', fontSize: 13.5 }}>
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

      {/* RIGHT — Live preview */}
      <Card style={{ padding: 18 }}>
        <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 14 }}>Live Preview</div>
        <div style={{ height: 6, background: '#2E7D52', borderRadius: 3, marginBottom: 12 }} />
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, color: 'var(--text-primary)' }}>{form.title || '—'}</div>
        {[['Date', form.event_date], ['Time', form.event_time ? fmt12(form.event_time) : '—'], ['Location', form.location], ['Status', form.status], ['Target', form.target_funding ? `₱${form.target_funding}` : '—']].map(([k, v]) => (
          <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-inner)', fontSize: 12.5 }}>
            <span style={{ color: 'var(--text-muted)' }}>{k}</span>
            <span style={{ color: v ? 'var(--text-primary)' : 'var(--border-card)', fontWeight: v ? 500 : 400 }}>{v || '—'}</span>
          </div>
        ))}
      </Card>
    </div>
  )
}
