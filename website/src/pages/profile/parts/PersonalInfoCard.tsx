// parts/PersonalInfoCard.tsx — Personal information fields
import { Card, CardHeader } from '../../../components/ui'
import { formatDate } from '../../../api/mockData'
import type { User } from '../../../types'

export default function PersonalInfoCard({ user }: { user: User }) {
  return (
    <Card>
      <CardHeader title="Personal Information" />
      <div style={{ padding: '14px 18px', display: 'flex' as const, flexDirection: 'column' as const, gap: 10 }}>
        {[
          ['Full Name',    user.full_name],
          ['Employee ID',  user.employee_number],
          ['Gender',       user.gender],
          ['Contact',      user.contact_number],
          ['Email',        user.email],
          ['City',         user.address_city     || '—'],
          ['Province',     user.address_province || '—'],
          ['Occupation',   user.occupation       || '—'],
          ['Department',   user.department       || '—'],
          ['Date Joined',  formatDate(user.joined)],
        ].map(([k, v]) => (
          <div key={k} style={{ display: 'flex' as const, gap: 12, paddingBottom: 8, borderBottom: '1px solid var(--border-inner)' }}>
            <div style={{ width: 120, fontSize: 12, color: 'var(--text-muted)', flexShrink: 0, paddingTop: 1, fontWeight: 500, textTransform: 'uppercase' as const, letterSpacing: '.04em' }}>{k}</div>
            <div style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--text-primary)' }}>{v}</div>
          </div>
        ))}
      </div>
    </Card>
  )
}
