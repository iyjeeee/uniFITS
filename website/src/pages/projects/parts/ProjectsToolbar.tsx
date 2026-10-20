// parts/ProjectsToolbar.tsx — Table card toolbar: title, type + status filters, search, Add button
import { NativeFilterSelect } from '../../../components/ui'
import { TableToolbar, ToolbarSearch, ToolbarAddButton } from '../../../components/TableToolbar'
import { TableIco } from '../../../components/Icons'
import { useOrg } from '../../../context/OrgContext'
import { capitalize } from '../../../utils/formatters'

interface Props {
  total: number
  typeFilter: string;   typeOptions: string[];   onTypeChange: (v: string) => void
  statusFilter: string; statusOptions: string[]; onStatusChange: (v: string) => void
  search: string; onSearchChange: (v: string) => void
}

export default function ProjectsToolbar({ total, typeFilter, typeOptions, onTypeChange, statusFilter, statusOptions, onStatusChange, search, onSearchChange }: Props) {
  const org = useOrg()
  return (
    <TableToolbar title={`${org.project_label} Data Table`} subtitle={`${total} records · click any row for details`}>
      {/* Type filter — by project type */}
      <NativeFilterSelect value={typeFilter} onChange={onTypeChange} options={typeOptions.map((t) => ({ value: t, label: t === 'all' ? 'All Types' : t }))} />
      {/* Status filter */}
      <NativeFilterSelect value={statusFilter} onChange={onStatusChange} options={statusOptions.map((s) => ({ value: s, label: s === 'all' ? 'All Status' : capitalize(s) }))} />
      <ToolbarSearch value={search} onChange={onSearchChange} />
      <ToolbarAddButton onClick={() => window.location.hash = '/projects/add'}><TableIco.Plus /> Add {org.project_label}</ToolbarAddButton>
    </TableToolbar>
  )
}
