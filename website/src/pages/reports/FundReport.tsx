// FundReport.jsx — Tile-card fund report; 4 per row; fund detail opens InfoModal (not blank page)
// FIX: isMobile was used in FundDetailContent sub-component but defined only in parent scope —
//      sub-components must call useBreakpoint() themselves to access responsive state
import { useState } from 'react'
import { Card, InfoModal, ResponseModal } from '../../components/ui'
import { MOCK_FUNDS, MOCK_USERS, MOCK_TRANSACTIONS, formatCurrency } from '../../api/mockData'
import { useOrg } from '../../context/OrgContext'
import useBreakpoint from '../../hooks/useBreakpoint'
import type { Fund, OrgConfig } from '../../types'
import { capitalize } from '../../utils/formatters'

/* ── SVG Icons ──────────────────────────────────────────────────── */
function IcoLock()   { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> }
function IcoGlobe()  { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg> }
function IcoExport() { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> }

/* ── TILE COLOR RULES:
   is_required = true  → GREEN top strip + lock icon (non-deletable, protected fund)
   is_required = false → random solid color from palette (deletable)
   Border always matches the strip color at 30% opacity for visual cohesion.     */
const PROTECTED_COLOR = '#2E7D52'                                        // green = non-deletable
const OPT_COLORS      = ['#4B5EAA','#2471A3','#7D3C98','#B7600A','#117A65','#C0392B','#1E2128','#0E6655']
function fundTileColor(fund: Fund) {
  if (fund.is_required) return PROTECTED_COLOR
  return OPT_COLORS[(parseInt(fund.id, 10) - 1 || 0) % OPT_COLORS.length]
}

/* ── Lock icon — shown top-right on non-deletable tiles ─────────── */
function IcoShieldLock() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  )
}

/* ── FundTileCard — clickable card in the grid ──────────────────── */
function FundTileCard({ fund, org, onClick }: { fund: Fund; org: OrgConfig; onClick: () => void }) {
  const stripColor  = fundTileColor(fund)
  const isProtected = fund.is_required    // green + lock = cannot be deleted
  return (
    <div
      onClick={onClick}
      style={{
        borderRadius: 12, overflow: 'hidden', position: 'relative' as const,
        border: `2px solid ${stripColor}40`,
        background: '#fff', cursor: 'pointer' as const,
        display: 'flex' as const, flexDirection: 'column' as const,
        transition: 'transform .15s, box-shadow .15s',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 8px 20px ${stripColor}40` }}
      onMouseLeave={(e: React.MouseEvent<HTMLElement>) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}>

      {/* Solid color top strip — GREEN for protected, random for optional */}
      <div style={{ height: 6, background: stripColor }} />

      {/* Lock badge — top-right corner, only for non-deletable protected funds */}
      {isProtected && (
        <div title="Protected fund — cannot be deleted" style={{ position: 'absolute' as const, top: 10, right: 10, width: 24, height: 24, borderRadius: '50%', background: PROTECTED_COLOR, color: '#fff', display: 'flex' as const, alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 6px rgba(46,125,82,.4)', zIndex: 1 }}>
          <IcoShieldLock />
        </div>
      )}

      <div style={{ padding: '13px 14px', flex: 1, display: 'flex' as const, flexDirection: 'column' as const, gap: 7 }}>
        {/* Fund name */}
        <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.3, color: 'var(--text-primary)', overflow: 'hidden', display: '-webkit-box' as const, WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', paddingRight: isProtected ? 28 : 0 }}>
          {fund.name}
        </div>
        {/* Status pill */}
        <div style={{ display: 'inline-flex' as const, width: 'fit-content' }}>
          <span style={{ padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: fund.status === 'active' ? '#2E7D52' : '#C0392B', color: '#fff' }}>
            {fund.status.charAt(0).toUpperCase() + fund.status.slice(1)}
          </span>
        </div>
        {/* Balance */}
        <div style={{ fontSize: 18, fontWeight: 800, color: stripColor }}>
          {formatCurrency(fund.balance, org.currency_symbol)}
        </div>
        {/* Annual fee hint */}
        {fund.annual_fee != null && fund.annual_fee > 0 && (
          <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>Fee: {formatCurrency(fund.annual_fee, org.currency_symbol)} / yr</div>
        )}
        {/* Click hint */}
        <div style={{ fontSize: 11, color: stripColor, fontWeight: 600, marginTop: 'auto', paddingTop: 6, borderTop: '1px solid var(--border-inner)' }}>
          {isProtected ? 'Protected · Click for details →' : 'Click for details →'}
        </div>
      </div>
    </div>
  )
}

/* ── FundDetailContent — body of the detail InfoModal ───────────────
   IMPORTANT: useBreakpoint() must be called here (inside this component)
   because sub-components cannot access variables from a parent's scope.     */
function FundDetailContent({ fund, org }: { fund: Fund; org: OrgConfig }) {
  const { isMobile } = useBreakpoint()                   // own hook call — fixes ReferenceError
  const accentC = fund.is_required ? 'var(--accent)' : 'var(--info)'
  const bgC     = fund.is_required ? 'var(--accent-light)' : 'var(--info-light)'

  // Build member contribution list for this fund
  const memberContribs = MOCK_USERS.map(user => {
    const txns = MOCK_TRANSACTIONS.filter((t) =>
      t.user_id === user.id &&
      t.fund === fund.name &&
      t.entry_type !== 'expense'
    )
    const total = txns.reduce((s, t) => s + t.amount, 0)
    return { user, txns, total }
  }).sort((a, b) => b.total - a.total) // sort by contribution descending

  const grandTotal = memberContribs.reduce((s, m) => s + m.total, 0)
  const contributors = memberContribs.filter((m) => m.total > 0)
  const nonContribs  = memberContribs.filter((m) => m.total === 0)

  return (
    <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 18 }}>
      {/* Hero balance + description */}
      <div style={{ padding: '16px 20px', borderRadius: 12, background: bgC, border: '1.5px solid ' + accentC + '30' }}>
        <div style={{ fontSize: 26, fontWeight: 800, color: accentC, marginBottom: 6 }}>
          {formatCurrency(fund.balance, org.currency_symbol)}
        </div>
        <div style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          {fund.description || 'No description provided.'}
        </div>
      </div>

      {/* Detail grid — 3-col desktop, 1-col mobile */}
      <div style={{ display: 'grid' as const, gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 12 }}>
        {[
          ['Fund Name',     fund.name],
          ['Type',          capitalize(fund.fund_type)],
          ['Status',        capitalize(fund.status)],
          ['Required',      fund.is_required ? 'Yes — all members' : 'No'],
          ['Pay Frequency', capitalize(fund.payment_frequency)],
          ['Annual Fee',    fund.annual_fee ? formatCurrency(fund.annual_fee, org.currency_symbol) : '—'],
          ['Balance',       formatCurrency(fund.balance, org.currency_symbol)],
          ['Managed by',    fund.created_by || '—'],
          ['Currency',      fund.currency || 'PHP'],
        ].map(([k, v]) => (
          <div key={k} style={{ padding: '12px 14px', borderRadius: 10, background: 'var(--neutral-light)', border: '1px solid var(--border-card)' }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' as const, letterSpacing: '.07em', marginBottom: 4 }}>{k}</div>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)' }}>{v}</div>
          </div>
        ))}
      </div>

      {/* ── Member Contributions List ──────────────────────────── */}
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
                  <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 1 }}>{m.user.role}</div>
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
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════════ */
export default function FundReport() {
  const org = useOrg()
  const { isMobile, isTablet } = useBreakpoint()
  const kpiCols  = isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)'
  const fundCols = isMobile ? '1fr' : isTablet ? 'repeat(2,1fr)' : 'repeat(4,1fr)'

  const totalBalance = MOCK_FUNDS.reduce((s, f) => s + f.balance, 0)
  const active       = MOCK_FUNDS.filter((f) => f.status === 'active').length
  const inactive     = MOCK_FUNDS.filter((f) => f.status !== 'active').length
  const required     = MOCK_FUNDS.filter((f) => f.is_required)
  const optional     = MOCK_FUNDS.filter((f) => !f.is_required)

  const [viewFund,     setViewFund]     = useState<Fund | null>(null)  // fund open in detail modal
  const [showExport,   setShowExport]   = useState(false) // export PDF confirmation
  const [exportResult, setExportResult] = useState<{variant:string;title:string;message:string} | null>(null)  // export feedback

  function handleExport() {
    setShowExport(false)
    setExportResult({ variant: 'success', title: 'PDF Exported', message: `Fund Report PDF has been generated and is ready to download.` })
  }

  return (
    <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 16 }}>

      {/* ── KPI strip ─────────────────────────────────────────── */}
      <div style={{ display: 'grid' as const, gridTemplateColumns: kpiCols, gap: 12 }}>
        {[
          { label: `Total ${org.fund_label}s`, value: MOCK_FUNDS.length,     bg: 'var(--neutral-light)',  color: 'var(--text-primary)', border: 'var(--border-card)' },
          { label: 'Active',                   value: active,                 bg: 'var(--success-light)',  color: 'var(--success)',      border: 'rgba(46,125,82,.25)' },
          { label: 'Inactive',                 value: inactive,               bg: 'var(--danger-light)',   color: 'var(--danger)',       border: 'rgba(192,57,43,.25)' },
          { label: 'Overall Balance',          value: formatCurrency(totalBalance, org.currency_symbol), bg: 'var(--warning-light)', color: 'var(--warning)', border: 'rgba(212,134,10,.25)' },
        ].map((k) => (
          <Card key={k.label} style={{ padding: '14px 18px', background: '#FFFFFF', borderLeft: '4px solid ' + k.color, border: '1px solid ' + k.color + '25', transition: 'transform .18s ease, box-shadow .18s ease' }}
            onMouseEnter={(e: React.MouseEvent<HTMLElement>) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(75,94,170,.18)' }}
            onMouseLeave={(e: React.MouseEvent<HTMLElement>) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500, marginBottom: 6 }}>{k.label}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: k.color }}>{k.value}</div>
          </Card>
        ))}
      </div>

      {/* ── Required Funds Section ─────────────────────────────── */}
      {required.length > 0 && (
        <Card style={{ padding: '18px 20px' }}>
          <div style={{ display: 'flex' as const, alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <div style={{ width: 28, height: 28, borderRadius: 7, background: 'var(--accent-light)', display: 'flex' as const, alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', flexShrink: 0 }}>
              <IcoLock />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>Funds Required for All {org.people_label}s</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 1 }}>{required.length} fund{required.length !== 1 ? 's' : ''} — click any tile for full details</div>
            </div>
          </div>
          <div style={{ display: 'grid' as const, gridTemplateColumns: fundCols, gap: 14 }}>
            {required.map((f) => <FundTileCard key={f.id} fund={f} org={org} onClick={() => setViewFund(f)} />)}
          </div>
        </Card>
      )}

      {/* ── Optional Funds Section ─────────────────────────────── */}
      {optional.length > 0 && (
        <Card style={{ padding: '18px 20px' }}>
          <div style={{ display: 'flex' as const, alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <div style={{ width: 28, height: 28, borderRadius: 7, background: 'var(--info-light)', display: 'flex' as const, alignItems: 'center', justifyContent: 'center', color: 'var(--info)', flexShrink: 0 }}>
              <IcoGlobe />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>Funds NOT Required for All {org.people_label}s</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 1 }}>{optional.length} fund{optional.length !== 1 ? 's' : ''} — click any tile for full details</div>
            </div>
          </div>
          <div style={{ display: 'grid' as const, gridTemplateColumns: fundCols, gap: 14 }}>
            {optional.map((f) => <FundTileCard key={f.id} fund={f} org={org} onClick={() => setViewFund(f)} />)}
          </div>
        </Card>
      )}

      {/* ── Fund Detail InfoModal ──────────────────────────────── */}
      <InfoModal
        open={!!viewFund}
        onClose={() => setViewFund(null)}
        title={viewFund?.name || ''}
        subtitle={viewFund?.description || 'Fund details and financial summary'}
        accentColor={viewFund?.is_required ? 'var(--accent)' : 'var(--info)'}
        footer={
          <div style={{ display: 'flex' as const, gap: 10, justifyContent: 'flex-end' }}>
            <button
              onClick={() => { setViewFund(null); setShowExport(true) }}
              style={{ display: 'flex' as const, alignItems: 'center', gap: 6, padding: '10px 22px', borderRadius: 9, border: '1.5px solid var(--accent)', background: 'var(--accent)', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' as const, fontFamily: 'var(--font-body)', transition: 'transform .18s ease, box-shadow .18s ease' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 0 0 1.5px rgba(0,0,0,.70), 0 4px 12px rgba(0,0,0,.14)' }}
              onMouseLeave={(e: React.MouseEvent<HTMLElement>) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}>
              <IcoExport /> Export PDF
            </button>
            <button
              onClick={() => setViewFund(null)}
              style={{ padding: '10px 28px', borderRadius: 9, border: '1.5px solid var(--border-card)', background: 'var(--neutral-light)', color: 'var(--text-primary)', fontSize: 14, fontWeight: 600, cursor: 'pointer' as const, fontFamily: 'var(--font-body)', transition: 'transform .18s ease, box-shadow .18s ease' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 0 0 1.5px rgba(0,0,0,.70), 0 4px 12px rgba(0,0,0,.14)' }}
              onMouseLeave={(e: React.MouseEvent<HTMLElement>) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{marginRight:4}}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> Close
            </button>
          </div>
        }>
        {/* FundDetailContent calls its own useBreakpoint — no scope leak */}
        {viewFund && <FundDetailContent fund={viewFund} org={org} />}
      </InfoModal>

      {/* ── Export PDF Confirmation Modal ──────────────────────── */}
      <ResponseModal
        open={showExport}
        onClose={() => setShowExport(false)}
        variant="info"
        title="Export Fund Report PDF"
        message="This will generate a downloadable PDF of the fund report with all financial details. Continue?"
        confirmLabel="Export PDF"
        cancelLabel="Cancel"
        onConfirm={handleExport}
      />

      {/* ── Export Result Feedback ─────────────────────────────── */}
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
