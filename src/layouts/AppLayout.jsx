import { useState, useEffect, useCallback } from 'react'
import Sidebar from '../components/Sidebar'
import Header  from '../components/Header'
import useBreakpoint from '../hooks/useBreakpoint'

export default function AppLayout({ children, page, sub }) {
  const bp = useBreakpoint()

  /* sidebar open state — desktop starts expanded, tablet starts collapsed, mobile starts closed */
  const [open,      setOpen]      = useState(bp === 'desktop')
  const [collapsed, setCollapsed] = useState(bp === 'tablet')

  /* sync defaults when breakpoint changes (e.g. resize from desktop to mobile) */
  useEffect(() => {
    if (bp === 'mobile')  { setOpen(false);  setCollapsed(false) }
    if (bp === 'tablet')  { setOpen(true);   setCollapsed(true)  }
    if (bp === 'desktop') { setOpen(true);   setCollapsed(false) }
  }, [bp])

  /* mobile: toggle drawer open/closed | desktop/tablet: toggle collapse */
  const handleToggle = useCallback(() => {
    if (bp === 'mobile') setOpen(v => !v)
    else { setCollapsed(v => !v); if (!collapsed) setOpen(false) }
  }, [bp, collapsed])

  const closeMobile = useCallback(() => { if (bp === 'mobile') setOpen(false) }, [bp])

  /* how far the main content should shift */
  const marginLeft = bp === 'mobile' ? 0
    : collapsed ? 'var(--sidebar-mini)'
    : 'var(--sidebar-w)'

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>

      {/* mobile backdrop — tap to close */}
      {bp === 'mobile' && open && (
        <div onClick={closeMobile} style={backdrop} aria-hidden="true" />
      )}

      <Sidebar
        open={open}
        collapsed={collapsed}
        isMobile={bp === 'mobile'}
        onToggle={handleToggle}
        onClose={closeMobile}
      />

      <div style={mainArea(marginLeft)}>
        <Header
          page={page}
          sub={sub}
          isMobile={bp === 'mobile'}
          onMenuClick={() => setOpen(v => !v)}
        />
        <main style={pageMain}>{children}</main>
      </div>

    </div>
  )
}

const backdrop = {
  position: 'fixed', inset: 0,
  background: 'rgba(0,0,0,.45)',
  zIndex: 99,
  backdropFilter: 'blur(2px)',
}

const mainArea = (ml) => ({
  marginLeft: ml,
  flex: 1, display: 'flex', flexDirection: 'column',
  transition: 'margin-left .25s cubic-bezier(.4,0,.2,1)',
  minWidth: 0, overflow: 'hidden',
})

const pageMain = { flex: 1, padding: 28, background: 'var(--neutral-light)' }
