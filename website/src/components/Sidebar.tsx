// components/Sidebar.tsx — Responsive navigation sidebar with collapsible sub-menus
// Active detection uses longest-prefix matching to prevent false highlights
import { useState, useCallback } from 'react'
import type { CSSProperties } from 'react'
import { useOrg } from '../context/OrgContext'
import type { OrgConfig } from '../types'
import type { NavigateFn } from '../types'

// ── Nav data types ────────────────────────────────────────────────────────────
interface SubItem { label: string; href: string }
interface NavItemDef {
  label:    string
  href:     string
  paths:    string[]
  sub?:     SubItem[]
  badge?:   number | null
  rect?:    { x: number; y: number; width: number; height: number; rx: number }
  circle?:  { cx: number; cy: number; r: number }
}
interface NavSection { section: string; items: NavItemDef[] }

// buildNav — returns the full nav structure using org labels from OrgContext
function buildNav(org: OrgConfig): NavSection[] {
  return [
    {
      section: 'Main',
      items: [
        { label: 'Announcements', href: '#/announcements',
          paths: ['M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9','M13.73 21a2 2 0 0 1-3.46 0'] },
        { label: 'Dashboard', href: '#/dashboard',
          paths: ['M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z'] },
      ],
    },
    {
      section: 'Organization',
      items: [
        { label: org.people_label + 's', href: '#/employees',
          sub: [{ label: `Add ${org.people_label}`, href: '#/employees/add' },{ label: `Manage ${org.people_label}s`, href: '#/employees' },{ label: 'Roles & Permissions', href: '#/employees/roles' },{ label: org.attendance_label, href: '#/employees/attendance' }],
          paths: ['M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2','M23 21v-2a4 4 0 0 0-3-3.87','M16 3.13a4 4 0 0 1 0 7.75'], circle: { cx: 9, cy: 7, r: 4 } },
        { label: org.project_label + 's', href: '#/projects',
          sub: [{ label: `Add ${org.project_label}`, href: '#/projects/add' },{ label: `Manage ${org.project_label}s`, href: '#/projects' }],
          paths: ['M2 20h20','M5 20V8l7-5 7 5v12','M9 20v-5h6v5'] },
        { label: org.event_label + 's', href: '#/events',
          sub: [{ label: `Add ${org.event_label}`, href: '#/events/add' },{ label: `Manage ${org.event_label}s`, href: '#/events' }],
          paths: ['M16 2v4','M8 2v4','M3 10h18'], rect: { x: 3, y: 4, width: 18, height: 18, rx: 2 } },
      ],
    },
    {
      section: 'Finance',
      items: [
        { label: org.fund_label + 's', href: '#/funds',
          sub: [{ label: `Add ${org.fund_label}`, href: '#/funds/add' },{ label: `Manage ${org.fund_label}s`, href: '#/funds' }],
          paths: ['M12 1v22','M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6'] },
        { label: org.transaction_label + 's', href: '#/transactions',
          sub: [{ label: `Add ${org.transaction_label}`, href: '#/transactions/add' },{ label: `All ${org.transaction_label}s`, href: '#/transactions' }],
          paths: ['M17 1l4 4-4 4','M3 11V9a4 4 0 0 1 4-4h14','M7 23l-4-4 4-4','M21 13v2a4 4 0 0 1-4 4H3'] },
        { label: org.utility_label + 's', href: '#/transactions/utilities',
          sub: [{ label: `Add ${org.utility_label}`, href: '#/transactions/utilities/add' },{ label: `Manage ${org.utility_label}s`, href: '#/transactions/utilities' }],
          paths: ['M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z','M9 12l2 2 4-4'] },
      ],
    },
    {
      section: 'Insights',
      items: [
        { label: org.report_label + 's', href: '#/reports/employees',
          sub: [{ label: `${org.people_label} Report`, href: '#/reports/employees' },{ label: `${org.fund_label} Report`, href: '#/reports/funds' },{ label: 'Club Report', href: '#/reports/club' }],
          paths: ['M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z','M14 2v6h6','M16 13H8','M16 17H8'] },
        { label: 'Audit Logs', href: '#/audit',
          paths: ['M9 11l3 3L22 4','M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11'] },
      ],
    },
  ]
}

// NavIcon — SVG icon component rendered per nav item
function NavIcon({ item, active }: { item: NavItemDef; active: boolean }) {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none"
      stroke={active ? '#fff' : 'rgba(249,250,251,.6)'}
      strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"
      style={{ flexShrink: 0 }}>
      {item.rect   && <rect   {...item.rect} />}
      {item.circle && <circle {...item.circle} />}
      {item.paths.map((d, i) => <path key={i} d={d} />)}
    </svg>
  )
}

// ── Sidebar props ─────────────────────────────────────────────────────────────
interface SidebarProps {
  open:      boolean
  collapsed: boolean
  isMobile:  boolean
  onToggle:  () => void
  onClose:   () => void
  navigate:  NavigateFn
}

export default function Sidebar({ open, collapsed, isMobile, onToggle, onClose }: SidebarProps) {
  const org = useOrg()
  const NAV = buildNav(org)

  const currentHash = window.location.hash.replace('#', '') || '/dashboard'
  const [openSub,     setOpenSub    ] = useState<string | null>(null)
  const [hovered,     setHovered    ] = useState<string | null>(null)
  const [collHovered, setCollHovered] = useState(false)
  const showLabel = isMobile ? true : !collapsed

  function handleItem(item: NavItemDef) {
    if (item.sub) {
      setOpenSub(openSub === item.label ? null : item.label)
    } else {
      window.location.hash = item.href?.replace('#', '') ?? ''
      if (isMobile) onClose()
    }
  }

  function handleSubItem(href: string) {
    window.location.hash = href.replace('#', '')
    if (isMobile) onClose()
  }

  const handleToggle = useCallback(() => {
    if (!isMobile && !collapsed) setOpenSub(null)
    onToggle()
  }, [isMobile, collapsed, onToggle])

  // isActive — longest-prefix matching so /transactions/utilities doesn't activate /transactions
  function isActive(item: NavItemDef): boolean {
    const candidates = item.sub
      ? item.sub.map(s => s.href.replace('#', ''))
      : [item.href?.replace('#', '') ?? '']

    const itemMatches = candidates.some(p =>
      p !== '' && (currentHash === p || currentHash.startsWith(p + '/'))
    )
    if (!itemMatches) return false

    const itemBestLen = Math.max(...candidates.map(p =>
      (p !== '' && (currentHash === p || currentHash.startsWith(p + '/'))) ? p.length : 0
    ))
    const allCandidates = NAV.flatMap(section =>
      section.items.flatMap(navItem =>
        navItem.sub
          ? navItem.sub.map(s => s.href.replace('#', ''))
          : [navItem.href?.replace('#', '') ?? '']
      )
    )
    const globalBestLen = Math.max(...allCandidates.map(p =>
      (p !== '' && (currentHash === p || currentHash.startsWith(p + '/'))) ? p.length : 0
    ))
    return itemBestLen >= globalBestLen && itemBestLen > 0
  }

  return (
    <aside style={sidebarStyle(open, collapsed, isMobile)}>

      {/* Brand bar */}
      <div style={brandBar}>
        <div style={brandMark}>uF</div>
        {showLabel && <span style={wordmark}>uniFITS</span>}
      </div>

      {/* Navigation */}
      <nav style={navArea as CSSProperties} className="sidebar-nav-touch">
        {NAV.map(({ section, items }) => (
          <div key={section}>
            {showLabel && <div style={sectionLabel as CSSProperties}>{section}</div>}
            {items.map((item) => {
              const active = isActive(item)
              const isOpen = openSub === item.label
              const isHov  = hovered === item.label
              return (
                <div key={item.label}>
                  <div
                    style={navItemStyle(active, isHov) as CSSProperties}
                    title={!showLabel ? item.label : undefined}
                    onClick={() => handleItem(item)}
                    onMouseEnter={() => setHovered(item.label)}
                    onMouseLeave={() => setHovered(null)}>
                    {active           && <span style={activePip as CSSProperties} />}
                    {!active && isHov && <span style={hoverPip  as CSSProperties} />}
                    <span style={{ display: 'flex', alignItems: 'center', width: 20, height: 20, flexShrink: 0, transition: 'transform .2s cubic-bezier(.34,1.56,.64,1)', transform: isHov && !active ? 'scale(1.18)' : 'scale(1)' }}>
                      <NavIcon item={item} active={active || isHov} />
                    </span>
                    {showLabel && <span style={{ flex: 1 }}>{item.label}</span>}
                    {showLabel && item.badge != null && (
                      <span style={active ? badgeActive : badgeStyle}>{item.badge}</span>
                    )}
                    {showLabel && item.sub && (
                      <svg width={14} height={14} viewBox="0 0 24 24" fill="none"
                        stroke={active ? 'rgba(255,255,255,.6)' : isHov ? 'rgba(249,250,251,.7)' : 'rgba(249,250,251,.35)'}
                        strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
                        style={{ flexShrink: 0, transition: 'transform .2s', transform: isOpen ? 'rotate(90deg)' : 'none' }}>
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    )}
                  </div>

                  {/* Sub-items */}
                  {item.sub && isOpen && showLabel && (
                    <div>
                      {item.sub.map(s => {
                        const subActive = currentHash === s.href.replace('#', '')
                        const subHov    = hovered === s.href
                        return (
                          <div key={s.href}
                            style={subItemStyle(subActive, subHov) as CSSProperties}
                            onClick={() => handleSubItem(s.href)}
                            onMouseEnter={() => setHovered(s.href)}
                            onMouseLeave={() => setHovered(null)}>
                            <span style={{ width: 5, height: 5, borderRadius: '50%', flexShrink: 0, background: subActive ? '#fff' : subHov ? 'rgba(255,255,255,.7)' : 'rgba(255,255,255,.25)', transition: 'background .15s, transform .2s', transform: subHov ? 'scale(1.4)' : 'scale(1)' }} />
                            {s.label}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </nav>

      {/* Collapse toggle button — desktop only */}
      {!isMobile && (
        <div style={footerBar}>
          <button
            style={{ ...collapseBtn, background: collHovered ? 'rgba(255,255,255,.10)' : 'transparent', transform: collHovered ? 'translateX(3px)' : 'none', boxShadow: collHovered ? 'inset 0 0 0 1px rgba(255,255,255,.12), 0 2px 8px rgba(0,0,0,.25)' : 'none' }}
            onClick={handleToggle}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            onMouseEnter={() => setCollHovered(true)}
            onMouseLeave={() => setCollHovered(false)}>
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none"
              stroke={collHovered ? 'rgba(249,250,251,.90)' : 'rgba(249,250,251,.40)'}
              strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
              style={{ flexShrink: 0, transition: 'transform .25s ease, stroke .15s ease', transform: collapsed ? 'rotate(180deg)' : 'none' }}>
              <polyline points="15 18 9 12 15 6" />
            </svg>
            {showLabel && (
              <span style={{ fontSize: 13, color: collHovered ? 'rgba(249,250,251,.90)' : 'rgba(249,250,251,.40)', transition: 'color .15s ease' }}>
                Collapse
              </span>
            )}
          </button>
        </div>
      )}
    </aside>
  )
}

/* ── Styles ──────────────────────────────────────────────────────────────────── */
const sidebarStyle = (open: boolean, collapsed: boolean, isMobile: boolean): CSSProperties => ({
  width: isMobile ? 'var(--sidebar-w)' : collapsed ? 'var(--sidebar-mini)' : 'var(--sidebar-w)',
  background: 'var(--primary)', display: 'flex', flexDirection: 'column',
  position: 'fixed', top: 0, left: 0, bottom: 0,
  zIndex: 100, overflow: 'hidden', flexShrink: 0,
  transition: isMobile ? 'transform .25s cubic-bezier(.4,0,.2,1)' : 'width .25s cubic-bezier(.4,0,.2,1)',
  transform: isMobile ? (open ? 'translateX(0)' : 'translateX(-100%)') : 'none',
})

const brandBar:  CSSProperties = { height: 62, display: 'flex', alignItems: 'center', padding: '0 14px', gap: 10, flexShrink: 0, borderBottom: '1px solid rgba(255,255,255,.08)', overflow: 'hidden', whiteSpace: 'nowrap' }
const brandMark: CSSProperties = { width: 36, height: 36, borderRadius: 9, flexShrink: 0, background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, color: '#fff', letterSpacing: '-.5px' }
const wordmark:  CSSProperties = { fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--text-on-dark)', letterSpacing: '-.3px', lineHeight: 1 }
const navArea                  = { flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '8px 8px', scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,.1) transparent' }
const sectionLabel             = { fontSize: 10, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: 'rgba(249,250,251,.3)', padding: '14px 10px 4px', whiteSpace: 'nowrap', userSelect: 'none' }

const navItemStyle = (active: boolean, hovered: boolean) => ({
  display: 'flex', alignItems: 'center', gap: 10,
  padding: '9px 10px 9px 13px', borderRadius: 8, cursor: 'pointer',
  color: active ? '#fff' : hovered ? 'rgba(249,250,251,.92)' : 'rgba(249,250,251,.65)',
  fontSize: 13.5, fontWeight: active ? 600 : hovered ? 500 : 400,
  background: active ? 'var(--accent)' : hovered ? 'linear-gradient(90deg, rgba(75,94,170,.28) 0%, rgba(75,94,170,.10) 100%)' : 'transparent',
  whiteSpace: 'nowrap',
  transition: 'background .18s ease, color .15s ease, transform .18s cubic-bezier(.34,1.56,.64,1), box-shadow .18s ease',
  transform: hovered && !active ? 'translateX(3px)' : 'none',
  boxShadow: hovered && !active ? 'inset 0 0 0 1px rgba(75,94,170,.35), 0 2px 8px rgba(75,94,170,.15)' : 'none',
  position: 'relative', userSelect: 'none', marginBottom: 2, overflow: 'hidden',
})

const activePip = { position: 'absolute', left: 0, top: '18%', bottom: '18%', width: 3, borderRadius: '0 3px 3px 0', background: 'rgba(255,255,255,.85)', flexShrink: 0 }
const hoverPip  = { position: 'absolute', left: 0, top: '22%', bottom: '22%', width: 3, borderRadius: '0 3px 3px 0', background: 'rgba(75,94,170,.7)', flexShrink: 0, transition: 'opacity .15s' }

const badgeStyle:  CSSProperties = { background: 'var(--accent)', color: '#fff', fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 20, lineHeight: 1.5 }
const badgeActive: CSSProperties = { background: 'rgba(255,255,255,.25)', color: '#fff', fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 20, lineHeight: 1.5 }

const subItemStyle = (active: boolean, hovered: boolean) => ({
  display: 'flex', alignItems: 'center', gap: 10,
  padding: '7px 10px 7px 38px', borderRadius: 8, cursor: 'pointer',
  color: active ? '#fff' : hovered ? 'rgba(249,250,251,.85)' : 'rgba(249,250,251,.5)',
  fontSize: 13, marginBottom: 1, userSelect: 'none',
  background: active ? 'rgba(75,94,170,.45)' : hovered ? 'rgba(255,255,255,.09)' : 'transparent',
  transition: 'background .15s ease, color .15s ease, transform .15s ease',
  transform: hovered && !active ? 'translateX(3px)' : 'none',
  fontWeight: active ? 500 : 400,
})

const footerBar:   CSSProperties = { padding: '10px 8px', borderTop: '1px solid rgba(255,255,255,.08)', flexShrink: 0 }
const collapseBtn: CSSProperties = { width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px', borderRadius: 8, cursor: 'pointer', background: 'transparent', border: 'none', fontFamily: 'var(--font-body)', transition: 'background .15s ease, transform .18s cubic-bezier(.34,1.56,.64,1), box-shadow .18s ease' }
