// ProjectDetail.jsx — Full project view: funding, attendance, contributions, financials

import { Card, PageHeader, Button, StatusBadge } from '../../components/ui'
import { getProjectsWithFunding, getUserName, formatCurrency, formatDate, getPartyName } from '../../api/mockData'
import { getItemDetailData } from '../../components/itemDetail/itemDetailData'
import { useOrg } from '../../context/OrgContext'

export default function ProjectDetail({ projectId = '1' }: { projectId?: string }) {
  const org  = useOrg()
  const projects = getProjectsWithFunding()
  const proj = projects.find((p) => p.id === projectId) || projects[0]
  const d = getItemDetailData(proj, 'project')   // financials + attendance of THIS project only (shared with the detail modal)
  const attendance = d.attendanceRecords

  return (
    <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 20 }}>
      <PageHeader title={proj.title} subtitle={proj.project_type} actions={
        <><Button variant="secondary">Back</Button><Button>Edit Project</Button></>
      } />

      {/* Project header info */}
      <Card style={{ padding: 24 }}>
        <div style={{ display: 'flex' as const, gap: 24, flexWrap: 'wrap', marginBottom: 20 }}>
          <div><div style={metaLabel}>Type</div><div style={metaVal}>{proj.project_type}</div></div>
          <div><div style={metaLabel}>Status</div><StatusBadge status={proj.status} /></div>
          <div><div style={metaLabel}>Location</div><div style={metaVal}>{proj.location || '—'}</div></div>
          <div><div style={metaLabel}>Start Date</div><div style={metaVal}>{formatDate(proj.start_date)}</div></div>
          <div><div style={metaLabel}>End Date</div><div style={metaVal}>{formatDate(proj.end_date)}</div></div>
        </div>
        {proj.description && <p style={{ margin: 0, fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{proj.description}</p>}

        {/* Funding progress */}
        <div style={{ display: 'flex' as const, gap: 24, marginTop: 20, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ display: 'flex' as const, justifyContent: 'space-between', marginBottom: 6, fontSize: 13 }}>
              <span style={{ color: 'var(--text-muted)' }}>Funding Progress</span>
              <span style={{ fontWeight: 600 }}>{formatCurrency(proj.current_funding)} / {formatCurrency(proj.target_funding)}</span>
            </div>
            <div style={{ height: 8, background: 'var(--border)', borderRadius: 8, overflow: 'hidden' }}>
              <div style={{ height: '100%', background: 'var(--success)', width: `${Math.min(100, proj.target_funding > 0 ? (proj.current_funding / proj.target_funding) * 100 : 0)}%`, borderRadius: 8, transition: 'width .5s' }} />
            </div>
          </div>
        </div>
      </Card>

      {/* ── 4 sections: 2x2 grid — Employee Contributions, Employee Attendance, External Income, External Expense */}
      <div style={{ display: 'grid' as const, gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>

        {/* 1 — Employee Contributions */}
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border-inner)', background: 'var(--accent-light)', display: 'flex' as const, alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--accent)' }}>Employee Contributions</div>
              <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 2 }}>{d.memberContribs.length} records</div>
            </div>
            <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--accent)' }}>{formatCurrency(d.totalContrib, org?.currency_symbol)}</div>
          </div>
          <div style={{ padding: '4px 0' }}>
            {d.memberContribs.length === 0
              ? <div style={{ padding: '20px', textAlign: 'center' as const, color: 'var(--text-muted)', fontSize: 13 }}>No contributions yet.</div>
              : d.memberContribs.slice(0, 5).map((t) => (
                <div key={t.id} style={{ display: 'flex' as const, alignItems: 'center', justifyContent: 'space-between', padding: '10px 20px', borderBottom: '1px solid var(--border)', fontSize: 13.5 }}>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{getPartyName(t.user_id, 'Member')}</span>
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
                  <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{getUserName(a.user_id)}</span>
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
              <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 2 }}>Donations & other income</div>
            </div>
            <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--success)' }}>{formatCurrency(d.totalExtInc, org?.currency_symbol)}</div>
          </div>
          <div style={{ padding: '4px 0' }}>
            {d.externalIncome.length === 0
              ? <div style={{ padding: '20px', textAlign: 'center' as const, color: 'var(--text-muted)', fontSize: 13 }}>No external income recorded.</div>
              : d.externalIncome.slice(0, 5).map((t) => (
                <div key={t.id} style={{ display: 'flex' as const, alignItems: 'center', justifyContent: 'space-between', padding: '10px 20px', borderBottom: '1px solid var(--border)', fontSize: 13.5 }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{getPartyName(t.user_id, 'External')}</span>
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
              <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 2 }}>Purchases & payouts</div>
            </div>
            <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--danger)' }}>{formatCurrency(d.totalExtExp, org?.currency_symbol)}</div>
          </div>
          <div style={{ padding: '4px 0' }}>
            {d.externalExpense.length === 0
              ? <div style={{ padding: '20px', textAlign: 'center' as const, color: 'var(--text-muted)', fontSize: 13 }}>No expenses recorded.</div>
              : d.externalExpense.slice(0, 5).map((t) => (
                <div key={t.id} style={{ display: 'flex' as const, alignItems: 'center', justifyContent: 'space-between', padding: '10px 20px', borderBottom: '1px solid var(--border)', fontSize: 13.5 }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{getPartyName(t.user_id, 'External')}</span>
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

const metaLabel = { fontSize: 11.5, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' as const, letterSpacing: '.06em', marginBottom: 4 }
const metaVal   = { fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }
