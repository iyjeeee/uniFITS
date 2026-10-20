// parts/EventsKpiStrip.tsx — Four KPI tiles: overall, completed, ongoing, upcoming
import KpiStrip from '../../../components/KpiStrip'
import type { AppEvent } from '../../../types'

export default function EventsKpiStrip({ data }: { data: AppEvent[] }) {
  const kpis = [
    { label: 'Overall Events', value: data.length,                                          color: 'var(--accent)'  },
    { label: 'Completed',      value: data.filter((e) => e.status === 'completed').length,  color: '#2E7D52'        },
    { label: 'Ongoing',        value: data.filter((e) => e.status === 'ongoing').length,    color: 'var(--info)'    },
    { label: 'Upcoming',       value: data.filter((e) => e.status === 'upcoming').length,   color: 'var(--warning)' },
  ]
  return <KpiStrip kpis={kpis} />
}
