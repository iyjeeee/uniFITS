// parts/DayDetailModal.tsx — Activities on a clicked calendar day
import { useOrg } from '../../../context/OrgContext'
import { InfoModal } from '../../../components/ui'
import { MONTH_NAMES } from '../../../constants/calendar'
import type { SelectedDay } from './types'
import DayCard from './DayCard'

export default function DayDetailModal({ day, onClose }: { day: SelectedDay | null; onClose: () => void }) {
  const org = useOrg()
  if (!day) return null
  return (
    <InfoModal open={!!day} onClose={onClose}
      title={`${MONTH_NAMES[day.month]} ${day.day}, ${day.year}`}
      subtitle="Activities on this day">
      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
        {day.projects.map(p => <DayCard key={p.id} item={{ ...p, kind:'project' }} org={org} />)}
        {day.events.map(e => <DayCard key={e.id} item={{ ...e, kind:'event' }} org={org} />)}
      </div>
    </InfoModal>
  )
}
