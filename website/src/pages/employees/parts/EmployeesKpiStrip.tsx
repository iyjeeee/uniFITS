// parts/EmployeesKpiStrip.tsx — Four KPI tiles: total, active, inactive, officers (non-Member roles)
import { useOrg } from '../../../context/OrgContext'
import KpiStrip from '../../../components/KpiStrip'
import type { User } from '../../../types'

export default function EmployeesKpiStrip({ data }: { data: User[] }) {
  const org = useOrg()
  const officers = data.filter((u) => u.role !== 'Member')
  const kpis = [
    { label: `Total ${org.people_label}s`, value: data.length,                                       color: 'var(--accent)' },
    { label: 'Active',                     value: data.filter((u) => u.status === 'active').length,   color: '#2E7D52'       },
    { label: 'Inactive',                   value: data.filter((u) => u.status === 'inactive').length, color: '#C0392B'       },
    { label: 'Officers',                   value: officers.length,                                    color: '#2471A3'       },
  ]
  return <KpiStrip kpis={kpis} />
}
