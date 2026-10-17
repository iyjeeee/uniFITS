// parts/TransactionsToolbar.tsx — Table card toolbar: title, entry type + status filters, search, Add button
import { FilterSelect } from '../../../components/ui'
import { TableToolbar, ToolbarSearch, ToolbarAddButton } from '../../../components/TableToolbar'
import { BtnIco } from '../../../components/Icons'
import { useOrg } from '../../../context/OrgContext'
import { capitalize } from '../../../utils/formatters'
import { TX_TYPE_OPTIONS, TX_STATUS_OPTIONS } from './transactionsShared'

interface Props {
  total: number
  typeFilter: string; onTypeChange: (v: string) => void
  statusFilter: string; onStatusChange: (v: string) => void
  search: string; onSearchChange: (v: string) => void
}

export default function TransactionsToolbar({ total, typeFilter, onTypeChange, statusFilter, onStatusChange, search, onSearchChange }: Props) {
  const org = useOrg()
  return (
    <TableToolbar title={`${org.transaction_label} Data Table`} subtitle={`${total} records · click any row for details`}>
      {/* Entry type filter */}
      <FilterSelect value={typeFilter} onChange={onTypeChange} options={TX_TYPE_OPTIONS.map((t) => ({ value: t, label: t === 'all' ? 'All Types' : capitalize(t) }))} />
      {/* Status filter */}
      <FilterSelect value={statusFilter} onChange={onStatusChange} options={TX_STATUS_OPTIONS.map((s) => ({ value: s, label: s === 'all' ? 'All Status' : capitalize(s) }))} />
      <ToolbarSearch value={search} onChange={onSearchChange} />
      <ToolbarAddButton onClick={() => { window.location.hash = '/transactions/add' }}><BtnIco.Plus /> Add {org.transaction_label}</ToolbarAddButton>
    </TableToolbar>
  )
}
