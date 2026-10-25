// parts/ClubReportSummary.tsx — I. Executive Summary: four headline tiles + net surplus/deficit banner
import { MOCK_USERS, formatCurrency } from '../../../api/mockData'
import { useOrg } from '../../../context/OrgContext'
import useBreakpoint from '../../../hooks/useBreakpoint'
import ReportSection from './ReportSection'
import type { ClubReportStats } from './clubReportStats'

export default function ClubReportSummary({ stats, reportPeriod }: { stats: ClubReportStats; reportPeriod: string }) {
  const org = useOrg()
  const { isMobile } = useBreakpoint()
  const { completedEvents, totalFundBalance, netSurplus, totalProjects } = stats
  return (
    <ReportSection title="I. Executive Summary">
      <div style={{ display: 'grid' as const, gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4,1fr)', gap: 12, marginBottom: 16 }}>
        {[
          { label: 'Total Members',      value: MOCK_USERS.length,       color: 'var(--accent)'  },
          { label: 'Active Projects',     value: totalProjects,           color: 'var(--warning)' },
          { label: 'Events Held',         value: completedEvents,         color: 'var(--success)' },
          { label: 'Fund Balance',        value: formatCurrency(totalFundBalance, org.currency_symbol), color: 'var(--success)' },
        ].map((k) => (
          <div key={k.label} style={{ padding: '14px 16px', borderRadius: 10, background: 'var(--neutral-light)', border: '1.5px solid var(--border-card)', textAlign: 'center' as const }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: k.color, lineHeight: 1 }}>{k.value}</div>
            <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 5 }}>{k.label}</div>
          </div>
        ))}
      </div>
      <div style={{ padding: '14px 18px', borderRadius: 10, background: netSurplus >= 0 ? 'var(--success-light)' : 'var(--danger-light)', border: `1.5px solid ${netSurplus >= 0 ? 'rgba(46,125,82,.25)' : 'rgba(192,57,43,.25)'}` }}>
        <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 4 }}>Net Financial Position ({reportPeriod})</div>
        <div style={{ fontSize: 28, fontWeight: 900, color: netSurplus >= 0 ? 'var(--success)' : 'var(--danger)', lineHeight: 1 }}>
          {netSurplus >= 0 ? '+' : '−'}{formatCurrency(Math.abs(netSurplus), org.currency_symbol)}
          <span style={{ fontSize: 13, fontWeight: 600, marginLeft: 8 }}>{netSurplus >= 0 ? 'Surplus' : 'Deficit'}</span>
        </div>
      </div>
    </ReportSection>
  )
}
