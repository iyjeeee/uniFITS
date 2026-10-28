// parts/EmployeeInfoSection.tsx — "Member Information" grid (name, position, ID, contact, joined, email, gender, occupation)
import { formatDate, getRoleName } from '../../../api/mockData'
import type { User } from '../../../types'

export default function EmployeeInfoSection({ selected }: { selected: User }) {
  return (
    <div style={{ padding: '18px 28px', borderBottom: '1px solid var(--border-inner)' }}>
      <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--accent)', marginBottom: 12, textTransform: 'uppercase' as const, letterSpacing: '.06em' }}>
        Member Information
      </div>
      <div style={{ display: 'grid' as const, gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 12 }}>
        {[
          ['Name',       selected.full_name],
          ['Position',   getRoleName(selected.role_id)],
          ['ID',         selected.employee_number],
          ['Contact',    selected.contact_number],
          ['Joined',     formatDate(selected.joined)],
          ['Email',      selected.email],
          ['Gender',     selected.gender],
          ['Occupation', selected.occupation || '—'],
        ].map(([k, v]) => (
          <div key={k}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' as const, letterSpacing: '.05em', marginBottom: 2 }}>{k}</div>
            <div style={{ fontSize: 13.5, fontWeight: 600 }}>{v}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
