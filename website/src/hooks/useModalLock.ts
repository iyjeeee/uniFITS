// hooks/useModalLock.ts — Lock body scroll while a modal is open (compensates for the scrollbar width); releases on close/unmount
import { useEffect } from 'react'

export default function useModalLock(open: boolean) {
  useEffect(() => {
    if (!open) return
    const sbw = window.innerWidth - document.documentElement.clientWidth
    document.body.style.overflow     = 'hidden'
    document.body.style.paddingRight = sbw + 'px'
    return () => {
      document.body.style.overflow     = ''
      document.body.style.paddingRight = ''
    }
  }, [open])
}
