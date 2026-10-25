// parts/ProjectsKpiStrip.tsx — Four KPI tiles: overall (all rows), completed, ongoing, upcoming (approved items only)
import KpiStrip from '../../../components/KpiStrip'
import { approvedOnly } from '../../../utils/approvals'
import type { Project } from '../../../types'

export default function ProjectsKpiStrip({ data }: { data: Project[] }) {
  const live = approvedOnly(data)   // pending / rejected items are not counted as completed, ongoing or upcoming
  const kpis = [
    { label: 'Overall Projects', value: data.length,                                       color: 'var(--accent)'  },
    { label: 'Completed',        value: live.filter((p) => p.status === 'completed').length,  color: '#2E7D52'        },
    { label: 'Ongoing',          value: live.filter((p) => p.status === 'ongoing').length,    color: 'var(--info)'    },
    { label: 'Upcoming',         value: live.filter((p) => p.status === 'upcoming').length,   color: 'var(--warning)' },
  ]
  return <KpiStrip kpis={kpis} />
}
