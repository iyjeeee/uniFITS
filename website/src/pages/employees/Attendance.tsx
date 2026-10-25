// Attendance.tsx — Project + Event attendance: tile cards open a modal to mark members Present/Absent
// Composition only — pieces live in ./parts (state and handlers in useAttendanceMarking)
import { Card, InfoModal } from '../../components/ui'
import { MOCK_PROJECTS, MOCK_EVENTS } from '../../api/mockData'
import { approvedOnly } from '../../utils/approvals'
import { useOrg } from '../../context/OrgContext'
import useBreakpoint from '../../hooks/useBreakpoint'
import AttendanceTileCard from './parts/AttendanceTileCard'
import AttendanceDetailContent from './parts/AttendanceDetailContent'
import SectionHeader from './parts/AttendanceSectionHeader'
import { IcoProject, IcoEvent, IcoSave } from './parts/AttendanceIcons'
import { useAttendanceMarking } from './parts/useAttendanceMarking'

export default function Attendance() {
  const org = useOrg()
  const projects = approvedOnly(MOCK_PROJECTS)   // attendance is taken only for approved activities
  const events   = approvedOnly(MOCK_EVENTS)
  const { isMobile, isTablet } = useBreakpoint()
  const tileCols = isMobile ? '1fr' : isTablet ? 'repeat(2,1fr)' : 'repeat(3,1fr)'
  const { allRecords, viewItem, setViewItem, localAttendance, openModal, handleStatusChange, handleMarkAllNoRecord, handleResetAll, handleSave } = useAttendanceMarking()

  return (
    <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 14 }}>

      {/* ── Projects Section ──────────────────────────────────── */}
      <Card style={{ padding: '18px 20px' }}>
        <SectionHeader icon={<IcoProject />} label={`${org.project_label} Attendance`} count={projects.length} color="var(--accent)" />
        <div style={{ display: 'grid' as const, gridTemplateColumns: tileCols, gap: 14 }}>
          {projects.map(project => (
            <AttendanceTileCard
              key={project.id}
              activity={project}
              kind="project"
              records={allRecords}
              onClick={() => openModal(project, 'project')}
            />
          ))}
        </div>
      </Card>

      {/* ── Events Section ────────────────────────────────────── */}
      <Card style={{ padding: '18px 20px' }}>
        <SectionHeader icon={<IcoEvent />} label={`${org.event_label} Attendance`} count={events.length} color="var(--success)" />
        <div style={{ display: 'grid' as const, gridTemplateColumns: tileCols, gap: 14 }}>
          {events.map(event => (
            <AttendanceTileCard
              key={event.id}
              activity={event}
              kind="event"
              records={allRecords}
              onClick={() => openModal(event, 'event')}
            />
          ))}
        </div>
      </Card>

      {/* ── Attendance Detail / Marking InfoModal ─────────────── */}
      <InfoModal
        open={!!viewItem}
        onClose={() => setViewItem(null)}
        title={viewItem?.activity.title ?? ''}
        subtitle={viewItem ? `${viewItem.kind === 'project' ? 'Project' : 'Event'} · Mark Attendance` : ''}
        accentColor={viewItem?.kind === 'project' ? 'var(--accent)' : 'var(--success)'}
        footer={
          <div style={{ display: 'flex' as const, gap: 10, justifyContent: 'flex-end' }}>
            <button onClick={handleSave}
              style={{ display: 'inline-flex' as const, alignItems: 'center', gap: 6, padding: '10px 22px', borderRadius: 9, border: 'none', background: 'var(--success)', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' as const, fontFamily: 'var(--font-body)' }}>
              <IcoSave /> Save Attendance
            </button>
            <button onClick={() => setViewItem(null)}
              style={{ padding: '10px 28px', borderRadius: 9, border: '1.5px solid var(--border-card)', background: 'var(--neutral-light)', color: 'var(--text-primary)', fontSize: 14, fontWeight: 600, cursor: 'pointer' as const, fontFamily: 'var(--font-body)' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{marginRight:4}}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> Close
            </button>
          </div>
        }>
        {viewItem && (
          <AttendanceDetailContent
            activity={viewItem.activity}
            kind={viewItem.kind}
            localAttendance={localAttendance}
            onStatusChange={handleStatusChange}
            onMarkAllNoRecord={handleMarkAllNoRecord}
            onResetAll={handleResetAll}
            isMobile={isMobile}
            isTablet={isTablet}
          />
        )}
      </InfoModal>
    </div>
  )
}
