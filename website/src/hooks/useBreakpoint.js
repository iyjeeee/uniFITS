// useBreakpoint.js — Responsive breakpoint detection hook
import { useState, useEffect } from 'react'

const BREAKPOINTS = { mobile: 768, tablet: 1024 }

export default function useBreakpoint() {
  const [width, setWidth] = useState(window.innerWidth)

  useEffect(() => {
    const handler = () => setWidth(window.innerWidth)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  return {
    width,
    isMobile:  width < BREAKPOINTS.mobile,
    isTablet:  width >= BREAKPOINTS.mobile && width < BREAKPOINTS.tablet,
    isDesktop: width >= BREAKPOINTS.tablet,
  }
}
