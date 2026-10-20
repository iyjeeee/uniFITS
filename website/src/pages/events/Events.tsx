// Events.tsx — Manage events with Announcements-style detail modal, in-modal edit,
// funding progress bar, solid action buttons, status-colored rows, always-visible pagination
// Fully responsive via useBreakpoint (KPI strip). Composition only; state in parts/useEvents, UI in parts/.
import { Card, ResponseModal } from '../../components/ui'
import EditItemModal from '../../components/EditItemModal'
import { PaginationRow } from '../../components/TableUtils'
import { useOrg } from '../../context/OrgContext'
import useEvents from './parts/useEvents'
import EventsKpiStrip from './parts/EventsKpiStrip'
import EventsToolbar from './parts/EventsToolbar'
import EventsTable from './parts/EventsTable'
import EventDetailModal from './parts/EventDetailModal'
import DeleteEventModal from './parts/DeleteEventModal'
import type { ModalVariant } from '../../types'

export default function Events() {
  const org = useOrg()
  const ev = useEvents()
  return (
    <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 14 }}>
      {/* KPI row — 4-col desktop, 2-col on mobile/tablet */}
      <EventsKpiStrip data={ev.data} />

      <Card>
        <EventsToolbar total={ev.filtered.length}
          typeFilter={ev.typeFilter} onTypeChange={ev.changeType}
          statusFilter={ev.statusFilter} statusOptions={ev.statusOptions} onStatusChange={ev.changeStatus}
          search={ev.search} onSearchChange={ev.changeSearch} />
        <EventsTable rows={ev.paged} onRowClick={ev.setViewItem} onApprove={ev.handleApprove} onReject={ev.handleReject} onDelete={ev.setDeleteItem} />
        <PaginationRow page={ev.page} totalPages={ev.totalPages} onPageChange={ev.setPage} total={ev.filtered.length} />
      </Card>

      {/* ── Detail InfoModal — Announcements-style ──────────────── */}
      <EventDetailModal item={ev.viewItem} onClose={() => ev.setViewItem(null)} onEdit={ev.startEdit} />

      {/* ── Edit Event Modal — in-modal, no redirect ─────────────── */}
      <EditItemModal open={!!ev.editItem} onClose={() => ev.setEditItem(null)} item={ev.editItem} kind="event" org={org} onSave={ev.handleSaveEdit} />

      {/* ── Confirmation Modal — Delete ─────────────────────────── */}
      <DeleteEventModal item={ev.deleteItem} onClose={() => ev.setDeleteItem(null)} onConfirm={ev.handleDelete} />

      <ResponseModal open={!!ev.actionResult} onClose={() => ev.setActionResult(null)}
        variant={(ev.actionResult?.variant || 'success') as ModalVariant} title={ev.actionResult?.title || ''} message={ev.actionResult?.message || ''} confirmLabel="Got it" />
    </div>
  )
}
