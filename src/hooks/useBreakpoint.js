import { useState, useEffect } from 'react'

const BP = { mobile: 768, tablet: 1024 }

function get(w) {
  if (w < BP.mobile) return 'mobile'
  if (w < BP.tablet) return 'tablet'
  return 'desktop'
}

export default function useBreakpoint() {
  const [bp, setBp] = useState(() => get(window.innerWidth))

  useEffect(() => {
    function update() { setBp(get(window.innerWidth)) }
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return bp  // 'mobile' | 'tablet' | 'desktop'
}
