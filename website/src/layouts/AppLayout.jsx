// AppLayout.jsx — Main layout shell: sidebar + sticky header + scrollable content
// Padding tightened to 16px 20px (was 24px 28px) to maximize usable content area
import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import Header  from '../components/Header'
import useBreakpoint from '../hooks/useBreakpoint'

export default function AppLayout({ children, page, sub, navigate, onLogout, currentUser }) {
  const { isMobile, isTablet } = useBreakpoint()
  const [collapsed,   setCollapsed]   = useState(false)  // desktop icon-only mode
  const [drawerOpen,  setDrawerOpen]  = useState(false)  // mobile slide-in drawer

  // Auto-collapse on tablet
  useEffect(() => {
    if (isTablet && !isMobile) setCollapsed(true)
    if (!isTablet && !isMobile) setCollapsed(false)
  }, [isTablet, isMobile])

  // Close drawer when leaving mobile
  useEffect(() => {
    if (!isMobile) setDrawerOpen(false)
  }, [isMobile])

  const sidebarW = isMobile ? 0 : collapsed ? 64 : 240

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-app)' }}>

      {/* Mobile backdrop */}
      {isMobile && drawerOpen && (
        <div
          onClick={() => setDrawerOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.4)', zIndex: 99, backdropFilter: 'blur(1px)' }}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        open={isMobile ? drawerOpen : true}
        collapsed={collapsed}
        isMobile={isMobile}
        onToggle={() => {
          if (isMobile) setDrawerOpen(o => !o)
          else setCollapsed(c => !c)
        }}
        onClose={() => setDrawerOpen(false)}
      />

      {/* Main content area */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        marginLeft: sidebarW,
        transition: 'margin-left .25s cubic-bezier(.4,0,.2,1)',
        minWidth: 0,
      }}>

        {/* Sticky header */}
        <Header
          page={page}
          sub={sub}
          onMenuClick={() => {
            if (isMobile) setDrawerOpen(o => !o)
            else setCollapsed(c => !c)
          }}
          navigate={navigate}
          onLogout={onLogout}
          currentUser={currentUser}
        />

        {/* Page content — tighter padding to maximise content width */}
        <main style={{
          flex: 1,
          padding: isMobile ? '14px 12px' : '16px 20px',  /* was 24px 28px — reduced to maximise space */
          maxWidth: 1600,                                   /* raised from 1400 to let wide screens use more */
          width: '100%',
          margin: '0 auto',
          boxSizing: 'border-box',
        }}>
          {children}
        </main>
      </div>
    </div>
  )
}
