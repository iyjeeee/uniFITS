// ProjectDetail.jsx — Full project view: funding, attendance, contributions, financials
import { useState } from 'react'
import { Card, PageHeader, CardHeader, Button, StatusBadge, Badge } from '../../components/ui'
import { MOCK_PROJECTS, MOCK_ATTENDANCES, MOCK_TRANSACTIONS, formatCurrency, formatDate } from '../../api/mockData'
import { useOrg } from '../../context/OrgContext'

export default function ProjectDetail({ projectId = '1' }) {
  const org  = useOrg()
  const proj = MOCK_PROJECTS.find(p => p.id === projectId) || MOCK_PROJECTS[0]
  const attendance   = MOCK_ATTENDANCES.filter(a => a.activity === proj.title)
  const contributions = MOCK_TRANSACTIONS.filter(t => t.category === 'project')
  const totalIncome  = contributions.filter(t => t.entry_type !== 'expense').reduce((s, t) => s + t.amount, 0)
  const totalExpense = contributions.filter(t => t.entry_type === 'expense').reduce((s, t) => s + t.amount, 0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <PageHeader title={proj.title} subtitle={proj.project_type} actions={
        <><Button variant="secondary">Back</Button><Button>Edit Project</Button></>
      } />

      {/* Project header info */}
      <Card style={{ padding: 24 }}>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginBottom: 20 }}>
          <div><div style={metaLabel}>Type</div><div style={metaVal}>{proj.project_type}</div></div>
          <div><div style={metaLabel}>Status</div><StatusBadge status={proj.status} /></div>
          <div><div style={metaLabel}>Location</div><div style={metaVal}>{proj.location || '—'}</div></div>
          <div><div style={metaLabel}>Start Date</div><div style={metaVal}>{formatDate(proj.start_date)}</div></div>
          <div><div style={metaLabel}>End Date</div><div style={metaVal}>{formatDate(proj.end_date)}</div></div>
        </div>
        {proj.description && <p style={{ margin: 0, fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{proj.description}</p>}

        {/* Funding progress */}
        <div style={{ display: 'flex', gap: 24, marginTop: 20, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13 }}>
              <span style={{ color: 'var(--text-muted)' }}>Funding Progress</span>
              <span style={{ fontWeight: 600 }}>{formatCurrency(proj.current_funding)} / {formatCurrency(proj.target_funding)}</span>
            </div>
            <div style={{ height: 8, background: 'var(--border)', borderRadius: 8, overflow: 'hidden' }}>
              <div style={{ height: '100%', background: 'var(--success)', width: `${Math.min(100, proj.target_funding > 0 ? (proj.current_funding / proj.target_funding) * 100 : 0)}%`, borderRadius: 8, transition: 'width .5s' }} />
            </div>
          </div>
        </div>
      </Card>

      {/* Attendance + Contributions split */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
        <Card>
          <CardHeader title="Attendance" subtitle={`${attendance.length} records`} actions={<Button size="sm">+ Add</Button>} />
          {attendance.length === 0
            ? <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13.5 }}>No attendance records yet.</div>
            : attendance.map(a => (
                <div key={a.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 20px', borderBottom: '1px solid var(--border)', fontSize: 13.5 }}>
                  <span>{a.user_name}</span><StatusBadge status={a.status} />
                </div>
              ))
          }
        </Card>

        <Card>
          <CardHeader title="Contributions" subtitle={`${contributions.length} transactions`} actions={<Button size="sm">+ Add</Button>} />
          {contributions.slice(0, 5).map(t => (
            <div key={t.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 20px', borderBottom: '1px solid var(--border)', fontSize: 13.5 }}>
              <span>{t.user_name || 'External'}</span>
              <span style={{ fontWeight: 600, color: 'var(--success)' }}>+{formatCurrency(t.amount)}</span>
            </div>
          ))}
        </Card>
      </div>

      {/* Financial Summary */}
      <Card style={{ padding: 24 }}>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Financial Summary</div>
        {[
          ['Total Contributions', totalIncome, 'var(--success)'],
          ['Total Expenses', totalExpense, 'var(--danger)'],
          ['Net Balance', totalIncome - totalExpense, totalIncome - totalExpense >= 0 ? 'var(--success)' : 'var(--danger)'],
        ].map(([k, v, color]) => (
          <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)', fontSize: 14 }}>
            <span style={{ color: 'var(--text-muted)' }}>{k}</span>
            <span style={{ fontWeight: 700, color }}>{formatCurrency(v)}</span>
          </div>
        ))}
      </Card>
    </div>
  )
}

const metaLabel = { fontSize: 11.5, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 4 }
const metaVal   = { fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }
