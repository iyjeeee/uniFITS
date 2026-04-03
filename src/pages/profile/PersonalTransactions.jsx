// PersonalTransactions.jsx — Personal financial contributions and dues
// Removed page title per spec; tile cards for dues; View All Dues modal with pagination
// Responsive via useBreakpoint
import { useState } from 'react'
import { Card, CardHeader, Button, StatusBadge, Badge, DataTable, InfoModal, ResponseModal } from '../../components/ui'
import { MOCK_TRANSACTIONS, MOCK_FUNDS, formatCurrency, formatDate } from '../../api/mockData'
import { useOrg } from '../../context/OrgContext'
import useBreakpoint from '../../hooks/useBreakpoint'

/* ── SVG icons ────────────────────────────────────────────────── */
function IcoMoney() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> }
function IcoCalendar() { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> }
function IcoChevL() { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg> }
function IcoChevR() { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg> }

/* ── Pagination ───────────────────────────────────────────────── */
function Pagination({ page, total, onChange }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
      <PBtn disabled={page === 1}     onClick={() => onChange(page - 1)}><IcoChevL /></PBtn>
      {Array.from({ length: total }, (_, i) => i + 1).map(p => (
        <PBtn key={p} active={p === page} onClick={() => onChange(p)}>{p}</PBtn>
      ))}
      <PBtn disabled={page === total} onClick={() => onChange(page + 1)}><IcoChevR /></PBtn>
    </div>
  )
}
function PBtn({ children, active, disabled, onClick }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      width: 28, height: 28, borderRadius: 6,
      border: '1.5px solid var(--border-card)',
      background: active ? 'var(--accent)' : disabled ? 'var(--neutral-light)' : '#fff',
      color: active ? '#fff' : disabled ? 'var(--text-muted)' : 'var(--text-primary)',
      cursor: disabled ? 'not-allowed' : 'pointer', fontSize: 12, fontWeight: active ? 700 : 400,
    }}>{children}</button>
  )
}

export default function PersonalTransactions({ userId = '1' }) {
  const org = useOrg()
  const { isMobile } = useBreakpoint() // responsive grid control

  /* Data */
  const myTx          = MOCK_TRANSACTIONS.filter(t => t.user_id === userId)
  const requiredFunds = MOCK_FUNDS.filter(f => f.is_required)

  /* Contribution totals */
  const totals = { total: 0, project: 0, event: 0, fund: 0, other: 0 }
  myTx.filter(t => t.entry_type !== 'expense').forEach(t => {
    totals.total += t.amount
    if (totals[t.category] !== undefined) totals[t.category] += t.amount
    else totals.other += t.amount
  })

  /* Due tile states */
  const [selectedDue, setSelectedDue]     = useState(null)  // InfoModal target
  const [showAllDues, setShowAllDues]      = useState(false) // View All modal
  const [duesPage,    setDuesPage]         = useState(1)

  /* View All dues — show all funds (required + optional) */
  const ALL_FUNDS     = MOCK_FUNDS
  const DUES_PER_PAGE = 6
  const duesPages     = Math.max(1, Math.ceil(ALL_FUNDS.length / DUES_PER_PAGE))
  const pagedDues     = ALL_FUNDS.slice((duesPage - 1) * DUES_PER_PAGE, duesPage * DUES_PER_PAGE)

  /* Required dues displayed in panel — max 6 tiles */
  const PANEL_LIMIT = 6
  const panelDues   = requiredFunds.slice(0, PANEL_LIMIT)

  /* Table columns */
  const columns = [
    { label: '#',           key: 'num',  render: (_, i) => <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>{i + 1}</span> },
    { label: 'Date',        key: 'date', render: r => <span style={{ fontSize: 13 }}>{formatDate(r.transaction_date)}</span> },
    { label: 'Type',        key: 'type', render: r => <Badge variant={r.entry_type === 'expense' ? 'danger' : 'success'}>{r.entry_type.charAt(0).toUpperCase() + r.entry_type.slice(1)}</Badge> },
    { label: 'Amount',      key: 'amt',  render: r => <span style={{ fontWeight: 700, color: r.entry_type === 'expense' ? 'var(--danger)' : 'var(--success)' }}>{formatCurrency(r.amount, org.currency_symbol)}</span> },
    { label: 'Category',    accessor: 'category', render: r => <Badge variant="neutral">{r.category.charAt(0).toUpperCase() + r.category.slice(1)}</Badge> },
    { label: 'Description', accessor: 'description', render: r => <span style={{ fontSize: 13 }}>{r.description || '—'}</span> },
    { label: 'Method',      accessor: 'payment_method', render: r => <span style={{ fontSize: 13 }}>{r.payment_method}</span> },
    { label: 'Reference',   key: 'ref',  render: r => <code style={{ fontSize: 11, background: 'var(--neutral-light)', padding: '1px 5px', borderRadius: 3 }}>{r.reference_number}</code> },
    { label: 'Status',      key: 'st',   render: r => <StatusBadge status={r.status} /> },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

      {/* Contributions summary + required dues — side by side */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 14, alignItems: 'flex-start' }}>

        {/* My Contributions Summary */}
        <Card>
          <CardHeader title="My Contributions Summary" subtitle="Breakdown by contribution type" />
          <div style={{ padding: '14px 16px', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 12 }}>
            {[
              { label: 'Total Contributions', value: totals.total,   color: 'var(--success)', bg: 'var(--success-light)', border: 'rgba(46,125,82,.2)'  },
              { label: 'Projects',            value: totals.project, color: 'var(--accent)',  bg: 'var(--accent-light)',  border: 'rgba(75,94,170,.2)'  },
              { label: 'Events',              value: totals.event,   color: 'var(--info)',    bg: 'var(--info-light)',    border: 'rgba(36,113,163,.2)' },
              { label: 'Funds',               value: totals.fund,    color: 'var(--warning)', bg: 'var(--warning-light)', border: 'rgba(212,134,10,.2)' },
              { label: 'Other',               value: totals.other,   color: 'var(--text-secondary)', bg: 'var(--neutral-light)', border: 'var(--border-card)' },
            ].map(k => (
              <div key={k.label} style={{ padding: '12px 14px', background: k.bg, borderRadius: 10, border: '1px solid ' + k.border }}>
                <div style={{ fontSize: 11.5, color: k.color, fontWeight: 600, marginBottom: 5, textTransform: 'uppercase', letterSpacing: '.04em' }}>{k.label}</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: k.color }}>{formatCurrency(k.value, org.currency_symbol)}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* My Required Dues — tile cards */}
        <Card style={{ display: 'flex', flexDirection: 'column' }}>
          <CardHeader title="My Required Dues" subtitle="Dues expected this year — click a tile for details" />
          <div style={{ padding: '14px 16px', flex: 1 }}>
            {panelDues.length === 0
              ? <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)', fontSize: 13 }}>No required dues found.</div>
              : (
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(3, 1fr)', gap: 12 }}>
                  {panelDues.map(f => (
                    <DueTileCard
                      key={f.id}
                      fund={f}
                      org={org}
                      onClick={() => setSelectedDue(f)}
                    />
                  ))}
                </div>
              )
            }
          </div>

          {/* View All Dues button */}
          <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border-inner)', textAlign: 'center' }}>
            <button
              onClick={() => { setDuesPage(1); setShowAllDues(true) }}
              style={{
                padding: '8px 28px', borderRadius: 8,
                border: '1.5px solid var(--accent)',
                background: 'var(--accent-light)', color: 'var(--accent)',
                cursor: 'pointer', fontSize: 13, fontWeight: 600,
                fontFamily: 'var(--font-body)', transition: 'background .15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--accent)' && (e.currentTarget.style.color = '#fff')}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--accent-light)'; e.currentTarget.style.color = 'var(--accent)' }}>
              View All Dues ({MOCK_FUNDS.length})
            </button>
          </div>
        </Card>
      </div>

      {/* Full transaction history table */}
      <DataTable
        columns={columns}
        data={myTx}
        title="My Transaction History"
        subtitle="All your financial contributions and dues"
        emptyMsg="No transactions found."
      />

      {/* ── Due Detail InfoModal ─────────────────────────────── */}
      {selectedDue && (
        <InfoModal
          open={!!selectedDue}
          onClose={() => setSelectedDue(null)}
          title={selectedDue.name}
          subtitle={selectedDue.description || 'Fund details and payment information'}
          accentColor={selectedDue.is_required ? 'var(--accent)' : 'var(--success)'}
          footer={
            <>
              <Button variant="secondary" onClick={() => setSelectedDue(null)}>Close</Button>
              <Button>Pay Now</Button>
            </>
          }>
          <DueDetailContent fund={selectedDue} org={org} />
        </InfoModal>
      )}

      {/* ── View All Dues InfoModal ──────────────────────────── */}
      <InfoModal
        open={showAllDues}
        onClose={() => setShowAllDues(false)}
        title="All Dues & Funds"
        subtitle={`${ALL_FUNDS.length} total funds · Page ${duesPage} of ${duesPages}`}
        footer={<Button variant="secondary" onClick={() => setShowAllDues(false)}>Close</Button>}>
        <div>
          {/* Tile grid in modal */}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(3, 1fr)', gap: 14, marginBottom: 20 }}>
            {pagedDues.map(f => (
              <DueTileCard
                key={f.id}
                fund={f}
                org={org}
                onClick={() => { setShowAllDues(false); setSelectedDue(f) }}
              />
            ))}
          </div>
          {/* Pagination */}
          <Pagination page={duesPage} total={duesPages} onChange={setDuesPage} />
        </div>
      </InfoModal>
    </div>
  )
}

/* ── DueTileCard — square-ish tile card for a fund/due ───────────── */
// Status derives from whether annual_fee is set and a mock "amount_paid" field
// paid: annual_fee fully covered → green
// partial: some amount paid but not full → amber
// unpaid: no payment recorded → red
function DueTileCard({ fund, org, onClick }) {
  // Derive payment status from mock data (in real app, would come from member_dues table)
  // For demo: use fund.id to assign varied statuses
  const idNum = parseInt(fund.id, 10) || 1
  const demoStatus = idNum % 3 === 0 ? 'partial' : idNum % 2 === 0 ? 'paid' : 'unpaid'
  const payStatus   = fund.due_status || demoStatus  // real field or demo

  const statusMap = {
    paid:    { color: '#2E7D52', bg: '#e8f7ef', label: 'Paid',        strip: '#2E7D52' },
    partial: { color: '#D4860A', bg: '#fff8ec', label: 'Partial',     strip: '#D4860A' },
    unpaid:  { color: '#C0392B', bg: '#fdecea', label: 'Unpaid',      strip: '#C0392B' },
  }
  const st = statusMap[payStatus] || statusMap.unpaid
  // Border accent is always the status color so it's immediately clear
  const borderC = st.color

  return (
    <div
      onClick={onClick}
      style={{
        borderRadius: 12,
        border: `2px solid ${borderC}40`,
        background: '#fff',
        cursor: 'pointer',
        overflow: 'hidden',
        transition: 'transform .15s, box-shadow .15s',
        display: 'flex', flexDirection: 'column',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 8px 20px ${borderC}30` }}
      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}>

      {/* Status-colored top strip */}
      <div style={{ height: 6, background: st.strip }} />

      <div style={{ padding: '12px 14px', flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* Fund name */}
        <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.3, color: 'var(--text-primary)' }}>
          {fund.name}
        </div>

        {/* Status pill — color reflects payment state */}
        <div style={{
          display: 'inline-flex', alignItems: 'center',
          padding: '3px 10px', borderRadius: 20,
          background: st.bg, color: st.color,
          fontSize: 11, fontWeight: 700, letterSpacing: '.03em',
          width: 'fit-content',
        }}>
          {st.label}
        </div>

        {/* Amount */}
        <div style={{ fontSize: 18, fontWeight: 800, color: st.color, marginTop: 2 }}>
          {formatCurrency(fund.annual_fee || fund.balance, org.currency_symbol)}
        </div>

        {/* Frequency */}
        {fund.payment_frequency && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11.5, color: 'var(--text-muted)' }}>
            <IcoCalendar />
            {fund.payment_frequency.charAt(0).toUpperCase() + fund.payment_frequency.slice(1)}
          </div>
        )}

        {/* View hint */}
        <div style={{ fontSize: 11, color: st.color, fontWeight: 600, marginTop: 'auto', paddingTop: 6, borderTop: '1px solid var(--border-inner)' }}>
          Click for details →
        </div>
      </div>
    </div>
  )
}

/* ── DueDetailContent — body of the Due InfoModal ─────────────────── */
// IMPORTANT: useBreakpoint() must be called inside this sub-component directly
// — sub-components cannot access variables from a parent component's scope.
function DueDetailContent({ fund, org }) {
  const { isMobile } = useBreakpoint()                   // own hook call — fixes ReferenceError
  const accentC = fund.is_required ? 'var(--accent)' : 'var(--success)'
  const bgC     = fund.is_required ? 'var(--accent-light)' : 'var(--success-light)'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {/* Hero */}
      <div style={{ padding: '18px 20px', borderRadius: 12, background: bgC, border: '1.5px solid ' + accentC + '30' }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: accentC, marginBottom: 6 }}>
          {formatCurrency(fund.annual_fee || fund.balance, org.currency_symbol)}
        </div>
        <div style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          {fund.description || 'No description provided.'}
        </div>
      </div>

      {/* Detail grid */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 12 }}>
        {[
          ['Fund Name',       fund.name],
          ['Type',            fund.fund_type ? (fund.fund_type.charAt(0).toUpperCase() + fund.fund_type.slice(1)) : '—'],
          ['Required',        fund.is_required ? 'Yes — all members' : 'No'],
          ['Status',          fund.status.charAt(0).toUpperCase() + fund.status.slice(1)],
          ['Pay Frequency',   fund.payment_frequency ? (fund.payment_frequency.charAt(0).toUpperCase() + fund.payment_frequency.slice(1)) : '—'],
          ['Annual Fee',      fund.annual_fee ? formatCurrency(fund.annual_fee, org.currency_symbol) : '—'],
          ['Current Balance', formatCurrency(fund.balance, org.currency_symbol)],
          ['Managed by',      fund.created_by],
        ].map(([k, v]) => (
          <div key={k} style={{ padding: '12px 14px', borderRadius: 10, background: 'var(--neutral-light)', border: '1px solid var(--border-card)' }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 4 }}>{k}</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{v}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
