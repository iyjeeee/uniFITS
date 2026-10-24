// parts/UtilitiesKpiStrip.tsx — Four KPI tiles: record count, total owed, total paid, remaining unpaid
import { useOrg } from '../../../context/OrgContext'
import KpiStrip from '../../../components/KpiStrip'
import { formatCurrency } from '../../../api/mockData'
import type { UtilityWithBalance } from '../../../types'

export default function UtilitiesKpiStrip({ data }: { data: UtilityWithBalance[] }) {
  const org = useOrg()
  const totalOwed   = data.reduce((s, u) => s + u.total_amount, 0)
  const totalPaid   = data.reduce((s, u) => s + u.amount_paid, 0)
  const totalUnpaid = totalOwed - totalPaid
  const kpis = [
    { label: `Total ${org.utility_label}s`, value: data.length,                                     color: 'var(--accent)'  },
    { label: 'Total Owed',                   value: formatCurrency(totalOwed,   org.currency_symbol), color: 'var(--warning)' },
    { label: 'Total Paid',                   value: formatCurrency(totalPaid,   org.currency_symbol), color: 'var(--success)' },
    { label: 'Remaining Unpaid',             value: formatCurrency(totalUnpaid, org.currency_symbol), color: totalUnpaid > 0 ? 'var(--danger)' : 'var(--success)' },
  ]
  return <KpiStrip kpis={kpis} valueSize={22} />
}
