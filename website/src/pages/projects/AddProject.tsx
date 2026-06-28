// AddProject.jsx — 3-col layout: StepWizard sidebar | Form | Preview
// Validation: per-step validation blocks Continue; shows inline field errors
import { useState } from 'react'
import { Button, Card, Input, SectionDivider, Select, Textarea } from '../../components/ui'
import { useOrg } from '../../context/OrgContext'
import useBreakpoint from '../../hooks/useBreakpoint'
import { required, isPositiveNumber, isValidDateRange, validateStep } from '../../utils/validation'

const STEPS = ['Project Info', 'Schedule', 'Location', 'Funding', 'Review']
const TYPE_OPTIONS = [
  { value: 'Community Service', label: 'Community Service' },
  { value: 'Medical Mission',   label: 'Medical Mission'   },
  { value: 'Livelihood',        label: 'Livelihood'        },
  { value: 'Education',         label: 'Education'         },
  { value: 'Environmental',     label: 'Environmental'     },
  { value: 'Other',             label: 'Other'             },
]

/* ── StepSidebar ─────────────────────────────────────────────────── */
function StepSidebar({ steps, current }: Record<string, any>) {
  return (
    <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 4 }}>
      {steps.map((label: string, i: number) => {
        const done = i < current, active = i === current
        return (
          <div key={i} style={{ display: 'flex' as const, alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 9, background: active ? 'var(--accent-light)' : done ? 'var(--success-light)' : 'transparent', border: '1.5px solid ' + (active ? 'rgba(75,94,170,.3)' : done ? 'rgba(46,125,82,.2)' : 'var(--border-card)') }}>
            <div style={{ width: 26, height: 26, borderRadius: '50%', background: done ? '#2E7D52' : active ? 'var(--accent)' : 'var(--border-card)', color: done || active ? '#fff' : 'var(--text-muted)', display: 'flex' as const, alignItems: 'center', justifyContent: 'center', fontSize: 11.5, fontWeight: 700, flexShrink: 0 }}>
              {done ? '✓' : i + 1}
            </div>
            <span style={{ fontSize: 13, fontWeight: active ? 700 : done ? 600 : 400, color: active ? 'var(--accent)' : done ? 'var(--success)' : 'var(--text-muted)' }}>{label}</span>
          </div>
        )
      })}
    </div>
  )
}

/* ── FieldError — inline error message ───────────────────────────── */
function FieldError({ msg }: Record<string, any>) {
  if (!msg) return null
  return (
    <div style={{ display: 'flex' as const, alignItems: 'center', gap: 5, marginTop: 3, fontSize: 12, color: 'var(--danger)', fontWeight: 500 }} role="alert">
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      {msg}
    </div>
  )
}

/* ── StepBanner — error summary banner ───────────────────────────── */
function StepBanner({ errors }: Record<string, any>) {
  const msgs = Object.values(errors as Record<string,string>).filter(Boolean)
  if (!msgs.length) return null
  return (
    <div style={{ display: 'flex' as const, alignItems: 'flex-start', gap: 10, padding: '12px 14px', borderRadius: 9, background: '#fff5f5', border: '1.5px solid rgba(192,57,43,.3)', marginBottom: 16 }} role="alert">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--danger)', marginBottom: 4 }}>Please fix the following before continuing:</div>
        {msgs.map((m, i) => <div key={i} style={{ fontSize: 12.5, color: 'var(--danger)', lineHeight: 1.5 }}>• {m}</div>)}
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════════ */
export default function AddProject() {
  const org = useOrg()
  const { isMobile } = useBreakpoint()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<Record<string,any>>({
    title: '', project_type: '', description: '',
    start_date: '', end_date: '', location: '',
    target_funding: '', photo_url: '',
  })
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)  // preview URL for uploaded photo
  const [errors, setErrors] = useState<Record<string,string>>({})
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => { setForm((f: any) => ({ ...f, [k]: e.target.value })); clearErr(k) }
  const clearErr = (k: string) => setErrors(p => { const n = { ...p }; delete n[k]; return n })

  // stepValidators — rules per step index
  const stepValidators = [
    // Step 0 — Project Info
    () => validateStep({
      title:        [() => required(form.title, 'Project Name')],
      project_type: [() => required(form.project_type, 'Project Type')],
    }),
    // Step 1 — Schedule
    () => validateStep({
      start_date: [() => required(form.start_date, 'Start Date')],
      end_date:   [() => isValidDateRange(form.start_date, form.end_date)],
    }),
    // Step 2 — Location (optional)
    () => ({}),
    // Step 3 — Funding (optional but must be non-negative)
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
    <div style={{ display: 'grid' as const, gridTemplateColumns: isMobile ? '1fr' : '200px 1fr 240px', gap: 14, alignItems: 'stretch' }}>

      {/* LEFT — Step sidebar */}
      <Card style={{ padding: '18px 14px' }}>
        <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' as const, letterSpacing: '.07em', marginBottom: 12 }}>Steps</div>
        <StepSidebar steps={STEPS} current={step} />
      </Card>

      {/* MIDDLE — Form */}
      <Card style={{ padding: 24 }}>
        <StepBanner errors={errors} />

        {/* Step 0 — Project Information */}
        {step === 0 && <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 16 }}>
          <SectionDivider label="Project Information" />
          <div>
            <Input label="Project Name" value={form.title} onChange={set('title')} placeholder="e.g. Medical Mission 2025" required error={errors.title} />
            <FieldError msg={errors.title} />
          </div>
          <div>
            <Select label="Project Type" value={form.project_type} onChange={set('project_type')} options={TYPE_OPTIONS} placeholder="Select type" required error={errors.project_type} />
            <FieldError msg={errors.project_type} />
          </div>
          <Textarea label="Description" value={form.description} onChange={set('description')} placeholder="Brief description of the project…" rows={5} />
          {/* Photo upload — optional; preview shown immediately */}
          <div>
            <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' as const, letterSpacing: '.04em', display: 'block' as const, marginBottom: 8 }}>Project Photo (optional)</label>
            <div style={{ display: 'flex' as const, gap: 14, alignItems: 'center' }}>
              <div style={{ width: 72, height: 72, borderRadius: 10, background: '#4B5EAA', overflow: 'hidden', flexShrink: 0, display: 'flex' as const, alignItems: 'center', justifyContent: 'center' }}>
                {photoPreview
                  ? <img src={photoPreview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' as const }} />
                  : <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.7)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
                }
              </div>
              <div>
                <label style={{ display: 'inline-flex' as const, padding: '7px 16px', borderRadius: 8, background: 'var(--accent)', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' as const }}>
                  Upload Photo
                  <input type="file" accept="image/*" style={{ display: 'none' as const }} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
                    const file = (e.target as HTMLInputElement).files?.[0]
                    if (file) {
                      // Validate file size — max 5 MB
                      if (file.size > 5 * 1024 * 1024) { setErrors(p => ({ ...p, photo: 'Photo must be under 5 MB.' })); return }
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

        {/* Step 1 — Schedule */}
        {step === 1 && <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 16 }}>
          <SectionDivider label="Schedule" />
          <div>
            <Input label="Start Date" type="date" value={form.start_date} onChange={set('start_date')} required error={errors.start_date} />
            <FieldError msg={errors.start_date} />
          </div>
          <div>
            <Input label="End Date" type="date" value={form.end_date} onChange={set('end_date')} />
            <FieldError msg={errors.end_date} />
          </div>
        </div>}

        {/* Step 2 — Location */}
        {step === 2 && <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 16 }}>
          <SectionDivider label="Location" />
          <Input label="Location / Venue" value={form.location} onChange={set('location')} placeholder="e.g. Taal, Batangas" />
        </div>}

        {/* Step 3 — Funding */}
        {step === 3 && <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 16 }}>
          <SectionDivider label="Funding" />
          <div>
            <Input label="Target Funding (₱)" type="number" value={form.target_funding} onChange={set('target_funding')} placeholder="0.00" hint="Leave as 0 if no specific funding target" error={errors.target_funding} />
            <FieldError msg={errors.target_funding} />
          </div>
        </div>}

        {/* Step 4 — Review */}
        {step === 4 && <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 10 }}>
          <SectionDivider label="Review" />
          {[
            ['Project Name',    form.title],
            ['Type',           form.project_type],
            ['Start Date',     form.start_date],
            ['End Date',       form.end_date],
            ['Location',       form.location],
            ['Target Funding', form.target_funding ? `₱${form.target_funding}` : '—'],
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
            : <Button variant="success" onClick={() => alert('Project created!')}>✓ Create {org.project_label}</Button>
          }
        </div>
      </Card>

      {/* RIGHT — Live Preview */}
      <Card style={{ padding: 18 }}>
        <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' as const, letterSpacing: '.07em', marginBottom: 14 }}>Live Preview</div>
        <div style={{ height: 6, background: '#4B5EAA', borderRadius: 3, marginBottom: 12 }} />
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>{form.title || '—'}</div>
        {[['Type', form.project_type], ['Start', form.start_date], ['End', form.end_date], ['Location', form.location], ['Target', form.target_funding ? `₱${form.target_funding}` : '—'], ['Status', 'Upcoming']].map(([k, v]) => (
          <div key={k} style={{ display: 'flex' as const, justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-inner)', fontSize: 12.5 }}>
            <span style={{ color: 'var(--text-muted)' }}>{k}</span>
            <span style={{ color: v ? 'var(--text-primary)' : 'var(--border-card)', fontWeight: v ? 500 : 400 }}>{v || '—'}</span>
          </div>
        ))}
      </Card>
    </div>
  )
}
