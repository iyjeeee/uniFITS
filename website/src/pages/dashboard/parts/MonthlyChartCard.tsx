// parts/MonthlyChartCard.tsx — Card: monthly income vs expense bar chart (hard-coded data)
import { Card, CardHeader } from '../../../components/ui'
import BarChart from './BarChart'
import { MONTHLY_DATA } from './dashboardData'

export default function MonthlyChartCard() {
  return (
  <Card>
    <CardHeader title="Monthly Income vs Expense" subtitle="6-month financial trend" />
    <div style={{ padding: '14px 18px 16px' }}>
      <BarChart data={MONTHLY_DATA} />
    </div>
  </Card>
  )
}
