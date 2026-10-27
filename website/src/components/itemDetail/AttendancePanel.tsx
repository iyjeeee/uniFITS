// itemDetail/AttendancePanel.tsx - Attendance records of the activity (matched by id): header strip + status rows
import MiniSection from './MiniSection'
import EmptyHint from './EmptyHint'
import AttendanceRow from './AttendanceRow'
import { AttendIcon } from './itemDetailIcons'
import { getUserName } from '../../api/mockData'
import type { Attendance, OrgConfig } from '../../types'

export default function AttendancePanel({ records, org }: { records: Attendance[]; org: OrgConfig }) {
  return (
    <div>
      <MiniSection
        icon={<AttendIcon />}
        title={`${org.people_label} Attendance`} count={records.length}
        color="var(--accent)" bg="var(--accent-light)" border="rgba(75,94,170,.25)" />
      {records.length === 0
        ? <EmptyHint text="No attendance records found for this activity." />
        : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {records.map((r: Attendance, i) => (
              <AttendanceRow key={r.id} member={getUserName(r.user_id)} status={r.status} idx={i} />
            ))}
          </div>
        )
      }
    </div>
  )
}
