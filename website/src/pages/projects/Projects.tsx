// Projects.tsx — Manage projects with Announcements-style detail modal, in-modal edit,
// funding progress bar, solid action buttons, status-colored rows, always-visible pagination
// Fully responsive via useBreakpoint (KPI strip). Composition only; state in parts/useProjects, UI in parts/.
import { Card, ResponseModal } from '../../components/ui'
import EditItemModal from '../../components/EditItemModal'
import { PaginationRow } from '../../components/TableUtils'
import { useOrg } from '../../context/OrgContext'
import useProjects from './parts/useProjects'
import ProjectsKpiStrip from './parts/ProjectsKpiStrip'
import ProjectsToolbar from './parts/ProjectsToolbar'
import ProjectsTable from './parts/ProjectsTable'
import ProjectDetailModal from './parts/ProjectDetailModal'
import DeleteProjectModal from './parts/DeleteProjectModal'
import type { ModalVariant } from '../../types'

export default function Projects() {
  const org = useOrg()
  const p = useProjects()
  return (
    <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 14 }}>
      {/* KPI row — 4-col desktop, 2-col on mobile/tablet */}
      <ProjectsKpiStrip data={p.data} />

      <Card>
        <ProjectsToolbar total={p.filtered.length}
          typeFilter={p.typeFilter} typeOptions={p.typeOptions} onTypeChange={p.changeType}
          statusFilter={p.statusFilter} statusOptions={p.statusOptions} onStatusChange={p.changeStatus}
          search={p.search} onSearchChange={p.changeSearch} />
        <ProjectsTable rows={p.paged} onRowClick={p.setViewItem} onApprove={p.handleApprove} onReject={p.handleReject} onDelete={p.setDeleteItem} />
        <PaginationRow page={p.page} totalPages={p.totalPages} onPageChange={p.setPage} total={p.filtered.length} />
      </Card>

      {/* ── Detail InfoModal — Announcements-style content ─────── */}
      <ProjectDetailModal item={p.viewItem} onClose={() => p.setViewItem(null)} onEdit={p.startEdit} />

      {/* ── Edit Project Modal — in-modal, no redirect ─────────── */}
      <EditItemModal open={!!p.editItem} onClose={() => p.setEditItem(null)} item={p.editItem} kind="project" org={org} onSave={p.handleSaveEdit} />

      {/* ── Confirmation Modal — Delete ─────────────────────────── */}
      <DeleteProjectModal item={p.deleteItem} onClose={() => p.setDeleteItem(null)} onConfirm={p.handleDelete} />

      <ResponseModal open={!!p.actionResult} onClose={() => p.setActionResult(null)}
        variant={(p.actionResult?.variant || 'success') as ModalVariant} title={p.actionResult?.title || ''} message={p.actionResult?.message || ''} confirmLabel="Got it" />
    </div>
  )
}
