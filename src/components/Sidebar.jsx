import { useState, useCallback } from 'react'

const NAV = [
  {
    section: 'Main',
    items: [
      { label: 'Announcements', badge: 3, paths: ['M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9', 'M13.73 21a2 2 0 0 1-3.46 0'] },
      { label: 'Dashboard',              paths: ['M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z'] },
    ],
  },
  {
    section: 'Organization',
    items: [
      { label: 'Employees', sub: ['Manage Employees', 'Roles & Permissions', 'Attendance'], paths: ['M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2', 'M23 21v-2a4 4 0 0 0-3-3.87', 'M16 3.13a4 4 0 0 1 0 7.75'], circle: { cx: 9, cy: 7, r: 4 } },
      { label: 'Projects',   sub: ['Manage Projects', 'Project Details'],                  paths: ['M2 20h20', 'M5 20V8l7-5 7 5v12', 'M9 20v-5h6v5'] },
      { label: 'Events',     sub: ['Manage Events', 'Calendar View'],                      paths: ['M16 2v4', 'M8 2v4', 'M3 10h18'], rect: { x: 3, y: 4, width: 18, height: 18, rx: 2 } },
    ],
  },
  {
    section: 'Finance',
    items: [
      { label: 'Funds',        sub: ['Manage Funds', 'Add Fund'],                         paths: ['M12 1v22', 'M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6'] },
      { label: 'Transactions', sub: ['All Transactions', 'Add Transaction', 'Utilities'], paths: ['M17 1l4 4-4 4', 'M3 11V9a4 4 0 0 1 4-4h14', 'M7 23l-4-4 4-4', 'M21 13v2a4 4 0 0 1-4 4H3'] },
    ],
  },
  {
    section: 'Insights',
    items: [
      { label: 'Reports',    sub: ['Employee Report', 'Fund Report', 'Club Report'], paths: ['M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z', 'M14 2v6h6', 'M16 13H8', 'M16 17H8'] },
      { label: 'Audit Logs',                                                         paths: ['M9 11l3 3L22 4', 'M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11'] },
    ],
  },
  {
    section: 'System',
    items: [
      { label: 'Settings', paths: ['M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z', 'M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z'] },
    ],
  },
]

function NavIcon({ item, active }) {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none"
      stroke={active ? '#fff' : 'rgba(249,250,251,.6)'}
      strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"
      style={{ flexShrink: 0 }}
    >
      {item.rect   && <rect   {...item.rect} />}
      {item.circle && <circle {...item.circle} />}
      {item.paths.map((d, i) => <path key={i} d={d} />)}
    </svg>
  )
}

/* open       — whether sidebar is visible at all (mobile drawer control)
   collapsed  — icon-only mode (desktop/tablet)
   isMobile   — drives translation vs width animation
   onToggle   — parent-controlled toggle
   onClose    — close drawer on mobile nav tap */
export default function Sidebar({ open, collapsed, isMobile, onToggle, onClose }) {
  const [active,    setActive]    = useState('Dashboard')
  const [openSub,   setOpenSub]   = useState(null)
  const [activeSub, setActiveSub] = useState(null)
  const [hovered,   setHovered]   = useState(null)

  const showLabel = isMobile ? true : !collapsed

  function handleItem(label, hasSub) {
    setActive(label)
    setOpenSub(hasSub ? (openSub === label ? null : label) : null)
    if (isMobile && !hasSub) onClose()
  }

  function handleSubItem(s) {
    setActiveSub(s)
    if (isMobile) onClose()
  }

  const handleToggle = useCallback(() => {
    if (!isMobile && !collapsed) setOpenSub(null)
    onToggle()
  }, [isMobile, collapsed, onToggle])

  return (
    <aside style={sidebarStyle(open, collapsed, isMobile)}>

      {/* ── Brand bar ── */}
      <div style={brandBar}>
        <div style={brandMark}>uF</div>
        {showLabel && <span style={wordmark}>uniFITS</span>}
      </div>

      {/* ── Navigation ── */}
      <nav style={navArea} className="sidebar-nav-touch">
        {NAV.map(({ section, items }) => (
          <div key={section}>
            {showLabel && <div style={sectionLabel}>{section}</div>}

            {items.map((item) => {
              const { label, badge, sub } = item
              const isActive = active  === label
              const isOpen   = openSub === label

              return (
                <div key={label}>
                  <div
                    style={navItemStyle(isActive, hovered === label)}
                    title={!showLabel ? label : undefined}
                    onClick={() => handleItem(label, !!sub)}
                    onMouseEnter={() => setHovered(label)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    {/* left accent pip on active item */}
                    {isActive && <span style={activePip} />}

                    <span style={{ display: 'flex', alignItems: 'center', width: 20, height: 20, flexShrink: 0 }}>
                      <NavIcon item={item} active={isActive} />
                    </span>

                    {showLabel && <span style={navLabelStyle}>{label}</span>}

                    {showLabel && badge != null && (
                      <span style={isActive ? badgeActiveStyle : badgeStyle}>{badge}</span>
                    )}

                    {showLabel && sub && (
                      <svg width={14} height={14} viewBox="0 0 24 24" fill="none"
                        stroke={isActive ? 'rgba(255,255,255,.6)' : 'rgba(249,250,251,.35)'}
                        strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
                        style={{ flexShrink: 0, transition: 'transform .2s', transform: isOpen ? 'rotate(90deg)' : 'none' }}
                      >
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    )}
                  </div>

                  {sub && isOpen && showLabel && (
                    <div>
                      {sub.map(s => (
                        <div key={s}
                          style={subItemStyle(activeSub === s, hovered === s)}
                          onClick={() => handleSubItem(s)}
                          onMouseEnter={() => setHovered(s)}
                          onMouseLeave={() => setHovered(null)}
                        >
                          {s}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </nav>

      {/* ── Collapse button — desktop/tablet only ── */}
      {!isMobile && (
        <div style={footerBar}>
          <button style={collapseBtn} onClick={handleToggle} title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none"
              stroke="rgba(249,250,251,.45)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
              style={{ flexShrink: 0, transition: 'transform .25s', transform: collapsed ? 'rotate(180deg)' : 'none' }}
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
            {showLabel && <span style={{ fontSize: 13, color: 'rgba(249,250,251,.45)' }}>Collapse</span>}
          </button>
        </div>
      )}

    </aside>
  )
}

/* ─── styles ─────────────────────────────────────────────────── */

const sidebarStyle = (open, collapsed, isMobile) => ({
  width: isMobile ? 'var(--sidebar-w)' : collapsed ? 'var(--sidebar-mini)' : 'var(--sidebar-w)',
  background: 'var(--primary)',
  display: 'flex', flexDirection: 'column',
  position: 'fixed', top: 0, left: 0, bottom: 0,
  zIndex: 100, overflow: 'hidden', flexShrink: 0,
  transition: isMobile
    ? 'transform .25s cubic-bezier(.4,0,.2,1)'
    : 'width .25s cubic-bezier(.4,0,.2,1)',
  transform: isMobile ? (open ? 'translateX(0)' : 'translateX(-100%)') : 'none',
})

const brandBar  = { height: 62, display: 'flex', alignItems: 'center', padding: '0 14px', gap: 10, flexShrink: 0, borderBottom: '1px solid rgba(255,255,255,.08)', overflow: 'hidden', whiteSpace: 'nowrap' }
const brandMark = { width: 36, height: 36, borderRadius: 9, flexShrink: 0, background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, color: '#fff', letterSpacing: '-.5px' }
const wordmark  = { fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--text-on-dark)', letterSpacing: '-.3px', lineHeight: 1 }

const navArea      = { flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '8px 8px', scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,.1) transparent' }
const sectionLabel = { fontSize: 10, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: 'rgba(249,250,251,.3)', padding: '14px 10px 4px', whiteSpace: 'nowrap', userSelect: 'none' }

/*
 * Active state: solid --accent fill so it's unmistakably highlighted
 * against the dark --primary sidebar background.
 * Hover state: a subtle 7% white overlay — visible but not distracting.
 */
const navItemStyle = (active, hovered) => ({
  display: 'flex', alignItems: 'center', gap: 10,
  padding: '9px 10px 9px 13px',
  borderRadius: 8, cursor: 'pointer',
  color: active ? '#fff' : 'rgba(249,250,251,.65)',
  fontSize: 13.5, fontWeight: active ? 600 : 400,
  background: active ? 'var(--accent)' : hovered ? 'rgba(255,255,255,.07)' : 'transparent',
  whiteSpace: 'nowrap', transition: 'background .15s, color .15s',
  position: 'relative', userSelect: 'none', marginBottom: 2,
  overflow: 'hidden',
})

/* bright white pip on the left edge — adds a crisp visual anchor */
const activePip = {
  position: 'absolute', left: 0, top: '18%', bottom: '18%',
  width: 3, borderRadius: '0 3px 3px 0',
  background: 'rgba(255,255,255,.75)',
  flexShrink: 0,
}

const navLabelStyle  = { flex: 1 }

/* badge on inactive item */
const badgeStyle = {
  background: 'var(--accent)', color: '#fff',
  fontSize: 10, fontWeight: 700,
  padding: '1px 6px', borderRadius: 20, lineHeight: 1.5,
}
/* badge on active item — white pill so it stays readable on accent bg */
const badgeActiveStyle = {
  background: 'rgba(255,255,255,.25)', color: '#fff',
  fontSize: 10, fontWeight: 700,
  padding: '1px 6px', borderRadius: 20, lineHeight: 1.5,
}

const subItemStyle = (active, hovered) => ({
  display: 'flex', alignItems: 'center', gap: 10,
  padding: '8px 10px 8px 40px', borderRadius: 8, cursor: 'pointer',
  color: active ? '#fff' : 'rgba(249,250,251,.5)',
  fontSize: 13, marginBottom: 1, userSelect: 'none',
  background: active ? 'rgba(75,94,170,.4)' : hovered ? 'rgba(255,255,255,.06)' : 'transparent',
  transition: 'background .15s, color .15s',
  fontWeight: active ? 500 : 400,
})

const footerBar   = { padding: '10px 8px', borderTop: '1px solid rgba(255,255,255,.08)', flexShrink: 0 }
const collapseBtn = { width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px', borderRadius: 8, cursor: 'pointer', background: 'none', border: 'none', fontFamily: 'var(--font-body)', transition: 'background .15s' }