// parts/NewAnnouncementModal.tsx — Compose and post a new announcement
import type { Dispatch, SetStateAction } from 'react'
import { Button, Input, Textarea, InfoModal } from '../../../components/ui'
import type { AnnouncementForm } from './types'

export default function NewAnnouncementModal({ open, onClose, form, setForm, onPost }: { open: boolean; onClose: () => void; form: AnnouncementForm; setForm: Dispatch<SetStateAction<AnnouncementForm>>; onPost: () => void }) {
  return (
    <InfoModal open={open} onClose={onClose}
      title="New Announcement"
      subtitle="Post an update visible to all members"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Close</Button>
          <Button onClick={onPost}>Post Announcement</Button>
        </>
      }>
      <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
        <Input label="Title" value={form.title} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Announcement title" required />
        <Textarea label="Content" value={form.content} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setForm(f => ({ ...f, content: e.target.value }))} placeholder="Write your announcement here…" rows={6} required />
        <label style={{ display:'flex', alignItems:'center', gap:10, fontSize:13.5, cursor:'pointer' }}>
          <input type="checkbox" checked={form.is_pinned} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setForm(f => ({ ...f, is_pinned: (e.target as HTMLInputElement).checked }))} style={{ accentColor:'var(--accent)', width:15, height:15 }} />
          Pin this announcement to the top
        </label>
      </div>
    </InfoModal>
  )
}
