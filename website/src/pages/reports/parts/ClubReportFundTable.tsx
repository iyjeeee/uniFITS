// parts/ClubReportFundTable.tsx — III. Fund Balance Sheet: per-fund received/spent/balance + totals row
import { formatCurrency } from '../../../api/mockData'
import { useOrg } from '../../../context/OrgContext'
import { capitalize } from '../../../utils/formatters'
import ReportSection from './ReportSection'
import type { ClubReportStats } from './clubReportStats'

export default function ClubReportFundTable({ stats }: { stats: ClubReportStats }) {
  const org = useOrg()
  const { fundRows, totalFundBalance } = stats
  return (
    <ReportSection title="III. Fund Balance Sheet">
      <div style={{ overflowX: 'auto' as const }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: 'var(--accent)' }}>
              {['Fund Name', 'Type', 'Status', 'Total Received', 'Total Spent', 'Current Balance'].map((h) => (
                <th key={h} style={{ padding: '10px 14px', textAlign: 'left' as const, fontSize: 11, fontWeight: 700, color: '#fff', textTransform: 'uppercase' as const, letterSpacing: '.06em', borderBottom: '2px solid var(--border-table)', whiteSpace: 'nowrap' as const }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {fundRows.map((f, i) => (
              <tr key={f.id} style={{ background: i % 2 === 0 ? 'var(--neutral-light)' : '#fff', borderBottom: '1px solid var(--border-inner)' }}>
                <td style={{ padding: '10px 14px', fontWeight: 600 }}>{f.name}</td>
                <td style={{ padding: '10px 14px', textTransform: 'capitalize' as const }}>{f.fund_type}</td>
                <td style={{ padding: '10px 14px' }}>
                  <span style={{ padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: f.status === 'active' ? '#2E7D52' : '#C0392B', color: '#fff' }}>
                    {capitalize(f.status)}
                  </span>
                </td>
                <td style={{ padding: '10px 14px', fontWeight: 700, color: 'var(--success)' }}>{formatCurrency(f.received, org.currency_symbol)}</td>
                <td style={{ padding: '10px 14px', fontWeight: 700, color: 'var(--danger)'  }}>{formatCurrency(f.spent,    org.currency_symbol)}</td>
                <td style={{ padding: '10px 14px', fontWeight: 800, color: 'var(--accent)'  }}>{formatCurrency(f.balance,  org.currency_symbol)}</td>
              </tr>
            ))}
            <tr style={{ background: '#EAECF0', fontWeight: 700 }}>
              <td colSpan={3} style={{ padding: '10px 14px', fontWeight: 700 }}>TOTAL</td>
              <td style={{ padding: '10px 14px', fontWeight: 800, color: 'var(--success)' }}>
                {formatCurrency(fundRows.reduce((s, f) => s + f.received, 0), org.currency_symbol)}
              </td>
              <td style={{ padding: '10px 14px', fontWeight: 800, color: 'var(--danger)' }}>
                {formatCurrency(fundRows.reduce((s, f) => s + f.spent, 0), org.currency_symbol)}
              </td>
              <td style={{ padding: '10px 14px', fontWeight: 800, color: 'var(--accent)' }}>
                {formatCurrency(totalFundBalance, org.currency_symbol)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </ReportSection>
  )
}
