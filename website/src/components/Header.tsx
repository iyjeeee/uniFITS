// components/Header.tsx — Sticky top bar: page title (LEFT), notifications + profile (RIGHT)
// Search bar removed per spec — each manage page has its own search field
import { useState, useRef, useEffect } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { InfoModal, ResponseModal } from './ui'
import { useOrg } from '../context/OrgContext'
import { getInitials } from '../utils/formatters'
import type { User, NavigateFn } from '../types'

// Notification record shape
interface Notification { id: number; text: string; time: string; read: boolean }

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 1,  text: 'New project "Medical Mission" created',         time: '2 min ago',  read: false },
  { id: 2,  text: 'Maria Santos paid membership dues',             time: '1 hr ago',   read: false },
  { id: 3,  text: 'Backup completed successfully',                 time: '3 hrs ago',  read: false },
  { id: 4,  text: 'Annual Gala Night event updated',               time: 'Yesterday',  read: true  },
  { id: 5,  text: 'Tree Planting Initiative funding reached 40%',  time: 'Yesterday',  read: true  },
  { id: 6,  text: 'Pedro Reyes paid membership dues',              time: '2 days ago', read: true  },
  { id: 7,  text: 'New member Ana Lim registered',                 time: '3 days ago', read: true  },
  { id: 8,  text: 'School Feeding Program budget approved',        time: '4 days ago', read: true  },
  { id: 9,  text: 'System backup scheduled for tomorrow 2AM',      time: '5 days ago', read: true  },
  { id: 10, text: 'Carlos Villanueva updated project status',      time: '6 days ago', read: true  },
  { id: 11, text: 'Livelihood Seminar venue confirmed',            time: '1 week ago', read: true  },
  { id: 12, text: 'Emergency Fund reached ₱20,000 milestone',     time: '1 week ago', read: true  },
]

// PBtn — pagination button inside the All Notifications modal
interface PBtnProps { children: ReactNode; active?: boolean; disabled?: boolean; onClick: () => void }
function PBtn({ children, active, disabled, onClick }: PBtnProps) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      width: 28, height: 28, borderRadius: 6,
      border: '1.5px solid var(--border-card)',
      background: active ? 'var(--accent)' : disabled ? 'var(--neutral-light)' : '#fff',
      color: active ? '#fff' : disabled ? 'var(--text-muted)' : 'var(--text-primary)',
      cursor: disabled ? 'not-allowed' : 'pointer', fontSize: 12, fontWeight: active ? 700 : 400,
    }}>{children}</button>
  )
}

interface HeaderProps {
  page:        string
  sub?:        string
  onMenuClick: () => void
  navigate:    NavigateFn
  onLogout:    () => void
  currentUser: User | null
}

export default function Header({ page, sub, onMenuClick, navigate, onLogout, currentUser }: HeaderProps) {
  const userName = currentUser?.full_name ?? 'Guest'   // profile pill — falls back if no session user
  const userRole = currentUser?.role ?? ''
  useOrg() // org available for future label use

  const [notifOpen,       setNotifOpen      ] = useState(false)
  const [showAllNotif,    setShowAllNotif   ] = useState(false)
  const [notifPage,       setNotifPage      ] = useState(1)
  const [profileOpen,     setProfileOpen    ] = useState(false)
  const [notifications,   setNotifications  ] = useState<Notification[]>(MOCK_NOTIFICATIONS)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const NOTIF_PER_PAGE = 8
  const unreadCount    = notifications.filter(n => !n.read).length
  const notifPages     = Math.max(1, Math.ceil(notifications.length / NOTIF_PER_PAGE))
  const pagedNotif     = notifications.slice((notifPage - 1) * NOTIF_PER_PAGE, notifPage * NOTIF_PER_PAGE)

  // Close both dropdowns on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
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

  function openAllNotif() {
    setNotifOpen(false)
    setNotifPage(1)
    setShowAllNotif(true)
  }

  return (
    <header style={{ height: 62, background: 'var(--white)', borderBottom: '1px solid var(--border-inner)', display: 'flex', alignItems: 'center', padding: '0 20px', position: 'sticky', top: 0, zIndex: 50, gap: 12, flexShrink: 0 }}>

      {/* Hamburger — smooth lift + border glow on hover */}
      <button
        onClick={onMenuClick}
        aria-label="Toggle sidebar"
        style={iconBtn as CSSProperties}
        onMouseEnter={e => {
          e.currentTarget.style.transform    = 'translateY(-2px)'
          e.currentTarget.style.boxShadow   = '0 0 0 1.5px rgba(0,0,0,.70), 0 4px 12px rgba(0,0,0,.14)'
          e.currentTarget.style.background  = 'var(--neutral-light)'
          e.currentTarget.style.borderColor = 'var(--accent)'
          e.currentTarget.style.color       = 'var(--accent)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform    = ''
          e.currentTarget.style.boxShadow   = ''
          e.currentTarget.style.background  = ''
          e.currentTarget.style.borderColor = ''
          e.currentTarget.style.color       = ''
        }}>
        <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
          <line x1={3} y1={6}  x2={21} y2={6}  />
          <line x1={3} y1={12} x2={21} y2={12} />
          <line x1={3} y1={18} x2={21} y2={18} />
        </svg>
      </button>

      {/* Page title + subtitle */}
      <div style={{ flexShrink: 0 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>{page || 'Dashboard'}</div>
        {sub && <div style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.2 }}>{sub}</div>}
      </div>

      <div style={{ width: 1, height: 24, background: 'var(--border-inner)', flexShrink: 0 }} />
      <div style={{ flex: 1 }} />

      {/* Right controls — notifications + profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }} ref={containerRef}>

        {/* Notification bell */}
        <div style={{ position: 'relative' }}>
          <button
            style={iconBtn as CSSProperties}
            onClick={() => { setNotifOpen(o => !o); setProfileOpen(false) }}
            aria-label={`${unreadCount} unread notifications`}
            onMouseEnter={e => {
              e.currentTarget.style.transform    = 'translateY(-2px)'
              e.currentTarget.style.boxShadow   = '0 0 0 1.5px rgba(0,0,0,.70), 0 4px 12px rgba(0,0,0,.14)'
              e.currentTarget.style.background  = 'var(--neutral-light)'
              e.currentTarget.style.borderColor = 'var(--accent)'
              e.currentTarget.style.color       = 'var(--accent)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform    = ''
              e.currentTarget.style.boxShadow   = ''
              e.currentTarget.style.background  = ''
              e.currentTarget.style.borderColor = ''
              e.currentTarget.style.color       = ''
            }}>
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            {unreadCount > 0 && (
              <span style={{ position: 'absolute', top: -4, right: -4, minWidth: 18, height: 18, borderRadius: 20, background: 'var(--danger)', border: '2px solid var(--white)', color: '#fff', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px', lineHeight: 1, fontFamily: 'var(--font-body)' }}>
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Compact dropdown — shows 5 latest */}
          {notifOpen && (
            <div style={dropdown(300) as CSSProperties}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px 8px', borderBottom: '1px solid var(--border-inner)' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
                  Notifications
                  {unreadCount > 0 && <span style={{ marginLeft: 7, background: 'var(--danger)', color: '#fff', fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 20 }}>{unreadCount}</span>}
                </div>
                {unreadCount > 0 && <button onClick={markAllRead} style={{ fontSize: 11.5, color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, padding: 0 }}>Mark all read</button>}
              </div>
              {notifications.slice(0, 5).map(n => (
                <div key={n.id} style={{ display: 'flex', gap: 10, padding: '10px 16px', borderBottom: '1px solid var(--border-inner)', background: n.read ? 'transparent' : 'rgba(75,94,170,.04)', alignItems: 'flex-start' }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', flexShrink: 0, marginTop: 5, background: n.read ? 'var(--border-card)' : 'var(--accent)' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, color: n.read ? 'var(--text-muted)' : 'var(--text-primary)', lineHeight: 1.45, fontWeight: n.read ? 400 : 500 }}>{n.text}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{n.time}</div>
                  </div>
                </div>
              ))}
              <div style={{ padding: '10px 16px', textAlign: 'center' }}>
                <button onClick={openAllNotif} style={{ fontSize: 12.5, color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, padding: 0 }}>
                  View All Notifications →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => { setProfileOpen(o => !o); setNotifOpen(false) }}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 10px 4px 6px', borderRadius: 8, border: '1.5px solid var(--border-card)', background: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
            <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff', flexShrink: 0 }}>{getInitials(userName)}</div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2 }}>{userName}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.2 }}>{userRole}</div>
            </div>
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth={2}><polyline points="6 9 12 15 18 9" /></svg>
          </button>

          {profileOpen && (
            <div style={dropdown(210) as CSSProperties}>
              <div style={dropHeader as CSSProperties}>My Account</div>
              {[
                { label: 'My Profile',           href: '#/profile',              icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
                { label: 'Personal Transactions', href: '#/profile/transactions', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg> },
                { label: 'Settings',              href: '#/settings',             icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg> },
              ].map(item => (
                <a key={item.href} href={item.href}
                  style={{ ...dropItem, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 9, margin: '3px 8px', borderRadius: 7, transition: 'transform .18s ease, box-shadow .18s ease, background .12s ease' } as CSSProperties}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 0 0 1.5px rgba(0,0,0,.70), 0 4px 12px rgba(0,0,0,.14)'
                    e.currentTarget.style.background = 'var(--neutral-light)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = ''
                    e.currentTarget.style.boxShadow = ''
                    e.currentTarget.style.background = ''
                  }}
                  onClick={() => { setProfileOpen(false); navigate(item.href.replace('#', '')) }}>
                  <span style={{ opacity: 0.6, display: 'flex', alignItems: 'center', flexShrink: 0 }}>{item.icon}</span>
                  {item.label}
                </a>
              ))}
              <div style={{ padding: '6px 8px 8px', borderTop: '1px solid var(--border-inner)' }}>
                <button
                  style={{ width: '100%', padding: '9px 12px', background: 'var(--danger-light)', border: '1px solid transparent', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 600, color: 'var(--danger)', fontFamily: 'var(--font-body)', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 9, transition: 'transform .18s ease, box-shadow .18s ease, background .12s ease, color .12s ease' }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 0 0 1.5px rgba(0,0,0,.70), 0 4px 12px rgba(0,0,0,.14)'
                    e.currentTarget.style.background = 'var(--danger)'
                    e.currentTarget.style.color = '#fff'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = ''
                    e.currentTarget.style.boxShadow = ''
                    e.currentTarget.style.background = 'var(--danger-light)'
                    e.currentTarget.style.color = 'var(--danger)'
                  }}
                  onClick={() => { setProfileOpen(false); setShowLogoutModal(true) }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── All Notifications InfoModal ─────────────────────────────────── */}
      <InfoModal
        open={showAllNotif}
        onClose={() => setShowAllNotif(false)}
        title="All Notifications"
        subtitle={`${notifications.length} total · ${unreadCount} unread · Page ${notifPage} of ${notifPages}`}
        footer={
          <div style={{ display: 'flex', gap: 10, justifyContent: 'space-between', width: '100%' }}>
            <button onClick={() => { setShowAllNotif(false); window.location.hash = '/audit' }}
              style={{ padding: '10px 20px', borderRadius: 9, border: '1.5px solid var(--accent)', background: 'var(--accent)', color: '#fff', fontSize: 13.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
              View All Activity
            </button>
            <button onClick={() => setShowAllNotif(false)}
              style={{ padding: '10px 24px', borderRadius: 9, border: '1.5px solid var(--border-card)', background: 'var(--neutral-light)', color: 'var(--text-primary)', fontSize: 13.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
              Close
            </button>
          </div>
        }>
        <div>
          {unreadCount > 0 && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
              <button onClick={markAllRead} style={{ fontSize: 12.5, color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Mark all read</button>
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 16 }}>
            {pagedNotif.map(n => (
              <div key={n.id} style={{ display: 'flex', gap: 12, padding: '12px 16px', borderRadius: 10, background: n.read ? 'var(--neutral-light)' : 'rgba(75,94,170,.06)', border: '1px solid ' + (n.read ? 'var(--border-inner)' : 'rgba(75,94,170,.18)'), alignItems: 'flex-start' }}>
                <div style={{ width: 9, height: 9, borderRadius: '50%', flexShrink: 0, marginTop: 5, background: n.read ? 'var(--border-card)' : 'var(--accent)', border: n.read ? '1.5px solid var(--border-card)' : '1.5px solid var(--accent)' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13.5, color: n.read ? 'var(--text-secondary)' : 'var(--text-primary)', lineHeight: 1.5, fontWeight: n.read ? 400 : 600 }}>{n.text}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>{n.time}</div>
                </div>
              </div>
            ))}
          </div>
          {notifPages > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
              <PBtn disabled={notifPage === 1} onClick={() => setNotifPage(p => p - 1)}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
              </PBtn>
              {Array.from({ length: notifPages }, (_, i) => i + 1).map(p => (
                <PBtn key={p} active={p === notifPage} onClick={() => setNotifPage(p)}>{p}</PBtn>
              ))}
              <PBtn disabled={notifPage === notifPages} onClick={() => setNotifPage(p => p + 1)}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
              </PBtn>
            </div>
          )}
        </div>
      </InfoModal>

      {/* ── Logout Confirmation Modal ───────────────────────────────────── */}
      <ResponseModal
        open={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        variant="warning"
        title="Sign Out?"
        message="Are you sure you want to sign out? Any unsaved changes will be lost."
        confirmLabel="Yes, Sign Out"
        cancelLabel="Cancel"
        onConfirm={() => {
          setShowLogoutModal(false)
          if (typeof onLogout === 'function') {
            onLogout()
          } else {
            try { sessionStorage.removeItem('unifits_authed'); sessionStorage.removeItem('unifits_user') } catch { /* ignore */ }
            window.location.hash = '/login'
          }
        }}
      />
    </header>
  )
}

/* ── Styles ──────────────────────────────────────────────────────────────────── */
const iconBtn    = { width: 36, height: 36, borderRadius: 8, border: '1px solid var(--border-card)', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', position: 'relative', transition: 'transform .18s ease, box-shadow .18s ease, background .15s ease, border-color .15s ease, color .15s ease' }
const dropdown   = (w: number) => ({ position: 'absolute', top: 'calc(100% + 8px)', right: 0, width: w, background: 'var(--white)', border: '1.5px solid var(--border-card)', borderRadius: 10, boxShadow: '0 8px 24px rgba(75,94,170,.14)', zIndex: 200, overflow: 'hidden' })
const dropHeader = { padding: '12px 16px 8px', fontSize: 11.5, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.06em', borderBottom: '1px solid var(--border-inner)' }
const dropItem   = { display: 'flex', gap: 8, padding: '10px 16px', fontSize: 13.5, color: 'var(--text-primary)', cursor: 'pointer', transition: 'background .1s', lineHeight: 1.4 }
