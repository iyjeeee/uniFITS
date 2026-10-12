// EditProfile.jsx — User self-service profile edit page
import { useState } from 'react'
import { Avatar, Button, Card, Input, PageHeader, SectionDivider, Select, ResponseModal } from '../../components/ui'
import { MOCK_USERS } from '../../api/mockData'
import useBreakpoint from '../../hooks/useBreakpoint'
import { GENDER_OPTIONS } from '../../constants/profile'
import type { ProfileForm } from './parts/profileShared'

type EditProfileForm = ProfileForm & { showPwSection: boolean }   // adds the password-section toggle


export default function EditProfile({ userId = '1' }: { userId?: string }) {
  
  const { isMobile } = useBreakpoint()
  const user = MOCK_USERS.find((u) => u.id === userId) || MOCK_USERS[0]
  const [form, setForm] = useState<EditProfileForm>({
    first_name: user.first_name, last_name: user.last_name,
    gender: user.gender, contact_number: user.contact_number,
    email: user.email, address_city: user.address_city || '',
    address_province: user.address_province || '', occupation: user.occupation || '',
    has_partner: false, showPwSection: false,
  })
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setForm((f) => ({ ...f, [k]: e.target.value }))
  const [feedback, setFeedback] = useState(false)  // success confirmation modal visibility

  return (
    <>
    <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 20 }}>
      <PageHeader title="Edit Profile" subtitle="Update your personal information" actions={
        <><Button variant="secondary" onClick={() => window.history.back()}>Cancel</Button><Button onClick={() => setFeedback(true)}>Save Changes</Button></>
      } />

      <div style={{ display: 'grid' as const, gridTemplateColumns: isMobile ? '1fr' : '1fr 260px', gap: 20, alignItems: 'flex-start' }}>
        <Card style={{ padding: 28 }}>
          <SectionDivider label="Personal Information" />
          <div style={{ display: 'grid' as const, gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <Input label="Full Name" value={`${form.first_name} ${form.last_name}`} onChange={() => {}} disabled hint="Contact admin to change your name" />
            <Input label="Date of Birth" type="date" value="" onChange={() => {}} />
          </div>
          <Select label="Gender" value={form.gender} onChange={set('gender')} options={GENDER_OPTIONS} />

          <SectionDivider label="Contact Information" />
          <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 16, marginBottom: 16 }}>
            <Input label="Contact Number" value={form.contact_number} onChange={set('contact_number')} hint="Must start with 09 and be exactly 11 digits" />
            <Input label="Email Address" type="email" value={form.email} onChange={set('email')} />
            <div style={{ display: 'grid' as const, gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16 }}>
              <Input label="City" value={form.address_city} onChange={set('address_city')} />
              <Input label="Province" value={form.address_province} onChange={set('address_province')} />
            </div>
          </div>

          <SectionDivider label="Partner Information" />
          <label style={{ display: 'flex' as const, alignItems: 'center', gap: 10, fontSize: 13.5, cursor: 'pointer' as const, marginBottom: 16 }}>
            <input type="checkbox" checked={form.has_partner} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setForm(f => ({ ...f, has_partner: (e.target as HTMLInputElement).checked }))} style={{ accentColor: 'var(--accent)' }} />
            I have a partner / spouse
          </label>
          {form.has_partner && <Input label="Anniversary Date" type="date" value="" onChange={() => {}} />}

          <SectionDivider label="Occupation & Photo" />
          <Input label="Occupation" value={form.occupation} onChange={set('occupation')} placeholder="e.g. Manager, Staff" style={{ marginBottom: 16 }} />
          <div>
            <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', display: 'block' as const, marginBottom: 5 }}>Profile Photo</label>
            <div style={{ display: 'flex' as const, gap: 12, alignItems: 'center' }}>
              <Avatar name={user.full_name} size={56} />
              <div>
                <input type="file" accept="image/*" style={{ fontSize: 13 }} />
                <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 4 }}>Leave blank if you don't want to change the photo.</div>
              </div>
            </div>
          </div>

          {/* Optional password change section */}
          <SectionDivider label="Change Username and Password (Optional)" />
          <div style={{ display: 'flex' as const, alignItems: 'center', justifyContent: 'space-between', marginBottom: form.showPwSection ? 16 : 0 }}>
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Click Toggle to change credentials</span>
            <Button variant="secondary" size="sm" onClick={() => setForm(f => ({ ...f, showPwSection: !f.showPwSection }))}>Toggle</Button>
          </div>
          {form.showPwSection && (
            <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 14 }}>
              <Input label="New Password"     type="password" value="" onChange={() => {}} placeholder="Enter new password" />
              <Input label="Confirm Password" type="password" value="" onChange={() => {}} placeholder="Confirm new password" />
            </div>
          )}
        </Card>

        {/* Avatar preview sidebar */}
        <Card style={{ padding: 24, textAlign: 'center' as const }}>
          <Avatar name={user.full_name} size={80} style={{ margin: '0 auto 12px' }} />
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{user.full_name}</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>{user.employee_number}</div>
          <label style={{ display: 'flex' as const, alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer' as const, justifyContent: 'center' }}>
            <input type="checkbox" style={{ accentColor: 'var(--danger)' }} />
            <span style={{ color: 'var(--danger)' }}>Remove Profile Photo</span>
          </label>
          <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 6 }}>Resets to default avatar</div>
        </Card>
      </div>
    </div>
    <ResponseModal open={feedback} onClose={() => { setFeedback(false); window.history.back() }}
      variant="success" title="Profile Updated!" message="Your profile has been successfully saved." confirmLabel="Done" />
    </>
  )
}
