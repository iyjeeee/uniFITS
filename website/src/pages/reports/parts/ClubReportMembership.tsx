// parts/ClubReportMembership.tsx — VI. Membership Summary
import { MOCK_USERS, formatCurrency } from '../../../api/mockData'
import { useOrg } from '../../../context/OrgContext'
import ReportSection from './ReportSection'
import StatRow from './ReportStatRow'
import type { ClubReportStats } from './clubReportStats'

export default function ClubReportMembership({ stats }: { stats: ClubReportStats }) {
  const org = useOrg()
  const { activeMembers, officers, regularMembers, memberDues } = stats
  return (
    <ReportSection title="VI. Membership Summary">
      <div style={{ borderRadius: 10, overflow: 'hidden', border: '1.5px solid var(--border-card)' }}>
        <StatRow label="Total Registered Members"     value={MOCK_USERS.length} />
        <StatRow label="Active Members"               value={activeMembers}   indent color="var(--success)" />
        <StatRow label="Officers / Committee Members" value={officers}        indent color="var(--accent)"  />
        <StatRow label="Regular Members"              value={regularMembers}  indent color="var(--text-muted)" />
        <StatRow label="Total Member Contributions"   value={formatCurrency(memberDues, org.currency_symbol)} bold color="var(--success)" border />
      </div>
    </ReportSection>
  )
}
