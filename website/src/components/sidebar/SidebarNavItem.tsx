// sidebar/SidebarNavItem.tsx — One nav row (pip, icon, label, badge, chevron) + its sub-item list when open and expanded
import NavIcon from './NavIcon'
import { navItemStyle, activePip, hoverPip, badgeStyle, badgeActive, subItemStyle } from './sidebarStyles'
import type { NavItemDef } from './sidebarNav'

interface Props {
  item: NavItemDef; active: boolean; isOpen: boolean; hovered: string | null; showLabel: boolean; currentHash: string
  onItemClick: (item: NavItemDef) => void; onSubClick: (href: string) => void; onHover: (key: string | null) => void
}

export default function SidebarNavItem({ item, active, isOpen, hovered, showLabel, currentHash, onItemClick, onSubClick, onHover }: Props) {
  const isHov = hovered === item.label
  return (
    <div>
      <div
        style={navItemStyle(active, isHov)}
        title={!showLabel ? item.label : undefined}
        onClick={() => onItemClick(item)}
        onMouseEnter={() => onHover(item.label)}
        onMouseLeave={() => onHover(null)}>
        {active           && <span style={activePip} />}
        {!active && isHov && <span style={hoverPip} />}
        <span style={{ display: 'flex', alignItems: 'center', width: 20, height: 20, flexShrink: 0, transition: 'transform .2s cubic-bezier(.34,1.56,.64,1)', transform: isHov && !active ? 'scale(1.18)' : 'scale(1)' }}>
          <NavIcon item={item} active={active || isHov} />
        </span>
        {showLabel && <span style={{ flex: 1 }}>{item.label}</span>}
        {showLabel && item.badge != null && (
          <span style={active ? badgeActive : badgeStyle}>{item.badge}</span>
        )}
        {showLabel && item.sub && (
          <svg width={14} height={14} viewBox="0 0 24 24" fill="none"
            stroke={active ? 'rgba(255,255,255,.6)' : isHov ? 'rgba(249,250,251,.7)' : 'rgba(249,250,251,.35)'}
            strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
            style={{ flexShrink: 0, transition: 'transform .2s', transform: isOpen ? 'rotate(90deg)' : 'none' }}>
            <polyline points="9 18 15 12 9 6" />
          </svg>
        )}
      </div>

      {/* Sub-items */}
      {item.sub && isOpen && showLabel && (
        <div>
          {item.sub.map(s => {
            const subActive = currentHash === s.href.replace('#', '')
            const subHov    = hovered === s.href
            return (
              <div key={s.href}
                style={subItemStyle(subActive, subHov)}
                onClick={() => onSubClick(s.href)}
                onMouseEnter={() => onHover(s.href)}
                onMouseLeave={() => onHover(null)}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', flexShrink: 0, background: subActive ? '#fff' : subHov ? 'rgba(255,255,255,.7)' : 'rgba(255,255,255,.25)', transition: 'background .15s, transform .2s', transform: subHov ? 'scale(1.4)' : 'scale(1)' }} />
                {s.label}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
