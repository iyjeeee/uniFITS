// header/AllNotificationsModal.tsx — All Notifications InfoModal: unread summary, Mark all read, paged list, View All Activity
import { InfoModal } from '../ui'
import Pagination from '../Pagination'
import { NOTIF_PER_PAGE } from './headerData'
import type { Notification } from './headerData'

interface Props {
  open: boolean; notifications: Notification[]; unreadCount: number; page: number
  onPageChange: (page: number) => void; onMarkAllRead: () => void; onViewActivity: () => void; onClose: () => void
}

export default function AllNotificationsModal({ open, notifications, unreadCount, page, onPageChange, onMarkAllRead, onViewActivity, onClose }: Props) {
  const pages = Math.max(1, Math.ceil(notifications.length / NOTIF_PER_PAGE))
  const paged = notifications.slice((page - 1) * NOTIF_PER_PAGE, page * NOTIF_PER_PAGE)
  return (
    <InfoModal
      open={open}
      onClose={onClose}
      title="All Notifications"
      subtitle={`${notifications.length} total · ${unreadCount} unread · Page ${page} of ${pages}`}
      footer={
        <div style={{ display: 'flex', gap: 10, justifyContent: 'space-between', width: '100%' }}>
          <button onClick={onViewActivity}
            style={{ padding: '10px 20px', borderRadius: 9, border: '1.5px solid var(--accent)', background: 'var(--accent)', color: '#fff', fontSize: 13.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
            View All Activity
          </button>
          <button onClick={onClose}
            style={{ padding: '10px 24px', borderRadius: 9, border: '1.5px solid var(--border-card)', background: 'var(--neutral-light)', color: 'var(--text-primary)', fontSize: 13.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
            Close
          </button>
        </div>
      }>
      <div>
        {unreadCount > 0 && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
            <button onClick={onMarkAllRead} style={{ fontSize: 12.5, color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Mark all read</button>
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 16 }}>
          {paged.map(n => (
            <div key={n.id} style={{ display: 'flex', gap: 12, padding: '12px 16px', borderRadius: 10, background: n.read ? 'var(--neutral-light)' : 'rgba(75,94,170,.06)', border: '1px solid ' + (n.read ? 'var(--border-inner)' : 'rgba(75,94,170,.18)'), alignItems: 'flex-start' }}>
              <div style={{ width: 9, height: 9, borderRadius: '50%', flexShrink: 0, marginTop: 5, background: n.read ? 'var(--border-card)' : 'var(--accent)', border: n.read ? '1.5px solid var(--border-card)' : '1.5px solid var(--accent)' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, color: n.read ? 'var(--text-secondary)' : 'var(--text-primary)', lineHeight: 1.5, fontWeight: n.read ? 400 : 600 }}>{n.text}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>{n.time}</div>
              </div>
            </div>
          ))}
        </div>
        {pages > 1 && <Pagination page={page} total={pages} onChange={onPageChange} />}
      </div>
    </InfoModal>
  )
}
