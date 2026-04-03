// ItemDetailContent.jsx — Shared rich detail panel used by Projects and Events manage modals.
// Adds 4 extra sections below the existing content (2 per row):
//   Row A: Member Contributions  |  Member Attendance
//   Row B: External Income       |  External Expense
// Props: item (project/event), org, kind ('project'|'event')
import { useState } from 'react'
import { StatusBadge, Badge } from './ui'
import { formatCurrency, formatDate, MOCK_TRANSACTIONS, MOCK_ATTENDANCES, MOCK_USERS, fmt12} from '../api/mockData'
import useBreakpoint from '../hooks/useBreakpoint'

/* ── Kind-specific colors ────────────────────────────────────────── */
const KIND_COLOR = { project: '#4B5EAA', event: '#2E7D52' }
const KIND_BG    = { project: 'var(--accent-light)', event: 'var(--success-light)' }

/* ── Default SVG illustration ────────────────────────────────────── */
function DefaultPhoto({ kind, color }) {
  if (kind === 'project') {
    return <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" opacity=".7"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
  }
  return <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" opacity=".7"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
}

/* ── Mini section header ─────────────────────────────────────────── */
function MiniSection({ icon, title, count, color, bg, border }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '10px 14px', borderRadius: 8,
      background: bg, border: `1.5px solid ${border}`,
      marginBottom: 12,
    }}>
      <span style={{ color, display: 'flex' }}>{icon}</span>
      <span style={{ fontSize: 13, fontWeight: 700, color }}>
        {title}
        {count !== undefined && (
          <span style={{ marginLeft: 6, fontSize: 12, fontWeight: 600, opacity: .8 }}>({count})</span>
        )}
      </span>
    </div>
  )
}

/* ── ContributionRow — a single member contribution entry ────────── */
function ContributionRow({ tx, idx, org }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', borderRadius: 8, background: idx % 2 === 0 ? 'var(--neutral-light)' : '#fff', border: '1px solid var(--border-inner)', gap: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', flexShrink: 0 }}>#{idx + 1}</span>
        <span style={{ fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {tx.user_name || 'External'}
        </span>
      </div>
      <span style={{ fontSize: 13.5, fontWeight: 800, color: tx.entry_type === 'expense' ? 'var(--danger)' : 'var(--success)', flexShrink: 0 }}>
        {tx.entry_type === 'expense' ? '−' : '+'}{formatCurrency(tx.amount, org.currency_symbol)}
      </span>
    </div>
  )
}

/* ── AttendanceRow — a single member attendance entry ────────────── */
const ATT_COLOR = { present: '#2E7D52', late: '#D4860A', absent: '#C0392B', excused: '#2471A3' }
const ATT_BG    = { present: '#f0faf4', late: '#fffbf0', absent: '#fdf3f2', excused: '#f0f7fd' }

function AttendanceRow({ member, status, idx }) {
  const c = ATT_COLOR[status] || '#9CA3AF'
  const b = ATT_BG[status]    || '#F9FAFB'
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', borderRadius: 8, background: idx % 2 === 0 ? 'var(--neutral-light)' : '#fff', border: '1px solid var(--border-inner)', gap: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', flexShrink: 0 }}>#{idx + 1}</span>
        <span style={{ fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{member}</span>
      </div>
      <span style={{ padding: '2px 9px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: c, color: '#fff', flexShrink: 0 }}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    </div>
  )
}

/* ── EmptyHint — shown when a section has no data ────────────────── */
function EmptyHint({ text }) {
  return (
    <div style={{ padding: '20px', textAlign: 'center', fontSize: 13, color: 'var(--text-muted)', background: 'var(--neutral-light)', borderRadius: 8, border: '1px solid var(--border-inner)' }}>
      {text}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════
   MAIN EXPORT
══════════════════════════════════════════════════════════════════ */
export default function ItemDetailContent({ item, org, kind }) {
  if (!item) return null
  const { isMobile } = useBreakpoint()
  const isProject = kind === 'project'
  const accentC   = KIND_COLOR[kind] || KIND_COLOR.project
  const bgC       = KIND_BG[kind]    || KIND_BG.project
  const photoSrc  = item.photo_url
  const pct       = item.target_funding > 0 ? Math.min(100, Math.round((item.current_funding / item.target_funding) * 100)) : null
  const cap       = s => s ? s.charAt(0).toUpperCase() + s.slice(1) : '—'

  // ── Derived financial + attendance data ──────────────────────────
  // Member contributions: contributions from named members for this category
  const memberContribs = MOCK_TRANSACTIONS.filter(t =>
    t.user_id !== null &&
    t.entry_type === 'contribution' &&
    (isProject ? t.category === 'project' : t.category === 'event')
  )
  // External income: income entries (no user_id) for this category
  const externalIncome = MOCK_TRANSACTIONS.filter(t =>
    t.user_id === null &&
    t.entry_type === 'income' &&
    (isProject ? t.category === 'project' : t.category === 'event')
  )
  // External expense: expense entries for this category
  const externalExpense = MOCK_TRANSACTIONS.filter(t =>
    t.entry_type === 'expense' &&
    (isProject ? t.category === 'project' : t.category === 'event')
  )
  // Member attendance: records for this activity
  const attendanceRecords = MOCK_ATTENDANCES.filter(r => r.activity === item.title)

  // Two-column layout for the extra sections on desktop
  const twoCol = isMobile ? '1fr' : '1fr 1fr'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ── Hero banner ──────────────────────────────────────── */}
      <div style={{ height: 160, borderRadius: 14, overflow: 'hidden', position: 'relative', background: accentC, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {photoSrc
          ? <img src={photoSrc} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : (
            <>
              <div style={{ opacity: .18 }}><DefaultPhoto kind={kind} color="#fff" /></div>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'flex-end', padding: '18px 20px' }}>
                <div style={{ background: 'rgba(0,0,0,.52)', borderRadius: 10, padding: '10px 16px', flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: '#fff', lineHeight: 1.2 }}>{item.title}</div>
                  {item.description && (
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,.80)', marginTop: 4, lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                      {item.description}
                    </div>
                  )}
                </div>
              </div>
            </>
          )
        }
        <div style={{ position: 'absolute', top: 12, right: 12 }}><StatusBadge status={item.status} /></div>
      </div>

      {/* ── Info detail grid ──────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px,1fr))', gap: 12 }}>
        {[
          ['Status',         cap(item.status)],
          isProject
            ? ['Duration',     `${formatDate(item.start_date)} – ${formatDate(item.end_date)}`]
            : ['Date & Time',  `${formatDate(item.event_date)}${item.event_time ? ' · ' + fmt12(item.event_time) : ''}`],
          ['Location',       item.location || '—'],
          isProject ? ['Type', cap(item.project_type)] : ['Status', cap(item.status)],
          ['Target Funding', item.target_funding > 0 ? formatCurrency(item.target_funding, org.currency_symbol) : 'Not Required'],
          ['Current Funding',item.current_funding > 0 ? formatCurrency(item.current_funding, org.currency_symbol) : '—'],
        ]
        .filter((row, idx, arr) => !(row[0] === 'Status' && arr.findIndex(r => r[0] === 'Status') !== idx))
        .map(([k, v]) => (
          <div key={k} style={{ padding: '12px 14px', borderRadius: 10, background: 'var(--neutral-light)', border: '1.5px solid var(--border-card)' }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 4 }}>{k}</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{v}</div>
          </div>
        ))}
      </div>

      {/* ── Funding progress bar ──────────────────────────────── */}
      {pct !== null && (
        <div style={{ padding: '16px 18px', borderRadius: 10, background: bgC, border: `1px solid ${accentC}25` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
            <span style={{ fontWeight: 600, color: accentC }}>Funding Progress</span>
            <span style={{ fontWeight: 700, color: accentC }}>{pct}%</span>
          </div>
          <div style={{ height: 10, background: 'rgba(0,0,0,.08)', borderRadius: 10, overflow: 'hidden' }}>
            <div style={{ height: '100%', background: accentC, width: `${pct}%`, borderRadius: 10 }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, color: 'var(--text-muted)', marginTop: 6 }}>
            <span>{formatCurrency(item.current_funding, org.currency_symbol)} raised</span>
            <span>{formatCurrency(item.target_funding, org.currency_symbol)} goal</span>
          </div>
        </div>
      )}

      {/* ══ EXTRA SECTIONS ══════════════════════════════════════ */}
      <div style={{ borderTop: '2px solid var(--border-inner)', paddingTop: 20, display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* ── Row A: Member Contributions | Member Attendance ── */}
        <div style={{ display: 'grid', gridTemplateColumns: twoCol, gap: 16 }}>

          {/* Member Contributions */}
          <div>
            <MiniSection
              icon={<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>}
              title={`${org.people_label} Contributions`}
              count={memberContribs.length}
              color="var(--success)"
              bg="var(--success-light)"
              border="rgba(46,125,82,.25)"
            />
            {memberContribs.length === 0
              ? <EmptyHint text="No member contributions recorded for this activity." />
              : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {memberContribs.map((tx, i) => <ContributionRow key={tx.id} tx={tx} idx={i} org={org} />)}
                  {/* Total */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', borderRadius: 8, background: 'var(--success-light)', border: '1.5px solid rgba(46,125,82,.25)', marginTop: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--success)' }}>Total Contributions</span>
                    <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--success)' }}>
                      {formatCurrency(memberContribs.reduce((s, t) => s + t.amount, 0), org.currency_symbol)}
                    </span>
                  </div>
                </div>
              )
            }
          </div>

          {/* Member Attendance */}
          <div>
            <MiniSection
              icon={<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>}
              title={`${org.people_label} Attendance`}
              count={attendanceRecords.length}
              color="var(--accent)"
              bg="var(--accent-light)"
              border="rgba(75,94,170,.25)"
            />
            {attendanceRecords.length === 0
              ? <EmptyHint text="No attendance records found for this activity." />
              : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {attendanceRecords.map((r, i) => (
                    <AttendanceRow key={r.id} member={r.user_name} status={r.status} idx={i} />
                  ))}
                </div>
              )
            }
          </div>
        </div>

        {/* ── Row B: External Income | External Expense ──────── */}
        <div style={{ display: 'grid', gridTemplateColumns: twoCol, gap: 16 }}>

          {/* External Income */}
          <div>
            <MiniSection
              icon={<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>}
              title="External Income"
              count={externalIncome.length}
              color="var(--info)"
              bg="var(--info-light)"
              border="rgba(36,113,163,.25)"
            />
            {externalIncome.length === 0
              ? <EmptyHint text="No external income recorded for this activity." />
              : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {externalIncome.map((tx, i) => <ContributionRow key={tx.id} tx={tx} idx={i} org={org} />)}
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', borderRadius: 8, background: 'var(--info-light)', border: '1.5px solid rgba(36,113,163,.25)', marginTop: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--info)' }}>Total External Income</span>
                    <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--info)' }}>
                      {formatCurrency(externalIncome.reduce((s, t) => s + t.amount, 0), org.currency_symbol)}
                    </span>
                  </div>
                </div>
              )
            }
          </div>

          {/* External Expense */}
          <div>
            <MiniSection
              icon={<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>}
              title="External Expense"
              count={externalExpense.length}
              color="var(--danger)"
              bg="var(--danger-light)"
              border="rgba(192,57,43,.25)"
            />
            {externalExpense.length === 0
              ? <EmptyHint text="No expenses recorded for this activity." />
              : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {externalExpense.map((tx, i) => <ContributionRow key={tx.id} tx={tx} idx={i} org={org} />)}
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', borderRadius: 8, background: 'var(--danger-light)', border: '1.5px solid rgba(192,57,43,.25)', marginTop: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--danger)' }}>Total Expenses</span>
                    <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--danger)' }}>
                      {formatCurrency(externalExpense.reduce((s, t) => s + t.amount, 0), org.currency_symbol)}
                    </span>
                  </div>
                </div>
              )
            }
          </div>
        </div>

        {/* ── Summary — financial balance overview ──────────── */}
        {(() => {
          const totalContrib  = memberContribs.reduce((s, t) => s + t.amount, 0)
          const totalExtInc   = externalIncome.reduce((s, t) => s + t.amount, 0)
          const totalExtExp   = externalExpense.reduce((s, t) => s + t.amount, 0)
          const totalInflow   = totalContrib + totalExtInc
          const netBalance    = totalInflow - totalExtExp
          const isPositive    = netBalance >= 0
          const rows = [
            { label: `${org.people_label} Contributions`, value: totalContrib, color: 'var(--success)', sign: '+' },
            { label: 'External Income',                    value: totalExtInc,  color: 'var(--info)',    sign: '+' },
            { label: 'External Expenses',                  value: totalExtExp,  color: 'var(--danger)',  sign: '−' },
          ]
          return (
            <div style={{ borderTop: '2px solid var(--border-inner)', paddingTop: 18 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 14 }}>
                Financial Summary
              </div>
              {/* Breakdown rows */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0, borderRadius: 10, overflow: 'hidden', border: '1.5px solid var(--border-card)', marginBottom: 12 }}>
                {rows.map(({ label, value, color, sign }, idx) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 16px', background: idx % 2 === 0 ? 'var(--neutral-light)' : '#fff', borderBottom: idx < rows.length - 1 ? '1px solid var(--border-inner)' : 'none', gap: 12 }}>
                    <span style={{ fontSize: 13.5, color: 'var(--text-secondary)', fontWeight: 500 }}>{label}</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color }}>
                      {sign}{formatCurrency(value, org.currency_symbol)}
                    </span>
                  </div>
                ))}
              </div>
              {/* Net balance highlight */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 18px', borderRadius: 10,
                background: isPositive ? 'var(--success-light)' : 'var(--danger-light)',
                border: `2px solid ${isPositive ? 'rgba(46,125,82,.3)' : 'rgba(192,57,43,.3)'}`,
              }}>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: isPositive ? 'var(--success)' : 'var(--danger)' }}>
                    Net Balance
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                    Total inflow {formatCurrency(totalInflow, org.currency_symbol)} − Total expenses {formatCurrency(totalExtExp, org.currency_symbol)}
                  </div>
                </div>
                <div style={{ fontSize: 26, fontWeight: 900, color: isPositive ? 'var(--success)' : 'var(--danger)', lineHeight: 1 }}>
                  {isPositive ? '+' : '−'}{formatCurrency(Math.abs(netBalance), org.currency_symbol)}
                </div>
              </div>
            </div>
          )
        })()}
      </div>
    </div>
  )
}
