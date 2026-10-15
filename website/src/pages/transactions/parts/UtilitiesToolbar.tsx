// parts/UtilitiesToolbar.tsx — Table card toolbar: title, type + status filters, search, Add button
import { FilterSelect } from '../../../components/ui'
import { TableToolbar, ToolbarSearch, ToolbarAddButton } from '../../../components/TableToolbar'
import { BtnIco } from '../../../components/Icons'
import { useOrg } from '../../../context/OrgContext'
import { capitalize } from '../../../utils/formatters'

interface Props {
  total: number
  typeFilter: string;   typeOptions: string[];   onTypeChange: (v: string) => void
  statusFilter: string; statusOptions: string[]; onStatusChange: (v: string) => void
  search: string; onSearchChange: (v: string) => void
}

export default function UtilitiesToolbar({ total, typeFilter, typeOptions, onTypeChange, statusFilter, statusOptions, onStatusChange, search, onSearchChange }: Props) {
  const org = useOrg()
  return (
    <TableToolbar title={`${org.utility_label} Data Table`} subtitle={`${total} records · click any row for details`}>
      <FilterSelect value={typeFilter} onChange={onTypeChange} options={typeOptions.map((t) => ({ value: t, label: t === 'all' ? 'All Types' : t }))} />
      <FilterSelect value={statusFilter} onChange={onStatusChange} options={statusOptions.map((s) => ({ value: s, label: s === 'all' ? 'All Status' : capitalize(s) }))} />
      <ToolbarSearch value={search} onChange={onSearchChange} />
      <ToolbarAddButton onClick={() => window.location.hash = '/transactions/utilities/add'}><BtnIco.Plus /> Add {org.utility_label}</ToolbarAddButton>
    </TableToolbar>
  )
}
