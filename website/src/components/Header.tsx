// components/Header.tsx — Sticky top bar: page title (LEFT), notifications + profile (RIGHT)
// Search bar removed per spec — each manage page has its own search field.
// Composition only; state in header/useHeaderMenus, pieces in header/.
import HeaderIconButton from './header/HeaderIconButton'
import NotificationBell from './header/NotificationBell'
import ProfileMenu from './header/ProfileMenu'
import AllNotificationsModal from './header/AllNotificationsModal'
import LogoutModal from './header/LogoutModal'
import useHeaderMenus from './header/useHeaderMenus'
import { useOrg } from '../context/OrgContext'
import type { User, NavigateFn } from '../types'

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
  const m = useHeaderMenus()

  return (
    <header style={{ height: 62, background: 'var(--white)', borderBottom: '1px solid var(--border-inner)', display: 'flex', alignItems: 'center', padding: '0 20px', position: 'sticky', top: 0, zIndex: 50, gap: 12, flexShrink: 0 }}>

      {/* Hamburger — smooth lift + border glow on hover */}
      <HeaderIconButton onClick={onMenuClick} ariaLabel="Toggle sidebar">
        <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
          <line x1={3} y1={6}  x2={21} y2={6}  />
          <line x1={3} y1={12} x2={21} y2={12} />
          <line x1={3} y1={18} x2={21} y2={18} />
        </svg>
      </HeaderIconButton>

      {/* Page title + subtitle */}
      <div style={{ flexShrink: 0 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>{page || 'Dashboard'}</div>
        {sub && <div style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.2 }}>{sub}</div>}
      </div>

      <div style={{ width: 1, height: 24, background: 'var(--border-inner)', flexShrink: 0 }} />
      <div style={{ flex: 1 }} />

      {/* Right controls — notifications + profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }} ref={m.containerRef}>
        <NotificationBell notifications={m.notifications} unreadCount={m.unreadCount} open={m.notifOpen}
          onToggle={m.toggleNotif} onMarkAllRead={m.markAllRead} onViewAll={m.openAllNotif} />
        <ProfileMenu userName={userName} userRole={userRole} open={m.profileOpen} onToggle={m.toggleProfile}
          onNavigate={(path) => { m.setProfileOpen(false); navigate(path) }} onSignOut={() => { m.setProfileOpen(false); m.setShowLogoutModal(true) }} />
      </div>

      <AllNotificationsModal open={m.showAllNotif} notifications={m.notifications} unreadCount={m.unreadCount} page={m.notifPage}
        onPageChange={m.setNotifPage} onMarkAllRead={m.markAllRead} onClose={() => m.setShowAllNotif(false)}
        onViewActivity={() => { m.setShowAllNotif(false); window.location.hash = '/audit' }} />
      <LogoutModal open={m.showLogoutModal} onClose={() => m.setShowLogoutModal(false)} onLogout={onLogout} />
    </header>
  )
}
