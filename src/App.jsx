import AppLayout from './layouts/AppLayout'
import useBreakpoint from './hooks/useBreakpoint'

function DashboardPlaceholder() {
  const bp = useBreakpoint()

  const kpiCols = bp === 'mobile' ? '1fr 1fr' : bp === 'tablet' ? '1fr 1fr' : 'repeat(4, 1fr)'
  const padding  = bp === 'mobile' ? 16 : 28

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      <div style={{ display: 'grid', gridTemplateColumns: kpiCols, gap: bp === 'mobile' ? 12 : 16 }}>
        {[
          { label: 'Total employees', value: '138',    trend: '+4 this month', color: 'var(--success)', bg: 'var(--success-light)' },
          { label: 'Overall balance',  value: '₱1.24M', trend: '+12.4%',        color: 'var(--warning)', bg: 'var(--accent-light)'  },
          { label: 'Active projects',  value: '24',     trend: '24 active',     color: 'var(--info)',    bg: 'var(--info-light)'    },
          { label: 'Upcoming events',  value: '8',      trend: '2 overdue',     color: 'var(--danger)',  bg: 'var(--danger-light)'  },
        ].map(({ label, value, trend, color, bg }) => (
          <div key={label} style={kpiCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                  <circle cx={12} cy={12} r={9} />
                </svg>
              </div>
              <span style={{ fontSize: 11, fontWeight: 500, padding: '2px 7px', borderRadius: 20, background: bg, color }}>{trend}</span>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: bp === 'mobile' ? 22 : 26, color: 'var(--text-primary)', lineHeight: 1 }}>{value}</div>
              <div style={{ fontSize: 12.5, color: 'var(--text-muted)', marginTop: 4 }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={card}>
        <div style={cardHeader}>
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>Recent transactions</span>
          <a href="#" style={{ fontSize: 12.5, color: 'var(--secondary)', fontWeight: 500 }}>View all →</a>
        </div>
        <div style={{ padding: '20px', color: 'var(--text-muted)', fontSize: 13.5, textAlign: 'center' }}>
          Connect your router and replace this with <code>&lt;TransactionsPage /&gt;</code>
        </div>
      </div>

    </div>
  )
}

export default function App() {
  return (
    <AppLayout page="Dashboard" sub="Overview">
      <DashboardPlaceholder />
    </AppLayout>
  )
}

const kpiCard   = { background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 12, cursor: 'pointer' }
const card      = { background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }
const cardHeader = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderBottom: '1px solid var(--border)' }
