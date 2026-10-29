// EditEvent.tsx — Edit an existing event; includes photo upload drag zone
import { useState, useRef } from 'react'
import type { ChangeEvent } from 'react'
import { Button, Card, Input, PageHeader, SectionDivider, Select, Textarea, ResponseModal } from '../../components/ui'
import { MOCK_EVENTS } from '../../api/mockData'
import { useOrg } from '../../context/OrgContext'
import { EVENT_TYPE_SELECT_OPTIONS } from '../../constants/eventTypes'
import type { AppEvent, NavigateFn, RecordPageProps } from '../../types'
import RecordNotFound from '../../components/RecordNotFound'

// Edit form — target_funding stays string|number: stored value is a number, the input yields strings
interface EventForm { title: string; event_type: string; description: string; event_date: string; event_time: string; location: string; status: string; target_funding: string | number }

const STATUS_OPTIONS = [
  { value: 'upcoming', label: 'Upcoming' }, { value: 'ongoing',   label: 'Ongoing'   },
  { value: 'completed', label: 'Completed'}, { value: 'cancelled', label: 'Cancelled' },
]

function EditEventForm({ event, navigate }: { event: AppEvent; navigate?: NavigateFn }) {
  const org = useOrg()

  const [form, setForm] = useState<EventForm>({
    title: event.title, event_type: event.event_type || '', description: event.description || '',
    event_date: event.event_date, event_time: event.event_time || '',
    location: event.location || '', status: event.status,
    target_funding: event.target_funding,
  })
  const [photo, setPhoto]   = useState<string | null>(event.photo_url || null)
  const fileRef = useRef<HTMLInputElement | null>(null)
  const [dragging, setDrag] = useState(false)
  const [feedback, setFeedback] = useState(false)  // success confirmation modal visibility

  // set — curried field setter
  const set = (k: string) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  function handleFile(file: File | undefined) {
    if (!file) return
    const url = URL.createObjectURL(file)
    setPhoto(url)
  }

  function handleSave() {
    setFeedback(true)
  }

  return (
    <>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 780 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
        <PageHeader title={`Edit ${org.event_label}`} subtitle={`Editing: ${event.title}`} />
        <div style={{ display: 'flex', gap: 10 }}>
          <Button variant="ghost" onClick={() => navigate?.('/events')}>Cancel</Button>
          <Button variant="primary" onClick={handleSave}>Save {org.event_label}</Button>
        </div>
      </div>

      {/* ── Photo Upload ───────────────────────────────────────── */}
      <Card style={{ padding: 28 }}>
        <SectionDivider label="Photo / Banner" />
        <div
          onClick={() => (fileRef.current as HTMLInputElement | null)?.click()}
          onDragOver={e => { e.preventDefault(); setDrag(true) }}
          onDragEnter={() => setDrag(true)}
          onDragLeave={() => setDrag(false)}
          onDrop={e => { e.preventDefault(); setDrag(false); const df = e.dataTransfer.files?.[0]; if (df) handleFile(df) }}
          style={{
            border: `2px dashed ${dragging ? 'var(--accent)' : 'var(--border-card)'}`,
            borderRadius: 10, padding: '22px 18px', textAlign: 'center' as const, cursor: 'pointer',
            background: dragging ? 'var(--accent-light)' : 'var(--neutral-light)',
            transition: 'border-color .18s, background .18s', marginBottom: 12,
          }}>
          {photo
            ? <img src={photo} alt="preview" style={{ maxHeight: 140, borderRadius: 8, objectFit: 'cover' }} />
            : (
              <>
                <div style={{ fontSize: 22, marginBottom: 6 }}>🖼️</div>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
                  Click to upload or drag &amp; drop
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>PNG, JPG, WEBP — max 5 MB</div>
              </>
            )
          }
        </div>
        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}
          onChange={(e: ChangeEvent<HTMLInputElement>) => handleFile(e.target.files?.[0])} />
        <div style={{ display: 'flex', gap: 8 }}>
          <Button size="sm" onClick={() => (fileRef.current as HTMLInputElement | null)?.click()}>Choose Photo</Button>
          {photo && <Button size="sm" variant="secondary" onClick={() => setPhoto(null)}>Remove</Button>}
        </div>
      </Card>

      {/* ── Event Information ──────────────────────────────────── */}
      <Card style={{ padding: 28 }}>
        <SectionDivider label="Event Information" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Input label="Event Name" value={form.title} onChange={set('title')} required />
          <Select label="Event Type" value={form.event_type} onChange={set('event_type')} options={EVENT_TYPE_SELECT_OPTIONS} />
          <Textarea label="Description" value={form.description} onChange={set('description')} rows={3} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Input label="Date" type="date" value={form.event_date} onChange={set('event_date')} />
            <Input label="Time" type="time" value={form.event_time} onChange={set('event_time')} />
          </div>
          <Input label="Location" value={form.location} onChange={set('location')} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Select label="Status" value={form.status} onChange={set('status')} options={STATUS_OPTIONS} />
            <Input label={`Target Funding (${org.currency_symbol})`} type="number" value={form.target_funding} onChange={set('target_funding')} />
          </div>
        </div>
      </Card>
    </div>
    <ResponseModal open={feedback} onClose={() => { setFeedback(false); navigate?.('/events') }}
      variant="success" title="Changes Saved!" message="The event has been successfully updated." confirmLabel="Done" />
    </>
  )
}

// Page entry — resolves the record from ?id=; unknown/missing id shows not-found instead of record 1 (B-01)
export default function EditEvent({ id, navigate }: RecordPageProps) {
  const org   = useOrg()
  const event = MOCK_EVENTS.find((e) => e.id === id)
  return event ? <EditEventForm event={event} navigate={navigate} /> : <RecordNotFound label={org.event_label} backPath="/events" navigate={navigate} />
}
