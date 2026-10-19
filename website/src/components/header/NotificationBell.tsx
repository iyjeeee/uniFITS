// header/NotificationBell.tsx — Bell button with unread badge + compact dropdown (5 latest, Mark all read, View All link)
import HeaderIconButton from './HeaderIconButton'
import { dropdown } from './headerStyles'
import type { Notification } from './headerData'

interface Props {
  notifications: Notification[]; unreadCount: number; open: boolean
  onToggle: () => void; onMarkAllRead: () => void; onViewAll: () => void
}

export default function NotificationBell({ notifications, unreadCount, open, onToggle, onMarkAllRead, onViewAll }: Props) {
  return (
    <div style={{ position: 'relative' }}>
      <HeaderIconButton onClick={onToggle} ariaLabel={`${unreadCount} unread notifications`}>
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
    {unreadCount > 0 && (
      <span style={{ position: 'absolute', top: -4, right: -4, minWidth: 18, height: 18, borderRadius: 20, background: 'var(--danger)', border: '2px solid var(--white)', color: '#fff', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px', lineHeight: 1, fontFamily: 'var(--font-body)' }}>
        {unreadCount > 9 ? '9+' : unreadCount}
      </span>
    )}
      </HeaderIconButton>

      {/* Compact dropdown — shows 5 latest */}
      {open && (
    <div style={dropdown(300)}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px 8px', borderBottom: '1px solid var(--border-inner)' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
          Notifications
          {unreadCount > 0 && <span style={{ marginLeft: 7, background: 'var(--danger)', color: '#fff', fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 20 }}>{unreadCount}</span>}
        </div>
        {unreadCount > 0 && <button onClick={onMarkAllRead} style={{ fontSize: 11.5, color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, padding: 0 }}>Mark all read</button>}
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
        <button onClick={onViewAll} style={{ fontSize: 12.5, color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, padding: 0 }}>
          View All Notifications →
        </button>
      </div>
    </div>
      )}
    </div>
  )
}
