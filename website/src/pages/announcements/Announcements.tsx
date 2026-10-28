// Announcements.tsx — Hub: announcements panel, activity tiles, calendar, upcoming schedule
// Composition only — each card/modal lives in ./parts (state for announcements in useAnnouncements)
import { useState } from 'react'
import { ResponseModal } from '../../components/ui'
import useBreakpoint from '../../hooks/useBreakpoint'
import ActivityOverviewCard from './parts/ActivityOverviewCard'
import AnnouncementsPanel from './parts/AnnouncementsPanel'
import CalendarCard from './parts/CalendarCard'
import ScheduleCard from './parts/ScheduleCard'
import AnnouncementDetailModal from './parts/AnnouncementDetailModal'
import NewAnnouncementModal from './parts/NewAnnouncementModal'
import AllAnnouncementsModal from './parts/AllAnnouncementsModal'
import ScheduleModal from './parts/ScheduleModal'
import ActivityDetailModal from './parts/ActivityDetailModal'
import DayDetailModal from './parts/DayDetailModal'
import { useAnnouncements } from './parts/useAnnouncements'
import { buildTiles, buildSchedule } from './parts/helpers'
import type { TileItem, SelectedDay } from './parts/types'
import type { User } from '../../types'

const PANEL_LIMIT = 5   // rows shown in the announcements panel and the schedule card

export default function Announcements({ currentUser = null }: { currentUser?: User | null }) {
  const { isMobile } = useBreakpoint()
  const twoColLayout = isMobile ? '1fr' : '1fr 300px'   // main column + side panel; collapses on mobile

  const ann = useAnnouncements(currentUser)
  const [showAllAnn,   setShowAllAnn]   = useState(false)
  const [allAnnPage,   setAllAnnPage]   = useState(1)
  const [showAllSched, setShowAllSched] = useState(false)
  const [schedPage,    setSchedPage]    = useState(1)
  const [detailItem,   setDetailItem]   = useState<TileItem | null>(null)
  const [selectedDay,  setSelectedDay]  = useState<SelectedDay | null>(null)

  const tiles    = buildTiles()
  const upcoming = buildSchedule(tiles)

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:14 }}>

      {/* ══ TOP ROW ═════════════════════════════════════════════════ */}
      <div style={{ display:'grid', gridTemplateColumns:twoColLayout, gap:14 }}>
        <ActivityOverviewCard tiles={tiles} onSelect={setDetailItem} />
        <AnnouncementsPanel
          items={ann.allSorted.slice(0, PANEL_LIMIT)}
          total={ann.allSorted.length}
          onNew={() => ann.setShowNewModal(true)}
          onView={ann.setViewAnn}
          onViewAll={() => { setAllAnnPage(1); setShowAllAnn(true) }}
        />
      </div>

      {/* ══ BOTTOM ROW ══════════════════════════════════════════════ */}
      <div style={{ display:'grid', gridTemplateColumns:twoColLayout, gap:14 }}>
        <CalendarCard onSelectDay={setSelectedDay} />
        <ScheduleCard
          items={upcoming.slice(0, PANEL_LIMIT)}
          total={upcoming.length}
          onViewAll={() => { setSchedPage(1); setShowAllSched(true) }}
        />
      </div>

      {/* ══ MODALS ══════════════════════════════════════════════════ */}
      <AnnouncementDetailModal
        ann={ann.viewAnn}
        onClose={() => ann.setViewAnn(null)}
        onTogglePin={ann.togglePin}
        onDelete={ann.confirmDelete}
      />
      <NewAnnouncementModal
        open={ann.showNewModal}
        onClose={() => ann.setShowNewModal(false)}
        form={ann.form}
        setForm={ann.setForm}
        onPost={ann.handleAdd}
      />
      <AllAnnouncementsModal
        open={showAllAnn}
        onClose={() => setShowAllAnn(false)}
        announcements={ann.allSorted}
        page={allAnnPage}
        onPageChange={setAllAnnPage}
        onSelect={a => { setShowAllAnn(false); ann.setViewAnn(a) }}
      />
      <ScheduleModal
        open={showAllSched}
        onClose={() => setShowAllSched(false)}
        items={upcoming}
        page={schedPage}
        onPageChange={setSchedPage}
      />
      <ActivityDetailModal item={detailItem} onClose={() => setDetailItem(null)} />
      <DayDetailModal day={selectedDay} onClose={() => setSelectedDay(null)} />

      {/* Delete confirm */}
      <ResponseModal
        open={!!ann.pendingDelete}
        onClose={() => ann.setPendingDelete(null)}
        variant="danger"
        title="Delete Announcement?"
        message="This will permanently remove the announcement. All members will lose access to this post and it cannot be recovered."
        confirmLabel="Yes, Delete"
        cancelLabel="Close"
        onConfirm={ann.handleDelete}
      />

      {/* Action feedback */}
      <ResponseModal
        open={!!ann.annResponse}
        onClose={() => ann.setAnnResponse(null)}
        variant={ann.annResponse?.variant || 'success'}
        title={ann.annResponse?.title || ''}
        message={ann.annResponse?.message || ''}
        confirmLabel="Got it"
      />
    </div>
  )
}
