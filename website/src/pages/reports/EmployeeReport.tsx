// EmployeeReport.jsx — Per-member report; header row with title + Export PDF + Print buttons
// Responsive via useBreakpoint — sidebar collapses on mobile
import { useState } from 'react'
import type { ReactNode } from 'react'
import { StatusBadge, Avatar, Card, InfoModal, ResponseModal } from '../../components/ui'
import { MOCK_USERS, MOCK_TRANSACTIONS, formatCurrency, formatDate } from '../../api/mockData'
import { useOrg } from '../../context/OrgContext'
import useBreakpoint from '../../hooks/useBreakpoint'
import type { User } from '../../types'

function IcoExport() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
    </svg>
  )
}

function IcoEye() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  )
}

function IcoPrint() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 6 2 18 2 18 9"/>
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
      <rect x="6" y="14" width="12" height="8"/>
    </svg>
  )
}

/* Solid-color action button */
function ActionBtn({ children, icon, onClick, variant = 'primary' }: { children: ReactNode; icon?: ReactNode; onClick: () => void; variant?: 'primary' | 'secondary' }) {
  const styles: Record<'primary' | 'secondary', { bg: string; border: string; color: string }> = {
    primary:   { bg: 'var(--accent)',  border: 'var(--accent)',      color: '#fff' },
    secondary: { bg: '#5A6474',        border: '#5A6474',            color: '#fff' },
  }
  const s = styles[variant] || styles.primary
  return (
    <button onClick={onClick} style={{
      display: 'flex' as const, alignItems: 'center', justifyContent: 'center', gap: 6,
      padding: '9px 18px', borderRadius: 8,
      border: '1.5px solid ' + s.border, background: s.bg, color: s.color,
      fontSize: 13, fontWeight: 600, cursor: 'pointer' as const, fontFamily: 'var(--font-body)',
      whiteSpace: 'nowrap' as const, transition: 'opacity .15s',
    }}>
      {icon}{children}
    </button>
  )
}

/* ── EmpRow — reusable employee row inside All Employees modal ─── */
function EmpRow({ u }: { u: User }) {
  return (
    <div style={{ display: 'flex' as const, alignItems: 'center', gap: 12, padding: '9px 14px', borderRadius: 10, background: 'var(--neutral-light)', border: '1px solid var(--border-card)', marginBottom: 5 }}>
      <Avatar name={u.full_name} size={32} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: 13.5 }}>{u.full_name}</div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 1 }}>{u.employee_number} · {u.department || '—'}</div>
      </div>
      <span style={{ padding: '3px 10px', borderRadius: 20, background: '#4B5EAA', color: '#fff', fontSize: 11, fontWeight: 700 }}>{u.role}</span>
      <StatusBadge status={u.status} />
    </div>
  )
}

export default function EmployeeReport() {
  const org = useOrg()
  const { isMobile } = useBreakpoint()
  const reportLayout = isMobile ? '1fr' : '220px 1fr' // sidebar collapses on mobile
  const [selected,     setSelected]    = useState(MOCK_USERS[0])
  const [showExport,   setShowExport]   = useState(false)   /* Export PDF confirmation modal */
  const [exportResult, setExportResult] = useState<{variant:string;title:string;message:string} | null>(null)    /* Export PDF result feedback */
  const [showAllList,  setShowAllList] = useState(false)
  const [listPage,     setListPage]   = useState(1)
  const LIST_PAGE_SIZE = 8
  const officers = MOCK_USERS.filter((u) => u.role !== 'Member')
  const members  = MOCK_USERS.filter((u) => u.role === 'Member')
  const listTotalPages = Math.max(1, Math.ceil(MOCK_USERS.length / LIST_PAGE_SIZE))
  const myTx     = MOCK_TRANSACTIONS.filter((t) => t.user_id === selected?.id).slice(0, 6)

  return (
    <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 14 }}>

      {/* ── Top header Card: title (left) + buttons (right) ── */}
      <Card style={{ padding: '12px 18px' }}>
        <div style={{ display: 'flex' as const, alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>Employee Report</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 1 }}>View and export individual member financial reports</div>
          </div>
          <div style={{ display: 'flex' as const, gap: 10 }}>
            <ActionBtn variant="secondary" icon={<IcoPrint />} onClick={() => window.print()}>
              Print
            </ActionBtn>
            <ActionBtn icon={<IcoExport />} onClick={() => setShowExport(true)}>
              Export PDF
            </ActionBtn>
          </div>
        </div>
      </Card>

      {/* ── Main layout: sidebar + report ─────────────────── */}
      <div style={{ display: 'grid' as const, gridTemplateColumns: reportLayout, gap: 14, alignItems: 'flex-start' }}>

        {/* Member list sidebar */}
        <Card>
          <div style={{ display: 'flex' as const, alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: '1px solid var(--border-inner)' }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{org.people_label} List</div>
            <button onClick={() => { setListPage(1); setShowAllList(true) }} title="View All Employees"
              style={{ width: 32, height: 32, borderRadius: 7, border: '1.5px solid var(--accent)', background: 'var(--accent-light)', color: 'var(--accent)', cursor: 'pointer' as const, display: 'flex' as const, alignItems: 'center', justifyContent: 'center' }}>
              <IcoEye />
            </button>
          </div>
          <div style={{ padding: '8px 0' }}>
            {[{ label: 'Officers', list: officers }, { label: `${org.people_label}s`, list: members }].map(({ label, list }) => (
              <div key={label}>
                <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase' as const, color: 'var(--text-muted)', padding: '8px 14px 4px' }}>
                  {label}
                </div>
                {list.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => setSelected(u)}
                    style={{
                      width: '100%', display: 'flex' as const, alignItems: 'center', gap: 9,
                      padding: '9px 14px',
                      background: selected?.id === u.id ? 'var(--accent-light)' : 'none',
                      border: 'none', cursor: 'pointer' as const, textAlign: 'left' as const,
                      fontFamily: 'var(--font-body)',
                      color: selected?.id === u.id ? 'var(--accent)' : 'var(--text-primary)',
                    }}>
                    <Avatar name={u.full_name} size={26} />
                    <span style={{ fontSize: 13, fontWeight: selected?.id === u.id ? 600 : 400 }}>
                      {u.full_name}
                    </span>
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
            <div style={{ padding: '22px 28px', borderBottom: '1px solid var(--border-inner)', textAlign: 'center' as const }}>
              <div style={{ fontSize: 18, fontWeight: 700 }}>uniFITS Organization</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--accent)', marginTop: 3 }}>
                {org.people_label} Report
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>
                Generated: {new Date().toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>

            {/* Member info */}
            <div style={{ padding: '18px 28px', borderBottom: '1px solid var(--border-inner)' }}>
              <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--accent)', marginBottom: 12, textTransform: 'uppercase' as const, letterSpacing: '.06em' }}>
                Member Information
              </div>
              <div style={{ display: 'grid' as const, gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 12 }}>
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
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' as const, letterSpacing: '.05em', marginBottom: 2 }}>{k}</div>
                    <div style={{ fontSize: 13.5, fontWeight: 600 }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent transactions */}
            <div style={{ padding: '18px 28px' }}>
              <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--accent)', marginBottom: 12, textTransform: 'uppercase' as const, letterSpacing: '.06em' }}>
                Recent Transactions
              </div>
              {myTx.length === 0
                ? <div style={{ color: 'var(--text-muted)', fontSize: 13, textAlign: 'center' as const, padding: '20px 0' }}>No transactions found for this member.</div>
                : (
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead>
                      <tr style={{ background: 'var(--table-head-bg)' }}>
                        {['Reference', 'Amount', 'Category', 'Method', 'Status', 'Date'].map((h) => (
                          <th key={h} style={{ padding: '8px 12px', textAlign: 'left' as const, fontSize: 11, fontWeight: 600, color: 'var(--table-head-fg)', textTransform: 'uppercase' as const, letterSpacing: '.05em', borderBottom: '2px solid var(--border-table)' }}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {myTx.map((t) => (
                        <tr key={t.id} style={{ borderBottom: '1px solid var(--border-inner)' }}>
                          <td style={{ padding: '9px 12px' }}><code style={{ fontSize: 11 }}>{t.reference_number}</code></td>
                          <td style={{ padding: '9px 12px', fontWeight: 700, color: 'var(--success)' }}>{formatCurrency(t.amount, org.currency_symbol)}</td>
                          <td style={{ padding: '9px 12px' }}>
                            <span style={{ display: 'inline-flex' as const, padding: '3px 10px', borderRadius: 20, background: '#4B5EAA', color: '#fff', fontSize: 11, fontWeight: 700 }}>
                              {t.category.charAt(0).toUpperCase() + t.category.slice(1)}
                            </span>
                          </td>
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

      {/* All Employees List modal */}
      {showAllList && (
        <InfoModal open={showAllList} onClose={() => setShowAllList(false)}
          title="All Employees List"
          subtitle={`${MOCK_USERS.length} total · ${officers.length} officers · ${members.length} members · Page ${listPage} of ${listTotalPages}`}
          footer={<button onClick={() => setShowAllList(false)} style={{ padding: '10px 28px', borderRadius: 9, border: '1.5px solid var(--border-card)', background: 'var(--neutral-light)', color: 'var(--text-primary)', fontSize: 14, fontWeight: 600, cursor: 'pointer' as const, fontFamily: 'var(--font-body)' }}>Close</button>}>
          <div>
            {/* Officers section — paginated */}
            {officers.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex' as const, alignItems: 'center', gap: 8, marginBottom: 12, paddingBottom: 8, borderBottom: '2px solid var(--accent)' }}>
                  <span style={{ padding: '3px 12px', borderRadius: 20, background: 'var(--accent)', color: '#fff', fontSize: 11.5, fontWeight: 700 }}>Officers</span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{officers.length} total</span>
                </div>
                {/* Officers paginated via listPage */}
                {officers.slice((listPage-1)*LIST_PAGE_SIZE, listPage*LIST_PAGE_SIZE).map((u) => (
                  <EmpRow key={u.id} u={u} />
                ))}
                {/* Officers pagination */}
                {Math.ceil(officers.length / LIST_PAGE_SIZE) > 1 && (
                  <div style={{ display: 'flex' as const, justifyContent: 'center', gap: 4, marginTop: 10 }}>
                    {Array.from({ length: Math.ceil(officers.length / LIST_PAGE_SIZE) }, (_, i) => i + 1).map((p) => (
                      <button key={p} onClick={() => setListPage(p)} style={{ width: 28, height: 28, borderRadius: 6, border: '1.5px solid var(--border-card)', background: p === listPage ? 'var(--accent)' : '#fff', color: p === listPage ? '#fff' : 'var(--text-primary)', cursor: 'pointer' as const, fontSize: 11, fontWeight: p === listPage ? 700 : 400 }}>{p}</button>
                    ))}
                  </div>
                )}
              </div>
            )}
            {/* Employees (members) section — paginated */}
            {members.length > 0 && (
              <div>
                <div style={{ display: 'flex' as const, alignItems: 'center', gap: 8, marginBottom: 12, paddingBottom: 8, borderBottom: '2px solid #5A6474' }}>
                  <span style={{ padding: '3px 12px', borderRadius: 20, background: '#5A6474', color: '#fff', fontSize: 11.5, fontWeight: 700 }}>Employees</span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{members.length} total</span>
                </div>
                {members.slice((listPage-1)*LIST_PAGE_SIZE, listPage*LIST_PAGE_SIZE).map((u) => (
                  <EmpRow key={u.id} u={u} />
                ))}
                {/* Employees pagination */}
                {Math.ceil(members.length / LIST_PAGE_SIZE) > 1 && (
                  <div style={{ display: 'flex' as const, justifyContent: 'center', gap: 4, marginTop: 10 }}>
                    {Array.from({ length: Math.ceil(members.length / LIST_PAGE_SIZE) }, (_, i) => i + 1).map((p) => (
                      <button key={p} onClick={() => setListPage(p)} style={{ width: 28, height: 28, borderRadius: 6, border: '1.5px solid var(--border-card)', background: p === listPage ? 'var(--accent)' : '#fff', color: p === listPage ? '#fff' : 'var(--text-primary)', cursor: 'pointer' as const, fontSize: 11, fontWeight: p === listPage ? 700 : 400 }}>{p}</button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </InfoModal>
      )}

      {/* ── Export PDF Confirmation Modal ──────────────────────── */}
      <ResponseModal
        open={showExport}
        onClose={() => setShowExport(false)}
        variant="info"
        title="Export Employee Report PDF"
        message={`This will generate a PDF report for ${selected?.full_name || 'the selected employee'} including all financial contributions and attendance records.`}
        confirmLabel="Export PDF"
        cancelLabel="Cancel"
        onConfirm={() => {
          setShowExport(false)
          setExportResult({ variant: 'success', title: 'PDF Exported', message: `Report for ${selected?.full_name} has been generated and is ready to download.` })
        }}
      />

      {/* ── Export result feedback ─────────────────────────────── */}
      <ResponseModal
        open={!!exportResult}
        onClose={() => setExportResult(null)}
        variant={(exportResult?.variant || 'success') as import('../../types').ModalVariant}
        title={exportResult?.title || ''}
        message={exportResult?.message || ''}
        confirmLabel="Got it"
      />
    </div>
  )
}
