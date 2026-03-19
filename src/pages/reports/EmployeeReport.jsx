// EmployeeReport.jsx — Per-member report with transactions, exportable
import { useState } from 'react'
import { Card, CardHeader, Button, Badge, StatusBadge, Avatar } from '../../components/ui'
import { MOCK_USERS, MOCK_TRANSACTIONS, formatCurrency, formatDate } from '../../api/mockData'
import { useOrg } from '../../context/OrgContext'

function IconExportPDF() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
}

export default function EmployeeReport() {
  const org      = useOrg()
  const [selected, setSelected] = useState(MOCK_USERS[0])

  const officers = MOCK_USERS.filter(u => u.role !== 'Member')
  const members  = MOCK_USERS.filter(u => u.role === 'Member')
  const myTx     = MOCK_TRANSACTIONS.filter(t => t.user_id === selected?.id).slice(0, 6)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 4 }}>
        <Button icon={<IconExportPDF />}>Export PDF</Button>
      </div>
      />

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 14, alignItems: 'flex-start' }}>

        {/* Member list sidebar */}
        <Card>
          <CardHeader title={`${org.people_label} List`} />
          <div style={{ padding: '8px 0' }}>
            {[{ label: 'Officers', list: officers }, { label: `${org.people_label}s`, list: members }].map(({ label, list }) => (
              <div key={label}>
                <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--text-muted)', padding: '8px 14px 4px' }}>{label}</div>
                {list.map(u => (
                  <button key={u.id} onClick={() => setSelected(u)} style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 9, padding: '9px 14px',
                    background: selected?.id === u.id ? 'var(--accent-light)' : 'none',
                    border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: 'var(--font-body)',
                    color: selected?.id === u.id ? 'var(--accent)' : 'var(--text-primary)',
                  }}>
                    <Avatar name={u.full_name} size={26} />
                    <span style={{ fontSize: 13, fontWeight: selected?.id === u.id ? 600 : 400 }}>{u.full_name}</span>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </Card>

        {/* Report view */}
        {selected && (
          <Card>
            {/* Report header */}
            <div style={{ padding: '22px 28px', borderBottom: '1px solid var(--border)', textAlign: 'center' }}>
              <div style={{ fontSize: 18, fontWeight: 700 }}>uniFITS Organization</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--accent)', marginTop: 3 }}>{org.people_label} Report</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>
                Generated: {new Date().toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>

            {/* Member info */}
            <div style={{ padding: '18px 28px', borderBottom: '1px solid var(--border)' }}>
              <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--accent)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '.06em' }}>Member Information</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 12 }}>
                {[
                  ['Name',       selected.full_name],
                  ['Position',   selected.role],
                  ['ID',         selected.employee_number],
                  ['Contact',    selected.contact_number],
                  ['Joined',     formatDate(selected.joined)],
                  ['Email',      selected.email],
                  ['Gender',     selected.gender],
                  ['Occupation', selected.occupation || '—'],
                ].map(([k, v]) => (
                  <div key={k}>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 2 }}>{k}</div>
                    <div style={{ fontSize: 13.5, fontWeight: 600 }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent transactions */}
            <div style={{ padding: '18px 28px' }}>
              <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--accent)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '.06em' }}>Recent Transactions</div>
              {myTx.length === 0
                ? <div style={{ color: 'var(--text-muted)', fontSize: 13, textAlign: 'center', padding: '20px 0' }}>No transactions found for this member.</div>
                : (
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead>
                      <tr style={{ background: 'var(--neutral-light)' }}>
                        {['Reference','Amount','Category','Method','Status','Date'].map(h => (
                          <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.05em', borderBottom: '1px solid var(--border)' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {myTx.map(t => (
                        <tr key={t.id} style={{ borderBottom: '1px solid var(--border)' }}>
                          <td style={{ padding: '9px 12px' }}><code style={{ fontSize: 11 }}>{t.reference_number}</code></td>
                          <td style={{ padding: '9px 12px', fontWeight: 700, color: 'var(--success)' }}>{formatCurrency(t.amount, org.currency_symbol)}</td>
                          <td style={{ padding: '9px 12px', textTransform: 'capitalize' }}>{t.category}</td>
                          <td style={{ padding: '9px 12px' }}>{t.payment_method}</td>
                          <td style={{ padding: '9px 12px' }}><StatusBadge status={t.status} /></td>
                          <td style={{ padding: '9px 12px' }}>{formatDate(t.transaction_date)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )
              }
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
