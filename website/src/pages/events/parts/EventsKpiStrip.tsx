// parts/EventsKpiStrip.tsx — Four KPI tiles: overall (all rows), completed, ongoing, upcoming (approved items only)
import KpiStrip from '../../../components/KpiStrip'
import { approvedOnly } from '../../../utils/approvals'
import { useOrg } from '../../../context/OrgContext'
import type { AppEvent } from '../../../types'

export default function EventsKpiStrip({ data }: { data: AppEvent[] }) {
  const org  = useOrg()
  const live = approvedOnly(data)   // pending / rejected items are not counted as completed, ongoing or upcoming
  const kpis = [
    { label: `Overall ${org.event_label_plural}`, value: data.length,                                          color: 'var(--accent)'  },
    { label: 'Completed',      value: live.filter((e) => e.status === 'completed').length,  color: '#2E7D52'        },
    { label: 'Ongoing',        value: live.filter((e) => e.status === 'ongoing').length,    color: 'var(--info)'    },
    { label: 'Upcoming',       value: live.filter((e) => e.status === 'upcoming').length,   color: 'var(--warning)' },
  ]
  return <KpiStrip kpis={kpis} />
}
