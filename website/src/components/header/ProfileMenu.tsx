// header/ProfileMenu.tsx — Profile pill (avatar initials, name, role) + My Account dropdown (links, Sign Out)
import { getInitials } from '../../utils/formatters'
import { dropdown, dropHeader, dropItem } from './headerStyles'

interface Props { userName: string; userRole: string; open: boolean; onToggle: () => void; onNavigate: (path: string) => void; onSignOut: () => void }

export default function ProfileMenu({ userName, userRole, open, onToggle, onNavigate, onSignOut }: Props) {
  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={onToggle}
        style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 10px 4px 6px', borderRadius: 8, border: '1.5px solid var(--border-card)', background: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
        <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff', flexShrink: 0 }}>{getInitials(userName)}</div>
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2 }}>{userName}</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.2 }}>{userRole}</div>
        </div>
        <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth={2}><polyline points="6 9 12 15 18 9" /></svg>
      </button>

      {open && (
        <div style={dropdown(210)}>
          <div style={dropHeader}>My Account</div>
          {[
            { label: 'My Profile',           href: '#/profile',              icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
            { label: 'Personal Transactions', href: '#/profile/transactions', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg> },
            { label: 'Settings',              href: '#/settings',             icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg> },
          ].map(item => (
            <a key={item.href} href={item.href}
              style={{ ...dropItem, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 9, margin: '3px 8px', borderRadius: 7, transition: 'transform .18s ease, box-shadow .18s ease, background .12s ease' }}
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
              onClick={() => onNavigate(item.href.replace('#', ''))}>
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
              onClick={onSignOut}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
