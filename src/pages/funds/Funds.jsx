// Funds.jsx — Manage all financial funds with tighter layout, no emoji
import { useState } from 'react'
import { Card, CardHeader, Button, StatusBadge } from '../../components/ui'
import { MOCK_FUNDS, MOCK_TRANSACTIONS, formatCurrency } from '../../api/mockData'
import { useOrg } from '../../context/OrgContext'

// Section label icon — lock for internal, globe for external
function IconLock() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
}
function IconGlobe() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
}

export default function Funds() {
  const org     = useOrg()
  const [funds] = useState(MOCK_FUNDS)

  const totalBalance  = funds.reduce((s, f) => s + f.balance, 0)
  const activeFunds   = funds.filter(f => f.status === 'active').length
  const inactiveFunds = funds.filter(f => f.status !== 'active').length

  const internal = funds.filter(f => f.fund_type === 'internal')
  const external = funds.filter(f => f.fund_type === 'external')

  // Section heading row helper
  function SectionLabel({ icon, label }) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 11.5, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 4 }}>
        <Button>+ Add {org.fund_label}</Button>
      </div>
        <span style={{ display: 'flex', color: 'var(--text-muted)' }}>{icon}</span>
        {label}
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

      {/* Summary KPIs — compact */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {[
          { label: `Total ${org.fund_label}s`, value: funds.length,                             color: 'var(--text-primary)', bg: 'var(--neutral-light)'  },
          { label: 'Active',                   value: activeFunds,                               color: 'var(--success)',      bg: 'var(--success-light)'  },
          { label: 'Inactive',                 value: inactiveFunds,                             color: 'var(--danger)',       bg: 'var(--danger-light)'   },
          { label: 'Running Balance',          value: formatCurrency(totalBalance, org.currency_symbol), color: 'var(--warning)', bg: 'var(--warning-light)' },
        ].map(k => (
          <Card key={k.label} style={{ padding: '14px 18px', background: k.bg, border: 'none' }}>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>{k.label}</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: k.color }}>{k.value}</div>
          </Card>
        ))}
      </div>

      {/* Internal funds */}
      {internal.length > 0 && (
        <div>
          <SectionLabel icon={<IconLock />} label="Internal Funds (Required)" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
            {internal.map(fund => <FundCard key={fund.id} fund={fund} org={org} />)}
          </div>
        </div>
      )}

      {/* External funds */}
      {external.length > 0 && (
        <div>
          <SectionLabel icon={<IconGlobe />} label="External Funds" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
            {external.map(fund => <FundCard key={fund.id} fund={fund} org={org} />)}
          </div>
        </div>
      )}

      {/* Transactions link stub */}
      <Card>
        <CardHeader title={`${org.fund_label} Transactions`} actions={<Button size="sm">+ Add {org.fund_label}</Button>} />
        <div style={{ padding: '18px 20px', fontSize: 13.5, color: 'var(--text-muted)' }}>
          View all fund transactions in the{' '}
          <a href="#/transactions" style={{ color: 'var(--accent)', fontWeight: 500 }}>Transactions</a> section.
        </div>
      </Card>
    </div>
  )
}

// FundCard — individual fund detail card
function FundCard({ fund, org }) {
  return (
    <Card style={{ padding: '16px 18px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{fund.name}</div>
          <StatusBadge status={fund.status} />
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <Button variant="secondary" size="sm">Edit</Button>
          {!fund.is_required && <Button variant="danger" size="sm">Delete</Button>}
        </div>
      </div>

      <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--success)', marginBottom: 12 }}>
        {formatCurrency(fund.balance, org.currency_symbol)}
      </div>

      {[
        ['Owner',          fund.created_by],
        ['Currency',       fund.currency || 'PHP'],
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
