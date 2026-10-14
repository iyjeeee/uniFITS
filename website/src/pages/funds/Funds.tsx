// Funds.tsx — Fund management: KPI strip, internal/external fund tiles, detail/edit/delete modals
// Composition only — pieces live in ./parts (state and handlers in useFunds)
import { Card, ResponseModal } from '../../components/ui'
import FundsKpiStrip from './parts/FundsKpiStrip'
import FundsHeaderCard from './parts/FundsHeaderCard'
import FundSection from './parts/FundSection'
import FundsEmptyState from './parts/FundsEmptyState'
import FundDetailModal from './parts/FundDetailModal'
import DeleteFundModal from './parts/DeleteFundModal'
import { IconLock, IconGlobe } from './parts/FundsIcons'
import { useFunds } from './parts/useFunds'

export default function Funds() {
  const f = useFunds()

  /* Split funds into internal and external sections */
  const internal = f.funds.filter((x) => x.fund_type === 'internal')
  const external = f.funds.filter((x) => x.fund_type === 'external')

  return (
    <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 14 }}>
      <FundsKpiStrip funds={f.funds} />
      <FundsHeaderCard count={f.funds.length} />

      {internal.length > 0 && (
        <FundSection funds={internal} title="Internal Funds (Required)" icon={<IconLock />} iconBg="var(--accent-light)" iconColor="var(--accent)" onSelect={f.openDetail} />
      )}
      {external.length > 0 && (
        <FundSection funds={external} title="External Funds" icon={<IconGlobe />} iconBg="var(--info-light)" iconColor="var(--info)" onSelect={f.openDetail} />
      )}

      {/* Empty state — shown when funds list is completely empty */}
      {f.funds.length === 0 && <FundsEmptyState />}

      {/* Transactions link */}
      <Card>
        <div style={{ padding: '14px 20px', fontSize: 13.5, color: 'var(--text-muted)' }}>
          View all fund transactions in the{' '}
          <a href="#/transactions" style={{ color: 'var(--accent)', fontWeight: 500 }}>Transactions</a> section.
        </div>
      </Card>

      <FundDetailModal
        viewItem={f.viewItem}
        editMode={f.editMode}
        editForm={f.editForm}
        onClose={f.closeDetail}
        onSave={f.handleSaveEdit}
        onCancel={f.handleCancelEdit}
        onEdit={() => f.setEditMode(true)}
        onRequestDelete={f.requestDelete}
        onFormChange={f.handleFormChange}
      />
      <DeleteFundModal fund={f.deleteItem} onClose={() => f.setDeleteItem(null)} onConfirm={f.handleDelete} />

      {/* Action Feedback */}
      <ResponseModal
        open={!!f.actionResult}
        onClose={() => f.setActionResult(null)}
        variant={f.actionResult?.variant || 'success'}
        title={f.actionResult?.title   || ''}
        message={f.actionResult?.message || ''}
        confirmLabel="Got it"
      />
    </div>
  )
}
