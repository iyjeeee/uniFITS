// Sidebar.jsx — Responsive navigation sidebar with collapsible sub-menus
// Announcements is now a direct link — Calendar is merged into the same page
import { useState, useCallback } from 'react'
import { useOrg } from '../context/OrgContext'

function buildNav(org) {
  return [
    {
      section: 'Main',
      items: [
        // Announcements — direct link, no sub-items (Calendar merged in)
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
          sub: [{ label: `Manage ${org.people_label}s`, href: '#/employees' },{ label: 'Roles & Permissions', href: '#/employees/roles' },{ label: org.attendance_label, href: '#/employees/attendance' }],
          paths: ['M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2','M23 21v-2a4 4 0 0 0-3-3.87','M16 3.13a4 4 0 0 1 0 7.75'], circle: { cx: 9, cy: 7, r: 4 } },
        { label: org.project_label + 's', href: '#/projects',
          sub: [{ label: `Manage ${org.project_label}s`, href: '#/projects' },{ label: `Add ${org.project_label}`, href: '#/projects/add' }],
          paths: ['M2 20h20','M5 20V8l7-5 7 5v12','M9 20v-5h6v5'] },
        { label: org.event_label + 's', href: '#/events',
          sub: [{ label: `Manage ${org.event_label}s`, href: '#/events' },{ label: `Add ${org.event_label}`, href: '#/events/add' }],
          paths: ['M16 2v4','M8 2v4','M3 10h18'], rect: { x: 3, y: 4, width: 18, height: 18, rx: 2 } },
      ],
    },
    {
      section: 'Finance',
      items: [
        { label: org.fund_label + 's', href: '#/funds',
          sub: [{ label: `Manage ${org.fund_label}s`, href: '#/funds' },{ label: `Add ${org.fund_label}`, href: '#/funds/add' }],
          paths: ['M12 1v22','M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6'] },
        { label: org.transaction_label + 's', href: '#/transactions',
          sub: [{ label: `All ${org.transaction_label}s`, href: '#/transactions' },{ label: `Add ${org.transaction_label}`, href: '#/transactions/add' },{ label: org.utility_label + 's', href: '#/transactions/utilities' }],
          paths: ['M17 1l4 4-4 4','M3 11V9a4 4 0 0 1 4-4h14','M7 23l-4-4 4-4','M21 13v2a4 4 0 0 1-4 4H3'] },
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

function NavIcon({ item, active }) {
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

export default function Sidebar({ open, collapsed, isMobile, onToggle, onClose }) {
  const org = useOrg()
  const NAV = buildNav(org)

  const currentHash = window.location.hash.replace('#', '') || '/dashboard'
  const [openSub, setOpenSub] = useState(null)
  const [hovered, setHovered] = useState(null)
  const showLabel = isMobile ? true : !collapsed

  function handleItem(item) {
    const hasSub = !!item.sub
    if (hasSub) {
      setOpenSub(openSub === item.label ? null : item.label)
    } else {
      // Direct navigation — no dropdown
      window.location.hash = item.href?.replace('#', '') || ''
      if (isMobile) onClose()
    }
  }

  function handleSubItem(href) {
    window.location.hash = href.replace('#', '')
    if (isMobile) onClose()
  }

  const handleToggle = useCallback(() => {
    if (!isMobile && !collapsed) setOpenSub(null)
    onToggle()
  }, [isMobile, collapsed, onToggle])

  function isActive(item) {
    if (item.href && currentHash.startsWith(item.href.replace('#', ''))) return true
    if (item.sub) return item.sub.some(s => currentHash === s.href.replace('#', ''))
    return false
  }

  return (
    <aside style={sidebarStyle(open, collapsed, isMobile)}>

      {/* Brand bar */}
      <div style={brandBar}>
        <div style={brandMark}>uF</div>
        {showLabel && <span style={wordmark}>uniFITS</span>}
      </div>

      {/* Navigation */}
      <nav style={navArea} className="sidebar-nav-touch">
        {NAV.map(({ section, items }) => (
          <div key={section}>
            {showLabel && <div style={sectionLabel}>{section}</div>}

            {items.map((item) => {
              const active = isActive(item)
              const isOpen = openSub === item.label

              return (
                <div key={item.label}>
                  <div
                    style={navItemStyle(active, hovered === item.label)}
                    title={!showLabel ? item.label : undefined}
                    onClick={() => handleItem(item)}
                    onMouseEnter={() => setHovered(item.label)}
                    onMouseLeave={() => setHovered(null)}>

                    {active && <span style={activePip} />}

                    <span style={{ display: 'flex', alignItems: 'center', width: 20, height: 20, flexShrink: 0 }}>
                      <NavIcon item={item} active={active} />
                    </span>

                    {showLabel && <span style={{ flex: 1 }}>{item.label}</span>}

                    {showLabel && item.badge != null && (
                      <span style={active ? badgeActive : badgeStyle}>{item.badge}</span>
                    )}

                    {/* Chevron only shown for items with sub-menus */}
                    {showLabel && item.sub && (
                      <svg width={14} height={14} viewBox="0 0 24 24" fill="none"
                        stroke={active ? 'rgba(255,255,255,.6)' : 'rgba(249,250,251,.35)'}
                        strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
                        style={{ flexShrink: 0, transition: 'transform .2s', transform: isOpen ? 'rotate(90deg)' : 'none' }}>
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    )}
                  </div>

                  {/* Sub-items dropdown */}
                  {item.sub && isOpen && showLabel && (
                    <div>
                      {item.sub.map(s => {
                        const subActive = currentHash === s.href.replace('#', '')
                        return (
                          <div key={s.href}
                            style={subItemStyle(subActive, hovered === s.href)}
                            onClick={() => handleSubItem(s.href)}
                            onMouseEnter={() => setHovered(s.href)}
                            onMouseLeave={() => setHovered(null)}>
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

      {/* Collapse button */}
      {!isMobile && (
        <div style={footerBar}>
          <button style={collapseBtn} onClick={handleToggle} title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none"
              stroke="rgba(249,250,251,.45)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
              style={{ flexShrink: 0, transition: 'transform .25s', transform: collapsed ? 'rotate(180deg)' : 'none' }}>
              <polyline points="15 18 9 12 15 6" />
            </svg>
            {showLabel && <span style={{ fontSize: 13, color: 'rgba(249,250,251,.45)' }}>Collapse</span>}
          </button>
        </div>
      )}
    </aside>
  )
}

/* ─── Styles ─────────────────────────────────────────────────────── */
const sidebarStyle = (open, collapsed, isMobile) => ({
  width: isMobile ? 'var(--sidebar-w)' : collapsed ? 'var(--sidebar-mini)' : 'var(--sidebar-w)',
  background: 'var(--primary)', display: 'flex', flexDirection: 'column',
  position: 'fixed', top: 0, left: 0, bottom: 0,
  zIndex: 100, overflow: 'hidden', flexShrink: 0,
  transition: isMobile ? 'transform .25s cubic-bezier(.4,0,.2,1)' : 'width .25s cubic-bezier(.4,0,.2,1)',
  transform: isMobile ? (open ? 'translateX(0)' : 'translateX(-100%)') : 'none',
})

const brandBar  = { height: 62, display: 'flex', alignItems: 'center', padding: '0 14px', gap: 10, flexShrink: 0, borderBottom: '1px solid rgba(255,255,255,.08)', overflow: 'hidden', whiteSpace: 'nowrap' }
const brandMark = { width: 36, height: 36, borderRadius: 9, flexShrink: 0, background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, color: '#fff', letterSpacing: '-.5px' }
const wordmark  = { fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--text-on-dark)', letterSpacing: '-.3px', lineHeight: 1 }
const navArea   = { flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '8px 8px', scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,.1) transparent' }
const sectionLabel = { fontSize: 10, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: 'rgba(249,250,251,.3)', padding: '14px 10px 4px', whiteSpace: 'nowrap', userSelect: 'none' }

const navItemStyle = (active, hovered) => ({
  display: 'flex', alignItems: 'center', gap: 10,
  padding: '9px 10px 9px 13px', borderRadius: 8, cursor: 'pointer',
  color: active ? '#fff' : 'rgba(249,250,251,.65)',
  fontSize: 13.5, fontWeight: active ? 600 : 400,
  background: active ? 'var(--accent)' : hovered ? 'rgba(255,255,255,.07)' : 'transparent',
  whiteSpace: 'nowrap', transition: 'background .15s, color .15s',
  position: 'relative', userSelect: 'none', marginBottom: 2, overflow: 'hidden',
})

const activePip   = { position: 'absolute', left: 0, top: '18%', bottom: '18%', width: 3, borderRadius: '0 3px 3px 0', background: 'rgba(255,255,255,.75)', flexShrink: 0 }
const badgeStyle  = { background: 'var(--accent)', color: '#fff', fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 20, lineHeight: 1.5 }
const badgeActive = { background: 'rgba(255,255,255,.25)', color: '#fff', fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 20, lineHeight: 1.5 }

const subItemStyle = (active, hovered) => ({
  display: 'flex', alignItems: 'center', gap: 10,
  padding: '8px 10px 8px 40px', borderRadius: 8, cursor: 'pointer',
  color: active ? '#fff' : 'rgba(249,250,251,.5)',
  fontSize: 13, marginBottom: 1, userSelect: 'none',
  background: active ? 'rgba(75,94,170,.4)' : hovered ? 'rgba(255,255,255,.06)' : 'transparent',
  transition: 'background .15s, color .15s', fontWeight: active ? 500 : 400,
})

const footerBar   = { padding: '10px 8px', borderTop: '1px solid rgba(255,255,255,.08)', flexShrink: 0 }
const collapseBtn = { width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px', borderRadius: 8, cursor: 'pointer', background: 'none', border: 'none', fontFamily: 'var(--font-body)', transition: 'background .15s' }
