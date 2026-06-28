// Profile.jsx — Rich personal profile page; Edit Profile via InfoModal
// Responsive via useBreakpoint — stat grids collapse on mobile
import { useState } from 'react'
import { Badge, StatusBadge, Avatar, Card, CardHeader, Button, Input, Select, InfoModal, ResponseModal, SectionDivider } from '../../components/ui'
import { MOCK_USERS, MOCK_ATTENDANCES, MOCK_TRANSACTIONS, formatDate, formatCurrency } from '../../api/mockData'
import { useOrg } from '../../context/OrgContext'
import useBreakpoint from '../../hooks/useBreakpoint'

const GENDER_OPTIONS = [
  { value: 'Male',              label: 'Male' },
  { value: 'Female',            label: 'Female' },
  { value: 'Non-binary',        label: 'Non-binary' },
  { value: 'Prefer not to say', label: 'Prefer not to say' },
]

/* ── SVG Icons ────────────────────────────────────────────────────── */
const IcoId     = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
const IcoMail   = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
const IcoPhone  = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.1 19.79 19.79 0 0 1 1.62 4.5 2 2 0 0 1 3.62 2.31h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.16 6.16l1.02-.78a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
const IcoCal    = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
const IcoEdit   = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
const IcoMoney  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
const IcoLock   = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
const IcoUser   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>

export default function Profile({ userId = '1' }: Record<string, any>) {
  const org  = useOrg()
  const { isMobile, isTablet } = useBreakpoint()
  const statCols = isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)' // responsive stat grid
  const user = MOCK_USERS.find((u: any) => u.id === userId) || MOCK_USERS[0]

  // Attendance records for this user
  const userAttendance = (MOCK_ATTENDANCES || []).filter((a: any) => a.user_name === user.full_name)

  // Personal transactions
  const userTransactions = MOCK_TRANSACTIONS.filter((t: any) => t.user_id === user.id).slice(0, 3)

  // Contribution total
  const totalContributed = MOCK_TRANSACTIONS
    .filter((t: any) => t.user_id === user.id && t.entry_type !== 'expense')
    .reduce((s, t) => s + t.amount, 0)

  // Attendance stats
  const attStats = {
    present: userAttendance.filter((a: any) => a.status === 'present').length,
    late:    userAttendance.filter((a: any) => a.status === 'late').length,
    absent:  userAttendance.filter((a: any) => a.status === 'absent').length,
    excused: userAttendance.filter((a: any) => a.status === 'excused').length,
  }
  const attTotal = userAttendance.length

  /* Edit modal state */
  const [showEditModal,    setShowEditModal]    = useState(false)
  const [saveResponse,     setSaveResponse]     = useState<{variant:string;title:string;message:string} | null>(null)
  const [showAllAttend,    setShowAllAttend]    = useState(false)
  const [showAllTxn,       setShowAllTxn]       = useState(false)
  const [form, setForm] = useState<Record<string,any>>({
    first_name:       user.first_name,
    last_name:        user.last_name,
    gender:           user.gender,
    contact_number:   user.contact_number,
    email:            user.email,
    address_city:     user.address_city     || '',
    address_province: user.address_province || '',
    occupation:       user.occupation       || '',
    has_partner:      false,
  })
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setForm((f: any) => ({ ...f, [k]: e.target.value }))

  function handleSave() {
    setShowEditModal(false)
    setSaveResponse({ variant: 'success', title: 'Profile Updated', message: 'Your profile information has been saved successfully. Changes are now reflected across the system.' })
  }

  return (
    <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 14 }}>

      {/* ── Profile hero card ─────────────────────────────────────── */}
      <Card style={{ padding: 22 }}>
        <div style={{ display: 'flex' as const, alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
          {/* Avatar */}
          <Avatar name={user.full_name} size={80} />

          {/* Name + meta */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 style={{ margin: '0 0 6px', fontSize: 22, fontWeight: 700 }}>{user.full_name}</h2>
            <div style={{ display: 'flex' as const, gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
              <Badge variant="accent">{user.role}</Badge>
              <Badge variant="neutral">{user.department}</Badge>
              <StatusBadge status={user.status} />
            </div>
            <div style={{ display: 'flex' as const, gap: 20, flexWrap: 'wrap', fontSize: 13, color: 'var(--text-muted)' }}>
              <span style={{ display: 'flex' as const, alignItems: 'center', gap: 5 }}><IcoId />    {user.employee_number}</span>
              <span style={{ display: 'flex' as const, alignItems: 'center', gap: 5 }}><IcoMail />  {user.email}</span>
              <span style={{ display: 'flex' as const, alignItems: 'center', gap: 5 }}><IcoPhone /> {user.contact_number}</span>
              <span style={{ display: 'flex' as const, alignItems: 'center', gap: 5 }}><IcoCal />   Joined {formatDate(user.joined)}</span>
            </div>
          </div>

          {/* Edit Profile button — inside card */}
          <Button onClick={() => setShowEditModal(true)} icon={<IcoEdit />} style={{ alignSelf: 'flex-start', flexShrink: 0 }}>
            Edit Profile
          </Button>
        </div>
      </Card>

      {/* ── Quick Stats row — 4-col desktop, 2-col mobile ────────── */}
      <div style={{ display: 'grid' as const, gridTemplateColumns: statCols, gap: 12 }}>
        {[
          { label: 'Total Contributions', value: formatCurrency(totalContributed, org.currency_symbol), color: 'var(--success)', icon: <IcoMoney /> },
          { label: 'Transactions',        value: userTransactions.length,                               color: 'var(--accent)',  icon: <IcoMoney /> },
          { label: 'Attendance Records',  value: attTotal,                                              color: 'var(--info)',    icon: <IcoCal /> },
          { label: 'Attendance Rate',     value: attTotal ? `${Math.round((attStats.present / attTotal) * 100)}%` : '—', color: 'var(--warning)', icon: <IcoUser /> },
        ].map((k: any) => (
          <Card key={k.label} style={{ padding: '14px 18px', background: '#FFFFFF', borderLeft: '4px solid ' + k.color, border: '1px solid ' + k.color + '25', transition: 'transform .18s ease, box-shadow .18s ease' }}
            onMouseEnter={(e: React.MouseEvent<HTMLElement>) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(75,94,170,.18)' }}
            onMouseLeave={(e: React.MouseEvent<HTMLElement>) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}>
            <div style={{ display: 'flex' as const, alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>{k.label}</div>
              <div style={{ width: 36, height: 36, borderRadius: 9, background: 'var(--neutral-light)', display: 'flex' as const, alignItems: 'center', justifyContent: 'center', color: k.color }}>
                {k.icon}
              </div>
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, color: k.color, lineHeight: 1 }}>{k.value}</div>
          </Card>
        ))}
      </div>

      {/* ── Main info grid — 4-col desktop, 2-col tablet, 1-col mobile ── */}
      <div style={{ display: 'grid' as const, gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2,1fr)' : 'repeat(4, 1fr)', gap: 14 }}>

        {/* Personal Information */}
        <Card>
          <CardHeader title="Personal Information" />
          <div style={{ padding: '14px 18px', display: 'flex' as const, flexDirection: 'column' as const, gap: 10 }}>
            {[
              ['Full Name',    user.full_name],
              ['Employee ID',  user.employee_number],
              ['Gender',       user.gender],
              ['Contact',      user.contact_number],
              ['Email',        user.email],
              ['City',         user.address_city     || '—'],
              ['Province',     user.address_province || '—'],
              ['Occupation',   user.occupation       || '—'],
              ['Department',   user.department       || '—'],
              ['Date Joined',  formatDate(user.joined)],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex' as const, gap: 12, paddingBottom: 8, borderBottom: '1px solid var(--border-inner)' }}>
                <div style={{ width: 120, fontSize: 12, color: 'var(--text-muted)', flexShrink: 0, paddingTop: 1, fontWeight: 500, textTransform: 'uppercase' as const, letterSpacing: '.04em' }}>{k}</div>
                <div style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--text-primary)' }}>{v}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Role & Access */}
        <Card>
          <CardHeader title="Role & Access" />
          <div style={{ padding: '14px 18px' }}>
            {/* Current role highlight */}
            <div style={{ padding: '14px 16px', background: 'var(--accent-light)', borderRadius: 10, marginBottom: 14, display: 'flex' as const, alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--accent)', display: 'flex' as const, alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
                <IcoUser />
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--accent)' }}>{user.role}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Since {formatDate(user.joined)}</div>
              </div>
            </div>

            {/* Permissions list based on role */}
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' as const, letterSpacing: '.06em', marginBottom: 8 }}>Access Level</div>
            <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 6 }}>
              {(user.role === 'President'
                ? ['View Dashboard', 'Manage Members', 'Manage Funds', 'Add Transactions', 'View Reports', 'View Audit Logs', 'Manage Settings', 'Backup & Restore']
                : user.role === 'Treasurer'
                ? ['View Dashboard', 'Manage Funds', 'Add Transactions', 'View Reports']
                : user.role === 'Secretary'
                ? ['View Dashboard', 'Manage Members', 'Add Projects', 'Add Events', 'View Reports']
                : ['View Dashboard', 'View Announcements']
              ).map(perm => (
                <div key={perm} style={{ display: 'flex' as const, alignItems: 'center', gap: 8, fontSize: 13 }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                  <span style={{ color: 'var(--text-secondary)' }}>{perm}</span>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--border-inner)', fontSize: 12.5, color: 'var(--text-muted)' }}>
              No previous roles on record.
            </div>
          </div>
        </Card>


        {/* Attendance Summary */}
        <Card style={{ display:'flex', flexDirection:'column' }}>
          <CardHeader title={`${org.attendance_label} Summary`} subtitle={`${attTotal} total records`} />
          {/* Stat pills */}
          <div style={{ display: 'grid' as const, gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4, 1fr)', gap: 0, borderBottom: '1px solid var(--border-inner)' }}>
            {[
              { label: 'Present', value: attStats.present, color: '#2E7D52', bg: '#f0faf4' },
              { label: 'Late',    value: attStats.late,    color: '#D4860A', bg: '#fffbf0' },
              { label: 'Absent',  value: attStats.absent,  color: '#C0392B', bg: '#fdf3f2' },
              { label: 'Excused', value: attStats.excused, color: '#2471A3', bg: '#f0f7fd' },
            ].map((s: any) => (
              <div key={s.label} style={{ padding: '12px 0', textAlign: 'center' as const, background: s.bg, borderRight: '1px solid var(--border-inner)' }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 11, color: s.color, fontWeight: 600, marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>

          <div style={{ padding: '6px 0', flex: 1 }}>
            {userAttendance.length === 0
              ? <div style={{ padding: '20px', textAlign: 'center' as const, color: 'var(--text-muted)', fontSize: 13 }}>No attendance records found.</div>
              : userAttendance.slice(0, 3).map((a: any) => (
                  <div key={a.id} style={{ display: 'flex' as const, alignItems: 'center', justifyContent: 'space-between', padding: '8px 18px', borderBottom: '1px solid var(--border-inner)', fontSize: 13 }}>
                    <div>
                      <div style={{ fontWeight: 500 }}>{a.activity}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{formatDate(a.attendance_date)}</div>
                    </div>
                    <StatusBadge status={a.status} />
                  </div>
                ))
            }
          </div>
          {userAttendance.length > 0 && (
            <div style={{ padding: '10px 16px', borderTop: '1px solid var(--border-inner)', textAlign: 'center' as const }}>
              <button
                onClick={() => setShowAllAttend(true)}
                style={{ padding: '7px 22px', borderRadius: 8, border: '1.5px solid var(--info)', background: 'var(--info)', color: '#fff', fontSize: 12.5, fontWeight: 600, cursor: 'pointer' as const, fontFamily: 'var(--font-body)' }}>
                View All Attended ({userAttendance.length})
              </button>
            </div>
          )}
        </Card>

        {/* Recent Personal Transactions */}
        <Card style={{ display:'flex', flexDirection:'column' }}>
          <CardHeader title="Personal Transactions" subtitle="Recent financial activity" />
          <div style={{ padding: '6px 0', flex: 1 }}>
            {userTransactions.length === 0
              ? <div style={{ padding: '20px', textAlign: 'center' as const, color: 'var(--text-muted)', fontSize: 13 }}>No transactions found.</div>
              : userTransactions.map((t: any) => (
                  <div key={t.id} style={{ display: 'flex' as const, alignItems: 'center', gap: 12, padding: '10px 18px', borderBottom: '1px solid var(--border-inner)' }}>
                    {/* Type icon */}
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: t.entry_type === 'expense' ? 'var(--danger-light)' : 'var(--success-light)', display: 'flex' as const, alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: t.entry_type === 'expense' ? 'var(--danger)' : 'var(--success)' }}>
                      <IcoMoney />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap' as const, overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.description || t.category}</div>
                      <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 1 }}>{formatDate(t.transaction_date)} · {t.fund}</div>
                    </div>
                    <div style={{ textAlign: 'right' as const, flexShrink: 0 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 700, color: t.entry_type === 'expense' ? 'var(--danger)' : 'var(--success)' }}>
                        {t.entry_type === 'expense' ? '−' : '+'}{formatCurrency(t.amount, org.currency_symbol)}
                      </div>
                      <StatusBadge status={t.status} />
                    </div>
                  </div>
                ))
            }
          </div>
          {MOCK_TRANSACTIONS.filter((t: any) => t.user_id === user.id).length > 0 && (
            <div style={{ padding: '10px 16px', borderTop: '1px solid var(--border-inner)', textAlign: 'center' as const }}>
              <button
                onClick={() => setShowAllTxn(true)}
                style={{ padding: '7px 22px', borderRadius: 8, border: '1.5px solid var(--success)', background: 'var(--success)', color: '#fff', fontSize: 12.5, fontWeight: 600, cursor: 'pointer' as const, fontFamily: 'var(--font-body)' }}>
                View All Transactions ({MOCK_TRANSACTIONS.filter((t: any) => t.user_id === user.id).length})
              </button>
            </div>
          )}
        </Card>
      </div>

      {/* ── View All Attended InfoModal ──────────────────────────── */}
      <InfoModal
        open={showAllAttend}
        onClose={() => setShowAllAttend(false)}
        title="All Attendance Records"
        subtitle={`${userAttendance.length} total records for ${user.full_name}`}
        accentColor="var(--info)"
        footer={
          <button onClick={() => setShowAllAttend(false)} style={{ padding: '10px 28px', borderRadius: 9, border: '1.5px solid var(--border-card)', background: 'var(--neutral-light)', color: 'var(--text-primary)', fontSize: 14, fontWeight: 600, cursor: 'pointer' as const, fontFamily: 'var(--font-body)' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{marginRight:4}}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> Close
          </button>
        }>
        <div>
          {/* Stats summary row */}
          <div style={{ display: 'grid' as const, gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4, 1fr)', gap: 10, marginBottom: 18 }}>
            {[
              { label: 'Present', value: attStats.present, color: '#2E7D52', bg: '#f0faf4' },
              { label: 'Late',    value: attStats.late,    color: '#D4860A', bg: '#fffbf0' },
              { label: 'Absent',  value: attStats.absent,  color: '#C0392B', bg: '#fdf3f2' },
              { label: 'Excused', value: attStats.excused, color: '#2471A3', bg: '#f0f7fd' },
            ].map((s: any) => (
              <div key={s.label} style={{ padding: '12px', textAlign: 'center' as const, background: s.bg, borderRadius: 10, border: '1px solid ' + s.color + '30' }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 12, color: s.color, fontWeight: 600, marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
          {/* Full records list */}
          <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 2 }}>
            {userAttendance.length === 0
              ? <div style={{ textAlign: 'center' as const, padding: '32px', color: 'var(--text-muted)', fontSize: 13 }}>No attendance records found.</div>
              : userAttendance.map((a: any) => (
                  <div key={a.id} style={{ display: 'flex' as const, alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: 10, background: 'var(--neutral-light)', border: '1px solid var(--border-card)', marginBottom: 4 }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13.5 }}>{a.activity}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                        {formatDate(a.attendance_date)} · Recorded by {a.recorded_by}
                      </div>
                      {a.remarks && <div style={{ fontSize: 11.5, color: 'var(--warning)', marginTop: 2, fontStyle: 'italic' }}>{a.remarks}</div>}
                    </div>
                    <StatusBadge status={a.status} />
                  </div>
                ))
            }
          </div>
        </div>
      </InfoModal>

      {/* ── View All Transactions InfoModal ─────────────────────── */}
      <InfoModal
        open={showAllTxn}
        onClose={() => setShowAllTxn(false)}
        title="All Personal Transactions"
        subtitle={`${MOCK_TRANSACTIONS.filter((t: any) => t.user_id === user.id).length} total transactions for ${user.full_name}`}
        accentColor="var(--success)"
        footer={
          <div style={{ display: 'flex' as const, gap: 10, justifyContent: 'flex-end' }}>
            <a href="#/profile/transactions"
              style={{ padding: '10px 20px', borderRadius: 9, border: '1.5px solid var(--accent)', background: 'var(--accent)', color: '#fff', fontSize: 13.5, fontWeight: 600, textDecoration: 'none', display: 'inline-flex' as const, alignItems: 'center', fontFamily: 'var(--font-body)' }}>
              View Full Transaction Page
            </a>
            <button onClick={() => setShowAllTxn(false)} style={{ padding: '10px 28px', borderRadius: 9, border: '1.5px solid var(--border-card)', background: 'var(--neutral-light)', color: 'var(--text-primary)', fontSize: 14, fontWeight: 600, cursor: 'pointer' as const, fontFamily: 'var(--font-body)' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{marginRight:4}}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> Close
            </button>
          </div>
        }>
        <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 6 }}>
          {MOCK_TRANSACTIONS.filter((t: any) => t.user_id === user.id).length === 0
            ? <div style={{ textAlign: 'center' as const, padding: '32px', color: 'var(--text-muted)', fontSize: 13 }}>No transactions found.</div>
            : MOCK_TRANSACTIONS.filter((t: any) => t.user_id === user.id).map((t: any) => (
                <div key={t.id} style={{ display: 'flex' as const, alignItems: 'center', gap: 14, padding: '12px 16px', borderRadius: 10, background: 'var(--neutral-light)', border: '1px solid var(--border-card)' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 9, background: t.entry_type === 'expense' ? 'var(--danger-light)' : 'var(--success-light)', display: 'flex' as const, alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: t.entry_type === 'expense' ? 'var(--danger)' : 'var(--success)' }}>
                    <IcoMoney />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 600 }}>{t.description || t.category}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 1 }}>
                      {formatDate(t.transaction_date)} · {t.fund} · {t.payment_method}
                    </div>
                    <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 1 }}>
                      Ref: {t.reference_number}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' as const, flexShrink: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: t.entry_type === 'expense' ? 'var(--danger)' : 'var(--success)' }}>
                      {t.entry_type === 'expense' ? '−' : '+'}{formatCurrency(t.amount, org.currency_symbol)}
                    </div>
                    <div style={{ marginTop: 3 }}><StatusBadge status={t.status} /></div>
                  </div>
                </div>
              ))
          }
        </div>
      </InfoModal>

      {/* ── Edit Profile InfoModal ────────────────────────────────── */}
      <InfoModal
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit My Profile"
        subtitle="Update your personal information and account credentials"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>Close</Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </>
        }>

        <div style={{ display: 'grid' as const, gridTemplateColumns: '1fr 260px', gap: 24, alignItems: 'flex-start' }}>

          {/* LEFT — form fields */}
          <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 4 }}>

            <SectionDivider label="Personal Information" />
            <div style={{ display: 'grid' as const, gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
              <Input label="Full Name" value={`${form.first_name} ${form.last_name}`} onChange={() => {}} disabled hint="Contact admin to change your name" />
              <Input label="Date of Birth" type="date" value="" onChange={() => {}} />
            </div>
            <Select label="Gender" value={form.gender} onChange={set('gender')} options={GENDER_OPTIONS} style={{ marginBottom: 14 }} />

            <SectionDivider label="Contact Information" />
            <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 14, marginBottom: 14 }}>
              <Input label="Contact Number" value={form.contact_number} onChange={set('contact_number')} hint="Must start with 09 and be exactly 11 digits" />
              <Input label="Email Address" type="email" value={form.email} onChange={set('email')} />
              <div style={{ display: 'grid' as const, gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <Input label="City"     value={form.address_city}     onChange={set('address_city')} />
                <Input label="Province" value={form.address_province} onChange={set('address_province')} />
              </div>
            </div>

            <SectionDivider label="Partner Information" />
            <label style={{ display: 'flex' as const, alignItems: 'center', gap: 10, fontSize: 13.5, cursor: 'pointer' as const, marginBottom: form.has_partner ? 14 : 18 }}>
              <input type="checkbox" checked={form.has_partner} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setForm(f => ({ ...f, has_partner: (e.target as HTMLInputElement).checked }))} style={{ accentColor: 'var(--accent)', width: 15, height: 15 }} />
              I have a partner / spouse
            </label>
            {form.has_partner && (
              <Input label="Anniversary Date" type="date" value="" onChange={() => {}} style={{ marginBottom: 14 }} />
            )}

            <SectionDivider label="Occupation" />
            <Input label="Occupation" value={form.occupation} onChange={set('occupation')} placeholder="e.g. Manager, Staff" style={{ marginBottom: 4 }} />
          </div>

          {/* RIGHT — avatar + photo upload + password (in order) */}
          <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 14 }}>

            {/* Avatar preview card */}
            <Card style={{ padding: 18, textAlign: 'center' as const }}>
              <Avatar name={user.full_name} size={68} style={{ margin: '0 auto 10px' }} />
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 2 }}>{user.full_name}</div>
              <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginBottom: 14 }}>{user.employee_number}</div>

              {/* Profile Photo section */}
              <div style={{ textAlign: 'left' as const, paddingTop: 12, borderTop: '1px solid var(--border-inner)' }}>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' as const, letterSpacing: '.06em', marginBottom: 8 }}>Profile Photo</div>
                <input type="file" accept="image/*" style={{ fontSize: 12.5, width: '100%', marginBottom: 6 }} />
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 10 }}>Leave blank to keep current photo</div>
                <label style={{ display: 'flex' as const, alignItems: 'center', gap: 7, fontSize: 12.5, cursor: 'pointer' as const }}>
                  <input type="checkbox" style={{ accentColor: 'var(--danger)' }} />
                  <span style={{ color: 'var(--danger)' }}>Remove Profile Photo</span>
                </label>
              </div>
            </Card>

            {/* Change Password — placed BELOW profile photo */}
            <Card style={{ padding: 18 }}>
              <div style={{ display: 'flex' as const, alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <span style={{ color: 'var(--accent)', display: 'flex' as const }}><IcoLock /></span>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>Change Password</div>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', fontStyle: 'italic' }}>(Optional)</span>
              </div>
              <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 12 }}>
                <Input label="Current Password" type="password" value="" onChange={() => {}} placeholder="Enter current password" />
                <Input label="New Password"     type="password" value="" onChange={() => {}} placeholder="Enter new password" />
                <Input label="Confirm Password" type="password" value="" onChange={() => {}} placeholder="Confirm new password" />
              </div>
            </Card>

          </div>
        </div>
      </InfoModal>

      {/* Save result */}
      <ResponseModal
        open={!!saveResponse}
        onClose={() => setSaveResponse(null)}
        variant={(saveResponse?.variant || 'success') as import('../../types').ModalVariant || 'success'}
        title={saveResponse?.title  || ''}
        message={saveResponse?.message || ''}
        confirmLabel="Got it"
      />
    </div>
  )
}
