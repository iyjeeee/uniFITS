// EditProject.tsx — Edit an existing project; includes photo upload drag zone
import { useState, useRef } from 'react'
import type { ChangeEvent } from 'react'
import { Button, Card, Input, PageHeader, SectionDivider, Select, Textarea, ResponseModal } from '../../components/ui'
import { MOCK_PROJECTS } from '../../api/mockData'
import { useOrg } from '../../context/OrgContext'
import type { Project, NavigateFn, RecordPageProps } from '../../types'
import RecordNotFound from '../../components/RecordNotFound'

// Edit form — target_funding stays string|number: stored value is a number, the input yields strings
interface ProjectForm { title: string; project_type: string; description: string; start_date: string; end_date: string; location: string; target_funding: string | number; status: string }

const STATUS_OPTIONS = [
  { value: 'upcoming', label: 'Upcoming' }, { value: 'ongoing',   label: 'Ongoing'   },
  { value: 'completed', label: 'Completed'}, { value: 'cancelled', label: 'Cancelled' },
]
const PROJECT_TYPE_OPTIONS = [
  { value: 'Community Service', label: 'Community Service' },
  { value: 'Medical Mission',   label: 'Medical Mission'   },
  { value: 'Livelihood',        label: 'Livelihood'        },
  { value: 'Education',         label: 'Education'         },
  { value: 'Environmental',     label: 'Environmental'     },
  { value: 'Other',             label: 'Other'             },
]

function EditProjectForm({ proj, navigate }: { proj: Project; navigate?: NavigateFn }) {
  const org = useOrg()

  const [form, setForm] = useState<ProjectForm>({
    title: proj.title, project_type: proj.project_type || '', description: proj.description || '',
    start_date: proj.start_date, end_date: proj.end_date || '', location: proj.location || '',
    target_funding: proj.target_funding, status: proj.status,
  })
  const [photo, setPhoto]   = useState<string | null>(proj.photo_url || null)
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
        <PageHeader title={`Edit ${org.project_label}`} subtitle={`Editing: ${proj.title}`} />
        <div style={{ display: 'flex', gap: 10 }}>
          <Button variant="ghost" onClick={() => navigate?.('/projects')}>Cancel</Button>
          <Button variant="primary" onClick={handleSave}>Save {org.project_label}</Button>
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

      {/* ── Project Information ────────────────────────────────── */}
      <Card style={{ padding: 28 }}>
        <SectionDivider label="Project Information" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Input label="Project Title" value={form.title} onChange={set('title')} required />
          <Select label="Project Type" value={form.project_type} onChange={set('project_type')} options={PROJECT_TYPE_OPTIONS} />
          <Textarea label="Description" value={form.description} onChange={set('description')} rows={3} />
          <Input label="Location" value={form.location} onChange={set('location')} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Input label="Start Date" type="date" value={form.start_date} onChange={set('start_date')} />
            <Input label="End Date"   type="date" value={form.end_date}   onChange={set('end_date')} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Select label="Status" value={form.status} onChange={set('status')} options={STATUS_OPTIONS} />
            <Input label={`Target Funding (${org.currency_symbol})`} type="number" value={form.target_funding} onChange={set('target_funding')} />
          </div>
        </div>
      </Card>
    </div>
    <ResponseModal open={feedback} onClose={() => { setFeedback(false); navigate?.('/projects') }}
      variant="success" title="Changes Saved!" message="The project has been successfully updated." confirmLabel="Done" />
    </>
  )
}

// Page entry — resolves the record from ?id=; unknown/missing id shows not-found instead of record 1 (B-01)
export default function EditProject({ id, navigate }: RecordPageProps) {
  const org  = useOrg()
  const proj = MOCK_PROJECTS.find((p) => p.id === id)
  return proj ? <EditProjectForm proj={proj} navigate={navigate} /> : <RecordNotFound label={org.project_label} backPath="/projects" navigate={navigate} />
}
