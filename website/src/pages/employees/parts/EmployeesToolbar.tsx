// parts/EmployeesToolbar.tsx — Table card toolbar: title, role + status filters, search, Import and Add buttons
import { NativeFilterSelect } from '../../../components/ui'
import { TableToolbar, ToolbarSearch, ToolbarAddButton } from '../../../components/TableToolbar'
import { TableIco } from '../../../components/Icons'
import { useOrg } from '../../../context/OrgContext'
import { capitalize } from '../../../utils/formatters'
import { IcoUpload } from './EmployeesIcons'
import { getRoleName } from '../../../api/mockData'

interface Props {
  total: number
  typeFilter: string;   typeOptions: string[];   onTypeChange: (v: string) => void
  statusFilter: string; statusOptions: string[]; onStatusChange: (v: string) => void
  search: string; onSearchChange: (v: string) => void; onImport: () => void
}

export default function EmployeesToolbar({ total, typeFilter, typeOptions, onTypeChange, statusFilter, statusOptions, onStatusChange, search, onSearchChange, onImport }: Props) {
  const org = useOrg()
  return (
    <TableToolbar title={`${org.people_label} Data Table`} subtitle={`${total} records · click any row for details`}>
      {/* Type filter — by role */}
      <NativeFilterSelect value={typeFilter} onChange={onTypeChange} options={typeOptions.map((t) => ({ value: t, label: t === 'all' ? 'All Types' : getRoleName(t) }))} />
      {/* Status filter */}
      <NativeFilterSelect value={statusFilter} onChange={onStatusChange} options={statusOptions.map((s) => ({ value: s, label: s === 'all' ? 'All Status' : capitalize(s) }))} />
      <ToolbarSearch value={search} onChange={onSearchChange} />
      {/* Import — opens InfoModal */}
      <button onClick={onImport}
        style={{ display: 'inline-flex' as const, alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, border: 'none', background: '#5A6474', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' as const, fontFamily: 'var(--font-body)', whiteSpace: 'nowrap' as const }}>
        <IcoUpload /> Import
      </button>
      {/* Add employee */}
      <ToolbarAddButton onClick={() => window.location.hash = '/employees/add'}><TableIco.Plus /> Add {org.people_label}</ToolbarAddButton>
    </TableToolbar>
  )
}
