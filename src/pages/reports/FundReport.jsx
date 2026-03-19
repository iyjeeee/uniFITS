// FundReport.jsx — Fund summary report with balance breakdown, no emoji
import { Card, CardHeader, Button, StatusBadge } from '../../components/ui'
import { MOCK_FUNDS, formatCurrency } from '../../api/mockData'
import { useOrg } from '../../context/OrgContext'

function IconLock()  { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> }
function IconGlobe() { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg> }

function SectionLabel({ icon, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 11.5, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 4 }}>
        <Button>Export PDF</Button>
      </div>
      <span style={{ display: 'flex', color: 'var(--text-muted)' }}>{icon}</span>
      {label}
    </div>
  )
}

export default function FundReport() {
  const org          = useOrg()
  const totalBalance = MOCK_FUNDS.reduce((s, f) => s + f.balance, 0)
  const active       = MOCK_FUNDS.filter(f => f.status === 'active').length
  const inactive     = MOCK_FUNDS.filter(f => f.status !== 'active').length
  const required     = MOCK_FUNDS.filter(f => f.is_required)
  const optional     = MOCK_FUNDS.filter(f => !f.is_required)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {[
          { label: `Total ${org.fund_label}s`, value: MOCK_FUNDS.length,                             bg: 'var(--neutral-light)',  color: 'var(--text-primary)' },
          { label: 'Active',                   value: active,                                         bg: 'var(--success-light)',  color: 'var(--success)'      },
          { label: 'Inactive',                 value: inactive,                                       bg: 'var(--danger-light)',   color: 'var(--danger)'       },
          { label: 'Overall Balance',          value: formatCurrency(totalBalance, org.currency_symbol), bg: 'var(--warning-light)', color: 'var(--warning)'  },
        ].map(k => (
          <Card key={k.label} style={{ padding: '14px 18px', background: k.bg, border: 'none' }}>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>{k.label}</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: k.color }}>{k.value}</div>
          </Card>
        ))}
      </div>

      {/* Required funds */}
      {required.length > 0 && (
        <div>
          <SectionLabel icon={<IconLock />} label={`Funds Required for All ${org.people_label}s`} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
            {required.map(f => <FundSummaryCard key={f.id} fund={f} org={org} />)}
          </div>
        </div>
      )}

      {/* Optional funds */}
      {optional.length > 0 && (
        <div>
          <SectionLabel icon={<IconGlobe />} label={`Funds NOT Required for All ${org.people_label}s`} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
            {optional.map(f => <FundSummaryCard key={f.id} fund={f} org={org} />)}
          </div>
        </div>
      )}
    </div>
  )
}

function FundSummaryCard({ fund, org }) {
  return (
    <Card style={{ padding: '16px 18px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <div style={{ fontSize: 14, fontWeight: 700 }}>{fund.name}</div>
        <StatusBadge status={fund.status} />
      </div>
      <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--success)', marginBottom: 12 }}>
        {formatCurrency(fund.balance, org.currency_symbol)}
      </div>
      {[
        ['Owner',          fund.created_by],
        ['Required',       fund.is_required ? 'Yes' : 'No'],
        ['Pay Frequency',  fund.payment_frequency || '—'],
        ['Annual Fee',     fund.annual_fee ? formatCurrency(fund.annual_fee, org.currency_symbol) : '—'],
        ['Description',    fund.description || '—'],
      ].map(([k, v]) => (
        <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid var(--border)', fontSize: 12.5 }}>
          <span style={{ color: 'var(--text-muted)' }}>{k}</span>
          <span style={{ fontWeight: 500 }}>{v}</span>
        </div>
      ))}
    </Card>
  )
}
