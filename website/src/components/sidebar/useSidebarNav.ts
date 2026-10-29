// sidebar/useSidebarNav.ts — Sidebar state + logic: nav data, open sub-menu, hovered row, longest-prefix active detection, click handlers
import { useState, useCallback } from 'react'
import { useOrg } from '../../context/OrgContext'
import { buildNav } from './sidebarNav'
import { splitHash } from '../../utils/route'
import type { NavItemDef } from './sidebarNav'

interface Args { collapsed: boolean; isMobile: boolean; onToggle: () => void; onClose: () => void }

export default function useSidebarNav({ collapsed, isMobile, onToggle, onClose }: Args) {
  const org = useOrg()
  const NAV = buildNav(org)

  const currentHash = splitHash(window.location.hash).path || '/dashboard'   // query (?id=) is not part of the route
  const [openSub, setOpenSub] = useState<string | null>(null)
  const [hovered, setHovered] = useState<string | null>(null)
  const [collHovered, setCollHovered] = useState(false)   // collapse button hover — kept here so hovering re-renders the whole sidebar (as before)
  const showLabel = isMobile ? true : !collapsed

  function handleItem(item: NavItemDef) {
    if (item.sub) {
      setOpenSub(openSub === item.label ? null : item.label)
    } else {
      window.location.hash = item.href?.replace('#', '') ?? ''
      if (isMobile) onClose()
    }
  }

  function handleSubItem(href: string) {
    window.location.hash = href.replace('#', '')
    if (isMobile) onClose()
  }

  const handleToggle = useCallback(() => {
    if (!isMobile && !collapsed) setOpenSub(null)
    onToggle()
  }, [isMobile, collapsed, onToggle])

  // isActive — longest-prefix matching so /transactions/utilities doesn't activate /transactions
  function isActive(item: NavItemDef): boolean {
    const candidates = item.sub
      ? item.sub.map(s => s.href.replace('#', ''))
      : [item.href?.replace('#', '') ?? '']

    const itemMatches = candidates.some(p =>
      p !== '' && (currentHash === p || currentHash.startsWith(p + '/'))
    )
    if (!itemMatches) return false

    const itemBestLen = Math.max(...candidates.map(p =>
      (p !== '' && (currentHash === p || currentHash.startsWith(p + '/'))) ? p.length : 0
    ))
    const allCandidates = NAV.flatMap(section =>
      section.items.flatMap(navItem =>
        navItem.sub
          ? navItem.sub.map(s => s.href.replace('#', ''))
          : [navItem.href?.replace('#', '') ?? '']
      )
    )
    const globalBestLen = Math.max(...allCandidates.map(p =>
      (p !== '' && (currentHash === p || currentHash.startsWith(p + '/'))) ? p.length : 0
    ))
    return itemBestLen >= globalBestLen && itemBestLen > 0
  }

  return { NAV, currentHash, openSub, hovered, setHovered, collHovered, setCollHovered, showLabel, handleItem, handleSubItem, handleToggle, isActive }
}
