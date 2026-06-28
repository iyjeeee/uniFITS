// Dashboard.jsx — Overview with KPIs, top contributors, recent transactions, and chart section
// Fully responsive: 4-col → 2-col on tablet → 1-col on mobile via useBreakpoint
import { Avatar, Badge, Card, CardHeader, KpiCard, StatusBadge } from '../../components/ui'
import {
  MOCK_USERS, MOCK_TRANSACTIONS, MOCK_PROJECTS, MOCK_EVENTS,
  MOCK_FUNDS, MOCK_ATTENDANCES,
  formatCurrency, formatDate,
} from '../../api/mockData'
import { useOrg } from '../../context/OrgContext'
import useBreakpoint from '../../hooks/useBreakpoint'

/* ── SVG icon helpers (no emoji) ──────────────────────────────────────────────── */
const Ico: Record<string, (c: string) => React.ReactElement> = {
  members:  c => <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={2}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx={9} cy={7} r={4}/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  fund:     c => <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={2}><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  project:  c => <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={2}><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>,
  event:    c => <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={2}><rect x={3} y={4} width={18} height={18} rx={2}/><line x1={16} y1={2} x2={16} y2={6}/><line x1={8} y1={2} x2={8} y2={6}/><line x1={3} y1={10} x2={21} y2={10}/></svg>,
  income:   c => <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={2}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  expense:  c => <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={2}><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>,
  txn:      c => <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={2}><path d="M17 1l4 4-4 4M3 11V9a4 4 0 0 1 4-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 0 1-4 4H3"/></svg>,
  complete: c => <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={2}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
}

/* ── Chart data ───────────────────────────────────────────────────────────────── */
const MONTHLY_DATA = [
  { month: 'Jan', income: 45000, expense: 22000 },
  { month: 'Feb', income: 38000, expense: 18000 },
  { month: 'Mar', income: 62000, expense: 31000 },
  { month: 'Apr', income: 50000, expense: 28000 },
  { month: 'May', income: 71000, expense: 35000 },
  { month: 'Jun', income: 55000, expense: 24000 },
]

const FUND_DATA = [
  { name: 'Membership', balance: 85000 },
  { name: 'Project',    balance: 45500 },
  { name: 'Event',      balance: 125000 },
  { name: 'Emergency',  balance: 20000 },
  { name: 'Building',   balance: 150000 },
]

const STATUS_BREAKDOWN = [
  { label: 'Completed', count: 2, color: '#2E7D52' },
  { label: 'Ongoing',   count: 2, color: '#4B5EAA' },
  { label: 'Upcoming',  count: 5, color: '#D4860A' },
  { label: 'Cancelled', count: 0, color: '#C0392B' },
]

/* ── Bar chart — monthly income vs expense ───────────────────────────────────── */
function BarChart({ data }: Record<string, any>) {
  const maxVal = Math.max(...data.flatMap((d: any) => [d.income, d.expense]), 1)
  const barW   = 20
  const gap    = 5
  const groupW = barW * 2 + gap + 20
  const svgW   = groupW * data.length + 50
  const svgH   = 150
  const padB   = 26
  const padL   = 46

  return (
    <svg viewBox={`0 0 ${svgW} ${svgH}`} style={{ width: '100%', height: svgH, overflow: 'visible' }}>
      {[0, .25, .5, .75, 1].map((frac, i) => {
        const y = (svgH - padB) * (1 - frac)
        return (
          <g key={i}>
            <line x1={padL} x2={svgW - 6} y1={y} y2={y} stroke="var(--border)" strokeWidth={1} strokeDasharray={i === 0 ? 'none' : '3,3'} />
            <text x={padL - 4} y={y + 4} fontSize={8} fill="var(--text-muted)" textAnchor="end">
              {frac === 0 ? '0' : `₱${Math.round(maxVal * frac / 1000)}k`}
            </text>
          </g>
        )
      })}
      {data.map((d: any, i: any) => {
        const x    = padL + 4 + i * groupW
        const incH = ((d.income  / maxVal) * (svgH - padB - 10)) || 0
        const expH = ((d.expense / maxVal) * (svgH - padB - 10)) || 0
        return (
          <g key={d.month}>
            <rect x={x}               y={svgH - padB - incH} width={barW} height={incH} rx={3} fill="#2E7D52" />
            <rect x={x + barW + gap}  y={svgH - padB - expH} width={barW} height={expH} rx={3} fill="#C0392B" />
            <text x={x + barW + gap/2} y={svgH - 6} fontSize={9} fill="var(--text-muted)" textAnchor="middle">{d.month}</text>
          </g>
        )
      })}
      {/* Legend */}
      <rect x={svgW - 80} y={6}  width={9} height={9} rx={2} fill="#2E7D52" />
      <text x={svgW - 67} y={14} fontSize={9} fill="var(--text-muted)">Income</text>
      <rect x={svgW - 80} y={21} width={9} height={9} rx={2} fill="#C0392B" />
      <text x={svgW - 67} y={29} fontSize={9} fill="var(--text-muted)">Expense</text>
    </svg>
  )
}

/* ── Horizontal bar chart — fund balances ──────────────────────────────────── */
function FundBarChart({ data }: Record<string, any>) {
  const maxVal = Math.max(...data.map((d: any) => d.balance), 1)
  const COLORS = ['#4B5EAA', '#2E7D52', '#2471A3', '#D4860A', '#7D3C98']

  return (
    <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 10 }}>
      {data.map((d: any, i: any) => {
        const pct = (d.balance / maxVal) * 100
        return (
          <div key={d.name}>
            <div style={{ display: 'flex' as const, justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
              <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{d.name}</span>
              <span style={{ color: COLORS[i % COLORS.length], fontWeight: 700 }}>₱{(d.balance / 1000).toFixed(0)}k</span>
            </div>
            <div style={{ height: 8, background: 'var(--border)', borderRadius: 6, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${pct}%`, background: COLORS[i % COLORS.length], borderRadius: 6, transition: 'width .4s' }} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ── Donut chart — project status breakdown ────────────────────────────────── */
function DonutChart({ data }: Record<string, any>) {
  const total = data.reduce((s: any, d: any) => s + d.count, 0) || 1
  let cumAngle = -90
  const cx = 60, cy = 60, r = 48, inner = 28

  const slices = data.map((d: any) => {
    const angle  = (d.count / total) * 360
    const startA = cumAngle
    cumAngle    += angle
    const endA   = cumAngle
    const toRad = (a: number) => (a * Math.PI) / 180
    const x1 = cx + r * Math.cos(toRad(startA))
    const y1 = cy + r * Math.sin(toRad(startA))
    const x2 = cx + r * Math.cos(toRad(endA))
    const y2 = cy + r * Math.sin(toRad(endA))
    const ix1 = cx + inner * Math.cos(toRad(startA))
    const iy1 = cy + inner * Math.sin(toRad(startA))
    const ix2 = cx + inner * Math.cos(toRad(endA))
    const iy2 = cy + inner * Math.sin(toRad(endA))
    const large = angle > 180 ? 1 : 0
    return { ...d, angle, path: d.count === 0 ? null : `M${x1},${y1} A${r},${r},0,${large},1,${x2},${y2} L${ix2},${iy2} A${inner},${inner},0,${large},0,${ix1},${iy1} Z` }
  })

  return (
    <div style={{ display: 'flex' as const, alignItems: 'center', gap: 18 }}>
      <svg viewBox="0 0 120 120" width={110} height={110} style={{ flexShrink: 0 }}>
        {slices.map((s: any, i: number) => s.path ? (
          <path key={i} d={s.path} fill={s.color} />
        ) : null)}
        <text x={cx} y={cy + 4} textAnchor="middle" fontSize={14} fontWeight={700} fill="var(--text-primary)">{total}</text>
        <text x={cx} y={cy + 17} textAnchor="middle" fontSize={8} fill="var(--text-muted)">TOTAL</text>
      </svg>
      <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 8 }}>
        {data.map((d: any) => (
          <div key={d.label} style={{ display: 'flex' as const, alignItems: 'center', gap: 8, fontSize: 12.5 }}>
            <div style={{ width: 10, height: 10, borderRadius: 3, background: d.color, flexShrink: 0 }} />
            <span style={{ color: 'var(--text-secondary)' }}>{d.label}</span>
            <span style={{ fontWeight: 700, color: 'var(--text-primary)', marginLeft: 'auto' }}>{d.count}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Attendance status bars ────────────────────────────────────────────────── */
function AttendanceChart({ data }: Record<string, any>) {
  const statuses = ['present', 'late', 'absent', 'excused']
  const colors   = { present: '#2E7D52', late: '#D4860A', absent: '#C0392B', excused: '#2471A3' }
  const counts   = statuses.reduce((acc: Record<string,number>, s) => {
    acc[s] = data.filter((a: any) => a.status === s).length
    return acc
  }, {} as Record<string,number>)
  const total = data.length || 1

  return (
    <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 10 }}>
      {statuses.map((s: any) => {
        const pct = Math.round((counts[s] / total) * 100)
        return (
          <div key={s}>
            <div style={{ display: 'flex' as const, justifyContent: 'space-between', fontSize: 12, marginBottom: 3 }}>
              <span style={{ color: 'var(--text-secondary)', textTransform: 'capitalize' as const, fontWeight: 500 }}>{s}</span>
              <span style={{ color: (colors as Record<string,string>)[s], fontWeight: 700 }}>{counts[s]} ({pct}%)</span>
            </div>
            <div style={{ height: 7, background: 'var(--border)', borderRadius: 5, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${pct}%`, background: (colors as Record<string,string>)[s], borderRadius: 5 }} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ════════════════════════════════════════════════════════════════════ */
export default function Dashboard() {
  const org = useOrg()
  const { isMobile, isTablet } = useBreakpoint()

  // Responsive column counts — 4-col desktop, 2-col tablet/mobile
  const kpiCols  = isMobile || isTablet ? 'repeat(2,1fr)' : 'repeat(4,1fr)'
  const chartCols = isMobile ? '1fr' : isTablet ? 'repeat(2,1fr)' : 'repeat(3,1fr)'
  const topRowCols = isMobile || isTablet ? '1fr' : '1fr 320px'

  /* ── Computed KPIs ─────────────────────────────────────────────── */
  const totalBalance     = MOCK_FUNDS.reduce((s, f) => s + f.balance, 0)
  const activeMembers    = MOCK_USERS.filter((u: any) => u.status === 'active').length
  const ongoingProjects  = MOCK_PROJECTS.filter((p: any) => p.status !== 'completed' && p.status !== 'cancelled').length
  const upcomingEvents   = MOCK_EVENTS.filter((e: any) => e.status === 'upcoming').length
  const totalIncome      = MOCK_TRANSACTIONS.filter((t: any) => t.entry_type !== 'expense').reduce((s, t) => s + t.amount, 0)
  const totalExpense     = MOCK_TRANSACTIONS.filter((t: any) => t.entry_type === 'expense').reduce((s, t) => s + t.amount, 0)
  const completedProjects = MOCK_PROJECTS.filter((p: any) => p.status === 'completed').length
  const totalTransactions = MOCK_TRANSACTIONS.length

  /* ── Top contributors ──────────────────────────────────────────── */
  const topContributors = Object.values(
    MOCK_TRANSACTIONS
      .filter((t: any) => t.user_name && t.entry_type !== 'expense')
      .reduce((acc: Record<string,{name:string;total:number;count:number}>, t: any) => {
        if (!acc[t.user_name]) acc[t.user_name] = { name: t.user_name, total: 0, count: 0 }
        acc[t.user_name].total += t.amount
        acc[t.user_name].count += 1
        return acc
      }, {} as Record<string,{name:string;total:number;count:number}>)
  ).sort((a: any, b: any) => b.total - a.total).slice(0, 5)

  const recentTransactions = MOCK_TRANSACTIONS.slice(0, 6)

  return (
    <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 14 }}>

      {/* ── Row 1: KPI cards (4-col desktop → 2-col mobile) ─────── */}
      <div style={{ display: 'grid' as const, gridTemplateColumns: kpiCols, gap: 12 }}>
        <KpiCard label={`Total ${org.people_label}s`}      value={activeMembers}                                 color="var(--accent)"  icon={Ico.members('var(--accent)')}  onClick={() => { window.location.hash = '/employees' }} />
        <KpiCard label="Total Fund Balance"                 value={formatCurrency(totalBalance, org.currency_symbol)} color="var(--success)" icon={Ico.fund('var(--success)')}    onClick={() => { window.location.hash = '/funds' }} />
        <KpiCard label={`Active ${org.project_label}s`}    value={ongoingProjects}                               color="var(--warning)" icon={Ico.project('var(--warning)')} onClick={() => { window.location.hash = '/projects' }} />
        <KpiCard label={`Upcoming ${org.event_label}s`}    value={upcomingEvents}                                color="var(--info)"    icon={Ico.event('var(--info)')}      onClick={() => { window.location.hash = '/events' }} />
      </div>
      <div style={{ display: 'grid' as const, gridTemplateColumns: kpiCols, gap: 12 }}>
        <KpiCard label="Total Income"                       value={formatCurrency(totalIncome, org.currency_symbol)}   color="var(--success)" icon={Ico.income('var(--success)')}   onClick={() => { window.location.hash = '/transactions' }} />
        <KpiCard label="Total Expenses"                     value={formatCurrency(totalExpense, org.currency_symbol)}  color="var(--danger)"  icon={Ico.expense('var(--danger)')}  onClick={() => { window.location.hash = '/transactions' }} />
        <KpiCard label={`Completed ${org.project_label}s`} value={completedProjects}                               color="var(--success)" icon={Ico.complete('var(--success)')} onClick={() => { window.location.hash = '/projects' }} />
        <KpiCard label="Total Transactions"                 value={totalTransactions}                               color="var(--accent)"  icon={Ico.txn('var(--accent)')}       onClick={() => { window.location.hash = '/transactions' }} />
      </div>

      {/* ── Row 2: Top Contributors (left big) + Fund Breakdown (right) */}
      <div style={{ display: 'grid' as const, gridTemplateColumns: topRowCols, gap: 12 }}>

        {/* Top Contributors — main feature card */}
        <Card>
          <CardHeader title="Top Contributors" subtitle="Members ranked by total contributions" />
          <div style={{ padding: '8px 0' }}>
            {topContributors.length === 0
              ? <div style={{ padding: '24px', textAlign: 'center' as const, color: 'var(--text-muted)', fontSize: 13 }}>No contribution data yet.</div>
              : topContributors.map((c, i) => (
                  <div key={c.name} style={{ display: 'flex' as const, alignItems: 'center', gap: 12, padding: '10px 18px', borderBottom: '1px solid var(--border-inner)' }}>
                    {/* Rank badge */}
                    <div style={{
                      width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                      background: i === 0 ? '#D4860A' : i === 1 ? '#9CA3AF' : i === 2 ? '#C0392B' : 'var(--accent-light)',
                      display: 'flex' as const, alignItems: 'center', justifyContent: 'center',
                      fontSize: 11.5, fontWeight: 800,
                      color: i < 3 ? '#fff' : 'var(--accent)',
                    }}>
                      {i + 1}
                    </div>
                    <Avatar name={c.name} size={32} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 600, whiteSpace: 'nowrap' as const, overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</div>
                      <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 1 }}>{c.count} transaction{c.count !== 1 ? 's' : ''}</div>
                    </div>
                    <div style={{ textAlign: 'right' as const, flexShrink: 0 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--success)' }}>{formatCurrency(c.total, org.currency_symbol)}</div>
                      {/* Contribution bar relative to #1 */}
                      <div style={{ marginTop: 4, width: 80, height: 4, background: 'var(--border)', borderRadius: 4, overflow: 'hidden' }}>
                        <div style={{ height: '100%', background: 'var(--success)', width: `${(c.total / topContributors[0].total) * 100}%`, borderRadius: 4 }} />
                      </div>
                    </div>
                  </div>
                ))
            }
          </div>
        </Card>

        {/* Fund Balance Breakdown */}
        <Card>
          <CardHeader title="Fund Balances" subtitle="Current balance per fund" />
          <div style={{ padding: '16px 18px' }}>
            <FundBarChart data={FUND_DATA} currency={org.currency_symbol} />
            <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--border-inner)' }}>
              <div style={{ display: 'flex' as const, justifyContent: 'space-between', fontSize: 12.5 }}>
                <span style={{ color: 'var(--text-muted)' }}>Total across all funds</span>
                <span style={{ fontWeight: 700, color: 'var(--success)' }}>{formatCurrency(totalBalance, org.currency_symbol)}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* ── Row 3: Recent Transactions table ──────────────────────── */}
      <Card>
        <CardHeader title="Recent Transactions" subtitle={`Latest ${recentTransactions.length} financial entries`} />
        <div style={{ overflowX: 'auto' as const }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: 'var(--table-head-bg)' }}>
                {['Reference','Member','Amount','Type','Category','Date','Status'].map((h: any) => (
                  <th key={h} style={{ padding: '9px 14px', textAlign: 'left' as const, fontSize: 11, fontWeight: 600, color: 'var(--table-head-fg)', textTransform: 'uppercase' as const, letterSpacing: '.06em', borderBottom: '2px solid var(--border-table)', whiteSpace: 'nowrap' as const }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map((t: any) => (
                <tr key={t.id} style={{ borderBottom: '1px solid var(--border-inner)' }}>
                  <td style={{ padding: '10px 14px' }}><code style={{ fontSize: 11 }}>{t.reference_number}</code></td>
                  <td style={{ padding: '10px 14px' }}>{t.user_name || '—'}</td>
                  <td style={{ padding: '10px 14px', fontWeight: 700, color: t.entry_type === 'expense' ? 'var(--danger)' : 'var(--success)' }}>
                    {t.entry_type === 'expense' ? '−' : '+'}{formatCurrency(t.amount, org.currency_symbol)}
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    {/* Type badge: expense=red, contribution=blue(accent), income=green */}
                    <Badge variant={t.entry_type === 'expense' ? 'danger' : t.entry_type === 'contribution' ? 'accent' : 'success'}>
                      {t.entry_type.charAt(0).toUpperCase() + t.entry_type.slice(1)}
                    </Badge>
                  </td>
                  <td style={{ padding: '10px 14px' }}>{t.category ? t.category.charAt(0).toUpperCase() + t.category.slice(1) : '—'}</td>
                  <td style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>{formatDate(t.transaction_date)}</td>
                  <td style={{ padding: '10px 14px' }}><StatusBadge status={t.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ── Row 4: Analytics charts (3-col desktop → 2-col tablet → 1-col mobile) */}
      <div style={{ display: 'grid' as const, gridTemplateColumns: chartCols, gap: 12 }}>

        {/* Income vs Expense — bar chart */}
        <Card>
          <CardHeader title="Monthly Income vs Expense" subtitle="6-month financial trend" />
          <div style={{ padding: '14px 18px 16px' }}>
            <BarChart data={MONTHLY_DATA} currency={org.currency_symbol} />
          </div>
        </Card>

        {/* Project Status Breakdown — donut */}
        <Card>
          <CardHeader title="Project Status" subtitle="Breakdown by current status" />
          <div style={{ padding: '18px 18px' }}>
            <DonutChart data={STATUS_BREAKDOWN} />
          </div>
        </Card>

        {/* Attendance breakdown — horizontal bars */}
        <Card>
          <CardHeader title="Attendance Overview" subtitle="All recorded attendance statuses" />
          <div style={{ padding: '16px 18px' }}>
            <AttendanceChart data={MOCK_ATTENDANCES} />
            <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--border-inner)', fontSize: 12.5, color: 'var(--text-muted)' }}>
              Total records: <strong>{MOCK_ATTENDANCES.length}</strong>
            </div>
          </div>
        </Card>
      </div>

    </div>
  )
}
