// header/useHeaderMenus.ts — Header state: notification list, dropdown open flags (outside click closes both), modals, notification paging
import { useState, useRef, useEffect } from 'react'
import { MOCK_NOTIFICATIONS } from './headerData'
import type { Notification } from './headerData'

export default function useHeaderMenus() {
  const [notifOpen,       setNotifOpen      ] = useState(false)
  const [showAllNotif,    setShowAllNotif   ] = useState(false)
  const [notifPage,       setNotifPage      ] = useState(1)
  const [profileOpen,     setProfileOpen    ] = useState(false)
  const [notifications,   setNotifications  ] = useState<Notification[]>(MOCK_NOTIFICATIONS)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)   // wraps bell + profile — clicks outside it close the dropdowns

  const unreadCount = notifications.filter(n => !n.read).length

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

  // Opening one dropdown closes the other
  function toggleNotif()   { setNotifOpen(o => !o); setProfileOpen(false) }
  function toggleProfile() { setProfileOpen(o => !o); setNotifOpen(false) }

  return {
    containerRef, notifications, unreadCount, notifOpen, profileOpen, showAllNotif, setShowAllNotif,
    notifPage, setNotifPage, showLogoutModal, setShowLogoutModal, setProfileOpen,
    markAllRead, openAllNotif, toggleNotif, toggleProfile,
  }
}
