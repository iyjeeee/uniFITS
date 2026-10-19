// parts/EmployeeReportSidebar.tsx — Member list card: View All button, Officers and Employees groups, selected member highlighted
import { Card, Avatar } from '../../../components/ui'
import { BtnIco } from '../../../components/Icons'
import { useOrg } from '../../../context/OrgContext'
import type { User } from '../../../types'

interface Props { officers: User[]; members: User[]; selected: User | undefined; onSelect: (u: User) => void; onViewAll: () => void }

export default function EmployeeReportSidebar({ officers, members, selected, onSelect, onViewAll }: Props) {
  const org = useOrg()
  return (
    <Card>
      <div style={{ display: 'flex' as const, alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: '1px solid var(--border-inner)' }}>
        <div style={{ fontSize: 14, fontWeight: 600 }}>{org.people_label} List</div>
        <button onClick={onViewAll} title="View All Employees"
          style={{ width: 32, height: 32, borderRadius: 7, border: '1.5px solid var(--accent)', background: 'var(--accent-light)', color: 'var(--accent)', cursor: 'pointer' as const, display: 'flex' as const, alignItems: 'center', justifyContent: 'center' }}>
          <BtnIco.View />
        </button>
      </div>
      <div style={{ padding: '8px 0' }}>
        {[{ label: 'Officers', list: officers }, { label: `${org.people_label}s`, list: members }].map(({ label, list }) => (
          <div key={label}>
            <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase' as const, color: 'var(--text-muted)', padding: '8px 14px 4px' }}>
              {label}
            </div>
            {list.map((u) => (
              <button
                key={u.id}
                onClick={() => onSelect(u)}
                style={{
                  width: '100%', display: 'flex' as const, alignItems: 'center', gap: 9,
                  padding: '9px 14px',
                  background: selected?.id === u.id ? 'var(--accent-light)' : 'none',
                  border: 'none', cursor: 'pointer' as const, textAlign: 'left' as const,
                  fontFamily: 'var(--font-body)',
                  color: selected?.id === u.id ? 'var(--accent)' : 'var(--text-primary)',
                }}>
                <Avatar name={u.full_name} size={26} />
                <span style={{ fontSize: 13, fontWeight: selected?.id === u.id ? 600 : 400 }}>
                  {u.full_name}
                </span>
              </button>
            ))}
          </div>
        ))}
      </div>
    </Card>
  )
}
