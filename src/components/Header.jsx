import { useState, useRef, useEffect } from 'react'

const ic  = { width: 17, height: 17, flexShrink: 0 }
const mic = { width: 16, height: 16, flexShrink: 0 }

const SearchIcon = () => (
  <svg style={ic} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx={11} cy={11} r={8} /><line x1={21} y1={21} x2={16.65} y2={16.65} />
  </svg>
)

const BellIcon = () => (
  <svg style={ic} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
)

const HelpIcon = () => (
  <svg style={ic} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <circle cx={12} cy={12} r={10} /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1={12} y1={17} x2={12.01} y2={17} />
  </svg>
)

const MenuIcon = () => (
  <svg style={ic} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <line x1={3} y1={6}  x2={21} y2={6}  />
    <line x1={3} y1={12} x2={21} y2={12} />
    <line x1={3} y1={18} x2={21} y2={18} />
  </svg>
)

/* isMobile — show hamburger, hide search bar + profile label
   onMenuClick — open mobile sidebar drawer */
export default function Header({ page = 'Dashboard', sub = 'Overview', isMobile = false, onMenuClick }) {
  const [dropOpen,   setDropOpen]   = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const dropRef   = useRef(null)
  const searchRef = useRef(null)

  useEffect(() => {
    function onOutside(e) {
      if (dropRef.current   && !dropRef.current.contains(e.target))   setDropOpen(false)
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false)
    }
    document.addEventListener('mousedown', onOutside)
    return () => document.removeEventListener('mousedown', onOutside)
  }, [])

  return (
    <header style={headerStyle}>

      {/* ── Left: hamburger (mobile) + breadcrumb ── */}
      <div style={breadcrumb}>
        {isMobile && (
          <button style={{ ...iconBtn, marginRight: 4 }} onClick={onMenuClick} title="Open menu">
            <MenuIcon />
          </button>
        )}
        <span style={pageTitle}>{page}</span>
        {!isMobile && <><span style={sep}>/</span><span style={subTitle}>{sub}</span></>}
      </div>

      {/* ── Right: search · bell · help · profile ── */}
      <div style={actions}>

        {/* Desktop: inline search bar | Mobile: icon → expanding panel */}
        {!isMobile ? (
          <div style={searchBox}>
            <SearchIcon />
            <input style={searchInput} type="text" placeholder="Search anything…" />
          </div>
        ) : (
          <div ref={searchRef} style={{ position: 'relative' }}>
            <button style={iconBtn} title="Search" onClick={() => setSearchOpen(v => !v)}>
              <SearchIcon />
            </button>
            {searchOpen && (
              <div style={mobileSearch}>
                <SearchIcon />
                <input autoFocus style={searchInput} type="text" placeholder="Search anything…" />
              </div>
            )}
          </div>
        )}

        <button style={iconBtn} title="Notifications">
          <BellIcon />
          <span style={notifDot} />
        </button>

        {!isMobile && (
          <button style={iconBtn} title="Help">
            <HelpIcon />
          </button>
        )}

        {/* ── Profile chip ── */}
        <div style={dividerLine} />

        <div style={{ position: 'relative' }} ref={dropRef}>
          <button style={profileChip(isMobile)} onClick={() => setDropOpen(v => !v)} title="My account">
            <div style={chipAvatar}>JD</div>
            {!isMobile && (
              <div style={chipInfo}>
                <span style={chipName}>Juan dela Cruz</span>
                <span style={chipRole}>Administrator</span>
              </div>
            )}
            {!isMobile && (
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none"
                stroke="var(--text-muted)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
                style={{ flexShrink: 0, transition: 'transform .2s', transform: dropOpen ? 'rotate(180deg)' : 'none' }}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            )}
          </button>

          {/* Dropdown */}
          <div style={dropdownStyle(dropOpen)}>
            <div style={dropHeader}>
              <div style={dropAvatar}>JD</div>
              <div>
                <div style={dropName}>Juan dela Cruz</div>
                <div style={dropRole}>Administrator</div>
              </div>
            </div>
            <div style={dropMenu}>
              <a href="#" style={menuItemStyle} onClick={() => setDropOpen(false)}>
                <svg style={mic} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx={12} cy={7} r={4} />
                </svg>
                My Profile
              </a>
              <div style={menuDivider} />
              <a href="#" style={{ ...menuItemStyle, color: 'var(--danger)' }} onClick={() => setDropOpen(false)}>
                <svg style={{ ...mic, stroke: 'var(--danger)' }} viewBox="0 0 24 24" fill="none" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1={21} y1={12} x2={9} y2={12} />
                </svg>
                Logout
              </a>
            </div>
          </div>
        </div>

      </div>
    </header>
  )
}

/* ─── styles ─────────────────────────────────────────────────── */

const headerStyle = { height: 'var(--header-h)', background: 'var(--white)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', padding: '0 16px', gap: 12, position: 'sticky', top: 0, zIndex: 90, boxShadow: '0 1px 0 var(--border)' }
const breadcrumb  = { display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }
const pageTitle   = { fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-.2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }
const sep         = { color: 'var(--text-muted)', fontSize: 14, flexShrink: 0 }
const subTitle    = { fontSize: 14, color: 'var(--text-muted)', whiteSpace: 'nowrap' }
const actions     = { display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }

const searchBox    = { display: 'flex', alignItems: 'center', gap: 8, background: 'var(--neutral-light)', border: '1px solid var(--border)', borderRadius: 8, padding: '0 12px', height: 38, width: 220 }
const mobileSearch = { position: 'absolute', top: 'calc(100% + 8px)', right: 0, width: 260, display: 'flex', alignItems: 'center', gap: 8, background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 8, padding: '0 12px', height: 40, boxShadow: 'var(--shadow-md)', zIndex: 100 }
const searchInput  = { border: 'none', background: 'none', outline: 'none', fontSize: 13.5, color: 'var(--text-primary)', fontFamily: 'var(--font-body)', width: '100%' }
const iconBtn      = { width: 38, height: 38, borderRadius: 8, background: 'none', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-secondary)', position: 'relative' }
const notifDot     = { position: 'absolute', top: 7, right: 7, width: 7, height: 7, background: 'var(--danger)', borderRadius: '50%', border: '1.5px solid var(--white)' }

/* thin vertical separator before the profile chip */
const dividerLine  = { width: 1, height: 24, background: 'var(--border)', flexShrink: 0, marginLeft: 2 }

/* profile chip — avatar + name/role on desktop, avatar-only on mobile */
const profileChip = (isMobile) => ({
  display: 'flex', alignItems: 'center', gap: 9,
  padding: isMobile ? '0' : '5px 10px 5px 5px',
  borderRadius: isMobile ? '50%' : 10,
  border: '1px solid var(--border)',
  background: 'none', cursor: 'pointer',
  transition: 'background .15s',
  width: isMobile ? 38 : 'auto',
  height: isMobile ? 38 : 'auto',
  justifyContent: isMobile ? 'center' : 'flex-start',
})

const chipAvatar = { width: 30, height: 30, borderRadius: '50%', background: 'var(--accent-light)', border: '2px solid var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 11, color: 'var(--accent)', flexShrink: 0, userSelect: 'none' }
const chipInfo   = { display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0 }
const chipName   = { fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', lineHeight: 1.2 }
const chipRole   = { fontSize: 11, color: 'var(--text-muted)', whiteSpace: 'nowrap', lineHeight: 1.2 }

const dropdownStyle = (open) => ({ position: 'absolute', top: 'calc(100% + 10px)', right: 0, background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 12, minWidth: 210, zIndex: 200, overflow: 'hidden', boxShadow: '0 8px 24px rgba(30,33,40,.12), 0 2px 6px rgba(30,33,40,.06)', opacity: open ? 1 : 0, transform: open ? 'translateY(0)' : 'translateY(-6px)', pointerEvents: open ? 'all' : 'none', transition: 'opacity .18s ease, transform .18s ease' })

const dropHeader  = { padding: '14px 16px 12px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 11 }
const dropAvatar  = { width: 38, height: 38, borderRadius: '50%', flexShrink: 0, background: 'var(--accent-light)', border: '2px solid var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, color: 'var(--accent)' }
const dropName    = { fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.3 }
const dropRole    = { fontSize: 11.5, color: 'var(--text-muted)' }
const dropMenu    = { padding: 6 }
const menuItemStyle = { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, cursor: 'pointer', fontSize: 13.5, color: 'var(--text-primary)', textDecoration: 'none' }
const menuDivider = { height: 1, background: 'var(--border)', margin: '4px 6px' }