// hooks/useBreakpoint.ts — Responsive breakpoint detection hook
import { useState, useEffect } from 'react'
import type { BreakpointResult } from '../types'

const BREAKPOINTS = { mobile: 768, tablet: 1024 } as const

export default function useBreakpoint(): BreakpointResult {
  const [width, setWidth] = useState<number>(window.innerWidth)

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
