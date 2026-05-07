// EditProject.jsx — Edit an existing project's details; includes photo upload
import { useState, useRef } from 'react'
import { Card, PageHeader, Button, Input, Select, Textarea, SectionDivider } from '../../components/ui'
import { MOCK_PROJECTS } from '../../api/mockData'
import { useOrg } from '../../context/OrgContext'

const TYPE_OPTIONS = [
  { value: 'Community Service', label: 'Community Service' },{ value: 'Medical Mission', label: 'Medical Mission' },
  { value: 'Livelihood', label: 'Livelihood' },{ value: 'Education', label: 'Education' },{ value: 'Other', label: 'Other' },
]
const STATUS_OPTIONS = [
  { value: 'upcoming', label: 'Upcoming' },{ value: 'ongoing', label: 'Ongoing' },
  { value: 'completed', label: 'Completed' },{ value: 'cancelled', label: 'Cancelled' },
]

export default function EditProject({ projectId = '1' }) {
  const org  = useOrg()
  const proj = MOCK_PROJECTS.find(p => p.id === projectId) || MOCK_PROJECTS[0]
  const [form, setForm] = useState({
    title: proj.title, project_type: proj.project_type || '', description: proj.description || '',
    start_date: proj.start_date, end_date: proj.end_date || '', location: proj.location || '',
    target_funding: proj.target_funding, status: proj.status,
  })
  const [photo, setPhoto]   = useState(proj.photo_url || null)  // local object URL preview
  const [dragging, setDrag] = useState(false)
  const fileRef             = useRef()
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  // Handle file from input click or drag-and-drop
  function handleFile(file) {
    if (!file || !file.type.startsWith('image/')) return
    setPhoto(URL.createObjectURL(file))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <PageHeader title="Edit Project" subtitle={proj.title} actions={
        <><Button variant="secondary">Cancel</Button><Button onClick={() => alert('Saved!')}>Save Changes</Button></>
      } />

      {/* ── Photo Upload ──────────────────────────────────────── */}
      <Card style={{ padding: 24 }}>
        <SectionDivider label="Project Photo" />
        <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          {/* Thumbnail preview */}
          <div style={{
            width: 140, height: 140, borderRadius: 12, flexShrink: 0, overflow: 'hidden',
            background: 'var(--neutral-light)', border: '1.5px solid var(--border-card)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {photo
              ? <img src={photo} alt="Project" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/>
                  <path d="M21 15l-5-5L5 21"/>
                </svg>
            }
          </div>
          {/* Drop zone + buttons */}
          <div style={{ flex: 1, minWidth: 200 }}>
            <div
              onClick={() => fileRef.current.click()}
              onDragOver={e => { e.preventDefault(); setDrag(true) }}
              onDragLeave={() => setDrag(false)}
              onDrop={e => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files[0]) }}
              style={{
                border: `2px dashed ${dragging ? 'var(--accent)' : 'var(--border-card)'}`,
                borderRadius: 10, padding: '22px 18px', textAlign: 'center', cursor: 'pointer',
                background: dragging ? 'var(--accent-light)' : 'var(--neutral-light)',
                transition: 'border-color .18s, background .18s', marginBottom: 12,
              }}>
              <div style={{ fontSize: 22, marginBottom: 6 }}>🖼️</div>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
                Click to upload or drag &amp; drop
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>PNG, JPG, WEBP — max 5 MB</div>
            </div>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}
              onChange={e => handleFile(e.target.files[0])} />
            <div style={{ display: 'flex', gap: 8 }}>
              <Button size="sm" onClick={() => fileRef.current.click()}>Choose Photo</Button>
              {photo && <Button size="sm" variant="secondary" onClick={() => setPhoto(null)}>Remove</Button>}
            </div>
          </div>
        </div>
      </Card>

      {/* ── Project Information ───────────────────────────────── */}
      <Card style={{ padding: 28 }}>
        <SectionDivider label="Project Information" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Input label="Project Name" value={form.title} onChange={set('title')} required />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Select label="Type"   value={form.project_type} onChange={set('project_type')} options={TYPE_OPTIONS} />
            <Select label="Status" value={form.status}       onChange={set('status')}       options={STATUS_OPTIONS} />
          </div>
          <Textarea label="Description" value={form.description} onChange={set('description')} rows={4} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Input label="Start Date" type="date" value={form.start_date} onChange={set('start_date')} />
            <Input label="End Date"   type="date" value={form.end_date}   onChange={set('end_date')} />
          </div>
          <Input label="Location" value={form.location} onChange={set('location')} />
          <Input label="Target Funding (₱)" type="number" value={form.target_funding} onChange={set('target_funding')} />
        </div>
      </Card>
    </div>
  )
}
