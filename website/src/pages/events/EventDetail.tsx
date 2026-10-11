// EventDetail.jsx — Full event view: info, attendance, contributions, financials
import { Button, Card, PageHeader, StatusBadge } from '../../components/ui'
import { fmt12, MOCK_EVENTS, MOCK_ATTENDANCES, MOCK_TRANSACTIONS, formatCurrency, formatDate } from '../../api/mockData'
import { useOrg } from '../../context/OrgContext'

export default function EventDetail({ eventId = '1' }: { eventId?: string }) {
  const org   = useOrg()
  const event = MOCK_EVENTS.find((e) => e.id === eventId) || MOCK_EVENTS[0]
  const attendance    = MOCK_ATTENDANCES.filter((a) => a.activity_type === 'event')
  const contributions = MOCK_TRANSACTIONS.filter((t) => t.category === 'event')
  const totalIncome   = contributions.filter((t) => t.entry_type !== 'expense').reduce((s, t) => s + t.amount, 0)
  const totalExpense  = contributions.filter((t) => t.entry_type === 'expense').reduce((s, t) => s + t.amount, 0)

  return (
    <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 20 }}>
      <PageHeader title={event.title} subtitle="Event Details" actions={
        <><Button variant="secondary">Back</Button><Button>Edit Event</Button></>
      } />

      <Card style={{ padding: 24 }}>
        <div style={{ display: 'flex' as const, gap: 24, flexWrap: 'wrap', marginBottom: 16 }}>
          <div><div style={ml}>Status</div><StatusBadge status={event.status} /></div>
          <div><div style={ml}>Date</div><div style={mv}>{formatDate(event.event_date)}</div></div>
          <div><div style={ml}>Time</div><div style={mv}>{event.event_time ? fmt12(event.event_time) : '—'}</div></div>
          <div><div style={ml}>Location</div><div style={mv}>{event.location || '—'}</div></div>
          <div><div style={ml}>Target Funding</div><div style={mv}>{formatCurrency(event.target_funding)}</div></div>
          <div><div style={ml}>Current Funding</div><div style={{ ...mv, color: 'var(--success)', fontWeight: 700 }}>{formatCurrency(event.current_funding)}</div></div>
        </div>
        {event.description && <p style={{ margin: 0, fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{event.description}</p>}
      </Card>

      {/* ── 4 sections: 2x2 grid — Employee Contributions, Employee Attendance, External Income, External Expense */}
      <div style={{ display: 'grid' as const, gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>

        {/* 1 — Employee Contributions */}
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border-inner)', background: 'var(--accent-light)', display: 'flex' as const, alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--accent)' }}>Employee Contributions</div>
              <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 2 }}>{contributions.filter((t) => t.entry_type !== 'expense').length} records</div>
            </div>
            <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--accent)' }}>{formatCurrency(totalIncome, org?.currency_symbol)}</div>
          </div>
          <div style={{ padding: '4px 0' }}>
            {contributions.filter((t) => t.entry_type !== 'expense').length === 0
              ? <div style={{ padding: '20px', textAlign: 'center' as const, color: 'var(--text-muted)', fontSize: 13 }}>No contributions yet.</div>
              : contributions.filter((t) => t.entry_type !== 'expense').slice(0, 5).map((t) => (
                <div key={t.id} style={{ display: 'flex' as const, alignItems: 'center', justifyContent: 'space-between', padding: '10px 20px', borderBottom: '1px solid var(--border)', fontSize: 13.5 }}>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{t.user_name || 'Member'}</span>
                  <span style={{ fontWeight: 700, color: 'var(--success)' }}>+{formatCurrency(t.amount, org?.currency_symbol)}</span>
                </div>
              ))
            }
          </div>
        </Card>

        {/* 2 — Employee Attendance */}
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border-inner)', background: 'var(--info-light)', display: 'flex' as const, alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--info)' }}>Employee Attendance</div>
              <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 2 }}>{attendance.length} records</div>
            </div>
            <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--info)' }}>
              {attendance.filter((a) => a.status === 'present').length}/{attendance.length} present
            </div>
          </div>
          <div style={{ padding: '4px 0' }}>
            {attendance.length === 0
              ? <div style={{ padding: '20px', textAlign: 'center' as const, color: 'var(--text-muted)', fontSize: 13 }}>No attendance records yet.</div>
              : attendance.map((a) => (
                <div key={a.id} style={{ display: 'flex' as const, alignItems: 'center', justifyContent: 'space-between', padding: '10px 20px', borderBottom: '1px solid var(--border)', fontSize: 13.5 }}>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{a.user_name}</span>
                  <StatusBadge status={a.status} />
                </div>
              ))
            }
          </div>
        </Card>

        {/* 3 — External Income */}
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border-inner)', background: 'var(--success-light)', display: 'flex' as const, alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--success)' }}>External Income</div>
              <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 2 }}>Donations & sponsorships</div>
            </div>
            <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--success)' }}>{formatCurrency(totalIncome, org?.currency_symbol)}</div>
          </div>
          <div style={{ padding: '4px 0' }}>
            {contributions.filter((t) => t.entry_type === 'income').length === 0
              ? <div style={{ padding: '20px', textAlign: 'center' as const, color: 'var(--text-muted)', fontSize: 13 }}>No external income recorded.</div>
              : contributions.filter((t) => t.entry_type === 'income').slice(0, 5).map((t) => (
                <div key={t.id} style={{ display: 'flex' as const, alignItems: 'center', justifyContent: 'space-between', padding: '10px 20px', borderBottom: '1px solid var(--border)', fontSize: 13.5 }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{t.user_name || 'External'}</span>
                  <span style={{ fontWeight: 700, color: 'var(--success)' }}>+{formatCurrency(t.amount, org?.currency_symbol)}</span>
                </div>
              ))
            }
          </div>
        </Card>

        {/* 4 — External Expense */}
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border-inner)', background: 'var(--danger-light)', display: 'flex' as const, alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--danger)' }}>External Expense</div>
              <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 2 }}>Venue, supplies & costs</div>
            </div>
            <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--danger)' }}>{formatCurrency(totalExpense, org?.currency_symbol)}</div>
          </div>
          <div style={{ padding: '4px 0' }}>
            {contributions.filter((t) => t.entry_type === 'expense').length === 0
              ? <div style={{ padding: '20px', textAlign: 'center' as const, color: 'var(--text-muted)', fontSize: 13 }}>No expenses recorded.</div>
              : contributions.filter((t) => t.entry_type === 'expense').slice(0, 5).map((t) => (
                <div key={t.id} style={{ display: 'flex' as const, alignItems: 'center', justifyContent: 'space-between', padding: '10px 20px', borderBottom: '1px solid var(--border)', fontSize: 13.5 }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{t.user_name || 'External'}</span>
                  <span style={{ fontWeight: 700, color: 'var(--danger)' }}>−{formatCurrency(t.amount, org?.currency_symbol)}</span>
                </div>
              ))
            }
          </div>
        </Card>
      </div>
    </div>
  )
}
const ml = { fontSize: 11.5, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' as const, letterSpacing: '.06em', marginBottom: 4 }
const mv = { fontSize: 14, fontWeight: 500 }
