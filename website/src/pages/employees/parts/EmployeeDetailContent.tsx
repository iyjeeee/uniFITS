// parts/EmployeeDetailContent.tsx — Detail modal body: profile hero + detail grid (3 columns desktop, 2 on mobile)
import { StatusBadge, Avatar, TypePill } from '../../../components/ui'
import { formatDate, getRoleName } from '../../../api/mockData'
import useBreakpoint from '../../../hooks/useBreakpoint'
import { capitalize } from '../../../utils/formatters'
import type { User } from '../../../types'

export default function EmployeeDetailContent({ item }: { item: User }) {
  const { isMobile } = useBreakpoint()
  return (
  <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 16 }}>
    {/* Profile hero */}
    <div style={{ display: 'flex' as const, alignItems: 'center', gap: 16, padding: '16px 20px', borderRadius: 12, background: 'var(--accent-light)', border: '1.5px solid rgba(75,94,170,.2)' }}>
      <Avatar name={item.full_name} size={56} />
      <div>
        <div style={{ fontSize: 18, fontWeight: 700 }}>{item.full_name}</div>
        <div style={{ display: 'flex' as const, gap: 8, marginTop: 6, flexWrap: 'wrap' }}>
          <TypePill>{getRoleName(item.role_id)}</TypePill>
          <StatusBadge status={item.status} />
        </div>
      </div>
    </div>
    {/* Full detail grid — 3-col desktop, 2-col mobile */}
    <div style={{ display: 'grid' as const, gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(3,1fr)', gap: 12 }}>
      {[
        ['Employee ID',  item.employee_number],
        ['Status',       capitalize(item.status)],
        ['Gender',       item.gender || '—'],
        ['Email',        item.email],
        ['Contact',      item.contact_number],
        ['Department',   item.department || '—'],
        ['Occupation',   item.occupation  || '—'],
        ['City',         item.address_city || '—'],
        ['Joined',       formatDate(item.joined)],
      ].map(([k, v]) => (
        <div key={k} style={{ padding: '12px 14px', borderRadius: 10, background: 'var(--neutral-light)', border: '1px solid var(--border-card)' }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' as const, letterSpacing: '.07em', marginBottom: 4 }}>{k}</div>
          <div style={{ fontSize: 13.5, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{v}</div>
        </div>
      ))}
    </div>
  </div>
  )
}
