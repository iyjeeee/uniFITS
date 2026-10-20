// parts/ProjectsKpiStrip.tsx — Four KPI tiles: overall, completed, ongoing, upcoming
import KpiStrip from '../../../components/KpiStrip'
import type { Project } from '../../../types'

export default function ProjectsKpiStrip({ data }: { data: Project[] }) {
  const kpis = [
    { label: 'Overall Projects', value: data.length,                                       color: 'var(--accent)'  },
    { label: 'Completed',        value: data.filter((p) => p.status === 'completed').length,  color: '#2E7D52'        },
    { label: 'Ongoing',          value: data.filter((p) => p.status === 'ongoing').length,    color: 'var(--info)'    },
    { label: 'Upcoming',         value: data.filter((p) => p.status === 'upcoming').length,   color: 'var(--warning)' },
  ]
  return <KpiStrip kpis={kpis} />
}
