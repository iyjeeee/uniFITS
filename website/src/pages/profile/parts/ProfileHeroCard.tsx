// parts/ProfileHeroCard.tsx — Avatar, name, role and contact summary with Edit Profile button
import { Badge, StatusBadge, Avatar, Card, Button } from '../../../components/ui'
import { formatDate } from '../../../api/mockData'
import { IcoId, IcoMail, IcoPhone, IcoCal, IcoEdit } from './ProfileIcons'
import type { User } from '../../../types'

export default function ProfileHeroCard({ user, onEdit }: { user: User; onEdit: () => void }) {
  return (
  <Card style={{ padding: 22 }}>
    <div style={{ display: 'flex' as const, alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
      {/* Avatar */}
      <Avatar name={user.full_name} size={80} />

      {/* Name + meta */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <h2 style={{ margin: '0 0 6px', fontSize: 22, fontWeight: 700 }}>{user.full_name}</h2>
        <div style={{ display: 'flex' as const, gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
          <Badge variant="accent">{user.role}</Badge>
          <Badge variant="neutral">{user.department}</Badge>
          <StatusBadge status={user.status} />
        </div>
        <div style={{ display: 'flex' as const, gap: 20, flexWrap: 'wrap', fontSize: 13, color: 'var(--text-muted)' }}>
          <span style={{ display: 'flex' as const, alignItems: 'center', gap: 5 }}><IcoId />    {user.employee_number}</span>
          <span style={{ display: 'flex' as const, alignItems: 'center', gap: 5 }}><IcoMail />  {user.email}</span>
          <span style={{ display: 'flex' as const, alignItems: 'center', gap: 5 }}><IcoPhone /> {user.contact_number}</span>
          <span style={{ display: 'flex' as const, alignItems: 'center', gap: 5 }}><IcoCal />   Joined {formatDate(user.joined)}</span>
        </div>
      </div>

      {/* Edit Profile button — inside card */}
      <Button onClick={() => onEdit()} icon={<IcoEdit />} style={{ alignSelf: 'flex-start', flexShrink: 0 }}>
        Edit Profile
      </Button>
    </div>
  </Card>
  )
}
