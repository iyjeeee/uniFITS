// EmployeeDetails.jsx — Full profile view: info, officer history, attendance
import { useState } from 'react'
import { Avatar, Badge, Button, Card, CardHeader, PageHeader, StatusBadge } from '../../components/ui'
import { MOCK_USERS, MOCK_ATTENDANCES, formatDate } from '../../api/mockData'
import { useOrg } from '../../context/OrgContext'

export default function EmployeeDetails({ userId = '1' }: { userId?: string }) {
  const org  = useOrg()
  const user = MOCK_USERS.find((u) => u.id === userId) || MOCK_USERS[0]
  const userAttendance = MOCK_ATTENDANCES.filter((a) => a.user_name === user.full_name)
  const [tab, setTab] = useState('info') // info | attendance

  const tabs = ['info', 'attendance']

  return (
    <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 20 }}>
      <PageHeader title={user.full_name} subtitle={user.employee_number} actions={
        <Button>Edit Profile</Button>
      } />

      {/* Profile header card */}
      <Card style={{ padding: 28 }}>
        <div style={{ display: 'flex' as const, alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
          <Avatar name={user.full_name} size={72} />
          <div style={{ flex: 1 }}>
            <h2 style={{ margin: '0 0 4px', fontSize: 22 }}>{user.full_name}</h2>
            <div style={{ display: 'flex' as const, gap: 10, flexWrap: 'wrap', marginBottom: 8 }}>
              <Badge variant="accent">{user.role}</Badge>
              <StatusBadge status={user.status} />
            </div>
            <div style={{ display: 'flex' as const, gap: 24, flexWrap: 'wrap', fontSize: 13.5, color: 'var(--text-muted)' }}>
              <span>📧 {user.email}</span>
              <span>📞 {user.contact_number}</span>
              <span>🏢 {user.department}</span>
              <span>Joined {formatDate(user.joined)}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Tab navigation */}
      <div style={{ display: 'flex' as const, gap: 4, borderBottom: '2px solid var(--border)', paddingBottom: 0 }}>
        {tabs.map((t) => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '8px 18px', background: 'none', border: 'none', cursor: 'pointer' as const,
            fontSize: 14, fontWeight: tab === t ? 600 : 400, fontFamily: 'var(--font-body)',
            color: tab === t ? 'var(--accent)' : 'var(--text-muted)',
            borderBottom: tab === t ? '2px solid var(--accent)' : '2px solid transparent',
            marginBottom: -2, textTransform: 'capitalize' as const,
          }}>{t}</button>
        ))}
      </div>

      {tab === 'info' && (
        <Card style={{ padding: 28 }}>
          <div style={{ display: 'grid' as const, gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
            {[
              ['Employee Number', user.employee_number], ['Full Name', user.full_name],
              ['Gender', user.gender], ['Email', user.email],
              ['Contact', user.contact_number], ['City', user.address_city],
              ['Province', user.address_province], ['Occupation', user.occupation],
              ['Department', user.department], ['Status', user.status],
            ].map(([k, v]) => (
              <div key={k}>
                <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' as const, letterSpacing: '.06em', marginBottom: 4 }}>{k}</div>
                <div style={{ fontSize: 14, color: 'var(--text-primary)', fontWeight: 500 }}>{v || '—'}</div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {tab === 'attendance' && (
        <Card>
          <CardHeader title={`${org.attendance_label} Records`} subtitle={`${userAttendance.length} records found`} />
          <div style={{ overflowX: 'auto' as const }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5 }}>
              <thead>
                <tr style={{ background: 'var(--neutral-light)' }}>
                  {['Activity Type','Activity','Date','Status','Remarks'].map((h) => (
                    <th key={h} style={th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {userAttendance.length === 0
                  ? <tr><td colSpan={5} style={{ padding: '32px', textAlign: 'center' as const, color: 'var(--text-muted)' }}>No attendance records found.</td></tr>
                  : userAttendance.map((a) => (
                      <tr key={a.id} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={td}><Badge variant={a.activity_type === 'event' ? 'success' : 'accent'}>{a.activity_type}</Badge></td>
                        <td style={td}>{a.activity}</td>
                        <td style={td}>{formatDate(a.attendance_date)}</td>
                        <td style={td}><StatusBadge status={a.status} /></td>
                        <td style={td}>{a.remarks || '—'}</td>
                      </tr>
                    ))
                }
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}

const th = { padding: '10px 16px', textAlign: 'left' as const, fontSize: 11.5, fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase' as const, color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }
const td = { padding: '12px 16px', verticalAlign: 'middle' }
