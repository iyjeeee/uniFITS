// parts/MonthlyChartCard.tsx — Card: monthly income vs expense bar chart (derived data)
import { Card, CardHeader } from '../../../components/ui'
import BarChart from './BarChart'
import type { MonthlyPoint } from './dashboardData'

export default function MonthlyChartCard({ data }: { data: MonthlyPoint[] }) {
  return (
  <Card>
    <CardHeader title="Monthly Income vs Expense" subtitle="6-month financial trend" />
    <div style={{ padding: '14px 18px 16px' }}>
      <BarChart data={data} />
    </div>
  </Card>
  )
}
