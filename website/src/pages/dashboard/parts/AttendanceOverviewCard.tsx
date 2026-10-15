// parts/AttendanceOverviewCard.tsx — Card: attendance status bars + total record count
import { Card, CardHeader } from '../../../components/ui'
import { MOCK_ATTENDANCES } from '../../../api/mockData'
import AttendanceChart from './AttendanceChart'

export default function AttendanceOverviewCard() {
  return (
  <Card>
    <CardHeader title="Attendance Overview" subtitle="All recorded attendance statuses" />
    <div style={{ padding: '16px 18px' }}>
      <AttendanceChart data={MOCK_ATTENDANCES} />
      <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--border-inner)', fontSize: 12.5, color: 'var(--text-muted)' }}>
        Total records: <strong>{MOCK_ATTENDANCES.length}</strong>
      </div>
    </div>
  </Card>
  )
}
