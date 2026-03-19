// Header.jsx — Sticky top bar: breadcrumb + search (LEFT), notifications + profile (RIGHT)
// Search bar is now on the LEFT side, immediately after the page title/breadcrumb
import { useState, useRef, useEffect } from 'react'
import { useOrg } from '../context/OrgContext'

const MOCK_NOTIFICATIONS = [
  { id: 1, text: 'New project "Medical Mission" created',        read: false },
  { id: 2, text: 'Maria Santos paid membership dues',             read: false },
  { id: 3, text: 'Backup completed successfully',                read: false },
  { id: 4, text: 'Annual Gala Night event updated',              read: true  },
  { id: 5, text: 'Tree Planting Initiative funding reached 40%', read: true  },
]

export default function Header({ page, sub, onMenuClick, navigate }) {
  const org = useOrg()
  const [notifOpen,     setNotifOpen]     = useState(false)
  const [profileOpen,   setProfileOpen]   = useState(false)
  const [search,        setSearch]        = useState('')
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS)
  const containerRef = useRef(null)

  const unreadCount = notifications.filter(n => !n.read).length

  useEffect(() => {
    function handler(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setNotifOpen(false)
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  function markAllRead() {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  return (
    <header style={{
      height: 62, background: 'var(--white)', borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'center',
      padding: '0 20px', position: 'sticky', top: 0, zIndex: 50, gap: 12, flexShrink: 0,
    }}>

      {/* ── FAR LEFT: hamburger menu ───────────────────────── */}
      <button onClick={onMenuClick} style={iconBtn} aria-label="Toggle sidebar">
        <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
          <line x1={3} y1={6}  x2={21} y2={6}  />
          <line x1={3} y1={12} x2={21} y2={12} />
          <line x1={3} y1={18} x2={21} y2={18} />
        </svg>
      </button>

      {/* ── Page title / breadcrumb ────────────────────────── */}
      <div style={{ flexShrink: 0 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>
          {page || 'Dashboard'}
        </div>
        {sub && (
          <div style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.2 }}>{sub}</div>
        )}
      </div>

      {/* ── Separator ─────────────────────────────────────── */}
      <div style={{ width: 1, height: 24, background: 'var(--border)', flexShrink: 0 }} />

      {/* ── SEARCH BAR — left side, after page title ──────── */}
      <div style={{ position: 'relative', width: 300, flexShrink: 0 }}>
        <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth={2} strokeLinecap="round"
          style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
          <circle cx={11} cy={11} r={8} /><line x1={21} y1={21} x2={16.65} y2={16.65} />
        </svg>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search..."
          style={{
            width: '100%', padding: '7px 10px 7px 30px',
            borderRadius: 8, border: '1px solid var(--border)',
            background: 'var(--neutral-light)', fontSize: 13,
            fontFamily: 'var(--font-body)', color: 'var(--text-primary)',
            outline: 'none', boxSizing: 'border-box',
          }}
        />
      </div>

      {/* ── Spacer — pushes notifications + profile to right ── */}
      <div style={{ flex: 1 }} />

      {/* ── RIGHT: notifications + profile ────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }} ref={containerRef}>

        {/* Notifications bell with count badge */}
        <div style={{ position: 'relative' }}>
          <button style={iconBtn} onClick={() => { setNotifOpen(o => !o); setProfileOpen(false) }}
            aria-label={`${unreadCount} unread notifications`}>
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute', top: -4, right: -4,
                minWidth: 18, height: 18, borderRadius: 20,
                background: 'var(--danger)', border: '2px solid var(--white)',
                color: '#fff', fontSize: 10, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '0 4px', lineHeight: 1, fontFamily: 'var(--font-body)',
              }}>
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div style={dropdown(300)}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px 8px', borderBottom: '1px solid var(--border)' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
                  Notifications
                  {unreadCount > 0 && (
                    <span style={{ marginLeft: 7, background: 'var(--danger)', color: '#fff', fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 20 }}>
                      {unreadCount}
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button onClick={markAllRead}
                    style={{ fontSize: 11.5, color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, padding: 0 }}>
                    Mark all read
                  </button>
                )}
              </div>
              {notifications.map(n => (
                <div key={n.id} style={{
                  display: 'flex', gap: 10, padding: '10px 16px',
                  borderBottom: '1px solid var(--border)',
                  background: n.read ? 'transparent' : 'rgba(75,94,170,.04)',
                  alignItems: 'flex-start',
                }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', flexShrink: 0, marginTop: 5, background: n.read ? 'var(--border)' : 'var(--accent)' }} />
                  <div style={{ fontSize: 13, color: n.read ? 'var(--text-muted)' : 'var(--text-primary)', lineHeight: 1.45, fontWeight: n.read ? 400 : 500 }}>
                    {n.text}
                  </div>
                </div>
              ))}
              <div style={{ padding: '10px 16px', textAlign: 'center' }}>
                <a href="#/audit" onClick={() => setNotifOpen(false)}
                  style={{ fontSize: 12.5, color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>
                  View all activity →
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Profile dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => { setProfileOpen(o => !o); setNotifOpen(false) }}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 10px 4px 6px', borderRadius: 8, border: '1px solid var(--border)', background: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
            <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff', flexShrink: 0 }}>JD</div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2 }}>Juan Dela Cruz</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.2 }}>Admin</div>
            </div>
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth={2}><polyline points="6 9 12 15 18 9" /></svg>
          </button>

          {profileOpen && (
            <div style={dropdown(200)}>
              <div style={dropHeader}>My Account</div>
              {[
                { label: 'My Profile',            href: '#/profile'              },
                { label: 'Personal Transactions',  href: '#/profile/transactions' },
                { label: 'Settings',               href: '#/settings'             },
              ].map(item => (
                <a key={item.href} href={item.href}
                  style={{ ...dropItem, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}
                  onClick={() => setProfileOpen(false)}>
                  {item.label}
                </a>
              ))}
              <div style={{ padding: '8px', borderTop: '1px solid var(--border)' }}>
                <button
                  style={{ width: '100%', padding: '8px', background: 'var(--danger-light)', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 600, color: 'var(--danger)', fontFamily: 'var(--font-body)', textAlign: 'left' }}
                  onClick={() => { window.location.hash = '/login'; setProfileOpen(false) }}>
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  )
}

const iconBtn    = { width: 36, height: 36, borderRadius: 8, border: '1px solid var(--border)', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', position: 'relative', transition: 'background .15s' }
const dropdown   = (w) => ({ position: 'absolute', top: 'calc(100% + 8px)', right: 0, width: w, background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,.12)', zIndex: 200, overflow: 'hidden' })
const dropHeader = { padding: '12px 16px 8px', fontSize: 11.5, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.06em', borderBottom: '1px solid var(--border)' }
const dropItem   = { display: 'flex', gap: 8, padding: '10px 16px', fontSize: 13.5, color: 'var(--text-primary)', cursor: 'pointer', transition: 'background .1s', lineHeight: 1.4 }
