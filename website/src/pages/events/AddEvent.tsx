// AddEvent.jsx — 3-col layout: StepWizard sidebar | Form | Preview
// Validation: per-step validation blocks Continue; shows inline field errors
import { useState } from 'react'
import { Button, Card, Input, SectionDivider, Select, Textarea, ResponseModal } from '../../components/ui'
import { useOrg } from '../../context/OrgContext'
import useBreakpoint from '../../hooks/useBreakpoint'
import { fmt12 } from '../../api/mockData'
import { required, isPositiveNumber, validateStep } from '../../utils/validation'
import { StepSidebar, FieldError, StepBanner } from '../../components/FormWizard'
import { EVENT_TYPE_SELECT_OPTIONS } from '../../constants/eventTypes'

const STEPS = ['Event Info', 'Date & Time', 'Location & Status', 'Funding', 'Review']
const STATUS_OPTIONS = [
  { value: 'upcoming',  label: 'Upcoming'  },
  { value: 'ongoing',   label: 'Ongoing'   },
  { value: 'completed', label: 'Completed' },
]

/* ══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════════ */
export default function AddEvent() {
  const org = useOrg()
  const { isMobile } = useBreakpoint()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<Record<string, string>>({
    title: '', event_type: '', description: '', event_date: '', event_time: '',
    location: '', status: 'upcoming', target_funding: '', photo_url: '',
  })
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)  // preview URL for uploaded photo
  const [errors, setErrors] = useState<Record<string,string>>({})
  const [feedback, setFeedback] = useState(false)  // success confirmation modal visibility
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => { setForm((f) => ({ ...f, [k]: e.target.value })); clearErr(k) }
  const clearErr = (k: string) => setErrors(p => { const n = { ...p }; delete n[k]; return n })

  // stepValidators — rules per step index
  const stepValidators = [
    // Step 0 — Event Info
    () => validateStep({ title: [() => required(form.title, 'Event Name')], event_type: [() => required(form.event_type, 'Event Type')] }),
    // Step 1 — Date & Time
    () => validateStep({ event_date: [() => required(form.event_date, 'Event Date')] }),
    // Step 2 — Location & Status (all optional)
    () => ({}),
    // Step 3 — Funding (optional but must be non-negative if provided)
    () => validateStep({
      target_funding: [() => isPositiveNumber(form.target_funding, 'Target Funding')],
    }),
  ]

  function handleContinue() {
    if (step >= STEPS.length - 1) return
    const errs = stepValidators[step] ? stepValidators[step]() : {}
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setStep(s => s + 1)
  }

  return (
    <>
    <div style={{ display: 'grid' as const, gridTemplateColumns: isMobile ? '1fr' : '200px 1fr 240px', gap: 14, alignItems: 'stretch' }}>

      {/* LEFT — Step sidebar */}
      <Card style={{ padding: '18px 14px' }}>
        <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' as const, letterSpacing: '.07em', marginBottom: 12 }}>Steps</div>
        <StepSidebar steps={STEPS} current={step} />
      </Card>

      {/* MIDDLE — Form */}
      <Card style={{ padding: 24 }}>
        <StepBanner errors={errors} />

        {/* Step 0 — Event Information */}
        {step === 0 && <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 16 }}>
          <SectionDivider label="Event Information" />
          <div>
            <Input label="Event Name" value={form.title} onChange={set('title')} placeholder="e.g. Annual Gala Night" required error={errors.title} />
            <FieldError msg={errors.title} />
          </div>
          <div>
            <Select label="Event Type" value={form.event_type} onChange={set('event_type')} options={EVENT_TYPE_SELECT_OPTIONS} placeholder="Select type" required error={errors.event_type} />
            <FieldError msg={errors.event_type} />
          </div>
          <Textarea label="Description" value={form.description} onChange={set('description')} placeholder="Describe the event…" rows={5} />
          {/* Photo upload — optional; preview shown immediately */}
          <div>
            <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' as const, letterSpacing: '.04em', display: 'block' as const, marginBottom: 8 }}>Event Photo (optional)</label>
            <div style={{ display: 'flex' as const, gap: 14, alignItems: 'center' }}>
              <div style={{ width: 72, height: 72, borderRadius: 10, background: '#2E7D52', overflow: 'hidden', flexShrink: 0, display: 'flex' as const, alignItems: 'center', justifyContent: 'center' }}>
                {photoPreview
                  ? <img src={photoPreview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' as const }} />
                  : <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.7)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                }
              </div>
              <div>
                <label style={{ display: 'inline-flex' as const, padding: '7px 16px', borderRadius: 8, background: 'var(--accent)', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' as const }}>
                  Upload Photo
                  <input type="file" accept="image/*" style={{ display: 'none' as const }} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
                    const file = (e.target as HTMLInputElement).files?.[0]
                    if (file) {
                      // Validate file size — max 5 MB
                      if (file.size > 5 * 1024 * 1024) {
                        setErrors(p => ({ ...p, photo: 'Photo must be under 5 MB.' }))
                        return
                      }
                      clearErr('photo')
                      setPhotoPreview(URL.createObjectURL(file))
                    }
                  }} />
                </label>
                <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 5 }}>PNG, JPG or WebP · Max 5 MB</div>
                {errors.photo && <FieldError msg={errors.photo} />}
                {photoPreview && <button onClick={() => setPhotoPreview(null)} style={{ fontSize: 11.5, color: 'var(--danger)', background: 'none', border: 'none', cursor: 'pointer' as const, padding: 0, marginTop: 4 }}>Remove photo</button>}
              </div>
            </div>
          </div>
        </div>}

        {/* Step 1 — Date & Time */}
        {step === 1 && <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 16 }}>
          <SectionDivider label="Date & Time" />
          <div>
            <Input label="Event Date" type="date" value={form.event_date} onChange={set('event_date')} required error={errors.event_date} />
            <FieldError msg={errors.event_date} />
          </div>
          <Input label="Start Time" type="time" value={form.event_time} onChange={set('event_time')} />
        </div>}

        {/* Step 2 — Location & Status */}
        {step === 2 && <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 16 }}>
          <SectionDivider label="Location & Status" />
          <Input label="Location / Venue" value={form.location} onChange={set('location')} placeholder="e.g. Grand Ballroom, Manila Hotel" />
          <Select label="Status" value={form.status} onChange={set('status')} options={STATUS_OPTIONS} />
        </div>}

        {/* Step 3 — Funding */}
        {step === 3 && <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 16 }}>
          <SectionDivider label="Funding" />
          <div>
            <Input label={`Target Funding (${org.currency_symbol})`} type="number" value={form.target_funding} onChange={set('target_funding')} placeholder="0.00" hint="Leave as 0 if no funding target" error={errors.target_funding} />
            <FieldError msg={errors.target_funding} />
          </div>
        </div>}

        {/* Step 4 — Review */}
        {step === 4 && <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 10 }}>
          <SectionDivider label="Review" />
          {[
            ['Event Name', form.title],
            ['Type',       form.event_type],
            ['Date',       form.event_date],
            ['Time',       form.event_time ? fmt12(form.event_time) : '—'],
            ['Location',   form.location],
            ['Status',     form.status],
            ['Target Funding', form.target_funding ? `${org.currency_symbol}${form.target_funding}` : '—'],
          ].map(([k, v]) => (
            <div key={k} style={{ display: 'flex' as const, gap: 16, padding: '9px 0', borderBottom: '1px solid var(--border-inner)', fontSize: 13.5 }}>
              <div style={{ width: 140, color: 'var(--text-muted)', flexShrink: 0 }}>{k}</div>
              <div style={{ fontWeight: 500 }}>{v || '—'}</div>
            </div>
          ))}
        </div>}

        {/* Navigation */}
        <div style={{ display: 'flex' as const, justifyContent: 'space-between', marginTop: 24 }}>
          <Button variant="secondary" onClick={() => { setErrors({}); setStep(s => Math.max(0, s - 1)) }} disabled={step === 0}>← Back</Button>
          {step < STEPS.length - 1
            ? <Button onClick={handleContinue}>Continue →</Button>
            : <Button variant="success" onClick={() => setFeedback(true)}>✓ Create {org.event_label}</Button>
          }
        </div>
      </Card>

      {/* RIGHT — Live preview */}
      <Card style={{ padding: 18 }}>
        <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' as const, letterSpacing: '.07em', marginBottom: 14 }}>Live Preview</div>
        <div style={{ height: 6, background: '#2E7D52', borderRadius: 3, marginBottom: 12 }} />
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, color: 'var(--text-primary)' }}>{form.title || '—'}</div>
        {[['Type', form.event_type], ['Date', form.event_date], ['Time', form.event_time ? fmt12(form.event_time) : '—'], ['Location', form.location], ['Status', form.status], ['Target', form.target_funding ? `${org.currency_symbol}${form.target_funding}` : '—']].map(([k, v]) => (
          <div key={k} style={{ display: 'flex' as const, justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-inner)', fontSize: 12.5 }}>
            <span style={{ color: 'var(--text-muted)' }}>{k}</span>
            <span style={{ color: v ? 'var(--text-primary)' : 'var(--border-card)', fontWeight: v ? 500 : 400 }}>{v || '—'}</span>
          </div>
        ))}
      </Card>
    </div>
    <ResponseModal open={feedback} onClose={() => { setFeedback(false); window.location.hash = '/events' }}
      variant="success" title={`${org.event_label} Created!`} message="The event has been successfully created." confirmLabel="Go to Events" />
    </>
  )
}
