// parts/EditProfileModal.tsx — Edit profile form modal
import { Avatar, Card, Button, Input, Select, InfoModal, SectionDivider } from '../../../components/ui'
import { GENDER_OPTIONS } from '../../../constants/profile'
import { IcoLock } from './ProfileIcons'
import type { User } from '../../../types'
import type { Dispatch, SetStateAction } from 'react'
import type { ProfileForm, FieldHandler } from './profileShared'

export default function EditProfileModal({ user, open, onClose, onSave, form, set, setForm }: { user: User; open: boolean; onClose: () => void; onSave: () => void; form: ProfileForm; set: FieldHandler; setForm: Dispatch<SetStateAction<ProfileForm>> }) {
  return (
    <InfoModal
      open={open}
      onClose={() => onClose()}
      title="Edit My Profile"
      subtitle="Update your personal information and account credentials"
      footer={
        <>
          <Button variant="secondary" onClick={() => onClose()}>Close</Button>
          <Button onClick={onSave}>Save Changes</Button>
        </>
      }>

      <div style={{ display: 'grid' as const, gridTemplateColumns: '1fr 260px', gap: 24, alignItems: 'flex-start' }}>

        {/* LEFT — form fields */}
        <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 4 }}>

          <SectionDivider label="Personal Information" />
          <div style={{ display: 'grid' as const, gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
            <Input label="Full Name" value={`${form.first_name} ${form.last_name}`} onChange={() => {}} disabled hint="Contact admin to change your name" />
            <Input label="Date of Birth" type="date" value="" onChange={() => {}} />
          </div>
          <Select label="Gender" value={form.gender} onChange={set('gender')} options={GENDER_OPTIONS} style={{ marginBottom: 14 }} />

          <SectionDivider label="Contact Information" />
          <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 14, marginBottom: 14 }}>
            <Input label="Contact Number" value={form.contact_number} onChange={set('contact_number')} hint="Must start with 09 and be exactly 11 digits" />
            <Input label="Email Address" type="email" value={form.email} onChange={set('email')} />
            <div style={{ display: 'grid' as const, gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <Input label="City"     value={form.address_city}     onChange={set('address_city')} />
              <Input label="Province" value={form.address_province} onChange={set('address_province')} />
            </div>
          </div>

          <SectionDivider label="Partner Information" />
          <label style={{ display: 'flex' as const, alignItems: 'center', gap: 10, fontSize: 13.5, cursor: 'pointer' as const, marginBottom: form.has_partner ? 14 : 18 }}>
            <input type="checkbox" checked={form.has_partner} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setForm(f => ({ ...f, has_partner: (e.target as HTMLInputElement).checked }))} style={{ accentColor: 'var(--accent)', width: 15, height: 15 }} />
            I have a partner / spouse
          </label>
          {form.has_partner && (
            <Input label="Anniversary Date" type="date" value="" onChange={() => {}} style={{ marginBottom: 14 }} />
          )}

          <SectionDivider label="Occupation" />
          <Input label="Occupation" value={form.occupation} onChange={set('occupation')} placeholder="e.g. Manager, Staff" style={{ marginBottom: 4 }} />
        </div>

        {/* RIGHT — avatar + photo upload + password (in order) */}
        <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 14 }}>

          {/* Avatar preview card */}
          <Card style={{ padding: 18, textAlign: 'center' as const }}>
            <Avatar name={user.full_name} size={68} style={{ margin: '0 auto 10px' }} />
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 2 }}>{user.full_name}</div>
            <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginBottom: 14 }}>{user.employee_number}</div>

            {/* Profile Photo section */}
            <div style={{ textAlign: 'left' as const, paddingTop: 12, borderTop: '1px solid var(--border-inner)' }}>
              <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' as const, letterSpacing: '.06em', marginBottom: 8 }}>Profile Photo</div>
              <input type="file" accept="image/*" style={{ fontSize: 12.5, width: '100%', marginBottom: 6 }} />
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 10 }}>Leave blank to keep current photo</div>
              <label style={{ display: 'flex' as const, alignItems: 'center', gap: 7, fontSize: 12.5, cursor: 'pointer' as const }}>
                <input type="checkbox" style={{ accentColor: 'var(--danger)' }} />
                <span style={{ color: 'var(--danger)' }}>Remove Profile Photo</span>
              </label>
            </div>
          </Card>

          {/* Change Password — placed BELOW profile photo */}
          <Card style={{ padding: 18 }}>
            <div style={{ display: 'flex' as const, alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <span style={{ color: 'var(--accent)', display: 'flex' as const }}><IcoLock /></span>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>Change Password</div>
              <span style={{ fontSize: 11, color: 'var(--text-muted)', fontStyle: 'italic' }}>(Optional)</span>
            </div>
            <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 12 }}>
              <Input label="Current Password" type="password" value="" onChange={() => {}} placeholder="Enter current password" />
              <Input label="New Password"     type="password" value="" onChange={() => {}} placeholder="Enter new password" />
              <Input label="Confirm Password" type="password" value="" onChange={() => {}} placeholder="Confirm new password" />
            </div>
          </Card>

        </div>
      </div>
    </InfoModal>
  )
}
