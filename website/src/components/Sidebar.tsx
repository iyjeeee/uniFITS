// components/Sidebar.tsx — Responsive navigation sidebar with collapsible sub-menus
// Active detection uses longest-prefix matching to prevent false highlights
// Composition only; state/logic in sidebar/useSidebarNav, pieces in sidebar/.
import SidebarBrand from './sidebar/SidebarBrand'
import SidebarNavItem from './sidebar/SidebarNavItem'
import SidebarCollapseButton from './sidebar/SidebarCollapseButton'
import useSidebarNav from './sidebar/useSidebarNav'
import { sidebarStyle, navArea, sectionLabel } from './sidebar/sidebarStyles'
import type { NavigateFn } from '../types'

// ── Sidebar props ─────────────────────────────────────────────────────────────
interface SidebarProps {
  open:      boolean
  collapsed: boolean
  isMobile:  boolean
  onToggle:  () => void
  onClose:   () => void
  navigate:  NavigateFn
}

export default function Sidebar({ open, collapsed, isMobile, onToggle, onClose }: SidebarProps) {
  const s = useSidebarNav({ collapsed, isMobile, onToggle, onClose })

  return (
    <aside style={sidebarStyle(open, collapsed, isMobile)}>

      {/* Brand bar */}
      <SidebarBrand showLabel={s.showLabel} />

      {/* Navigation */}
      <nav style={navArea} className="sidebar-nav-touch">
        {s.NAV.map(({ section, items }) => (
          <div key={section}>
            {s.showLabel && <div style={sectionLabel}>{section}</div>}
            {items.map((item) => (
              <SidebarNavItem key={item.label} item={item} active={s.isActive(item)} isOpen={s.openSub === item.label}
                hovered={s.hovered} showLabel={s.showLabel} currentHash={s.currentHash}
                onItemClick={s.handleItem} onSubClick={s.handleSubItem} onHover={s.setHovered} />
            ))}
          </div>
        ))}
      </nav>

      {/* Collapse toggle button — desktop only */}
      {!isMobile && <SidebarCollapseButton collapsed={collapsed} showLabel={s.showLabel} hovered={s.collHovered} onHover={s.setCollHovered} onClick={s.handleToggle} />}
    </aside>
  )
}
