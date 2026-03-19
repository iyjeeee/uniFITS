// EventDetail.jsx — Full event view: info, attendance, contributions, financials
import { Card, CardHeader, Button, StatusBadge, PageHeader } from '../../components/ui'
import { MOCK_EVENTS, MOCK_ATTENDANCES, MOCK_TRANSACTIONS, formatCurrency, formatDate } from '../../api/mockData'
import { useOrg } from '../../context/OrgContext'

export default function EventDetail({ eventId = '1' }) {
  const org   = useOrg()
  const event = MOCK_EVENTS.find(e => e.id === eventId) || MOCK_EVENTS[0]
  const attendance    = MOCK_ATTENDANCES.filter(a => a.activity_type === 'event')
  const contributions = MOCK_TRANSACTIONS.filter(t => t.category === 'event')
  const totalIncome   = contributions.filter(t => t.entry_type !== 'expense').reduce((s, t) => s + t.amount, 0)
  const totalExpense  = contributions.filter(t => t.entry_type === 'expense').reduce((s, t) => s + t.amount, 0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <PageHeader title={event.title} subtitle={`${org.event_label} Details`} actions={
        <><Button variant="secondary">Edit</Button><Button variant="danger">Cancel Event</Button></>
      } />

      <Card style={{ padding: 24 }}>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginBottom: 16 }}>
          <div><div style={ml}>Status</div><StatusBadge status={event.status} /></div>
          <div><div style={ml}>Date</div><div style={mv}>{formatDate(event.event_date)}</div></div>
          <div><div style={ml}>Time</div><div style={mv}>{event.event_time || '—'}</div></div>
          <div><div style={ml}>Location</div><div style={mv}>{event.location || '—'}</div></div>
          <div><div style={ml}>Target Funding</div><div style={mv}>{formatCurrency(event.target_funding)}</div></div>
          <div><div style={ml}>Current Funding</div><div style={{ ...mv, color: 'var(--success)', fontWeight: 700 }}>{formatCurrency(event.current_funding)}</div></div>
        </div>
        {event.description && <p style={{ margin: 0, fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{event.description}</p>}
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
        <Card>
          <CardHeader title="Attendance" subtitle={`${attendance.length} records`} actions={<Button size="sm">+ Add</Button>} />
          {attendance.map(a => (
            <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 20px', borderBottom: '1px solid var(--border)', fontSize: 13.5 }}>
              <span>{a.user_name}</span><StatusBadge status={a.status} />
            </div>
          ))}
        </Card>

        <Card>
          <CardHeader title="Contributions" subtitle={`${contributions.length} transactions`} />
          {contributions.map(t => (
            <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 20px', borderBottom: '1px solid var(--border)', fontSize: 13.5 }}>
              <span>{t.user_name || 'External'}</span>
              <span style={{ fontWeight: 600, color: 'var(--success)' }}>{formatCurrency(t.amount)}</span>
            </div>
          ))}
        </Card>
      </div>

      <Card style={{ padding: 24 }}>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Financial Summary</div>
        {[['Club Contributions', totalIncome, 'var(--success)'],['External Expense', totalExpense, 'var(--danger)'],['Net Balance', totalIncome - totalExpense, totalIncome - totalExpense >= 0 ? 'var(--success)' : 'var(--danger)']].map(([k, v, c]) => (
          <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)', fontSize: 14 }}>
            <span style={{ color: 'var(--text-muted)' }}>{k}</span>
            <span style={{ fontWeight: 700, color: c }}>{formatCurrency(v)}</span>
          </div>
        ))}
      </Card>
    </div>
  )
}
const ml = { fontSize: 11.5, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 4 }
const mv = { fontSize: 14, fontWeight: 500 }
