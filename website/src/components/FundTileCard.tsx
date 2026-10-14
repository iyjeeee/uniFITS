// components/FundTileCard.tsx — Clickable fund tile (color strip, lock badge on protected funds); shared by Funds and FundReport
import { formatCurrency } from '../api/mockData'
import { PROTECTED_COLOR, fundTileColor } from '../constants/fundColors'
import type { Fund, OrgConfig } from '../types'

/* ── Lock icon — shown top-right on non-deletable tiles ─────────── */
function IcoShieldLock() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  )
}

/* ── FundTileCard — clickable tile ─────────────────────────────── */
export default function FundTileCard({ fund, org, onClick }: { fund: Fund; org: OrgConfig; onClick: () => void }) {
  const stripColor  = fundTileColor(fund)
  const isProtected = fund.is_required    // green + lock icon = cannot be deleted
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
      {/* Lock badge — top-right, only on non-deletable protected funds */}
      {isProtected && (
        <div title="Protected fund — cannot be deleted" style={{ position: 'absolute' as const, top: 10, right: 10, width: 24, height: 24, borderRadius: '50%', background: PROTECTED_COLOR, color: '#fff', display: 'flex' as const, alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 6px rgba(46,125,82,.4)', zIndex: 1 }}>
          <IcoShieldLock />
        </div>
      )}
      <div style={{ padding: '13px 14px', flex: 1, display: 'flex' as const, flexDirection: 'column' as const, gap: 7 }}>
        {/* Fund name */}
        <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.3, color: 'var(--text-primary)', overflow: 'hidden', display: '-webkit-box' as const, WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', paddingRight: isProtected ? 28 : 0 }}>{fund.name}</div>
        {/* Status pill */}
        <div style={{ display: 'inline-flex' as const, width: 'fit-content' }}>
          <span style={{ padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: fund.status === 'active' ? '#2E7D52' : '#C0392B', color: '#fff' }}>
            {fund.status.charAt(0).toUpperCase() + fund.status.slice(1)}
          </span>
        </div>
        {/* Balance */}
        <div style={{ fontSize: 18, fontWeight: 800, color: stripColor }}>{formatCurrency(fund.balance, org.currency_symbol)}</div>
        {/* Annual fee hint */}
        {fund.annual_fee != null && fund.annual_fee > 0 && <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>Fee: {formatCurrency(fund.annual_fee, org.currency_symbol)} / yr</div>}
        {/* Click hint */}
        <div style={{ fontSize: 11, color: stripColor, fontWeight: 600, marginTop: 'auto', paddingTop: 6, borderTop: '1px solid var(--border-inner)' }}>
          {isProtected ? 'Protected · Click for details →' : 'Click for details →'}
        </div>
      </div>
    </div>
  )
}
