// parts/ClubReportActivity.tsx — V. Project & Event Activity Summary (two columns, one on mobile)
import { formatCurrency } from '../../../api/mockData'
import { useOrg } from '../../../context/OrgContext'
import useBreakpoint from '../../../hooks/useBreakpoint'
import ReportSection from './ReportSection'
import StatRow from './ReportStatRow'
import type { ClubReportStats } from './clubReportStats'

export default function ClubReportActivity({ stats }: { stats: ClubReportStats }) {
  const org = useOrg()
  const { isMobile } = useBreakpoint()
  const { totalProjects, totalEvents, completedProjects, ongoingProjects, completedEvents, upcomingEvents, projectIncome, projectExpense, eventIncome, eventExpense } = stats
  return (
    <ReportSection title="V. Project & Event Activity Summary">
      <div style={{ display: 'grid' as const, gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16 }}>
        {/* Projects */}
        <div>
          <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--accent)', marginBottom: 10, textTransform: 'uppercase' as const, letterSpacing: '.05em' }}>{org.project_label}s</div>
          <div style={{ borderRadius: 10, overflow: 'hidden', border: '1.5px solid var(--border-card)' }}>
            <StatRow label="Total Projects"    value={totalProjects} />
            <StatRow label="Completed"         value={completedProjects} indent color="var(--success)" />
            <StatRow label="Ongoing"           value={ongoingProjects}   indent color="var(--warning)" />
            <StatRow label="Total Income"      value={formatCurrency(projectIncome,  org.currency_symbol)} indent color="var(--success)" />
            <StatRow label="Total Expenses"    value={formatCurrency(projectExpense, org.currency_symbol)} indent color="var(--danger)"  />
            <StatRow label="Net (Projects)"    value={formatCurrency(projectIncome - projectExpense, org.currency_symbol)} bold color={projectIncome >= projectExpense ? 'var(--success)' : 'var(--danger)'} border />
          </div>
        </div>
        {/* Events */}
        <div>
          <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--success)', marginBottom: 10, textTransform: 'uppercase' as const, letterSpacing: '.05em' }}>{org.event_label}s</div>
          <div style={{ borderRadius: 10, overflow: 'hidden', border: '1.5px solid var(--border-card)' }}>
            <StatRow label="Total Events"      value={totalEvents} />
            <StatRow label="Completed"         value={completedEvents}  indent color="var(--success)" />
            <StatRow label="Upcoming"          value={upcomingEvents}   indent color="var(--warning)" />
            <StatRow label="Total Income"      value={formatCurrency(eventIncome,  org.currency_symbol)} indent color="var(--success)" />
            <StatRow label="Total Expenses"    value={formatCurrency(eventExpense, org.currency_symbol)} indent color="var(--danger)"  />
            <StatRow label="Net (Events)"      value={formatCurrency(eventIncome - eventExpense, org.currency_symbol)} bold color={eventIncome >= eventExpense ? 'var(--success)' : 'var(--danger)'} border />
          </div>
        </div>
      </div>
    </ReportSection>
  )
}
