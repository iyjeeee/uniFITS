// parts/ProjectStatusCard.tsx — Card: project status donut (derived from the approved projects)
import { Card, CardHeader } from '../../../components/ui'
import DonutChart from './DonutChart'
import type { StatusPoint } from './dashboardData'

export default function ProjectStatusCard({ data }: { data: StatusPoint[] }) {
  return (
  <Card>
    <CardHeader title="Project Status" subtitle="Breakdown by current status" />
    <div style={{ padding: '18px 18px' }}>
      <DonutChart data={data} />
    </div>
  </Card>
  )
}
