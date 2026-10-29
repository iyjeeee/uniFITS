// components/EditItemModal.tsx — In-modal edit form for both Projects and Events
// kind prop switches between project and event field sets — no page redirect
import { useState, useEffect } from 'react'
import { EVENT_TYPE_SELECT_OPTIONS } from '../constants/eventTypes'
import type { ChangeEvent } from 'react'
import { InfoModal, Input, Select, Textarea, SectionDivider } from './ui'
import { modalAccentColor } from '../constants/tableColors'
import type { Project, AppEvent, OrgConfig } from '../types'

const STATUS_OPTIONS = [
  { value: 'upcoming',  label: 'Upcoming'  },
  { value: 'ongoing',   label: 'Ongoing'   },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
]
const PROJECT_TYPE_OPTIONS = [
  { value: 'Community Service', label: 'Community Service' },
  { value: 'Medical Mission',   label: 'Medical Mission'   },
  { value: 'Livelihood',        label: 'Livelihood'        },
  { value: 'Education',         label: 'Education'         },
  { value: 'Environmental',     label: 'Environmental'     },
  { value: 'Other',             label: 'Other'             },
]

// SaveBtn — accent-colored inline save button used in the footer
function SaveBtn({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button onClick={onClick}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 22px', borderRadius: 9, border: 'none', background: 'var(--accent)', color: '#fff', fontSize: 13.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'opacity .15s' }}
      onMouseEnter={e => { e.currentTarget.style.opacity = '.85' }}
      onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}>
      ✓ {label}
    </button>
  )
}

// EditItemModal accepts either a Project or AppEvent — kind prop narrows the form fields shown
interface EditItemModalProps<T extends Project | AppEvent> {
  open:    boolean
  onClose: () => void
  item:    T | null
  kind:    'project' | 'event'
  org:     OrgConfig
  onSave:  (updated: T) => void
}

// EditFormState — mutable working copy (all fields optional during editing)
type EditFormState = Partial<Project & AppEvent>

export default function EditItemModal<T extends Project | AppEvent>({ open, onClose, item, kind, org, onSave }: EditItemModalProps<T>) {
  const isProject = kind === 'project'
  const [form, setForm] = useState<EditFormState>({})

  // Sync form when item prop changes
  useEffect(() => { if (item) setForm({ ...item }) }, [item])

  if (!item) return null

  // set — curried field setter for all form inputs
  const set = (k: keyof EditFormState) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const accent = modalAccentColor(form.status ?? item.status)

  function handleSave() {
    onSave(form as T)
    onClose()
  }

  return (
    <InfoModal
      open={open}
      onClose={onClose}
      title={`Edit ${isProject ? org.project_label : org.event_label}`}
      subtitle={`Editing: ${item.title}`}
      accentColor={accent}
      footer={
        <div style={{ display: 'flex', gap: 10, justifyContent: 'space-between', width: '100%' }}>
          <SaveBtn onClick={handleSave} label={`Save ${isProject ? org.project_label : org.event_label}`} />
          <button onClick={onClose}
            style={{ padding: '10px 28px', borderRadius: 9, border: '1.5px solid var(--border-card)', background: 'var(--neutral-light)', color: 'var(--text-primary)', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
            Cancel
          </button>
        </div>
      }>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

        {/* ── Shared fields ──────────────────────────────────────── */}
        <div>
          <SectionDivider label="Basic Information" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 14 }}>
            <Input label="Title"            value={form.title       ?? ''} onChange={set('title')}    required />
            <Textarea label="Description"   value={form.description ?? ''} onChange={set('description')} rows={3} />
            <Input label="Location / Venue" value={form.location    ?? ''} onChange={set('location')} />
            <Select label="Status" value={form.status ?? 'upcoming'} onChange={set('status')} options={STATUS_OPTIONS} />
          </div>
        </div>

        {/* ── Project-specific fields ────────────────────────────── */}
        {isProject && (
          <div>
            <SectionDivider label="Project Details" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 14 }}>
              <Select label="Project Type" value={(form as Partial<Project>).project_type ?? ''} onChange={set('project_type')} options={PROJECT_TYPE_OPTIONS} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <Input label="Start Date" type="date" value={(form as Partial<Project>).start_date ?? ''} onChange={set('start_date')} />
                <Input label="End Date"   type="date" value={(form as Partial<Project>).end_date   ?? ''} onChange={set('end_date')} />
              </div>
              <Input label={`Target Funding (${org.currency_symbol})`} type="number" value={form.target_funding ?? ''} onChange={set('target_funding')} hint="0 = no target" />
            </div>
          </div>
        )}

        {/* ── Event-specific fields ──────────────────────────────── */}
        {!isProject && (
          <div>
            <SectionDivider label="Event Details" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 14 }}>
              <Select label="Event Type" value={(form as Partial<AppEvent>).event_type ?? ''} onChange={set('event_type')} options={EVENT_TYPE_SELECT_OPTIONS} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <Input label="Event Date" type="date" value={(form as Partial<AppEvent>).event_date ?? ''} onChange={set('event_date')} />
                <Input label="Start Time" type="time" value={(form as Partial<AppEvent>).event_time ?? ''} onChange={set('event_time')} />
              </div>
              <Input label={`Target Funding (${org.currency_symbol})`} type="number" value={form.target_funding ?? ''} onChange={set('target_funding')} hint="0 = no target" />
            </div>
          </div>
        )}
      </div>
    </InfoModal>
  )
}
