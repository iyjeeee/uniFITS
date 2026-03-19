// PersonalTransactions.jsx — Individual member's financial contributions and dues
import { useState } from 'react'
import { Card, CardHeader, Button, StatusBadge, Badge, DataTable, PageHeader } from '../../components/ui'
import { MOCK_TRANSACTIONS, MOCK_FUNDS, formatCurrency, formatDate } from '../../api/mockData'
import { useOrg } from '../../context/OrgContext'

export default function PersonalTransactions({ userId = '1' }) {
  const org = useOrg()
  // Filter transactions for the current user
  const myTx = MOCK_TRANSACTIONS.filter(t => t.user_id === userId)

  // Compute contribution totals by category
  const totals = { total: 0, project: 0, event: 0, fund: 0, other: 0 }
  myTx.filter(t => t.entry_type !== 'expense').forEach(t => {
    totals.total += t.amount
    if (totals[t.category] !== undefined) totals[t.category] += t.amount
    else totals.other += t.amount
  })

  // Required dues from required funds
  const requiredFunds = MOCK_FUNDS.filter(f => f.is_required)
  const totalDue = requiredFunds.reduce((s, f) => s + (f.annual_fee || 0), 0)

  const columns = [
    { label: '#',         key: 'num',  render: (_, i) => i + 1 },
    { label: 'Date',      key: 'date', render: r => formatDate(r.transaction_date) },
    { label: 'Type',      key: 'type', render: r => <Badge variant={r.entry_type === 'expense' ? 'danger' : 'success'}>{r.entry_type}</Badge> },
    { label: 'Amount',    key: 'amt',  render: r => <span style={{ fontWeight: 700, color: 'var(--success)' }}>{formatCurrency(r.amount, org.currency_symbol)}</span> },
    { label: 'Category',  accessor: 'category', render: r => <span style={{ textTransform: 'capitalize' }}>{r.category}</span> },
    { label: 'Description', accessor: 'description' },
    { label: 'Method',    accessor: 'payment_method' },
    { label: 'Reference', key: 'ref', render: r => <code style={{ fontSize: 11.5 }}>{r.reference_number}</code> },
    { label: 'Status',    key: 'st',  render: r => <StatusBadge status={r.status} /> },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <PageHeader title="Personal Transactions" subtitle="Your individual financial contributions and dues" />

      {/* Contributions summary + required dues */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Card>
          <CardHeader title="My Contributions Summary" />
          <div style={{ padding: '16px 20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {[
              { label: 'Total Contributions', value: totals.total, color: 'var(--success)' },
              { label: `${org.project_label}s`, value: totals.project, color: 'var(--accent)' },
              { label: `${org.event_label}s`, value: totals.event, color: 'var(--info)' },
              { label: org.fund_label, value: totals.fund, color: 'var(--warning)' },
              { label: 'Other Purposes', value: totals.other, color: 'var(--text-muted)' },
            ].map(k => (
              <div key={k.label} style={{ padding: '12px 14px', background: 'var(--neutral-light)', borderRadius: 8 }}>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>{k.label}</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: k.color }}>{formatCurrency(k.value, org.currency_symbol)}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader title="My Required Dues" subtitle="Dues expected to pay this year" />
          <div style={{ padding: '16px 20px' }}>
            {requiredFunds.map(f => (
              <div key={f.id} style={{ marginBottom: 14, padding: '12px 14px', background: 'var(--neutral-light)', borderRadius: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{f.name}</div>
                  <Badge variant="danger">Unpaid</Badge>
                </div>
                <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--danger)', marginBottom: 8 }}>{formatCurrency(totalDue, org.currency_symbol)}</div>
                <Button size="sm" style={{ width: '100%', justifyContent: 'center' }}>View All Dues</Button>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Full transaction history table */}
      <DataTable
        columns={columns}
        data={myTx}
        title="My Transaction History"
        subtitle="Filter by category to view specific contributions"
        emptyMsg="No transactions found."
      />
    </div>
  )
}
