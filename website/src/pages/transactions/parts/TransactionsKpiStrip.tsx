// parts/TransactionsKpiStrip.tsx — Four KPI tiles: record count (every row in the list), then income, expenses and net balance of the APPROVED rows only
import { useOrg } from '../../../context/OrgContext'
import KpiStrip from '../../../components/KpiStrip'
import { formatCurrency } from '../../../api/mockData'

interface Props { count: number; totalIncome: number; totalExpense: number; balance: number }

export default function TransactionsKpiStrip({ count, totalIncome, totalExpense, balance }: Props) {
  const org = useOrg()
  const kpis = [
    { label: `Total ${org.transaction_label_plural}`, value: count,                                            color: 'var(--accent)'  },
    { label: 'Total Income',                     value: formatCurrency(totalIncome,  org.currency_symbol), color: 'var(--success)' },
    { label: 'Total Expenses',                   value: formatCurrency(totalExpense, org.currency_symbol), color: 'var(--danger)'  },
    { label: 'Net Balance',                      value: formatCurrency(balance, org.currency_symbol),      color: balance >= 0 ? 'var(--success)' : 'var(--danger)' },
  ]
  return <KpiStrip kpis={kpis} valueSize={22} />
}
