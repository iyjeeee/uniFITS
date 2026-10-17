// Transactions.tsx — Full ledger matching Projects/Events table style (composition only; state in parts/useTransactions, UI in parts/).
// Statuses: pending, approved, rejected (approval workflow).
// Actions: Approve (green), Reject (red), Delete (dark red) — no receipt button in table.
// Row click opens transaction detail modal (receipt-style).
import { Card, ResponseModal } from '../../components/ui'
import { PaginationRow } from '../../components/TableUtils'
import useTransactions from './parts/useTransactions'
import TransactionsKpiStrip from './parts/TransactionsKpiStrip'
import TransactionsToolbar from './parts/TransactionsToolbar'
import TransactionsTable from './parts/TransactionsTable'
import TransactionReceiptModal from './parts/TransactionReceiptModal'
import DeleteTransactionModal from './parts/DeleteTransactionModal'
import type { ModalVariant } from '../../types'

export default function Transactions() {
  const t = useTransactions()
  return (
    <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 14 }}>
      <TransactionsKpiStrip count={t.data.length} totalIncome={t.totalIncome} totalExpense={t.totalExpense} balance={t.balance} />

      {/* ── Data table card ─────────────────────────────────────── */}
      <Card>
        <TransactionsToolbar total={t.filtered.length}
          typeFilter={t.typeFilter} onTypeChange={t.changeType}
          statusFilter={t.statusFilter} onStatusChange={t.changeStatus}
          search={t.search} onSearchChange={t.changeSearch} />
        <TransactionsTable rows={t.paged} page={t.page} onRowClick={t.setViewItem} onApprove={t.handleApprove} onReject={t.handleReject} onDelete={t.setDeleteItem} />
        <PaginationRow page={t.page} totalPages={t.totalPages} onPageChange={t.setPage} total={t.filtered.length} />
      </Card>

      <TransactionReceiptModal item={t.viewItem} onClose={() => t.setViewItem(null)} />
      <DeleteTransactionModal item={t.deleteItem} onClose={() => t.setDeleteItem(null)} onConfirm={t.handleDelete} />

      {/* ── Action Feedback ─────────────────────────────────────── */}
      <ResponseModal
        open={!!t.actionResult}
        onClose={() => t.setActionResult(null)}
        variant={(t.actionResult?.variant || 'success') as ModalVariant}
        title={t.actionResult?.title   || ''}
        message={t.actionResult?.message || ''}
        confirmLabel="Got it"
      />
    </div>
  )
}
