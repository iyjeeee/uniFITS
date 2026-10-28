// parts/FundContributionsList.tsx — Member contributions to a fund: header with total, ranked rows (rank, name, role, payments, total), members without contributions
import { formatCurrency, MOCK_USERS, getRoleName } from '../../../api/mockData'
import type { getFundContributions } from './fundReportData'
import type { OrgConfig } from '../../../types'

interface Props { data: ReturnType<typeof getFundContributions>; accentC: string; org: OrgConfig }

export default function FundContributionsList({ data, accentC, org }: Props) {
  const { grandTotal, contributors, nonContribs } = data
  return (
    <div style={{ borderTop: '2px solid var(--border-inner)', paddingTop: 16 }}>
      <div style={{ display: 'flex' as const, alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
        <div>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-primary)' }}>
            {org.people_label} Contributions
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
            {contributors.length} of {MOCK_USERS.length} members have contributed
          </div>
        </div>
        <div style={{ padding: '6px 14px', borderRadius: 8, background: accentC, color: '#fff', fontSize: 13, fontWeight: 700 }}>
          Total: {formatCurrency(grandTotal, org.currency_symbol)}
        </div>
      </div>

      {/* Header row */}
      <div style={{ display: 'grid' as const, gridTemplateColumns: '32px 1fr 90px 80px', gap: 8, padding: '8px 12px', background: 'var(--table-head-bg)', borderRadius: 8, marginBottom: 6 }}>
        {['#', 'Member', 'Transactions', 'Total'].map((h) => (
          <div key={h} style={{ fontSize: 11, fontWeight: 700, color: 'var(--table-head-fg)', textTransform: 'uppercase' as const, letterSpacing: '.06em' }}>{h}</div>
        ))}
      </div>

      {/* Contributors */}
      {contributors.length === 0 ? (
        <div style={{ padding: '20px', textAlign: 'center' as const, fontSize: 13, color: 'var(--text-muted)', background: 'var(--neutral-light)', borderRadius: 8 }}>
          No member contributions recorded for this fund yet.
        </div>
      ) : (
        <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 4 }}>
          {contributors.map((m, idx) => (
            <div key={m.user.id} style={{
              display: 'grid' as const, gridTemplateColumns: '32px 1fr 90px 80px', gap: 8,
              padding: '10px 12px', borderRadius: 8, alignItems: 'center',
              background: idx % 2 === 0 ? 'var(--neutral-light)' : '#fff',
              border: '1px solid var(--border-inner)',
            }}>
              <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-muted)' }}>{idx + 1}</div>
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)' }}>{m.user.full_name}</div>
                <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 1 }}>{getRoleName(m.user.role_id)}</div>
              </div>
              <div style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>{m.txns.length} payment{m.txns.length !== 1 ? 's' : ''}</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--success)' }}>
                {formatCurrency(m.total, org.currency_symbol)}
              </div>
            </div>
          ))}

          {/* No-contribution members */}
          {nonContribs.length > 0 && (
            <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px dashed var(--border-inner)' }}>
              <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' as const, letterSpacing: '.06em', marginBottom: 6 }}>
                No Contributions Yet ({nonContribs.length})
              </div>
              <div style={{ display: 'flex' as const, flexWrap: 'wrap', gap: 6 }}>
                {nonContribs.map((m) => (
                  <span key={m.user.id} style={{ padding: '4px 12px', borderRadius: 20, background: 'var(--neutral-light)', border: '1px solid var(--border-card)', fontSize: 12, color: 'var(--text-muted)' }}>
                    {m.user.full_name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
