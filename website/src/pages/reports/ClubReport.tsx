// ClubReport.jsx — Comprehensive org-level financial report
// Includes: income statement, balance summary, fund breakdown, activity P&L,
// member stats, utility expense breakdown, and a printable layout.
import { useState } from 'react'
import { Card, Button, ResponseModal } from '../../components/ui'
import {
  MOCK_USERS, MOCK_PROJECTS, MOCK_EVENTS, MOCK_FUNDS,
  MOCK_TRANSACTIONS, MOCK_UTILITIES, formatCurrency,
} from '../../api/mockData'
import { useOrg } from '../../context/OrgContext'
import useBreakpoint from '../../hooks/useBreakpoint'

const REPORT_TYPE_OPTIONS = [
  { value: 'annual',    label: 'Annual Report'    },
  { value: 'quarterly', label: 'Quarterly Report' },
  { value: 'monthly',   label: 'Monthly Report'   },
]

/* ── SVG Icons ─────────────────────────────────────────────────────── */
function IcoPDF()    { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> }
function IcoPrint()  { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg> }

/* ── Section divider ─────────────────────────────────────────────── */
function ReportSection({ title, children }: Record<string, any>) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase' as const, letterSpacing: '.06em', paddingBottom: 8, borderBottom: '2px solid var(--accent)', marginBottom: 14 }}>
        {title}
      </div>
      {children}
    </div>
  )
}

/* ── Two-col stat row ─────────────────────────────────────────────── */
function StatRow({ label, value, color, bold, indent, border, whiteLabel }: Record<string, any>) {
  // whiteLabel=true: INCOME/EXPENSES/NET SURPLUS header rows — accent bg, white text
  // bold without whiteLabel: total rows — color-tinted light bg so green/red stays visible
  const isHeader   = bold && whiteLabel
  const isTotalRow = bold && !whiteLabel
  const rowBg = isHeader
    ? 'var(--accent)'
    : isTotalRow
      ? color === 'var(--success)' ? 'rgba(46,125,82,.10)'
      : color === 'var(--danger)'  ? 'rgba(192,57,43,.10)'
      : 'rgba(75,94,170,.10)'
    : 'transparent'
  return (
    <div style={{
      display: 'flex' as const, justifyContent: 'space-between', alignItems: 'center',
      padding: '9px 14px',
      paddingLeft: indent ? 28 : 14,
      borderBottom: border ? '2px solid var(--text-primary)' : '1px solid var(--border-inner)',
      background: rowBg,
    }}>
      <span style={{ fontSize: 13.5, fontWeight: bold ? 700 : 400, color: isHeader ? '#fff' : 'var(--text-primary)' }}>{label}</span>
      <span style={{ fontSize: 14, fontWeight: bold ? 800 : 600, color: isHeader ? '#fff' : (color || 'var(--text-primary)') }}>{value}</span>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════════ */
export default function ClubReport() {
  const org = useOrg()
  const { isMobile } = useBreakpoint()
  const [reportType,   setReportType]   = useState('annual')
  const [reportPeriod, setReportPeriod] = useState('2025')
  const [generated,    setGenerated]    = useState(false)
  const [exportResult, setExportResult] = useState<{variant:string;title:string;message:string} | null>(null)

  /* ── Dynamic period options based on report type ─────────────── */
  const YEARS = [2025, 2024, 2023]
  const QUARTERS = ['Q1 (Jan–Mar)', 'Q2 (Apr–Jun)', 'Q3 (Jul–Sep)', 'Q4 (Oct–Dec)']
  const MONTHS   = ['January','February','March','April','May','June','July','August','September','October','November','December']

  const periodOptions = reportType === 'annual'
    ? YEARS.map(y    => ({ value: String(y),           label: String(y)           }))
    : reportType === 'quarterly'
    ? QUARTERS.map((q: any) => ({ value: q,                   label: q                   }))
    : MONTHS.map(m   => ({ value: m + ' 2025',         label: m + ' 2025'         }))

  // Reset period when type changes
  function handleTypeChange(e: React.FormEvent | React.ChangeEvent<any>) {
    setReportType(e.target.value)
    setReportPeriod(e.target.value === 'annual' ? '2025' : e.target.value === 'quarterly' ? 'Q1 (Jan–Mar)' : 'January 2025')
    setGenerated(false)
  }

  /* ── Computed financials ─────────────────────────────────────── */
  const totalFundBalance    = MOCK_FUNDS.reduce((s, f) => s + f.balance, 0)

  // Income
  const memberDues          = MOCK_TRANSACTIONS.filter((t: any) => t.entry_type === 'contribution').reduce((s, t) => s + t.amount, 0)
  const projectIncome       = MOCK_TRANSACTIONS.filter((t: any) => t.category === 'project' && t.entry_type === 'income').reduce((s, t) => s + t.amount, 0)
  const eventIncome         = MOCK_TRANSACTIONS.filter((t: any) => t.category === 'event'   && t.entry_type === 'income').reduce((s, t) => s + t.amount, 0)
  const fundIncome          = MOCK_TRANSACTIONS.filter((t: any) => t.category === 'fund'    && t.entry_type === 'income').reduce((s, t) => s + t.amount, 0)
  const totalIncome         = memberDues + projectIncome + eventIncome + fundIncome

  // Expenses
  const projectExpense      = MOCK_TRANSACTIONS.filter((t: any) => t.category === 'project' && t.entry_type === 'expense').reduce((s, t) => s + t.amount, 0)
  const eventExpense        = MOCK_TRANSACTIONS.filter((t: any) => t.category === 'event'   && t.entry_type === 'expense').reduce((s, t) => s + t.amount, 0)
  const utilityExpense      = MOCK_UTILITIES.reduce((s, u) => s + u.amount_paid, 0)
  const totalExpense        = projectExpense + eventExpense + utilityExpense
  const netSurplus          = totalIncome - totalExpense

  // Member stats
  const activeMembers       = MOCK_USERS.filter((u: any) => u.status === 'active').length
  const officers            = MOCK_USERS.filter((u: any) => u.role !== 'Member').length
  const regularMembers      = MOCK_USERS.filter((u: any) => u.role === 'Member').length

  // Project stats
  const completedProjects   = MOCK_PROJECTS.filter((p: any) => p.status === 'completed').length
  const ongoingProjects     = MOCK_PROJECTS.filter((p: any) => p.status === 'ongoing').length
  const completedEvents     = MOCK_EVENTS.filter((e: any) => e.status === 'completed').length
  const upcomingEvents      = MOCK_EVENTS.filter((e: any) => e.status === 'upcoming').length

  // Utility breakdown
  const utilByType = MOCK_UTILITIES.reduce((acc: Record<string,any>, u: any) => {
    acc[u.expense_type] = (acc[u.expense_type] || 0) + u.amount_paid
    return acc
  }, {} as Record<string,any>)

  // Fund per-fund breakdown
  const fundRows = MOCK_FUNDS.map((f: any) => {
    const received = MOCK_TRANSACTIONS.filter((t: any) => t.fund === f.name && t.entry_type !== 'expense').reduce((s, t) => s + t.amount, 0)
    const spent    = MOCK_TRANSACTIONS.filter((t: any) => t.fund === f.name && t.entry_type === 'expense').reduce((s, t) => s + t.amount, 0)
    return { ...f, received, spent }
  })

  const cap = (s: any): string => s ? s.charAt(0).toUpperCase() + s.slice(1) : '—'
  const reportTypeLabel = REPORT_TYPE_OPTIONS.find((o: any) => o.value === reportType)?.label || 'Annual Report'

  return (
    <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 14 }}>

      {/* ── Generator controls — all on one row ──────────────────── */}
      <Card style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex' as const, gap: 12, flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          {/* LEFT — selectors + Generate */}
          <div style={{ display: 'flex' as const, gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
            {/* Report Type */}
            <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 4 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' as const, letterSpacing: '.04em' }}>Report Type</label>
              <select value={reportType} onChange={handleTypeChange}
                style={{ padding: '8px 12px', borderRadius: 8, border: '1.5px solid var(--border-card)', fontSize: 13.5, fontFamily: 'var(--font-body)', color: 'var(--text-primary)', background: '#fff', outline: 'none', cursor: 'pointer' as const }}>
                {REPORT_TYPE_OPTIONS.map((o: any) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            {/* Report Period — changes based on type */}
            <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 4 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' as const, letterSpacing: '.04em' }}>
                Report Period {reportType === 'annual' ? '(Year)' : reportType === 'quarterly' ? '(Quarter)' : '(Month)'}
              </label>
              <select value={reportPeriod} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => { setReportPeriod(e.target.value); setGenerated(false) }}
                style={{ padding: '8px 12px', borderRadius: 8, border: '1.5px solid var(--border-card)', fontSize: 13.5, fontFamily: 'var(--font-body)', color: 'var(--text-primary)', background: '#fff', outline: 'none', cursor: 'pointer' as const, minWidth: 180 }}>
                {periodOptions.map((o: any) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <Button onClick={() => setGenerated(true)}>Generate Report</Button>
          </div>

          {/* RIGHT — Print + Export PDF (only visible after Generate) */}
          {generated && (
            <div style={{ display: 'flex' as const, gap: 8, flexShrink: 0 }}>
              <button onClick={() => window.print()}
                style={{ display: 'inline-flex' as const, alignItems: 'center', gap: 6, padding: '9px 16px', borderRadius: 8, border: '1.5px solid var(--border-card)', background: '#fff', color: 'var(--text-primary)', fontSize: 13, fontWeight: 600, cursor: 'pointer' as const, fontFamily: 'var(--font-body)' }}>
                <IcoPrint /> Print
              </button>
              <button onClick={() => setExportResult({ variant: 'success', title: 'PDF Exported', message: `${reportTypeLabel} for ${reportPeriod} has been generated and is ready to download.` })}
                style={{ display: 'inline-flex' as const, alignItems: 'center', gap: 6, padding: '9px 16px', borderRadius: 8, border: 'none', background: 'var(--accent)', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' as const, fontFamily: 'var(--font-body)' }}>
                <IcoPDF /> Export PDF
              </button>
            </div>
          )}
        </div>
      </Card>

      {/* ── Generated Report ─────────────────────────────────────── */}
      {generated && (
        <Card>
          <div style={{ padding: '0 28px 28px' }}>

            {/* ── Report Header ───────────────────────────────── */}
            <div style={{ textAlign: 'center' as const, padding: '28px 0 24px', borderBottom: '2px solid var(--border-inner)', marginBottom: 28 }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>
                uniFITS Organization
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--accent)', marginBottom: 4 }}>
                {cap(reportType)} Financial Report
              </div>
              <div style={{ fontSize: 13.5, color: 'var(--text-muted)', marginBottom: 2 }}>
                Period: {reportPeriod}
              </div>
              <div style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>
                Date Generated: {new Date().toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </div>

            {/* ── Executive Summary ───────────────────────────── */}
            <ReportSection title="I. Executive Summary">
              <div style={{ display: 'grid' as const, gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4,1fr)', gap: 12, marginBottom: 16 }}>
                {[
                  { label: 'Total Members',      value: MOCK_USERS.length,       color: 'var(--accent)'  },
                  { label: 'Active Projects',     value: MOCK_PROJECTS.length,    color: 'var(--warning)' },
                  { label: 'Events Held',         value: completedEvents,         color: 'var(--success)' },
                  { label: 'Fund Balance',        value: formatCurrency(totalFundBalance, org.currency_symbol), color: 'var(--success)' },
                ].map((k: any) => (
                  <div key={k.label} style={{ padding: '14px 16px', borderRadius: 10, background: 'var(--neutral-light)', border: '1.5px solid var(--border-card)', textAlign: 'center' as const }}>
                    <div style={{ fontSize: 22, fontWeight: 800, color: k.color, lineHeight: 1 }}>{k.value}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 5 }}>{k.label}</div>
                  </div>
                ))}
              </div>
              <div style={{ padding: '14px 18px', borderRadius: 10, background: netSurplus >= 0 ? 'var(--success-light)' : 'var(--danger-light)', border: `1.5px solid ${netSurplus >= 0 ? 'rgba(46,125,82,.25)' : 'rgba(192,57,43,.25)'}` }}>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 4 }}>Net Financial Position ({reportPeriod})</div>
                <div style={{ fontSize: 28, fontWeight: 900, color: netSurplus >= 0 ? 'var(--success)' : 'var(--danger)', lineHeight: 1 }}>
                  {netSurplus >= 0 ? '+' : '−'}{formatCurrency(Math.abs(netSurplus), org.currency_symbol)}
                  <span style={{ fontSize: 13, fontWeight: 600, marginLeft: 8 }}>{netSurplus >= 0 ? 'Surplus' : 'Deficit'}</span>
                </div>
              </div>
            </ReportSection>

            {/* ── Income Statement ────────────────────────────── */}
            <ReportSection title="II. Statement of Income & Expenses">
              <div style={{ borderRadius: 10, overflow: 'hidden', border: '1.5px solid var(--border-card)' }}>
                {/* Income */}
                <StatRow label="INCOME" value="" bold whiteLabel />
                <StatRow label="Member Dues & Contributions"     value={formatCurrency(memberDues,    org.currency_symbol)} indent color="var(--success)" />
                <StatRow label="Project-Related Income"          value={formatCurrency(projectIncome, org.currency_symbol)} indent color="var(--success)" />
                <StatRow label="Event-Related Income"            value={formatCurrency(eventIncome,   org.currency_symbol)} indent color="var(--success)" />
                <StatRow label="Other Fund Income"               value={formatCurrency(fundIncome,    org.currency_symbol)} indent color="var(--success)" />
                <StatRow label="Total Income"                    value={formatCurrency(totalIncome,   org.currency_symbol)} bold color="var(--success)" border />

                {/* Expenses */}
                <div style={{ height: 8 }} />
                <StatRow label="EXPENSES" value="" bold whiteLabel />
                <StatRow label="Project Expenses"                value={formatCurrency(projectExpense, org.currency_symbol)} indent color="var(--danger)" />
                <StatRow label="Event Expenses"                  value={formatCurrency(eventExpense,   org.currency_symbol)} indent color="var(--danger)" />
                <StatRow label="Operational / Utility Expenses"  value={formatCurrency(utilityExpense, org.currency_symbol)} indent color="var(--danger)" />
                <StatRow label="Total Expenses"                  value={formatCurrency(totalExpense,   org.currency_symbol)} bold color="var(--danger)" border />

                {/* Net */}
                <div style={{ height: 8 }} />
                <StatRow
                  label={`NET ${netSurplus >= 0 ? 'SURPLUS' : 'DEFICIT'}`} whiteLabel
                  value={`${netSurplus >= 0 ? '+' : '−'}${formatCurrency(Math.abs(netSurplus), org.currency_symbol)}`}
                  bold color={netSurplus >= 0 ? 'var(--success)' : 'var(--danger)'} border
                />
              </div>
            </ReportSection>

            {/* ── Fund Balance Sheet ──────────────────────────── */}
            <ReportSection title="III. Fund Balance Sheet">
              <div style={{ overflowX: 'auto' as const }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: 'var(--accent)' }}>
                      {['Fund Name', 'Type', 'Status', 'Total Received', 'Total Spent', 'Current Balance'].map((h: any) => (
                        <th key={h} style={{ padding: '10px 14px', textAlign: 'left' as const, fontSize: 11, fontWeight: 700, color: '#fff', textTransform: 'uppercase' as const, letterSpacing: '.06em', borderBottom: '2px solid var(--border-table)', whiteSpace: 'nowrap' as const }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {fundRows.map((f, i) => (
                      <tr key={f.id} style={{ background: i % 2 === 0 ? 'var(--neutral-light)' : '#fff', borderBottom: '1px solid var(--border-inner)' }}>
                        <td style={{ padding: '10px 14px', fontWeight: 600 }}>{f.name}</td>
                        <td style={{ padding: '10px 14px', textTransform: 'capitalize' as const }}>{f.fund_type}</td>
                        <td style={{ padding: '10px 14px' }}>
                          <span style={{ padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: f.status === 'active' ? '#2E7D52' : '#C0392B', color: '#fff' }}>
                            {cap(f.status)}
                          </span>
                        </td>
                        <td style={{ padding: '10px 14px', fontWeight: 700, color: 'var(--success)' }}>{formatCurrency(f.received, org.currency_symbol)}</td>
                        <td style={{ padding: '10px 14px', fontWeight: 700, color: 'var(--danger)'  }}>{formatCurrency(f.spent,    org.currency_symbol)}</td>
                        <td style={{ padding: '10px 14px', fontWeight: 800, color: 'var(--accent)'  }}>{formatCurrency(f.balance,  org.currency_symbol)}</td>
                      </tr>
                    ))}
                    <tr style={{ background: '#EAECF0', fontWeight: 700 }}>
                      <td colSpan={3} style={{ padding: '10px 14px', fontWeight: 700 }}>TOTAL</td>
                      <td style={{ padding: '10px 14px', fontWeight: 800, color: 'var(--success)' }}>
                        {formatCurrency(fundRows.reduce((s, f) => s + f.received, 0), org.currency_symbol)}
                      </td>
                      <td style={{ padding: '10px 14px', fontWeight: 800, color: 'var(--danger)' }}>
                        {formatCurrency(fundRows.reduce((s, f) => s + f.spent, 0), org.currency_symbol)}
                      </td>
                      <td style={{ padding: '10px 14px', fontWeight: 800, color: 'var(--accent)' }}>
                        {formatCurrency(totalFundBalance, org.currency_symbol)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </ReportSection>

            {/* ── Operational Expenses Breakdown ──────────────── */}
            <ReportSection title="IV. Operational Expenses Breakdown">
              <div style={{ borderRadius: 10, overflow: 'hidden', border: '1.5px solid var(--border-card)' }}>
                {Object.entries(utilByType).map(([type, amount], _i) => (
                  <StatRow key={type} label={type} value={formatCurrency(amount, org.currency_symbol)} indent color="var(--danger)" />
                ))}
                <StatRow label="Total Operational Expenses" value={formatCurrency(utilityExpense, org.currency_symbol)} bold color="var(--danger)" border />
              </div>
            </ReportSection>

            {/* ── Project & Event Activity Summary ────────────── */}
            <ReportSection title="V. Project & Event Activity Summary">
              <div style={{ display: 'grid' as const, gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16 }}>
                {/* Projects */}
                <div>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--accent)', marginBottom: 10, textTransform: 'uppercase' as const, letterSpacing: '.05em' }}>{org.project_label}s</div>
                  <div style={{ borderRadius: 10, overflow: 'hidden', border: '1.5px solid var(--border-card)' }}>
                    <StatRow label="Total Projects"    value={MOCK_PROJECTS.length} />
                    <StatRow label="Completed"         value={completedProjects} indent color="var(--success)" />
                    <StatRow label="Ongoing"           value={ongoingProjects}   indent color="var(--warning)" />
                    <StatRow label="Total Income"      value={formatCurrency(projectIncome,  org.currency_symbol)} indent color="var(--success)" />
                    <StatRow label="Total Expenses"    value={formatCurrency(projectExpense, org.currency_symbol)} indent color="var(--danger)"  />
                    <StatRow label="Net (Projects)"    value={formatCurrency(projectIncome - projectExpense, org.currency_symbol)} bold color={projectIncome >= projectExpense ? 'var(--success)' : 'var(--danger)'} border />
                  </div>
                </div>
                {/* Events */}
                <div>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--success)', marginBottom: 10, textTransform: 'uppercase' as const, letterSpacing: '.05em' }}>{org.event_label}s</div>
                  <div style={{ borderRadius: 10, overflow: 'hidden', border: '1.5px solid var(--border-card)' }}>
                    <StatRow label="Total Events"      value={MOCK_EVENTS.length} />
                    <StatRow label="Completed"         value={completedEvents}  indent color="var(--success)" />
                    <StatRow label="Upcoming"          value={upcomingEvents}   indent color="var(--warning)" />
                    <StatRow label="Total Income"      value={formatCurrency(eventIncome,  org.currency_symbol)} indent color="var(--success)" />
                    <StatRow label="Total Expenses"    value={formatCurrency(eventExpense, org.currency_symbol)} indent color="var(--danger)"  />
                    <StatRow label="Net (Events)"      value={formatCurrency(eventIncome - eventExpense, org.currency_symbol)} bold color={eventIncome >= eventExpense ? 'var(--success)' : 'var(--danger)'} border />
                  </div>
                </div>
              </div>
            </ReportSection>

            {/* ── Membership Summary ──────────────────────────── */}
            <ReportSection title="VI. Membership Summary">
              <div style={{ borderRadius: 10, overflow: 'hidden', border: '1.5px solid var(--border-card)' }}>
                <StatRow label="Total Registered Members"     value={MOCK_USERS.length} />
                <StatRow label="Active Members"               value={activeMembers}   indent color="var(--success)" />
                <StatRow label="Officers / Committee Members" value={officers}        indent color="var(--accent)"  />
                <StatRow label="Regular Members"              value={regularMembers}  indent color="var(--text-muted)" />
                <StatRow label="Total Member Contributions"   value={formatCurrency(memberDues, org.currency_symbol)} bold color="var(--success)" border />
              </div>
            </ReportSection>

            {/* ── Report footer ───────────────────────────────── */}
            <div style={{ marginTop: 32, paddingTop: 20, borderTop: '2px solid var(--border-inner)', display: 'flex' as const, justifyContent: 'space-between', flexWrap: 'wrap', gap: 24 }}>
              {['Prepared by', 'Reviewed by', 'Approved by'].map(role => (
                <div key={role} style={{ textAlign: 'center' as const, minWidth: 160, flex: 1 }}>
                  {/* Signature space — 72px gives enough room to write */}
                  <div style={{ height: 72, borderBottom: '1.5px solid var(--text-primary)', marginBottom: 8, width: '100%' }} />
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase' as const, letterSpacing: '.06em' }}>{role}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>Signature over Printed Name</div>
                </div>
              ))}
            </div>

          </div>
        </Card>
      )}

      {/* ── Export Result Feedback ─────────────────────────────── */}
      <ResponseModal
        open={!!exportResult}
        onClose={() => setExportResult(null)}
        variant={(exportResult?.variant || 'success') as import('../../types').ModalVariant}
        title={exportResult?.title   || ''}
        message={exportResult?.message || ''}
        confirmLabel="Got it"
      />
    </div>
  )
}
