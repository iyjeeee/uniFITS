// parts/ProjectStatusCard.tsx — Card: project status donut (hard-coded data)
import { Card, CardHeader } from '../../../components/ui'
import DonutChart from './DonutChart'
import { STATUS_BREAKDOWN } from './dashboardData'

export default function ProjectStatusCard() {
  return (
  <Card>
    <CardHeader title="Project Status" subtitle="Breakdown by current status" />
    <div style={{ padding: '18px 18px' }}>
      <DonutChart data={STATUS_BREAKDOWN} />
    </div>
  </Card>
  )
}
