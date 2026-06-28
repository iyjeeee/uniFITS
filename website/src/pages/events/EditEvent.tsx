// EditEvent.tsx — Edit an existing event; includes photo upload drag zone
import { useState, useRef } from 'react'
import type { ChangeEvent } from 'react'
import { Button, Card, Input, PageHeader, SectionDivider, Select, Textarea } from '../../components/ui'
import { MOCK_EVENTS } from '../../api/mockData'
import { useOrg } from '../../context/OrgContext'

const STATUS_OPTIONS = [
  { value: 'upcoming', label: 'Upcoming' }, { value: 'ongoing',   label: 'Ongoing'   },
  { value: 'completed', label: 'Completed'}, { value: 'cancelled', label: 'Cancelled' },
]

export default function EditEvent({ eventId = '1', navigate }: Record<string, any>) {
  const org = useOrg()
  const event = MOCK_EVENTS.find((e: any) => e.id === eventId) || MOCK_EVENTS[0]

  const [form, setForm] = useState<Record<string,any>>({
    title: event.title, description: event.description || '',
    event_date: event.event_date, event_time: event.event_time || '',
    location: event.location || '', status: event.status,
    target_funding: event.target_funding,
  })
  const [photo, setPhoto]   = useState<string | null>((event as any).photo_url || null)
  const fileRef = useRef<HTMLInputElement | null>(null)
  const [dragging, setDrag] = useState(false)

  // set — curried field setter
  const set = (k: string) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f: Record<string,any>) => ({ ...f, [k]: e.target.value }))

  function handleFile(file: File | undefined) {
    if (!file) return
    const url = URL.createObjectURL(file)
    setPhoto(url)
  }

  function handleSave() {
    navigate?.('/events')
  }

  return (
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
        <input ref={fileRef as any} type="file" accept="image/*" style={{ display: 'none' }}
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
