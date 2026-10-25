// PersonalTransactions.tsx — A member's contributions summary, required dues, and full transaction history
// Composition only — pieces live in ./parts (data + modal state in usePersonalTransactions)
import { DataTable } from '../../components/ui'
import { getFundName, getPaymentMethodName } from '../../api/mockData'
import { useOrg } from '../../context/OrgContext'
import useBreakpoint from '../../hooks/useBreakpoint'
import ContributionsCard from './parts/ContributionsCard'
import RequiredDuesCard from './parts/RequiredDuesCard'
import TransactionDetailModal from './parts/TransactionDetailModal'
import DueDetailModal from './parts/DueDetailModal'
import AllDuesModal from './parts/AllDuesModal'
import { buildTransactionColumns } from './parts/transactionColumns'
import { usePersonalTransactions } from './parts/usePersonalTransactions'

export default function PersonalTransactions({ userId = '1' }: { userId?: string }) {
  const org = useOrg()
  const { isMobile } = useBreakpoint() // responsive grid control
  const t = usePersonalTransactions(userId)

  return (
    <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 14 }}>

      {/* Contributions summary + required dues — side by side */}
      <div style={{ display: 'grid' as const, gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 14, alignItems: 'flex-start' }}>
        <ContributionsCard totals={t.totals} />
        <RequiredDuesCard
          dues={t.panelDues}
          onSelect={t.setSelectedDue}
          onViewAll={() => { t.setDuesPage(1); t.setShowAllDues(true) }}
        />
      </div>

      {/* Full transaction history table — click a row for detail */}
      <DataTable
        columns={buildTransactionColumns(org)}
        data={t.myTx}
        title="My Transaction History"
        subtitle="All your financial contributions and dues — click any row for details"
        emptyMsg="No transactions found."
        onRowClick={t.setViewTx}
        searchValues={(tx) => Object.values({ ...tx, fund_id: getFundName(tx.fund_id), payment_method_id: getPaymentMethodName(tx.payment_method_id) })}   // search names, not ids
      />

      <TransactionDetailModal tx={t.viewTx} onClose={() => t.setViewTx(null)} />
      <DueDetailModal fund={t.selectedDue} onClose={() => t.setSelectedDue(null)} />
      <AllDuesModal
        open={t.showAllDues}
        funds={t.allFunds}
        page={t.duesPage}
        onPageChange={t.setDuesPage}
        onClose={() => t.setShowAllDues(false)}
        onSelect={f => { t.setShowAllDues(false); t.setSelectedDue(f) }}
      />
    </div>
  )
}
