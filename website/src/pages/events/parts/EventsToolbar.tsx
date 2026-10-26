// parts/EventsToolbar.tsx — Table card toolbar: title, category + status filters, search, Add button
import { NativeFilterSelect } from '../../../components/ui'
import { TableToolbar, ToolbarSearch, ToolbarAddButton } from '../../../components/TableToolbar'
import { TableIco } from '../../../components/Icons'
import { useOrg } from '../../../context/OrgContext'
import { capitalize } from '../../../utils/formatters'
import { APPROVAL_FILTER_OPTIONS } from '../../../constants/approval'
import { EVENT_TYPE_FILTER_OPTIONS } from './eventsShared'

interface Props {
  total: number
  typeFilter: string;   onTypeChange: (v: string) => void
  statusFilter: string; statusOptions: string[]; onStatusChange: (v: string) => void
  approvalFilter: string; onApprovalChange: (v: string) => void
  search: string; onSearchChange: (v: string) => void
}

export default function EventsToolbar({ total, typeFilter, onTypeChange, statusFilter, statusOptions, onStatusChange, approvalFilter, onApprovalChange, search, onSearchChange }: Props) {
  const org = useOrg()
  return (
    <TableToolbar title={`${org.event_label} Data Table`} subtitle={`${total} records · click any row for details`}>
      {/* Type filter — by event category */}
      <NativeFilterSelect value={typeFilter} onChange={onTypeChange} options={EVENT_TYPE_FILTER_OPTIONS.map((t) => ({ value: t, label: t === 'all' ? 'All Types' : t }))} />
      {/* Status filter */}
      <NativeFilterSelect value={statusFilter} onChange={onStatusChange} options={statusOptions.map((s) => ({ value: s, label: s === 'all' ? 'All Status' : capitalize(s) }))} />
      {/* Approval filter -- pending / approved / rejected */}
      <NativeFilterSelect value={approvalFilter} onChange={onApprovalChange} options={APPROVAL_FILTER_OPTIONS} />
      <ToolbarSearch value={search} onChange={onSearchChange} />
      <ToolbarAddButton onClick={() => window.location.hash = '/events/add'}><TableIco.Plus /> Add {org.event_label}</ToolbarAddButton>
    </TableToolbar>
  )
}
