// Transactions.jsx — Full financial transaction ledger with receipt modal
import { useState } from 'react'
import { DataTable, Button, StatusBadge, Badge, Modal } from '../../components/ui'
import { MOCK_TRANSACTIONS, formatCurrency, formatDate } from '../../api/mockData'
import { useOrg } from '../../context/OrgContext'

export default function Transactions() {
  const org           = useOrg()
  const [data]        = useState(MOCK_TRANSACTIONS)
  const [receipt, setReceipt] = useState(null) // selected tx for receipt modal

  const columns = [
    { label: '#',         key: 'num',    render: (r, i) => <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>{i + 1}</span> },
    { label: 'Reference', key: 'ref',    render: r => <code style={{ fontSize: 11, background: 'var(--neutral-light)', padding: '2px 6px', borderRadius: 4 }}>{r.reference_number}</code> },
    { label: 'Person',    key: 'person', render: r => r.user_name || <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>External</span> },
    { label: 'Amount',    key: 'amt',    render: r => (
        <span style={{ fontWeight: 700, color: r.entry_type === 'expense' ? 'var(--danger)' : 'var(--success)' }}>
          {r.entry_type === 'expense' ? '−' : '+'}{formatCurrency(r.amount, org.currency_symbol)}
        </span>
      )},
    { label: 'Type',      key: 'type',   render: r => <Badge variant={r.entry_type === 'expense' ? 'danger' : 'success'}>{r.entry_type}</Badge> },
    { label: 'Category',  accessor: 'category', render: r => <span style={{ textTransform: 'capitalize', fontSize: 13 }}>{r.category}</span> },
    { label: 'Fund',      accessor: 'fund' },
    { label: 'Method',    accessor: 'payment_method' },
    { label: 'Status',    key: 'st',     render: r => <StatusBadge status={r.status} /> },
    { label: 'Date',      key: 'date',   render: r => <span style={{ fontSize: 13 }}>{formatDate(r.transaction_date)}</span> },
    { label: 'Actions',   key: 'act',    render: r => (
        <div style={{ display: 'flex', gap: 6 }}>
          <Button variant="secondary" size="sm" onClick={() => setReceipt(r)}>Receipt</Button>
          <Button variant="danger"    size="sm">Delete</Button>
        </div>
      )},
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 4 }}>
        <Button>+ Add {org.transaction_label}</Button>
      </div>

      <DataTable
        columns={columns}
        data={data}
        title={`${org.transaction_label} Data Table`}
        emptyMsg="No transactions found."
      />

      {/* Receipt Modal */}
      <Modal open={!!receipt} onClose={() => setReceipt(null)} title="Transaction Receipt" width={480}>
        {receipt && (
          <div style={{ fontFamily: 'var(--font-body)' }}>
            {/* Receipt header */}
            <div style={{ background: 'var(--accent)', color: '#fff', padding: '16px 22px', borderRadius: 10, textAlign: 'center', marginBottom: 18 }}>
              <div style={{ fontSize: 16, fontWeight: 700 }}>Transaction Receipt</div>
              <div style={{ fontSize: 12, opacity: .8, marginTop: 3 }}>Official Proof of {org.transaction_label}</div>
            </div>

            {/* Key-value grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
              {[
                ['Transaction ID', receipt.id],
                ['Encoded By',     'Current User'],
                ['Date & Time',    formatDate(receipt.transaction_date)],
                ['Member',         receipt.user_name || '—'],
                ['Status',         receipt.status],
                ['Reference #',    receipt.reference_number],
              ].map(([k, v]) => (
                <div key={k}>
                  <div style={{ fontSize: 10.5, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 2 }}>{k}</div>
                  <div style={{ fontSize: 13.5, fontWeight: 600 }}>{v}</div>
                </div>
              ))}
            </div>

            {/* Transaction flow */}
            <div style={{ background: 'var(--neutral-light)', borderRadius: 8, padding: '12px 16px', marginBottom: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.06em' }}>Transaction Flow</div>
              <div style={{ fontSize: 13.5 }}>
                <div><strong>From:</strong> {receipt.user_name || 'External'}</div>
                <div style={{ marginTop: 4 }}><strong>To:</strong> {receipt.fund}</div>
                <div style={{ marginTop: 6 }}>
                  <Badge variant={receipt.entry_type === 'expense' ? 'danger' : 'success'}>{receipt.entry_type}</Badge>
                </div>
              </div>
            </div>

            {/* Amounts */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 3 }}>Category</div>
                <div style={{ fontSize: 14, textTransform: 'capitalize' }}>{receipt.category}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 3 }}>Amount</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--success)' }}>{formatCurrency(receipt.amount, org.currency_symbol)}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 3 }}>Payment Method</div>
                <div style={{ fontSize: 14 }}>{receipt.payment_method}</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 18 }}>
              <Button variant="secondary" onClick={() => setReceipt(null)}>Close</Button>
              <Button onClick={() => window.print()}>Print Receipt</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
