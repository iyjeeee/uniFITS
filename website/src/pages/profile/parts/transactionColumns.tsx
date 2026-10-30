// parts/transactionColumns.tsx — Column definitions for the My Transaction History table
import { Badge, StatusBadge } from '../../../components/ui'
import { formatDate, formatCurrency, getPaymentMethodName } from '../../../api/mockData'
import type { Transaction, Column, OrgConfig } from '../../../types'
import { isOutflow } from '../../../utils/ledger'

/** buildTransactionColumns — table columns (stable keys; descriptions come from the row data) */
export function buildTransactionColumns(org: OrgConfig): Column<Transaction>[] {
  return [
    { label: '#',           key: 'num',  render: (_, i) => <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>{i + 1}</span> },
    { label: 'Date',        key: 'date', render: (r) => <span style={{ fontSize: 13 }}>{formatDate(r.transaction_date)}</span> },
    { label: 'Type',        key: 'type', render: (r) => <Badge variant={isOutflow(r) ? 'danger' : 'success'}>{r.entry_type.charAt(0).toUpperCase() + r.entry_type.slice(1)}</Badge> },
    { label: 'Amount',      key: 'amt',  render: (r) => <span style={{ fontWeight: 700, color: isOutflow(r) ? 'var(--danger)' : 'var(--success)' }}>{formatCurrency(r.amount, org.currency_symbol)}</span> },
    { label: 'Category',    key: 'cat', accessor: 'category', render: (r) => <Badge variant="neutral">{r.category.charAt(0).toUpperCase() + r.category.slice(1)}</Badge> },
    { label: 'Description', key: 'desc', accessor: 'description', render: (r) => <span style={{ fontSize: 13 }}>{r.description || '—'}</span> },
    { label: 'Method',      key: 'mth', render: (r) => <span style={{ fontSize: 13 }}>{getPaymentMethodName(r.payment_method_id)}</span> },
    { label: 'Reference',   key: 'ref',  render: (r) => <code style={{ fontSize: 11, color: 'var(--text-primary)', fontFamily: 'monospace' }}>{r.reference_number}</code> },
    { label: 'Status',      key: 'st',   render: (r) => <StatusBadge status={r.status} /> },
  ]
}
