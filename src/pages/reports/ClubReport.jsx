// ClubReport.jsx — Org-level report with yearly financial breakdown, exportable
import { useState } from 'react'
import { Card, CardHeader, Button, Select } from '../../components/ui'
import { MOCK_USERS, MOCK_PROJECTS, MOCK_EVENTS, MOCK_TRANSACTIONS, MOCK_UTILITIES, formatCurrency } from '../../api/mockData'
import { useOrg } from '../../context/OrgContext'

const REPORT_TYPE_OPTIONS = [
  { value: 'yearly',    label: 'Yearly'    },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'monthly',   label: 'Monthly'   },
]
const YEAR_OPTIONS = [2025, 2024, 2023].map(y => ({ value: String(y), label: String(y) }))

// PDF export icon — no emoji
function IconExportPDF() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
}

export default function ClubReport() {
  const org  = useOrg()
  const [reportType, setReportType] = useState('yearly')
  const [reportYear, setReportYear] = useState('2025')
  const [generated,  setGenerated]  = useState(false)

  const totalFundBalance    = 140500
  const totalProjectIncome  = MOCK_TRANSACTIONS.filter(t => t.category === 'project' && t.entry_type !== 'expense').reduce((s, t) => s + t.amount, 0)
  const totalEventIncome    = MOCK_TRANSACTIONS.filter(t => t.category === 'event'   && t.entry_type !== 'expense').reduce((s, t) => s + t.amount, 0)
  const totalProjectExpense = MOCK_TRANSACTIONS.filter(t => t.category === 'project' && t.entry_type === 'expense').reduce((s, t) => s + t.amount, 0)
  const totalEventExpense   = MOCK_TRANSACTIONS.filter(t => t.category === 'event'   && t.entry_type === 'expense').reduce((s, t) => s + t.amount, 0)
  const totalUtilityExpense = MOCK_UTILITIES.reduce((s, u) => s + u.total_amount, 0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

      {/* Generator controls */}
      <Card>
        <CardHeader
          title="Generate Report"
          actions={<Button icon={<IconExportPDF />}>Export PDF</Button>}
        />
        <div style={{ padding: '16px 20px', display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <Select label="Report Type"   value={reportType} onChange={e => setReportType(e.target.value)} options={REPORT_TYPE_OPTIONS} />
          <Select label="Report Period" value={reportYear} onChange={e => setReportYear(e.target.value)} options={YEAR_OPTIONS} />
          <Button onClick={() => setGenerated(true)}>Generate Report</Button>
        </div>
      </Card>

      {/* Generated report */}
      {generated && (
        <Card>
          {/* Report header */}
          <div style={{ padding: '22px 28px', borderBottom: '1px solid var(--border)', textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>uniFITS Organization</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--accent)', marginTop: 3 }}>Organization {org.report_label}</div>
            <div style={{ fontSize: 12.5, color: 'var(--text-muted)', marginTop: 3 }}>Generated: {new Date().toLocaleString('en-PH')}</div>
            <div style={{ fontSize: 13, fontWeight: 600, marginTop: 3 }}>Report Period: {reportYear}</div>
          </div>

          {/* Summary stat row */}
          <div style={{ padding: '16px 28px', borderBottom: '1px solid var(--border)', display: 'flex', gap: 28, flexWrap: 'wrap' }}>
            {[
              [`${org.people_label}s`, MOCK_USERS.length],
              [`${org.project_label}s`, MOCK_PROJECTS.length],
              [`${org.event_label}s`,   MOCK_EVENTS.length],
              ['Report Period',          reportYear],
            ].map(([k, v]) => (
              <div key={k}>
                <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginBottom: 2 }}>{k}</div>
                <div style={{ fontSize: 18, fontWeight: 700 }}>{v}</div>
              </div>
            ))}
          </div>

          {/* Financial breakdown table */}
          <div style={{ padding: '20px 28px' }}>
            <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 12 }}>Summary & Financial Breakdown</div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: 'var(--accent)', color: '#fff' }}>
                    {[
                      'Overall Fund Balance',
                      `Overall ${org.project_label} Income`,
                      `Overall ${org.event_label} Income`,
                      `Overall ${org.project_label} Expense`,
                      `Overall ${org.event_label} Expense`,
                      `Overall ${org.utility_label} Expense`,
                    ].map(h => (
                      <th key={h} style={{ padding: '9px 14px', textAlign: 'left', fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap', letterSpacing: '.03em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    {[totalFundBalance, totalProjectIncome, totalEventIncome, totalProjectExpense, totalEventExpense, totalUtilityExpense].map((v, i) => (
                      <td key={i} style={{ padding: '12px 14px', fontWeight: 700, fontSize: 14 }}>{formatCurrency(v, org.currency_symbol)}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
